import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usersApi, kitchensApi } from '../lib/supabase'

export default function Users() {
  const [users, setUsers] = useState([])
  const [kitchens, setKitchens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, kitchensData] = await Promise.all([
        usersApi.getAll(),
        kitchensApi.getAll()
      ])
      setUsers(usersData || [])
      setKitchens(kitchensData || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false
    return true
  })

  const getKitchenName = (kitchenId) => {
    if (!kitchenId) return '—'
    const kitchen = kitchens.find(k => k.id === kitchenId)
    return kitchen ? kitchen.kitchen_name : '—'
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-subtitle"></div></div>
        <div className="skeleton skeleton-card"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: '#ef476f' }}>Error: {error}</p>
        <button onClick={loadData} className="btn btn-secondary">Try Again</button>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <div style={{ fontSize: '14px', color: 'var(--color-gray-text)' }}>
            Manage user accounts ({filteredUsers.length} users)
          </div>
        </div>
        <Link to="/users/new" className="btn btn-primary">+ Add User</Link>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div className="filters">
          <div style={{ flex: 1, fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'center' }}>
            Filter:
          </div>
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="chef">Chef</option>
          </select>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>No users found. {users.length === 0 ? 'Add your first user!' : 'Try adjusting your filters.'}</p>
            {users.length > 0 && (
              <button onClick={() => setRoleFilter('all')} className="btn btn-secondary btn-small">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Kitchen</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.email}</strong>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '13px',
                        padding: '4px 10px',
                        background: user.role === 'admin' ? '#e8f5e9' : '#f4f5f7',
                        color: user.role === 'admin' ? '#2e7d32' : 'inherit',
                        borderRadius: '4px',
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>{getKitchenName(user.kitchen_id)}</td>
                    <td>
                      <span className={`status status-${user.status === 'active' ? 'available' : 'paused'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link to={`/users/${user.id}`} className="btn btn-small btn-secondary">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
