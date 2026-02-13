import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { kitchensApi, productsApi, standingOrdersApi } from '../lib/supabase'

export default function Orders() {
  const [kitchens, setKitchens] = useState([])
  const [products, setProducts] = useState([])
  const [standingOrders, setStandingOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [kitchenData, productData, ordersData] = await Promise.all([
        kitchensApi.getAll(),
        productsApi.getAll(),
        standingOrdersApi.getAll()
      ])
      setKitchens(kitchenData || [])
      setProducts(productData || [])
      setStandingOrders(ordersData || [])
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

  const getStandingOrder = (kitchenId) => {
    return standingOrders.find(so => so.kitchen_id === kitchenId)
  }

  const getOrderSummary = (kitchenId) => {
    const order = getStandingOrder(kitchenId)
    if (!order || !order.items || order.items.length === 0) {
      return { itemCount: 0, totalQty: 0, productNames: [] }
    }
    const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0)
    const productNames = order.items.map(item => {
      const product = products.find(p => p.id === item.product_id)
      return product ? product.name : 'Unknown'
    })
    return { itemCount: order.items.length, totalQty, productNames }
  }

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: '#ef476f' }}>Error: {error}</p>
        <button onClick={loadData} className="btn btn-secondary" style={{ marginTop: '12px' }}>Try Again</button>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <div className="page-subtitle">
            Manage standing orders per kitchen ({filteredKitchens.length} kitchen{filteredKitchens.length !== 1 ? 's' : ''})
          </div>
        </div>
      </div>

      <div className="card-static" style={{ padding: '24px' }}>
        <div className="filters">
          <span className="filter-label">Filter:</span>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Kitchens</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        {filteredKitchens.length === 0 ? (
          <div className="empty-state">
            <p>No kitchens found. {kitchens.length === 0 ? 'Add kitchens first to set up orders.' : 'Try adjusting your filters.'}</p>
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
                  <th>Kitchen</th>
                  <th>Standing Order</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredKitchens.map(kitchen => {
                  const summary = getOrderSummary(kitchen.id)
                  const order = getStandingOrder(kitchen.id)
                  return (
                    <tr key={kitchen.id}>
                      <td>
                        <strong>{kitchen.kitchen_name}</strong>
                        {kitchen.contact_name && (
                          <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginTop: '2px' }}>{kitchen.contact_name}</div>
                        )}
                      </td>
                      <td>
                        {summary.itemCount > 0 ? (
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              {summary.itemCount} item{summary.itemCount !== 1 ? 's' : ''}, {summary.totalQty} unit{summary.totalQty !== 1 ? 's' : ''}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginTop: '2px' }}>
                              {summary.productNames.slice(0, 3).join(', ')}{summary.productNames.length > 3 ? ` +${summary.productNames.length - 3} more` : ''}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-gray-text)', fontStyle: 'italic' }}>No order set</span>
                        )}
                      </td>
                      <td>
                        {order ? (
                          <span style={{ fontSize: '13px' }}>
                            {new Date(order.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-gray-text)' }}>&mdash;</span>
                        )}
                      </td>
                      <td>
                        <span className={`status status-${kitchen.status}`}>
                          {kitchen.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link to={`/orders/${kitchen.id}`} className="btn btn-small btn-secondary">
                          {summary.itemCount > 0 ? 'Edit Order' : 'Set Up Order'}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
