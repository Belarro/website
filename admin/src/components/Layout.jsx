import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { submissionsApi } from '../lib/supabase'

// Helper to get viewed submissions from localStorage
const getViewedSubmissions = () => {
  try {
    return JSON.parse(localStorage.getItem('viewedSubmissions') || '[]')
  } catch {
    return []
  }
}

export default function Layout() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  const loadUnreadCount = async () => {
    try {
      const submissions = await submissionsApi.getAll()
      const viewedIds = getViewedSubmissions()
      const count = submissions.filter(s => s.status === 'new' && !viewedIds.includes(s.id)).length
      setUnreadCount(count)
    } catch (err) {
      console.error('Error loading unread count:', err)
    }
  }

  useEffect(() => {
    loadUnreadCount()
    // Listen for updates from Submissions page
    const handleUpdate = () => loadUnreadCount()
    window.addEventListener('submissionsUpdated', handleUpdate)
    // Refresh every 30 seconds for new submissions
    const interval = setInterval(loadUnreadCount, 30000)
    return () => {
      window.removeEventListener('submissionsUpdated', handleUpdate)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <NavLink to="/" className="sidebar-logo">BELARRO</NavLink>

        <div style={{ padding: '0 16px 24px 16px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>View Mode</div>
          <div style={{ display: 'grid', gap: '4px' }}>
            <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ fontSize: '13px', padding: '8px 12px' }}>
              Admin Workspace
            </NavLink>
            <NavLink to="/chef" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ fontSize: '13px', padding: '8px 12px' }}>
              Chef Order App
            </NavLink>
          </div>
        </div>

        <div style={{ padding: '0 16px', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)' }}>
          Management
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/products"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            Products
          </NavLink>
          <NavLink
            to="/kitchens"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            Kitchens
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            Users
          </NavLink>
          <NavLink
            to="/submissions"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            Submissions
            {unreadCount > 0 && (
              <span style={{
                minWidth: '20px',
                height: '20px',
                padding: '0 6px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              padding: '0 16px'
            }}>
              {user.picture && (
                <img
                  src={user.picture}
                  alt=""
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%'
                  }}
                />
              )}
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                {user.name || user.email}
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="sidebar-logout">
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
