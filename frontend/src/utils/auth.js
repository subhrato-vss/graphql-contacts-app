// This function is called after successful login or signup.
// It stores the JWT token and user object in browser localStorage
// so the user stays logged in even after page refresh.
export const saveAuthData = (token, user) => {
  // Save JWT token (used later in Apollo authLink for GraphQL requests)
  localStorage.setItem('token', token)

  // Save user object after converting it to string (localStorage only stores strings)
  localStorage.setItem('user', JSON.stringify(user))
}

// This function returns the JWT token from localStorage.
// It is used to check login status and to attach the token in GraphQL headers.
export const getToken = () => {
  return localStorage.getItem('token')
}

// This function returns the logged-in user's data from localStorage.
// If user data exists, it converts it back to an object.
// If not, it returns null.
export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// This function checks whether the user is authenticated or not.
// If a token exists in localStorage, it returns true, otherwise false.
export const isAuthenticated = () => {
  const token = getToken()
  return !!token
}

// This function logs the user out by removing token and user data
// from localStorage. After this, all protected GraphQL APIs will fail
// and the app should redirect the user to the login page.
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
