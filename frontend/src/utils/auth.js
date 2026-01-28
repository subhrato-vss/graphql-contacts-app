// Save token and user data to localStorage
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token')
}

// Get user data from localStorage
export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken()
  return !!token
}

// Logout - clear all auth data
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}