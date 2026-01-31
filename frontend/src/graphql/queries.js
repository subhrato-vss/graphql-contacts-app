// ================================
// Import gql from Apollo Client
import { gql } from '@apollo/client'
// gql is used to write GraphQL queries in JS files

// ================================
// GET LOGGED-IN USER QUERY

export const GET_ME = gql`
  # Query name: GetMe
  query GetMe {
    # Call me resolver
    me {
      # Fields we want from User type
      id
      name
      email
    }
  }
`

// ================================
// GET ALL CONTACTS QUERY

export const GET_CONTACTS = gql`
  # Query name: GetContacts
  query GetContacts {
    # Call getContacts resolver
    getContacts {
      # Fields returned for each contact
      id
      name
      number
      address
      createdAt
      updatedAt
    }
  }
`

// ================================
// GET SINGLE CONTACT QUERY

export const GET_CONTACT = gql`
  # Query name: GetContact
  # Variable: $id of type Int!
  query GetContact($id: Int!) {
    # Call getContact resolver
    getContact(id: $id) {
      # Fields returned
      id
      name
      number
      address
      createdAt
      updatedAt
    }
  }
`

// ================================
// GRAPHQL QUERY CONCEPTS
//
// query → read operation
// gql   → GraphQL template literal
// $id   → GraphQL variable
// Int!  → required integer
//
// ================================
// VARIABLE EXAMPLE
//
// For GET_CONTACT:
// {
//   "id": 5
// }
//
// ================================
// QUERY EXECUTION FLOW
//
// React Component
//   ↓
// useQuery(GET_CONTACTS)
//   ↓
// Apollo Client
//   ↓
// authLink → adds token
//   ↓
// httpLink → POST /graphql
//   ↓
// Express
//   ↓
// context auth
//   ↓
// resolver.getContacts
//   ↓
// Sequelize
//   ↓
// MySQL
//   ↓
// GraphQL response
//   ↓
// Apollo cache
//   ↓
// React re-render
//
// ================================
// WHY GRAPHQL QUERIES ARE POWERFUL
//
// ✔ Frontend decides fields
// ✔ No over-fetching
// ✔ No under-fetching
// ✔ Typed responses
// ✔ Auto validation
// ✔ Auto documentation
// ✔ Single endpoint
//
// ================================