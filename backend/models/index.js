const sequelize = require('../config/database');
const User = require('./User');
const Contact = require('./Contact');

// Define associations
User.hasMany(Contact, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Contact.belongsTo(User, {
    foreignKey: 'userId'
});

module.exports = {
    sequelize,
    User,
    Contact
};