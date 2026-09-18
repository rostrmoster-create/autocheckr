const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const VinSearch = sequelize.define('VinSearch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  vin: {
    type: DataTypes.STRING(17),
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  errorMessage: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'createdAt']
    },
    {
      fields: ['vin']
    },
    {
      fields: ['ipAddress', 'createdAt']
    }
  ]
});

VinSearch.belongsTo(User, { foreignKey: 'userId' });

module.exports = VinSearch;
