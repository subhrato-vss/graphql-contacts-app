// ================================
// Import Sequelize DataTypes

const { DataTypes } = require('sequelize');
// Used to define column data types (STRING, INTEGER, TEXT, etc.)

// ================================
// Import Sequelize DB connection

const sequelize = require('../config/database');
// MySQL connection instance

// ================================
// Define Contact Model

const Contact = sequelize.define('Contact', {

  // -------------------------------
  // id column

  id: {
    type: DataTypes.INTEGER,     // SQL: INT
    primaryKey: true,            // Primary Key
    autoIncrement: true          // Auto increment
  },

  // -------------------------------
  // name column

  name: {
    type: DataTypes.STRING,      // SQL: VARCHAR
    allowNull: false             // NOT NULL
  },

  // -------------------------------
  // number column (phone number)

  number: {
    type: DataTypes.STRING,      // VARCHAR
    allowNull: false
  },

  // -------------------------------
  // address column

  address: {
    type: DataTypes.TEXT,        // SQL: TEXT (long text)
    allowNull: true              // Optional field
  },

  // -------------------------------
  // userId column (foreign key)

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,

    // Foreign key reference
    references: {
      model: 'Users',            // Refers to Users table
      key: 'id'                  // Refers to users.id
    }
  }

}, {

  // -------------------------------
  // Auto timestamps

  timestamps: true
  // Adds:
  // createdAt
  // updatedAt
});

// ================================
// Export Contact model

module.exports = Contact;

// ================================
// DATABASE STRUCTURE CREATED
//
// contacts table
// --------------------------------
// id        INT PK AUTO_INCREMENT
// name      VARCHAR NOT NULL
// number    VARCHAR NOT NULL
// address   TEXT
// userId    INT FK → users.id
// createdAt DATETIME
// updatedAt DATETIME
//
// ================================
// RELATIONSHIP MODEL
//
// User (1) ────────< Contact (many)
//
// users.id ←── contacts.userId
//
// ================================
// GRAPHQL SECURITY FLOW
//
// addContact
//   ↓
// context.userId
//   ↓
// Contact.create({ userId })
//   ↓
// Contact linked to correct user
//
// getContacts
//   ↓
// where: { userId: context.userId }
//   ↓
// Only user's contacts returned
//
// ================================
// MULTI-TENANT SECURITY DESIGN
//
// One DB
// Multiple users
// Data separation using userId
//
// ================================
