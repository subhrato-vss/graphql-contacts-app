// ================================
// Import Sequelize connection instance

const sequelize = require('../config/database');
// This is the configured Sequelize object
// It contains DB connection info (host, user, password, db name)

// ================================
// Import Sequelize models

const User = require('./User');
// User model → users table

const Contact = require('./Contact');
// Contact model → contacts table

// ================================
// Define associations (relationships between tables)

// -------------------------------
// One User → Many Contacts

User.hasMany(Contact, {

    foreignKey: 'userId',
    // userId column will exist in contacts table

    onDelete: 'CASCADE'
    // If a user is deleted → all contacts of that user are deleted
});

// -------------------------------
// Each Contact belongs to one User

Contact.belongsTo(User, {

    foreignKey: 'userId'
    // This tells Sequelize:
    // contacts.userId references users.id
});

// ================================
// Export everything

module.exports = {
    sequelize, // DB connection
    User,      // User model
    Contact    // Contact model
};

// ================================
// RELATIONAL DATABASE MAPPING
//
// users table
//   id (PK)
//   name
//   email
//   password
//
// contacts table
//   id (PK)
//   name
//   number
//   address
//   userId (FK)
//
// ================================
// GRAPHQL + DB RELATION FLOW
//
// GraphQL Resolver
//   ↓
// Contact.findAll({ where: { userId } })
//   ↓
// Sequelize
//   ↓
// MySQL JOIN relation
//   ↓
// Data
//
// ================================
