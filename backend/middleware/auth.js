// ================================
// Import JWT library

const jwt = require('jsonwebtoken');
// Used to verify and decode JWT tokens

require('dotenv').config();
// Loads JWT_SECRET from .env file

// ================================
// Auth Middleware Function
// This function is called for EVERY /graphql request

const auth = (req) => {

  // -------------------------------
  // Read Authorization header

  const authHeader = req.headers.authorization;
  // Example header format:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

  // -------------------------------
  // If header does not exist

  if (!authHeader) {

    // No token → not authenticated
    return { isAuth: false, userId: null };
  }

  // -------------------------------
  // Extract token from header

  const token = authHeader.split(' ')[1];
  // "Bearer TOKEN" → split → ["Bearer", "TOKEN"]
  // token = "TOKEN"

  // -------------------------------
  // If token is empty

  if (!token || token === '') {
    return { isAuth: false, userId: null };
  }

  // -------------------------------
  // Verify JWT token

  let decodedToken;
  try {

    // jwt.verify checks:
    // 1. Token signature
    // 2. Token expiry
    // 3. Token validity

    decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  } catch (err) {

    // Token invalid / expired / tampered
    return { isAuth: false, userId: null };
  }

  // -------------------------------
  // If token is invalid

  if (!decodedToken) {
    return { isAuth: false, userId: null };
  }

  // -------------------------------
  // Token valid → authenticated

  return {
    isAuth: true,               // User is authenticated
    userId: decodedToken.userId // Extract userId from token payload
  };
};

// ================================
// Export auth function

module.exports = auth;

// ================================
// FULL AUTH FLOW (GRAPHQL STYLE)
//
// React Login
//   ↓
// Receive token
//   ↓
// Save token (localStorage)
//   ↓
// Every request:
// Authorization: Bearer TOKEN
//   ↓
// Express /graphql
//   ↓
// auth(req)
//   ↓
// context = { isAuth, userId }
//   ↓
// Resolver checks:
// if (!context.isAuth) throw error
//   ↓
// DB queries filtered by userId
//
// ================================
// IMPORTANT GRAPHQL SECURITY IDEA
//
// No routes like /private
// No route middleware
// Security is inside resolvers
// Context controls access
//
// ================================
