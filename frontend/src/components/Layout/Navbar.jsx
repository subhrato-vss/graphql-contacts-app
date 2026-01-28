import { Link, useNavigate } from 'react-router-dom'
import { isAuthenticated, logout, getUser } from '../../utils/auth'

const Navbar = () => {
  const navigate = useNavigate()
  const user = getUser()
  const authenticated = isAuthenticated()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          Contact Manager
        </Link>

        <div style={styles.navLinks}>
          {authenticated ? (
            <>
              <span style={styles.userName}>Hello, {user?.name}</span>
              <Link to="/contacts" style={styles.link}>
                Contacts
              </Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/signup" style={styles.link}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    backgroundColor: '#007bff',
    padding: '15px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '8px 15px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  userName: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500',
  },
}

export default Navbar