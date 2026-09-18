const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Vehicle = require('./Vehicle');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  vehicleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Vehicle,
      key: 'id'
    }
  },
  reportType: {
    type: DataTypes.ENUM('free_preview', 'full_report'),
    defaultValue: 'free_preview'
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reportData: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  accidentRecords: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  mileageHistory: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  titleHistory: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  ownershipHistory: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  serviceHistory: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  recalls: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  theftRecords: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  timestamps: true
});

Report.belongsTo(User, { foreignKey: 'userId' });
Report.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
User.hasMany(Report, { foreignKey: 'userId' });
Vehicle.hasMany(Report, { foreignKey: 'vehicleId' });

module.exports = Report;
