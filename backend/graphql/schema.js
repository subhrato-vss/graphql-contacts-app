// ================================
// Import GraphQL schema builder

const { buildSchema } = require('graphql');
// buildSchema converts GraphQL SDL (Schema Definition Language)
// into an executable GraphQL schema

// ================================
// GraphQL Schema Definition
// This is the "API CONTRACT" of your app
// Frontend and backend both follow this structure

const schema = buildSchema(`

  // ==================================================
  // ======================= TYPES =====================
  // ==================================================

  // -------------------------------
  // User type → structure of User object

  type User {
    id: Int!        // User ID (non-null)
    name: String!   // User name (non-null)
    email: String!  // User email (non-null)
    token: String   // Token (optional field)
  }

  // -------------------------------
  // Contact type → structure of Contact object

  type Contact {
    id: Int!         // Contact ID
    name: String!   // Contact name
    number: String! // Phone number
    address: String // Address (optional)
    userId: Int!    // Owner user ID (relation)
    createdAt: String! // Auto timestamp
    updatedAt: String! // Auto timestamp
  }

  // -------------------------------
  // AuthPayload → response structure for login/signup

  type AuthPayload {
    userId: Int!   // Logged-in user id
    token: String! // JWT token
    user: User!    // Full user object
  }

  // ==================================================
  // ======================= INPUTS ====================
  // ==================================================

  // Input types are used for mutations
  // Like DTOs (Data Transfer Objects)

  // -------------------------------
  // Signup input

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  // -------------------------------
  // Login input

  input LoginInput {
    email: String!
    password: String!
  }

  // -------------------------------
  // Add contact input

  input ContactInput {
    name: String!
    number: String!
    address: String
  }

  // -------------------------------
  // Update contact input (all optional fields)

  input UpdateContactInput {
    name: String
    number: String
    address: String
  }

  // ==================================================
  // ====================== QUERIES ====================
  // ==================================================

  type Query {

    // Get logged-in user
    me: User

    // Get all contacts of user
    getContacts: [Contact!]!
    // [Contact!]! means:
    // array of Contact
    // no null items
    // array itself not null

    // Get single contact by id
    getContact(id: Int!): Contact
  }

  // ==================================================
  // ===================== MUTATIONS ===================
  // ==================================================

  type Mutation {

    // User signup
    signup(input: SignupInput!): AuthPayload!

    // User login
    login(input: LoginInput!): AuthPayload!

    // Add new contact
    addContact(input: ContactInput!): Contact!

    // Update contact
    updateContact(id: Int!, input: UpdateContactInput!): Contact!

    // Delete contact
    deleteContact(id: Int!): Boolean!
  }
`);

// ================================
// Export schema

module.exports = schema;

// ================================
// GRAPHQL THEORY (BEGINNER LEVEL)
//
// !  → non-null (mandatory)
// [] → array
//
// String!        → must exist
// String         → optional
// [Contact!]!    → array cannot be null and items cannot be null
// [Contact]      → array optional, items optional
//
// ================================
// GRAPHQL IS NOT REST
//
// REST:
//   GET /contacts
//   POST /contacts
//   GET /contacts/:id
//   DELETE /contacts/:id
//
// GraphQL:
//   POST /graphql
//   Query/Mutation controls everything
//
// ================================
// FRONTEND CONTROL
//
// Client decides what fields to fetch:
//
// query {
//   getContacts {
//     id
//     name
//   }
// }
//
// Backend sends only requested fields
//
// ================================
