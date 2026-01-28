require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');

const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const auth = require('./middleware/auth');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// GraphQL endpoint
app.use('/graphql', (req, res) => {
    // Get auth context for each request
    const authContext = auth(req);

    graphqlHTTP({
        schema: schema,
        rootValue: resolvers,
        graphiql: true,
        context: authContext,
        customFormatErrorFn: (error) => {
            // Log full error on server console
            console.log('-----> GraphQL Error: ', error.message || 'Internal Server Error');

            // Send detailed error to client
            return {
                message: error.message, // ✅ This sends "Invalid email or password" to client
                locations: error.locations,
                path: error.path,
            };
        }
    })(req, res);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});

// Database connection and server start
const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Sync models with database
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized.');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
            console.log(`🔍 GraphiQL interface available for testing`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
};

startServer();