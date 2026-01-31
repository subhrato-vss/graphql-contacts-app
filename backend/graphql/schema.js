// ================================
// Import GraphQL schema builder

const { buildSchema } = require('graphql');

// ================================
// GraphQL Schema Definition

const schema = buildSchema(`

  # ==================================================
  # ======================= TYPES =====================
  # ==================================================

  type User {
    id: Int!
    name: String!
    email: String!
    token: String
  }

  type Contact {
    id: Int!
    name: String!
    number: String!
    address: String
    userId: Int!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    userId: Int!
    token: String!
    user: User!
  }

  # ==================================================
  # ======================= INPUTS ====================
  # ==================================================

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ContactInput {
    name: String!
    number: String!
    address: String
  }

  input UpdateContactInput {
    name: String
    number: String
    address: String
  }

  # ==================================================
  # ====================== QUERIES ====================
  # ==================================================

  type Query {
    me: User
    getContacts: [Contact!]!
    getContact(id: Int!): Contact
  }

  # ==================================================
  # ===================== MUTATIONS ===================
  # ==================================================

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    addContact(input: ContactInput!): Contact!
    updateContact(id: Int!, input: UpdateContactInput!): Contact!
    deleteContact(id: Int!): Boolean!
  }
`);

module.exports = schema;
