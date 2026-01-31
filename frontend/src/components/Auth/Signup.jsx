import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate, Link } from 'react-router-dom'
import { SIGNUP_MUTATION } from '../../graphql/mutations'
import { saveAuthData } from '../../utils/auth'

const Signup = () => {
  const navigate = useNavigate()

  // State to store signup form values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  // State to store backend / validation errors
  const [error, setError] = useState('')

  // useMutation hook to call SIGNUP GraphQL mutation
  // "signup" is the function to execute the mutation
  // "loading" is true while request is being processed
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION, {

    // Runs automatically when signup is successful
    onCompleted: (data) => {
      // Save JWT token and user info into localStorage
      saveAuthData(data.signup.token, data.signup.user)

      // Redirect user to protected contacts page
      navigate('/contacts')
    },

    // Runs automatically if GraphQL or server error occurs
    onError: (error) => {
      // Store error message to show in UI
      setError(error.message)
    },
  })

  // Runs whenever user types in any input field
  const handleChange = (e) => {
    setFormData({
      ...formData,
      // Dynamically update correct field using input name
      [e.target.name]: e.target.value,
    })
  }

  // Runs when user submits signup form
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page reload
    setError('')       // Clear old errors

    // Basic frontend validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }

    try {
      // Call GraphQL signup mutation and send input object
      await signup({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
        },
      })
    } catch (err) {
      // Error is already handled in onError callback
    }
  }

  return (
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h2 style={styles.title}>Sign Up</h2>

          {/* Show error message if exists */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Signup form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter your name"
              />
            </div>

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
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          {/* Login redirect link */}
          <p style={styles.linkText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Login</Link>
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

export default Signup