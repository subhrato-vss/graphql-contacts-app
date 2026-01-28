import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import PrivateRoute from './components/Layout/PrivateRoute'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import ContactList from './components/Contacts/ContactList'
import AddContact from './components/Contacts/AddContact'
import EditContact from './components/Contacts/EditContact'
import { isAuthenticated } from './utils/auth'
import './App.css'

function App() {
  return (
    <Router>
      <div style={styles.app}>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated() ? <Navigate to="/contacts" replace /> : <Login />
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated() ? <Navigate to="/contacts" replace /> : <Signup />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/contacts"
            element={
              <PrivateRoute>
                <ContactList />
              </PrivateRoute>
            }
          />
          <Route
            path="/contacts/add"
            element={
              <PrivateRoute>
                <AddContact />
              </PrivateRoute>
            }
          />
          <Route
            path="/contacts/edit/:id"
            element={
              <PrivateRoute>
                <EditContact />
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              isAuthenticated() ? <Navigate to="/contacts" replace /> : <Navigate to="/login" replace />
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
}

export default App