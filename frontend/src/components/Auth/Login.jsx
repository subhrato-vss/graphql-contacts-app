import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate, Link } from 'react-router-dom'
import { LOGIN_MUTATION } from '../../graphql/mutations'
import { saveAuthData } from '../../utils/auth'

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')

    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            saveAuthData(data.login.token, data.login.user)
            navigate('/contacts')
        },
        onError: (error) => {
            // ✅ Extract the actual error message from GraphQL error
            const errorMessage = error.graphQLErrors?.[0]?.message || error.message || 'An error occurred'
            setError(errorMessage)
            console.error('Login error:', error) // Log full error for debugging
        },
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('') // ✅ Clear previous errors

        if (!formData.email || !formData.password) {
            setError('All fields are required')
            return
        }

        try {
            await login({
                variables: {
                    input: {
                        email: formData.email,
                        password: formData.password,
                    },
                },
            })
        } catch (err) {
            // Error already handled by onError callback
            console.error('Caught error:', err)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <h2 style={styles.title}>Login</h2>

                {error && <div style={styles.error}>{error}</div>}

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

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={styles.linkText}>
                    Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
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