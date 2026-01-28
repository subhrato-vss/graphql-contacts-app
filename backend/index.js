// ================================
// Load environment variables from .env file
// Example: PORT=4000, DB_HOST=localhost, DB_USER=root, etc.
// This allows us to use process.env.VARIABLE_NAME
require('dotenv').config();

// ================================
// Import required core libraries

const express = require('express');
// Express is a Node.js framework for building APIs and servers

const morgan = require('morgan');
// Morgan is a logging middleware
// It logs every HTTP request in the console (method, URL, status, time)

const { graphqlHTTP } = require('express-graphql');
// express-graphql connects GraphQL with Express
// graphqlHTTP creates a GraphQL middleware

const cors = require('cors');
// CORS allows frontend apps (React) from other domains/ports
// Example: React on localhost:3000 can call backend on localhost:4000

// ================================
// Import project-specific files

const schema = require('./graphql/schema');
// GraphQL schema (typeDefs): defines Types, Queries, Mutations

const resolvers = require('./graphql/resolvers');
// Resolvers: actual functions that run when queries/mutations are called

const auth = require('./middleware/auth');
// Custom authentication middleware
// This will verify JWT and extract user info

const { sequelize } = require('./models');
// Sequelize instance
// Used to connect Node.js with MySQL database

// ================================
// Create Express app

const app = express();

// ================================
// Global Middleware

app.use(cors());
// Enables Cross-Origin Resource Sharing

app.use(morgan('dev'));
// Logs API requests in terminal (GET /graphql 200 15ms)

app.use(express.json());
// Allows Express to read JSON body in requests
// Needed for POST requests

// ================================
// GraphQL Endpoint

app.use('/graphql', (req, res) => {

    // -------------------------------
    // Auth context creation per request

    // auth(req) reads token from headers
    // Example header: Authorization: Bearer eyJhbGciOi...
    // It verifies token and returns user data

    const authContext = auth(req);

    // -------------------------------
    // GraphQL middleware

    graphqlHTTP({

        // GraphQL schema definition
        schema: schema,

        // Resolvers (functions for queries & mutations)
        rootValue: resolvers,

        // Enables GraphiQL UI in browser
        // You can open /graphql and test queries manually
        graphiql: true,

        // Context is shared across all resolvers
        // Here it contains authenticated user info
        context: authContext,

        // Custom error formatting
        customFormatErrorFn: (error) => {

            // Log full error in server terminal
            console.log('-----> GraphQL Error: ', error.message || 'Internal Server Error');

            // Send structured error to frontend
            return {
                message: error.message,  // Example: "Invalid email or password"
                locations: error.locations,
                path: error.path,
            };
        }
    })(req, res); // Important: Immediately execute graphqlHTTP middleware
});

// ================================
// Health Check Endpoint

app.get('/health', (req, res) => {

    // Simple REST endpoint to test server status
    res.json({ status: 'Server is running!' });
});

// ================================
// Server & Database Setup

// Read PORT from .env or use 4000 by default
const PORT = process.env.PORT || 4000;

// Async function to start server
const startServer = async () => {
    try {

        // -------------------------------
        // Test MySQL connection

        await sequelize.authenticate();
        // If connection fails, it will throw error

        console.log('✅ Database connection established successfully.');

        // -------------------------------
        // Sync Sequelize models with DB

        await sequelize.sync({ alter: true });
        // alter: true → updates DB tables based on model changes

        console.log('✅ Database models synchronized.');

        // -------------------------------
        // Start Express server

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
            console.log(`🔍 GraphiQL interface available for testing`);
        });

    } catch (error) {

        // If DB connection or server start fails
        console.error('❌ Unable to start server:', error);

        // Exit Node process
        process.exit(1);
    }
};

// ================================
// Start the server

startServer();

// ================================
// FLOW SUMMARY (BEGINNER VIEW)
//
// React App
//   ↓
// GraphQL Query/Mutation
//   ↓
// POST /graphql
//   ↓
// Express receives request
//   ↓
// auth middleware extracts user
//   ↓
// GraphQL schema validates query
//   ↓
// Resolver function executes
//   ↓
// Resolver talks to MySQL using Sequelize
//   ↓
// Data returned to GraphQL
//   ↓
// GraphQL sends response to React
//   ↓
// UI updates
//
// ================================
