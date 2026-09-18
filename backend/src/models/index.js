const sequelize = require('../config/database');
const User = require('./User');
const Vehicle = require('./Vehicle');
const Report = require('./Report');
const Payment = require('./Payment');
const VinSearch = require('./VinSearch');
const Product = require('./Product');

const models = {
  User,
  Vehicle,
  Report,
  Payment,
  VinSearch,
  Product
};

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized');
    
    // Create default products if they don't exist
    await createDefaultProducts();
  } catch (error) {
    console.error('Database sync error:', error);
    throw error;
  }
};

const createDefaultProducts = async () => {
  const products = [
    {
      name: 'Single Report',
      description: 'One complete vehicle history report',
      price: 19.99,
      reportCredits: 1,
      features: ['Full history', 'Printable report', 'PDF download']
    },
    {
      name: '3 Reports',
      description: 'Three vehicle history reports',
      price: 39.99,
      reportCredits: 3,
      features: ['Full history', 'Printable reports', 'PDF downloads', 'Best for dealers']
    },
    {
      name: '5 Reports',
      description: 'Five vehicle history reports',
      price: 49.99,
      reportCredits: 5,
      features: ['Full history', 'Printable reports', 'PDF downloads', 'Best value']
    }
  ];

  for (const productData of products) {
    await Product.findOrCreate({
      where: { name: productData.name },
      defaults: productData
    });
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  ...models
};
