import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useNavigate, useParams } from 'react-router-dom'
import { GET_CONTACT } from '../../graphql/queries'
import { UPDATE_CONTACT_MUTATION } from '../../graphql/mutations'

const EditContact = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [formData, setFormData] = useState({
        name: '',
        number: '', // ✅ Changed from 'phone' to 'number'
        address: '',
    })
    const [error, setError] = useState('')

    const { loading: queryLoading, error: queryError, data } = useQuery(GET_CONTACT, {
        variables: { id: parseInt(id) }, // ✅ Convert id to Int
    })

    const [updateContact, { loading: mutationLoading }] = useMutation(UPDATE_CONTACT_MUTATION, {
        onCompleted: () => {
            navigate('/contacts')
        },
        onError: (error) => {
            setError(error.message)
        },
    })

    useEffect(() => {
        if (data?.getContact) {
            setFormData({
                name: data.getContact.name,
                number: data.getContact.number, // ✅ Changed from 'phone' to 'number'
                address: data.getContact.address,
            })
        }
    }, [data])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.name || !formData.number || !formData.address) { // ✅ Changed phone to number
            setError('All fields are required')
            return
        }

        try {
            await updateContact({
                variables: {
                    id: parseInt(id), // ✅ Convert id to Int
                    input: { // ✅ Wrapped in input object
                        name: formData.name,
                        number: formData.number, // ✅ Changed from 'phone' to 'number'
                        address: formData.address,
                    },
                },
            })
        } catch (err) {
            // Error handled by onError callback
        }
    }

    if (queryLoading) return <div style={styles.loading}>Loading contact...</div>
    if (queryError) return <div style={styles.error}>Error: {queryError.message}</div>

    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <h2 style={styles.title}>Edit Contact</h2>

                {error && <div style={styles.errorBox}>{error}</div>}

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
                            name="number" // ✅ Changed from 'phone' to 'number'
                            value={formData.number} // ✅ Changed from phone to number
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

                    <div style={styles.buttonGroup}>
                        <button
                            type="submit"
                            disabled={mutationLoading}
                            style={styles.submitButton}
                        >
                            {mutationLoading ? 'Updating...' : 'Update Contact'}
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
        backgroundColor: '#ffc107',
        color: '#333',
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
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        padding: '40px',
        color: '#666',
    },
    error: {
        textAlign: 'center',
        fontSize: '18px',
        padding: '40px',
        color: '#dc3545',
    },
    errorBox: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb',
    },
}

export default EditContact