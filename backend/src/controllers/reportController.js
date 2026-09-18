const { Report, Vehicle, User } = require('../models');
const vehicleDataService = require('../services/vehicleDataService');
const logger = require('../config/logger');

exports.getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const report = await Report.findOne({
      where: { id },
      include: [
        { model: Vehicle },
        { 
          model: User, 
          attributes: ['id', 'email', 'firstName', 'lastName'] 
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Verify ownership
    if (report.userId !== userId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to view this report' });
    }

    res.json({
      success: true,
      report: {
        id: report.id,
        reportType: report.reportType,
        purchaseDate: report.purchaseDate,
        vehicle: {
          vin: report.Vehicle.vin,
          year: report.Vehicle.year,
          make: report.Vehicle.make,
          model: report.Vehicle.model,
          trim: report.Vehicle.trim,
          bodyStyle: report.Vehicle.bodyStyle,
          vehicleType: report.Vehicle.vehicleType,
          engine: report.Vehicle.engine,
          transmission: report.Vehicle.transmission,
          fuelType: report.Vehicle.fuelType,
          drivetrain: report.Vehicle.drivetrain,
          countryOfManufacture: report.Vehicle.countryOfManufacture,
          specifications: report.Vehicle.specifications
        },
        history: report.reportType === 'full_report' ? {
          accidentRecords: report.accidentRecords,
          mileageHistory: report.mileageHistory,
          titleHistory: report.titleHistory,
          ownershipHistory: report.ownershipHistory,
          serviceHistory: report.serviceHistory,
          recalls: report.recalls,
          theftRecords: report.theftRecords
        } : null,
        _isMockData: report.reportData._isMockData || false
      }
    });

  } catch (error) {
    logger.error('Get report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const reports = await Report.findAll({
      where: { userId },
      include: [{ model: Vehicle }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      reports: reports.map(report => ({
        id: report.id,
        reportType: report.reportType,
        purchaseDate: report.purchaseDate,
        createdAt: report.createdAt,
        vehicle: {
          vin: report.Vehicle.vin,
          year: report.Vehicle.year,
          make: report.Vehicle.make,
          model: report.Vehicle.model
        }
      }))
    });

  } catch (error) {
    logger.error('Get user reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createPreviewReport = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const userId = req.user.id;

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Check if preview already exists
    let report = await Report.findOne({
      where: {
        userId,
        vehicleId,
        reportType: 'free_preview'
      }
    });

    if (!report) {
      report = await Report.create({
        userId,
        vehicleId,
        reportType: 'free_preview',
        reportData: { preview: true }
      });
    }

    res.json({
      success: true,
      reportId: report.id
    });

  } catch (error) {
    logger.error('Create preview report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.unlockReport = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    
    if (user.reportCredits < 1) {
      return res.status(400).json({ 
        error: 'Insufficient report credits. Please purchase more credits.' 
      });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Check if user already has full report
    let report = await Report.findOne({
      where: {
        userId,
        vehicleId,
        reportType: 'full_report'
      }
    });

    if (report) {
      return res.json({
        success: true,
        message: 'Report already unlocked',
        reportId: report.id
      });
    }

    // Get full vehicle history
    const vehicleHistory = await vehicleDataService.getVehicleHistory(vehicle.vin);

    // Create full report
    report = await Report.create({
      userId,
      vehicleId,
      reportType: 'full_report',
      purchaseDate: new Date(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      accidentRecords: vehicleHistory.accidentRecords,
      mileageHistory: vehicleHistory.mileageHistory,
      titleHistory: vehicleHistory.titleHistory,
      ownershipHistory: vehicleHistory.ownershipHistory,
      serviceHistory: vehicleHistory.serviceHistory,
      recalls: vehicleHistory.recalls,
      theftRecords: vehicleHistory.theftRecords,
      reportData: {
        _isMockData: vehicleHistory._isMockData || false
      }
    });

    // Deduct credit
    user.reportCredits -= 1;
    await user.save();

    res.json({
      success: true,
      message: 'Report unlocked successfully',
      reportId: report.id,
      remainingCredits: user.reportCredits
    });

  } catch (error) {
    logger.error('Unlock report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
