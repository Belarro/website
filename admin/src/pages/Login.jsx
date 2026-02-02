import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GOOGLE_CLIENT_ID } from '../config'

export default function Login() {
  const { user, error, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    // Render Google Sign-In button
    if (window.google && !user) {
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        {
          theme: 'filled_black',
          size: 'large',
          width: 300,
          text: 'signin_with',
        }
      )
      // Also show One Tap prompt
      window.google.accounts.id.prompt()
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-box">
          <div className="login-logo">BELARRO</div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">BELARRO</div>
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Authorized administrators only.</p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div
          id="google-signin-btn"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '24px'
          }}
        ></div>

        <p className="login-hint">
          Contact your administrator if you need access.
        </p>
      </div>
    </div>
  )
}
