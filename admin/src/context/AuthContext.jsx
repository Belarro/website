import { createContext, useContext, useState, useEffect } from 'react'
import { GOOGLE_CLIENT_ID, ALLOWED_ADMIN_EMAILS } from '../config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('belarro_admin_user')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      // Verify email is still allowed
      if (ALLOWED_ADMIN_EMAILS.includes(parsed.email)) {
        setUser(parsed)
      } else {
        localStorage.removeItem('belarro_admin_user')
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Initialize Google Identity Services
    if (window.google) {
      initializeGoogle()
    } else {
      // Wait for script to load
      window.onGoogleLibraryLoad = initializeGoogle
    }
  }, [])

  const initializeGoogle = () => {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    })
  }

  const handleGoogleResponse = (response) => {
    setError(null)
    // Decode JWT token safely
    let payload
    try {
      payload = JSON.parse(atob(response.credential.split('.')[1]))
    } catch (e) {
      setError('Authentication failed: invalid token')
      return
    }

    const userData = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    }

    // Check if email is allowed
    if (!ALLOWED_ADMIN_EMAILS.includes(userData.email)) {
      setError(`Access denied. ${userData.email} is not authorized.`)
      return
    }

    // Save to state and localStorage
    setUser(userData)
    localStorage.setItem('belarro_admin_user', JSON.stringify(userData))
  }

  const signIn = () => {
    setError(null)
    window.google.accounts.id.prompt()
  }

  const signOut = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem('belarro_admin_user')
    window.google.accounts.id.disableAutoSelect()
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
