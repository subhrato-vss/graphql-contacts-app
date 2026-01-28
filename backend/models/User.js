// ================================
// Import Sequelize DataTypes

const { DataTypes } = require('sequelize');
// DataTypes define column types like STRING, INTEGER, BOOLEAN, etc.

// ================================
// Import Sequelize DB instance

const sequelize = require('../config/database');
// This is the MySQL connection via Sequelize

// ================================
// Import bcrypt

const bcrypt = require('bcryptjs');
// Used for hashing and comparing passwords

// ================================
// Define User Model

const User = sequelize.define('User', {

  // -------------------------------
  // id column

  id: {
    type: DataTypes.INTEGER,     // SQL: INT
    primaryKey: true,            // Primary Key
    autoIncrement: true          // Auto-increment
  },

  // -------------------------------
  // name column

  name: {
    type: DataTypes.STRING,      // SQL: VARCHAR
    allowNull: false             // NOT NULL
  },

  // -------------------------------
  // email column

  email: {
    type: DataTypes.STRING,
    allowNull: false,            // NOT NULL
    unique: true,                // UNIQUE constraint
    validate: {
      isEmail: true              // Email format validation
    }
  },

  // -------------------------------
  // password column

  password: {
    type: DataTypes.STRING,      // Hashed password
    allowNull: false
  }

}, {

  // -------------------------------
  // Auto timestamps

  timestamps: true,
  // Adds:
  // createdAt
  // updatedAt

  // -------------------------------
  // Sequelize Hooks (Lifecycle methods)

  hooks: {

    // Runs BEFORE user is saved to DB
    beforeCreate: async (user) => {

      // If password exists
      if (user.password) {

        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // 10 = salt rounds (security level)

        // Hash password
        user.password = await bcrypt.hash(user.password, salt);
        // Plain password → hashed password
      }
    }
  }
});

// ================================
// Instance Method (Model Method)
// Adds a method to every User object

User.prototype.comparePassword = async function(candidatePassword) {

  // Compare entered password with stored hashed password
  return await bcrypt.compare(candidatePassword, this.password);
};

// ================================
// Export User model

module.exports = User;

// ================================
// DATABASE STRUCTURE CREATED
//
// users table
// --------------------------------
// id        INT PK AUTO_INCREMENT
// name      VARCHAR NOT NULL
// email     VARCHAR UNIQUE NOT NULL
// password  VARCHAR NOT NULL
// createdAt DATETIME
// updatedAt DATETIME
//
// ================================
// AUTH FLOW CONNECTION
//
// signup mutation
//   ↓
// User.create()
//   ↓
// beforeCreate hook
//   ↓
// bcrypt.hash(password)
//   ↓
// password saved hashed
//
// login mutation
//   ↓
// user.comparePassword(password)
//   ↓
// bcrypt.compare()
//   ↓
// true/false
//
// ================================
// SECURITY DESIGN
//
// ❌ Never store plain password
// ✅ Always store hashed password
// ❌ Never return password in API
//
// ================================
