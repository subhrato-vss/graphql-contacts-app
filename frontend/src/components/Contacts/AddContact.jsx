import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { ADD_CONTACT_MUTATION } from '../../graphql/mutations'
import { GET_CONTACTS } from '../../graphql/queries'

const AddContact = () => {
  const navigate = useNavigate()

  // Local state to store form input values
  const [formData, setFormData] = useState({
    name: '',
    number: '',   // Contact phone number
    address: '',
  })

  // State to store validation / backend error messages
  const [error, setError] = useState('')

  // useMutation hook to call ADD_CONTACT GraphQL mutation
  // "addContact" is the function to execute the mutation
  // "loading" becomes true while the request is in progress
  const [addContact, { loading }] = useMutation(ADD_CONTACT_MUTATION, {

    // After adding contact, refetch contact list query
    // so UI automatically shows latest data
    refetchQueries: [{ query: GET_CONTACTS }],

    // Runs automatically when mutation is successful
    onCompleted: () => {
      // Redirect user back to contacts page
      navigate('/contacts')
    },

    // Runs automatically if GraphQL or server error occurs
    onError: (error) => {
      setError(error.message)
    },
  })

  // Runs whenever user types in any form input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      // Dynamically update correct field using input name
      [e.target.name]: e.target.value,
    })
  }

  // Runs when user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page reload
    setError('')       // Clear previous errors

    // Basic frontend validation
    if (!formData.name || !formData.number || !formData.address) {
      setError('All fields are required')
      return
    }

    try {
      // Call GraphQL addContact mutation and send input object
      await addContact({
        variables: {
          input: {
            name: formData.name,
            number: formData.number,
            address: formData.address,
          },
        },
      })
    } catch (err) {
      // Error already handled in onError callback
    }
  }

  return (
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h2 style={styles.title}>Add New Contact</h2>

          {/* Show error message if exists */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Add contact form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name *</label>
              <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter contact name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone *</label>
              <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter phone number"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Address *</label>
              <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ ...styles.input, ...styles.textarea }}
                  placeholder="Enter address"
                  rows="3"
              />
            </div>

            {/* Action buttons */}
            <div style={styles.buttonGroup}>
              <button
                  type="submit"
                  disabled={loading}
                  style={styles.submitButton}
              >
                {loading ? 'Adding...' : 'Add Contact'}
              </button>

              <button
                  type="button"
                  onClick={() => navigate('/contacts')}
                  style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '0 20px',
  },
  formWrapper: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontSize: '28px',
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
    marginBottom: '8px',
    color: '#555',
    fontWeight: '500',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  textarea: {
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  },
}

export default AddContact