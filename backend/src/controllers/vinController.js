const { Vehicle, VinSearch, Report } = require('../models');
const { validateVIN } = require('../utils/vinValidator');
const vehicleDataService = require('../services/vehicleDataService');
const logger = require('../config/logger');

exports.validateVin = async (req, res) => {
  try {
    const { vin } = req.body;

    const validation = validateVIN(vin);

    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        error: validation.error 
      });
    }

    res.json({ 
      success: true, 
      message: 'VIN is valid',
      vin: validation.vin 
    });
  } catch (error) {
    logger.error('VIN validation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.searchVin = async (req, res) => {
  try {
    const { vin } = req.body;
    const userId = req.user ? req.user.id : null;

    // Validate VIN
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      // Log failed search
      await VinSearch.create({
        userId,
        vin: vin || '',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        success: false,
        errorMessage: validation.error
      });

      return res.status(400).json({ 
        success: false, 
        error: validation.error 
      });
    }

    const validatedVIN = validation.vin;

    // Check if vehicle already exists in database
    let vehicle = await Vehicle.findOne({ where: { vin: validatedVIN } });

    if (!vehicle) {
      // Fetch from external API
      const vehicleData = await vehicleDataService.getVehicleData(validatedVIN);
      
      // Save to database
      vehicle = await Vehicle.create(vehicleData);
    } else {
      // Update if data is old (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (vehicle.lastUpdated < thirtyDaysAgo) {
        const vehicleData = await vehicleDataService.getVehicleData(validatedVIN);
        await vehicle.update({ ...vehicleData, lastUpdated: new Date() });
      }
    }

    // Log successful search
    await VinSearch.create({
      userId,
      vin: validatedVIN,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      success: true
    });

    // Check if user has already purchased a report for this vehicle
    let userReport = null;
    if (userId) {
      userReport = await Report.findOne({
        where: {
          userId,
          vehicleId: vehicle.id,
          reportType: 'full_report'
        }
      });
    }

    // Return basic vehicle info (free preview)
    res.json({
      success: true,
      vehicle: {
        id: vehicle.id,
        vin: vehicle.vin,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        trim: vehicle.trim,
        bodyStyle: vehicle.bodyStyle,
        vehicleType: vehicle.vehicleType,
        specifications: vehicle.specifications,
        _isMockData: vehicle._isMockData || false
      },
      hasFullReport: !!userReport,
      reportId: userReport ? userReport.id : null
    });

  } catch (error) {
    logger.error('VIN search error:', error);

    // Log failed search
    await VinSearch.create({
      userId: req.user ? req.user.id : null,
      vin: req.body.vin || '',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      success: false,
      errorMessage: error.message
    });

    res.status(500).json({ 
      success: false, 
      error: 'Unable to retrieve vehicle information' 
    });
  }
};
