import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate, Link } from 'react-router-dom'
import { LOGIN_MUTATION } from '../../graphql/mutations'
import { saveAuthData } from '../../utils/auth'

const Login = () => {
    const navigate = useNavigate()

    // Local state to store form input values
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    // State to store error message to show in UI
    const [error, setError] = useState('')

    // useMutation hook to call LOGIN GraphQL mutation
    // "login" is the function we call to execute the mutation
    // "loading" becomes true while request is in progress
    const [login, { loading }] = useMutation(LOGIN_MUTATION, {

        // Runs automatically when login is successful
        onCompleted: (data) => {
            // Save token and user info into localStorage
            saveAuthData(data.login.token, data.login.user)

            // Redirect user to protected contacts page
            navigate('/contacts')
        },

        // Runs automatically if GraphQL or server error occurs
        onError: (error) => {
            // Extract actual backend error message
            const errorMessage =
                error.graphQLErrors?.[0]?.message ||
                error.message ||
                'An error occurred'

            // Store error message in state to show in UI
            setError(errorMessage)

            // Log full error in console for debugging
            console.error('Login error:', error)
        },
    })

    // Runs whenever user types in email or password field
    const handleChange = (e) => {
        setFormData({
            ...formData,
            // Dynamically update field based on input name
            [e.target.name]: e.target.value,
        })
    }

    // Runs when user submits the login form
    const handleSubmit = async (e) => {
        e.preventDefault() // Prevent page reload
        setError('')       // Clear previous errors

        // Basic frontend validation
        if (!formData.email || !formData.password) {
            setError('All fields are required')
            return
        }

        try {
            // Call GraphQL login mutation and send input data
            await login({
                variables: {
                    input: {
                        email: formData.email,
                        password: formData.password,
                    },
                },
            })
        } catch (err) {
            // Error is already handled in onError callback
            console.error('Caught error:', err)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <h2 style={styles.title}>Login</h2>

                {/* Show error message if exists */}
                {error && <div style={styles.error}>{error}</div>}

                {/* Login form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Disable button while request is in progress */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Signup redirect link */}
                <p style={styles.linkText}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={styles.link}>Sign Up</Link>
                </p>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    formWrapper: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#555',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    button: {
        padding: '12px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb',
    },
    linkText: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#666',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
    },
}

export default Login