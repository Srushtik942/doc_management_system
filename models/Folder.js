const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); // Ensure correct import

const Folder = sequelize.define('Folder', {
  folderId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false, // Fix: `allow` → `allowNull`
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Fix: `allow` → `allowNull`
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('csv', 'img', 'pdf', 'ppt'),
    allowNull: false
  },
  maxFileLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'folders',
  timestamps: false
});

module.exports = Folder;
