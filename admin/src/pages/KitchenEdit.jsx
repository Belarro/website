import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { kitchensApi } from '../lib/supabase'
import { deliveryDays } from '../data/mockData'

export default function KitchenEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState({
    kitchen_name: '',
    delivery_day: 'tuesday',
    status: 'active',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(!isNew)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isNew) {
      loadKitchen()
    }
  }, [id, isNew])

  const loadKitchen = async () => {
    try {
      setLoadingData(true)
      const kitchen = await kitchensApi.getById(id)
      if (kitchen) {
        setForm({
          kitchen_name: kitchen.kitchen_name || '',
          delivery_day: kitchen.delivery_day || 'tuesday',
          status: kitchen.status || 'active',
          contact_name: kitchen.contact_name || '',
          contact_email: kitchen.contact_email || '',
          contact_phone: kitchen.contact_phone || '',
          address: kitchen.address || '',
          notes: kitchen.notes || ''
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
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const kitchenData = {
        kitchen_name: form.kitchen_name,
        delivery_day: form.delivery_day,
        status: form.status,
        contact_name: form.contact_name || null,
        contact_email: form.contact_email || null,
        contact_phone: form.contact_phone || null,
        address: form.address || null,
        notes: form.notes || null
      }

      if (isNew) {
        await kitchensApi.create(kitchenData)
      } else {
        await kitchensApi.update(id, kitchenData)
      }

      navigate('/kitchens')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this kitchen? This cannot be undone.')) {
      try {
        await kitchensApi.delete(id)
        navigate('/kitchens')
      } catch (err) {
        setError(err.message)
      }
    }
  }

  if (loadingData) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading kitchen...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to="/kitchens" style={{ fontSize: '14px', color: 'var(--color-gray-text)', marginBottom: '4px', display: 'block', textDecoration: 'none' }}>&larr; Back to Kitchens</Link>
          <h1>{isNew ? 'Add Kitchen' : form.kitchen_name || 'Edit Kitchen'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isNew && (
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/kitchens')}>
            Cancel
          </button>
          <button type="submit" form="kitchen-form" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Kitchen'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#ffebeb', color: '#ef476f', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
          Error: {error}
        </div>
      )}

      <form id="kitchen-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ marginTop: 0 }}>Kitchen Information</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="kitchen_name">Kitchen Name</label>
              <input
                type="text"
                id="kitchen_name"
                name="kitchen_name"
                className="form-input"
                value={form.kitchen_name}
                onChange={handleChange}
                required
                placeholder="e.g. Restaurant Mitte"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="delivery_day">Delivery Day</label>
                <select
                  id="delivery_day"
                  name="delivery_day"
                  className="form-select"
                  value={form.delivery_day}
                  onChange={handleChange}
                >
                  {deliveryDays.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
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
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Delivery Address</label>
              <textarea
                id="address"
                name="address"
                className="form-textarea"
                value={form.address}
                onChange={handleChange}
                rows={2}
                placeholder="Street, City, Postal Code"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="form-textarea"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Internal notes about this kitchen..."
              />
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ marginTop: 0 }}>Contact</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="contact_name">Contact Name</label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                className="form-input"
                value={form.contact_name}
                onChange={handleChange}
                placeholder="e.g. Thomas Weber"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact_email">Email</label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                className="form-input"
                value={form.contact_email}
                onChange={handleChange}
                placeholder="contact@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact_phone">Phone</label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                className="form-input"
                value={form.contact_phone}
                onChange={handleChange}
                placeholder="+49 30 1234567"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
