const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vin: {
    type: DataTypes.STRING(17),
    allowNull: false,
    unique: true,
    validate: {
      len: [17, 17]
    }
  },
  year: DataTypes.INTEGER,
  make: DataTypes.STRING,
  model: DataTypes.STRING,
  trim: DataTypes.STRING,
  bodyStyle: DataTypes.STRING,
  vehicleType: DataTypes.STRING,
  engine: DataTypes.STRING,
  transmission: DataTypes.STRING,
  fuelType: DataTypes.STRING,
  drivetrain: DataTypes.STRING,
  countryOfManufacture: DataTypes.STRING,
  manufacturerName: DataTypes.STRING,
  plantCity: DataTypes.STRING,
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['vin']
    }
  ]
});

module.exports = Vehicle;
