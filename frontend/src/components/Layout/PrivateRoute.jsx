import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../../utils/auth'

// This component protects routes that should only be accessible
// when the user is logged in (token exists in localStorage).
// It receives "children", which means the actual page/component
// you want to protect (for example: Contacts page, Dashboard, etc.).
const PrivateRoute = ({ children }) => {

  // isAuthenticated() checks if a token exists in localStorage.
  // If it returns true → user is logged in → show the protected page.
  // If it returns false → user is not logged in → redirect to /login page.
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
