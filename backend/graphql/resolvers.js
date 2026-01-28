// ================================
// Import Sequelize models

const { User, Contact } = require('../models');
// User  -> users table in MySQL
// Contact -> contacts table in MySQL
// Sequelize maps these models to DB tables

// ================================
// Import libraries

const bcrypt = require('bcryptjs');
// Used for password hashing (not directly here, but used in model hooks)

const jwt = require('jsonwebtoken');
// Used to generate JWT tokens for authentication

require('dotenv').config();
// Loads JWT_SECRET and other env variables

// ================================
// GraphQL Resolvers Object
// Each key here must match schema.js Query or Mutation names

const resolvers = {

    // ==================================================
    // ===================== QUERIES =====================
    // ==================================================

    // -------------------------------
    // me → returns logged-in user's data
    // GraphQL query: me { id name email }

    me: async ({ }, context) => {

        // context comes from app.js (auth middleware)
        // context.isAuth → true/false
        // context.userId → logged-in user's id

        if (!context.isAuth) {
            // If token is missing or invalid
            throw new Error('Unauthenticated! Please login.');
        }

        try {

            // Find user by Primary Key (ID)
            const user = await User.findByPk(context.userId, {

                // Only select these columns
                attributes: ['id', 'name', 'email']
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Return user → goes to GraphQL response
            return user;

        } catch (error) {
            throw error;
        }
    },

    // -------------------------------
    // getContacts → returns all contacts of logged-in user
    // GraphQL query: getContacts { id name number address }

    getContacts: async ({ }, context) => {

        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        try {

            // Find all contacts where userId = logged-in user
            const contacts = await Contact.findAll({

                where: { userId: context.userId },

                // Order by newest first
                order: [['createdAt', 'DESC']]
            });

            return contacts;

        } catch (error) {
            throw error;
        }
    },

    // -------------------------------
    // getContact → returns single contact
    // GraphQL query: getContact(id: 1) { name number }

    getContact: async ({ id }, context) => {

        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        try {

            // Find contact by id + userId (security check)
            const contact = await Contact.findOne({
                where: { id, userId: context.userId }
            });

            if (!contact) {
                throw new Error('Contact not found');
            }

            return contact;

        } catch (error) {
            throw error;
        }
    },

    // ==================================================
    // ==================== MUTATIONS ====================
    // ==================================================

    // -------------------------------
    // signup → create new user
    // GraphQL mutation: signup(input: {...})

    signup: async ({ input }) => {

        // Destructure input object from GraphQL
        const { name, email, password } = input;

        try {

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                throw new Error('User already exists with this email');
            }

            // Create user in DB
            // Password hashing happens in User model (beforeCreate hook)
            const user = await User.create({
                name,
                email,
                password
            });

            // Generate JWT token
            const token = jwt.sign(

                // Payload stored in token
                { userId: user.id, email: user.email },

                // Secret key
                process.env.JWT_SECRET,

                // Token expiry
                { expiresIn: '24h' }
            );

            // Return response to GraphQL client
            return {
                userId: user.id,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            };

        } catch (error) {
            throw error;
        }
    },

    // -------------------------------
    // login → authenticate user
    // GraphQL mutation: login(input: {...})

    login: async ({ input }) => {

        const { email, password } = input;

        try {

            // Find user by email
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Compare entered password with hashed password
            const isValidPassword = await user.comparePassword(password);

            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Return auth data
            return {
                userId: user.id,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            };

        } catch (error) {
            throw error;
        }
    },

    // -------------------------------
    // addContact → create new contact
    // GraphQL mutation: addContact(input: {...})

    addContact: async ({ input }, context) => {

        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        const { name, number, address } = input;

        try {

            // Create contact linked to user
            const contact = await Contact.create({
                name,
                number,
                address,
                userId: context.userId
            });

            return contact;

        } catch (error) {
            throw error;
        }
    },

    // -------------------------------
    // updateContact → update existing contact

    updateContact: async ({ id, input }, context) => {

        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        try {

            // Find contact belonging to user
            const contact = await Contact.findOne({
                where: { id, userId: context.userId }
            });

            if (!contact) {
                throw new Error('Contact not found');
            }

            // Update fields
            await contact.update(input);

            return contact;

        } catch (error) {
            throw error;
        }
    },

    // -------------------------------
    // deleteContact → delete contact

    deleteContact: async ({ id }, context) => {

        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        try {

            // Find contact
            const contact = await Contact.findOne({
                where: { id, userId: context.userId }
            });

            if (!contact) {
                throw new Error('Contact not found');
            }

            // Delete from DB
            await contact.destroy();

            // Return boolean
            return true;

        } catch (error) {
            throw error;
        }
    }
};

// ================================
// Export resolvers to be used in app.js

module.exports = resolvers;

// ================================
// GRAPHQL CONCEPT MAPPING (IMPORTANT)
//
// Query   -> read data
// Mutation-> write data
// Resolver-> function that executes query/mutation
// Context -> shared request data (auth, userId)
// Schema  -> defines what queries/mutations are allowed
//
// ================================
// SECURITY FLOW
//
// React
//  ↓ Authorization: Bearer TOKEN
// Express
//  ↓ auth middleware
// context = { isAuth, userId }
// Resolver
//  ↓ DB query filtered by userId
// MySQL
//
// ================================
