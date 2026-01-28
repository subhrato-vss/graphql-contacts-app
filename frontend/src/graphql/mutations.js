import { gql } from '@apollo/client'

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
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

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
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

export const ADD_CONTACT_MUTATION = gql`
  mutation AddContact($input: ContactInput!) {
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

export const UPDATE_CONTACT_MUTATION = gql`
  mutation UpdateContact($id: Int!, $input: UpdateContactInput!) {
    updateContact(id: $id, input: $input) {
      id
      name
      number
      address
      updatedAt
    }
  }
`

export const DELETE_CONTACT_MUTATION = gql`
  mutation DeleteContact($id: Int!) {
    deleteContact(id: $id)
  }
`