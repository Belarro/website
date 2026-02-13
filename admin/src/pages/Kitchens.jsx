import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { kitchensApi } from '../lib/supabase'
import { deliveryDays } from '../data/mockData'

export default function Kitchens() {
  const [kitchens, setKitchens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadKitchens()
  }, [])

  const loadKitchens = async () => {
    try {
      setLoading(true)
      const data = await kitchensApi.getAll()
      setKitchens(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredKitchens = kitchens.filter(kitchen => {
    if (statusFilter !== 'all' && kitchen.status !== statusFilter) return false
    return true
  })

  const getDeliveryLabel = (value) => {
    const day = deliveryDays.find(d => d.value === value)
    return day ? day.label : value
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
        <button onClick={loadKitchens} className="btn btn-secondary">Try Again</button>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Kitchens</h1>
          <div style={{ fontSize: '14px', color: 'var(--color-gray-text)' }}>
            Manage client kitchens ({filteredKitchens.length} kitchens)
          </div>
        </div>
        <Link to="/kitchens/new" className="btn btn-primary">+ Add Kitchen</Link>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div className="filters">
          <div style={{ flex: 1, fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'center' }}>
            Filter:
          </div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        {filteredKitchens.length === 0 ? (
          <div className="empty-state">
            <p>No kitchens found. {kitchens.length === 0 ? 'Add your first kitchen!' : 'Try adjusting your filters.'}</p>
            {kitchens.length > 0 && (
              <button onClick={() => setStatusFilter('all')} className="btn btn-secondary btn-small">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Kitchen Name</th>
                  <th>Delivery Day</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredKitchens.map(kitchen => (
                  <tr key={kitchen.id}>
                    <td>
                      <strong>{kitchen.kitchen_name}</strong>
                    </td>
                    <td>{getDeliveryLabel(kitchen.delivery_day)}</td>
                    <td>
                      {kitchen.contact_name ? (
                        <div>
                          <div>{kitchen.contact_name}</div>
                          <div style={{ fontSize: '12px', opacity: 0.7 }}>
                            {kitchen.contact_email}
                          </div>
                        </div>
                      ) : (
                        <span style={{ opacity: 0.5 }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`status status-${kitchen.status}`}>
                        {kitchen.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link to={`/kitchens/${kitchen.id}`} className="btn btn-small btn-secondary">
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
