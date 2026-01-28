import { useQuery, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { GET_CONTACTS } from '../../graphql/queries'
import { DELETE_CONTACT_MUTATION } from '../../graphql/mutations'

const ContactList = () => {
  const navigate = useNavigate()
  const { loading, error, data, refetch } = useQuery(GET_CONTACTS)

  const [deleteContact] = useMutation(DELETE_CONTACT_MUTATION, {
    onCompleted: () => {
      refetch()
    },
    onError: (error) => {
      alert('Error deleting contact: ' + error.message)
    },
  })

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact({
          variables: { id },
        })
      } catch (err) {
        // Error handled by onError callback
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/contacts/edit/${id}`)
  }

  if (loading) return <div style={styles.loading}>Loading contacts...</div>
  if (error) return <div style={styles.error}>Error: {error.message}</div>

  const contacts = data?.getContacts || []

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Contacts</h2>
        <button 
          onClick={() => navigate('/contacts/add')} 
          style={styles.addButton}
        >
          + Add Contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No contacts yet. Add your first contact!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {contacts.map((contact) => (
            <div key={contact.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.contactName}>{contact.name}</h3>
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.contactInfo}>
                  <span style={styles.label}>Phone:</span>
                  <span style={styles.value}>{contact.number}</span>
                </div>
                
                <div style={styles.contactInfo}>
                  <span style={styles.label}>Address:</span>
                  <span style={styles.value}>{contact.address}</span>
                </div>
                
                <div style={styles.contactInfo}>
                  <span style={styles.label}>Added:</span>
                  <span style={styles.value}>
                    {new Date(parseInt(contact.createdAt)).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <button 
                  onClick={() => handleEdit(contact.id)} 
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(contact.id)} 
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    color: '#333',
    margin: 0,
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '16px',
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
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s',
  },
  cardHeader: {
    backgroundColor: '#007bff',
    padding: '15px 20px',
  },
  contactName: {
    color: 'white',
    margin: 0,
    fontSize: '20px',
  },
  cardBody: {
    padding: '20px',
  },
  contactInfo: {
    display: 'flex',
    marginBottom: '12px',
  },
  label: {
    fontWeight: '600',
    color: '#555',
    minWidth: '80px',
  },
  value: {
    color: '#333',
    flex: 1,
  },
  cardFooter: {
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
}

export default ContactList