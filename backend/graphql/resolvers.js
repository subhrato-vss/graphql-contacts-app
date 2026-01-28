const { User, Contact } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const resolvers = {
    // Queries
    me: async ({ }, context) => {
        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        try {
            const user = await User.findByPk(context.userId, {
                attributes: ['id', 'name', 'email']
            });

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw error;
        }
    },

    getContacts: async ({ }, context) => {
        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        try {
            const contacts = await Contact.findAll({
                where: { userId: context.userId },
                order: [['createdAt', 'DESC']]
            });

            return contacts;
        } catch (error) {
            throw error;
        }
    },

    getContact: async ({ id }, context) => {
        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        try {
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

    // Mutations
    signup: async ({ input }) => {
        const { name, email, password } = input;

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }

            // Create user (password will be hashed by beforeCreate hook)
            const user = await User.create({
                name,
                email,
                password
            });

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

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

    login: async ({ input }) => {
        const { email, password } = input;

        try {
            // Find user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Check password
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

    addContact: async ({ input }, context) => {
        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        const { name, number, address } = input;

        try {
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

    updateContact: async ({ id, input }, context) => {
        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        try {
            const contact = await Contact.findOne({
                where: { id, userId: context.userId }
            });

            if (!contact) {
                throw new Error('Contact not found');
            }

            await contact.update(input);

            return contact;
        } catch (error) {
            throw error;
        }
    },

    deleteContact: async ({ id }, context) => {
        if (!context.isAuth) {
            throw new Error('Unauthenticated! Please login.');
        }

        try {
            const contact = await Contact.findOne({
                where: { id, userId: context.userId }
            });

            if (!contact) {
                throw new Error('Contact not found');
            }

            await contact.destroy();

            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = resolvers;