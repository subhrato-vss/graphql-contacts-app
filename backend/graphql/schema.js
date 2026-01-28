const { buildSchema } = require('graphql');

const schema = buildSchema(`
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

  type Query {
    me: User
    getContacts: [Contact!]!
    getContact(id: Int!): Contact
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    addContact(input: ContactInput!): Contact!
    updateContact(id: Int!, input: UpdateContactInput!): Contact!
    deleteContact(id: Int!): Boolean!
  }
`);

module.exports = schema;