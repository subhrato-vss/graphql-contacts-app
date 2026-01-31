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

                {/* Navbar is always visible */}
                <Navbar />

                <Routes>

                    {/* ---------------- PUBLIC ROUTES ---------------- */}

                    {/* Login page (redirect to /contacts if already logged in) */}
                    <Route
                        path="/login"
                        element={
                            isAuthenticated()
                                ? <Navigate to="/contacts" replace />
                                : <Login />
                        }
                    />

                    {/* Signup page (redirect to /contacts if already logged in) */}
                    <Route
                        path="/signup"
                        element={
                            isAuthenticated()
                                ? <Navigate to="/contacts" replace />
                                : <Signup />
                        }
                    />

                    {/* ---------------- PROTECTED ROUTES ---------------- */}

                    {/* Contacts list (only accessible when logged in) */}
                    <Route
                        path="/contacts"
                        element={
                            <PrivateRoute>
                                <ContactList />
                            </PrivateRoute>
                        }
                    />

                    {/* Add contact page (protected) */}
                    <Route
                        path="/contacts/add"
                        element={
                            <PrivateRoute>
                                <AddContact />
                            </PrivateRoute>
                        }
                    />

                    {/* Edit contact page (protected, dynamic id) */}
                    <Route
                        path="/contacts/edit/:id"
                        element={
                            <PrivateRoute>
                                <EditContact />
                            </PrivateRoute>
                        }
                    />

                    {/* ---------------- DEFAULT ROUTES ---------------- */}

                    {/* Home route → auto redirect based on login state */}
                    <Route
                        path="/"
                        element={
                            isAuthenticated()
                                ? <Navigate to="/contacts" replace />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* Catch-all route (if user enters wrong URL) */}
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
