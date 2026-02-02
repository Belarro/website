import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usersApi, kitchensApi } from '../lib/supabase'

export default function UserEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState({
    email: '',
    role: 'chef',
    kitchen_id: '',
    status: 'active'
  })

  const [kitchens, setKitchens] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(!isNew)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadKitchens()
    if (!isNew) {
      loadUser()
    }
  }, [id, isNew])

  const loadKitchens = async () => {
    try {
      const data = await kitchensApi.getAll()
      setKitchens(data || [])
    } catch (err) {
      console.error('Error loading kitchens:', err)
    }
  }

  const loadUser = async () => {
    try {
      setLoadingData(true)
      const user = await usersApi.getById(id)
      if (user) {
        setForm({
          email: user.email || '',
          role: user.role || 'chef',
          kitchen_id: user.kitchen_id || '',
          status: user.status || 'active'
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      // Clear kitchen_id if role changes to admin
      ...(name === 'role' && value === 'admin' ? { kitchen_id: '' } : {})
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const userData = {
        email: form.email,
        role: form.role,
        kitchen_id: form.kitchen_id || null,
        status: form.status
      }

      if (isNew) {
        await usersApi.create(userData)
      } else {
        await usersApi.update(id, userData)
      }

      navigate('/users')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this user? This cannot be undone.')) {
      try {
        await usersApi.delete(id)
        navigate('/users')
      } catch (err) {
        setError(err.message)
      }
    }
  }

  if (loadingData) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading user...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to="/users" style={{ fontSize: '14px', color: 'var(--color-gray-text)', marginBottom: '4px', display: 'block', textDecoration: 'none' }}>&larr; Back to Users</Link>
          <h1>{isNew ? 'Add User' : form.email || 'Edit User'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isNew && (
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/users')}>
            Cancel
          </button>
          <button type="submit" form="user-form" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save User'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#ffebeb', color: '#ef476f', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
          Error: {error}
        </div>
      )}

      <form id="user-form" onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ marginTop: 0 }}>User Information</h2>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              required
              disabled={!isNew}
              placeholder="user@example.com"
            />
            {!isNew && (
              <p style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginTop: '4px' }}>
                Email cannot be changed after creation
              </p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
              >
                <option value="chef">Chef</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="kitchen_id">Kitchen</label>
              <select
                id="kitchen_id"
                name="kitchen_id"
                className="form-select"
                value={form.kitchen_id}
                onChange={handleChange}
                disabled={form.role === 'admin'}
              >
                <option value="">— No kitchen —</option>
                {kitchens.map(kitchen => (
                  <option key={kitchen.id} value={kitchen.id}>
                    {kitchen.kitchen_name}
                  </option>
                ))}
              </select>
              {form.role === 'admin' && (
                <p style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginTop: '4px' }}>
                  Admins have access to all kitchens
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}
