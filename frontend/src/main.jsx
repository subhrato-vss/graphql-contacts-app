// ================================
// Import React core

import React from 'react'
// React library

import ReactDOM from 'react-dom/client'
// React DOM renderer (for React 18)

// ================================
// Import Apollo GraphQL tools

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
// ApolloClient     → GraphQL client
// InMemoryCache    → GraphQL cache system
// ApolloProvider   → React context provider for GraphQL
// createHttpLink   → Connects Apollo to backend GraphQL API

import { setContext } from '@apollo/client/link/context'
// Used to modify request headers (for auth token injection)

// ================================
// Import App root component

import App from './App.jsx'
// Main React component

import './index.css'
// Global CSS

// ================================
// Create HTTP connection to GraphQL API

const httpLink = createHttpLink({

  // GraphQL backend endpoint
  uri: 'http://localhost:5000/graphql',
  // This is your Express GraphQL endpoint
})

// ================================
// Auth middleware for Apollo
// Adds JWT token to every request

const authLink = setContext((_, { headers }) => {

  // Get token from browser storage
  const token = localStorage.getItem('token')

  return {
    headers: {
      ...headers,

      // Attach Authorization header
      // Format: Authorization: Bearer TOKEN
      authorization: token ? `Bearer ${token}` : '',
    }
  }
})

// ================================
// Create Apollo Client instance

const client = new ApolloClient({

  // Combine authLink + httpLink
  // authLink runs first → adds token
  // httpLink runs second → sends request

  link: authLink.concat(httpLink),

  // GraphQL cache
  cache: new InMemoryCache(),
})

// ================================
// Render React app

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>

      {/* ApolloProvider makes GraphQL client available to all components */}
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>

    </React.StrictMode>,
)

// ================================
// FRONTEND GRAPHQL FLOW
//
// React Component
//   ↓
// useQuery / useMutation
//   ↓
// Apollo Client
//   ↓
// authLink → adds token
//   ↓
// httpLink → POST /graphql
//   ↓
// Express GraphQL
//   ↓
// auth middleware
//   ↓
// context
//   ↓
// resolver
//   ↓
// Sequelize
//   ↓
// MySQL
//   ↓
// Response
//   ↓
// Apollo Cache
//   ↓
// React UI
//
// ================================
// IMPORTANT IDEAS
//
// ✔ Single endpoint API
// ✔ Token auto-attached
// ✔ Centralized auth
// ✔ No REST API calls
// ✔ Typed API
// ✔ Auto caching
// ✔ Smart re-rendering
//
// ================================
