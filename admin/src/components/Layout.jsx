import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

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
