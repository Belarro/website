import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// DEV_BYPASS: only enabled in local development (npm run dev)
const DEV_BYPASS = import.meta.env.DEV

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (DEV_BYPASS) {
    return children
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
