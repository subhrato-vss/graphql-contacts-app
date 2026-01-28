// ================================
// Import gql tag from Apollo Client

import { gql } from '@apollo/client'
// gql is used to write GraphQL queries/mutations in JS
// It parses GraphQL syntax into a format Apollo understands

// ================================
// SIGNUP MUTATION

export const SIGNUP_MUTATION = gql`

  // mutation name: Signup
  // variable: $input of type SignupInput!

  mutation Signup($input: SignupInput!) {

    // Call signup mutation on backend
    signup(input: $input) {

      // Fields we want in response
      token       // JWT token
      userId      // user id

      // Nested user object
      user {
        id
        name
        email
      }
    }
  }
`

// ================================
// LOGIN MUTATION

export const LOGIN_MUTATION = gql`

  mutation Login($input: LoginInput!) {

    // Call login mutation
    login(input: $input) {

      token
      userId

      user {
        id
        name
        email
      }
    }
  }
`

// ================================
// ADD CONTACT MUTATION

export const ADD_CONTACT_MUTATION = gql`

  mutation AddContact($input: ContactInput!) {

    // Call addContact mutation
    addContact(input: $input) {

      // Fields returned after creation
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
// UPDATE CONTACT MUTATION

export const UPDATE_CONTACT_MUTATION = gql`

  mutation UpdateContact($id: Int!, $input: UpdateContactInput!) {

    // Call updateContact mutation
    updateContact(id: $id, input: $input) {

      // Updated fields returned
      id
      name
      number
      address
      updatedAt
    }
  }
`

// ================================
// DELETE CONTACT MUTATION

export const DELETE_CONTACT_MUTATION = gql`

  mutation DeleteContact($id: Int!) {

    // Call deleteContact mutation
    deleteContact(id: $id)
    // Returns Boolean (true/false)
  }
`

// ================================
// GRAPHQL CONCEPTS (BEGINNER)
//
// mutation → write operation
// $input   → GraphQL variable
// SignupInput → input type from schema.js
// gql`` → GraphQL template literal
//
// ================================
// VARIABLE STRUCTURE EXAMPLES
//
// Signup variables:
// {
//   "input": {
//     "name": "John",
//     "email": "john@test.com",
//     "password": "123456"
//   }
// }
//
// AddContact variables:
// {
//   "input": {
//     "name": "Alex",
//     "number": "9999999999",
//     "address": "Delhi"
//   }
// }
//
// ================================
// WHY GRAPHQL IS POWERFUL HERE
//
// ✔ Frontend controls response shape
// ✔ No over-fetching
// ✔ No under-fetching
// ✔ Typed inputs
// ✔ Auto validation
// ✔ Single endpoint
// ✔ Clean API
//
// ================================
