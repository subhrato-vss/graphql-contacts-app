import { gql } from '@apollo/client'

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`

export const GET_CONTACTS = gql`
  query GetContacts {
    getContacts {
      id
      name
      number
      address
      createdAt
      updatedAt
    }
  }
`

export const GET_CONTACT = gql`
  query GetContact($id: Int!) {
    getContact(id: $id) {
      id
      name
      number
      address
      createdAt
      updatedAt
    }
  }
`