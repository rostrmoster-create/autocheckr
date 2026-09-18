const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment, Product, User } = require('../models');
const logger = require('../config/logger');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const user = await User.findByPk(userId);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      customer_email: user.email,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        productId: productId,
        reportCredits: product.reportCredits
      }
    });

    // Create pending payment record
    await Payment.create({
      userId,
      stripeSessionId: session.id,
      amount: product.price,
      status: 'pending',
      productType: product.name,
      creditsGranted: 0,
      metadata: {
        productId: productId,
        reportCredits: product.reportCredits
      }
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    logger.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
};

exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

const handleCheckoutSessionCompleted = async (session) => {
  try {
    const userId = session.metadata.userId;
    const reportCredits = parseInt(session.metadata.reportCredits);

    // Find pending payment
    const payment = await Payment.findOne({
      where: {
        stripeSessionId: session.id,
        status: 'pending'
      }
    });

    if (!payment) {
      logger.error('Payment record not found for session:', session.id);
      return;
    }

    // Update payment
    payment.status = 'completed';
    payment.stripePaymentId = session.payment_intent;
    payment.creditsGranted = reportCredits;
    await payment.save();

    // Add credits to user
    const user = await User.findByPk(userId);
    if (user) {
      user.reportCredits += reportCredits;
      await user.save();
      logger.info(`Added ${reportCredits} credits to user ${userId}`);
    }

  } catch (error) {
    logger.error('Handle checkout session completed error:', error);
  }
};

const handlePaymentIntentSucceeded = async (paymentIntent) => {
  logger.info('Payment intent succeeded:', paymentIntent.id);
};

const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const payment = await Payment.findOne({
      where: {
        stripePaymentId: paymentIntent.id
      }
    });

    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }

    logger.error('Payment intent failed:', paymentIntent.id);
  } catch (error) {
    logger.error('Handle payment intent failed error:', error);
  }
};

exports.verifySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const payment = await Payment.findOne({
        where: {
          stripeSessionId: sessionId,
          userId: req.user.id
        }
      });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json({
        success: true,
        payment: {
          status: payment.status,
          amount: payment.amount,
          creditsGranted: payment.creditsGranted
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Payment not completed'
      });
    }

  } catch (error) {
    logger.error('Verify session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
