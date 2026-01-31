// ================================
// Import gql tag from Apollo Client

import { gql } from '@apollo/client'
// gql is used to write GraphQL queries/mutations in JS
// It parses GraphQL syntax into a format Apollo understands

// ================================
// SIGNUP MUTATION

export const SIGNUP_MUTATION = gql`
  # mutation name: Signup
  # variable: $input of type SignupInput!

  mutation Signup($input: SignupInput!) {
    # Call signup mutation on backend
    signup(input: $input) {
      # Fields we want in response
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
// LOGIN MUTATION

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    # Call login mutation
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
    # Call addContact mutation
    addContact(input: $input) {
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
    # Call updateContact mutation
    updateContact(id: $id, input: $input) {
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
    # Call deleteContact mutation
    deleteContact(id: $id)
  }
`

// ================================
// GRAPHQL CONCEPTS (BEGINNER)
//
// mutation → write operation
// $input   → GraphQL variable
// gql``    → GraphQL template literal
//
// ================================
// VARIABLE STRUCTURE EXAMPLES
//
// Signup:
// {
//   "input": {
//     "name": "John",
//     "email": "john@test.com",
//     "password": "123456"
//   }
// }
//
// AddContact:
// {
//   "input": {
//     "name": "Alex",
//     "number": "9999999999",
//     "address": "Delhi"
//   }
// }
//
// ================================
