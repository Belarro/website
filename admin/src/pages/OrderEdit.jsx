import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { kitchensApi, productsApi } from '../lib/supabase'
import { mockStandingOrders, mockOrderHistory, growingStageOptions } from '../data/mockData'

// Calculate total growing days for a product
function getTotalGrowDays(product) {
  if (!product.growing_stages || product.growing_stages.length === 0) return 0
  return product.growing_stages.reduce((total, gs) => {
    if (gs.stage === 'soaking') return total
    if (gs.unit === 'hours') return total + gs.duration / 24
    return total + gs.duration
  }, 0)
}

// Get the next Tuesday from today
function getNextTuesday() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilTuesday = (2 - dayOfWeek + 7) % 7 || 7
  const next = new Date(today)
  next.setDate(today.getDate() + daysUntilTuesday)
  next.setHours(0, 0, 0, 0)
  return next
}

// Calculate which growing stage a crop is in based on seeding date and today
function calculateCurrentStage(product) {
  if (!product.growing_stages || product.growing_stages.length === 0) return null

  const totalDays = getTotalGrowDays(product)
  const deliveryDate = getNextTuesday()

  // Determine seeding day: Tuesday for 14+ day crops, Friday for shorter
  let seedingDate = new Date(deliveryDate)
  if (totalDays >= 14) {
    // Seed on Tuesday, totalDays before delivery
    seedingDate.setDate(deliveryDate.getDate() - Math.ceil(totalDays))
  } else {
    // Seed on Friday before delivery
    seedingDate.setDate(deliveryDate.getDate() - Math.ceil(totalDays))
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysSinceSeeding = (today - seedingDate) / (1000 * 60 * 60 * 24)

  if (daysSinceSeeding < 0) {
    return { activeIndex: -1, stages: product.growing_stages, status: 'Not started' }
  }

  let accumulated = 0
  for (let i = 0; i < product.growing_stages.length; i++) {
    const gs = product.growing_stages[i]
    const durationInDays = gs.unit === 'hours' ? gs.duration / 24 : gs.duration
    accumulated += durationInDays
    if (daysSinceSeeding < accumulated) {
      return { activeIndex: i, stages: product.growing_stages, status: 'Growing' }
    }
  }

  return { activeIndex: product.growing_stages.length, stages: product.growing_stages, status: 'Ready' }
}

function getStageName(stageValue) {
  const opt = growingStageOptions.find(o => o.value === stageValue)
  return opt ? opt.label : stageValue
}

export default function OrderEdit() {
  const { kitchenId } = useParams()
  const navigate = useNavigate()

  const [kitchen, setKitchen] = useState(null)
  const [products, setProducts] = useState([])
  const [orderItems, setOrderItems] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('order')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [kitchenId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [kitchenData, productData] = await Promise.all([
        kitchensApi.getById(kitchenId),
        productsApi.getAll()
      ])
      setKitchen(kitchenData)
      setProducts(productData || [])

      // Load standing order from mock
      const standingOrder = mockStandingOrders.find(so => so.kitchen_id === kitchenId)
      if (standingOrder) {
        setOrderItems(standingOrder.items.map(item => ({ ...item })))
      }

      // Load order history from mock
      const history = mockOrderHistory.filter(oh => oh.kitchen_id === kitchenId)
      setOrderHistory(history)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const availableProducts = products.filter(p =>
    p.availability_status === 'available' || p.availability_status === 'seasonal'
  )

  const filteredProducts = searchQuery
    ? availableProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : availableProducts

  const getOrderItem = (productId) => {
    return orderItems.find(i => i.product_id === productId)
  }

  const updateOrderItem = (productId, field, value) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.product_id === productId)
      if (existing) {
        if (field === 'quantity' && value <= 0) {
          return prev.filter(i => i.product_id !== productId)
        }
        return prev.map(i => i.product_id === productId ? { ...i, [field]: value } : i)
      } else if (field === 'quantity' && value > 0) {
        const product = products.find(p => p.id === productId)
        const defaultSize = product?.available_sizes?.[0] || ''
        return [...prev, { product_id: productId, size: defaultSize, quantity: value }]
      } else if (field === 'size') {
        const product = products.find(p => p.id === productId)
        return [...prev, { product_id: productId, size: value, quantity: 1 }]
      }
      return prev
    })
  }

  const removeOrderItem = (productId) => {
    setOrderItems(prev => prev.filter(i => i.product_id !== productId))
  }

  const getOrderTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.product_id)
      if (!product || !product.prices) return total
      const unitPrice = product.prices[item.size] || 0
      return total + (unitPrice * item.quantity)
    }, 0)
  }

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      // Mock save for now
      await new Promise(resolve => setTimeout(resolve, 500))
      alert('Standing order saved successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleClearOrder = () => {
    if (window.confirm('Clear all items from this standing order?')) {
      setOrderItems([])
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading order...</p>
      </div>
    )
  }

  if (error && !kitchen) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: '#ef476f' }}>Error: {error}</p>
        <button onClick={loadData} className="btn btn-secondary">Try Again</button>
      </div>
    )
  }

  const tabStyle = (tab) => ({
    padding: '8px 20px',
    border: 'none',
    background: activeTab === tab ? 'var(--color-dark)' : 'transparent',
    color: activeTab === tab ? 'white' : 'var(--color-gray-text)',
    borderRadius: '100px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px'
  })

  const nextTuesday = getNextTuesday()

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to="/orders" style={{ fontSize: '14px', color: 'var(--color-gray-text)', marginBottom: '4px', display: 'block', textDecoration: 'none' }}>&larr; Back to Orders</Link>
          <h1>{kitchen?.kitchen_name || 'Kitchen Order'}</h1>
          <div style={{ fontSize: '14px', color: 'var(--color-gray-text)', marginTop: '4px' }}>
            Next delivery: {nextTuesday.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/orders')}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Order'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#ffebeb', color: '#ef476f', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
          Error: {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        <button type="button" style={tabStyle('order')} onClick={() => setActiveTab('order')}>
          Standing Order
        </button>
        <button type="button" style={tabStyle('history')} onClick={() => setActiveTab('history')}>
          Order History ({orderHistory.length})
        </button>
        <button type="button" style={tabStyle('tracking')} onClick={() => setActiveTab('tracking')}>
          Production Tracking
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>

        {/* Left Column */}
        <div>
          {activeTab === 'order' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>All Crops</h2>
                <span style={{ fontSize: '13px', color: 'var(--color-gray-text)' }}>
                  {availableProducts.length} available
                </span>
              </div>

              {/* Search */}
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search crops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {filteredProducts.map(product => {
                  const orderItem = getOrderItem(product.id)
                  const qty = orderItem?.quantity || 0
                  const selectedSize = orderItem?.size || product.available_sizes?.[0] || ''
                  const unitPrice = product.prices?.[selectedSize] || 0
                  const hasSizes = product.available_sizes && product.available_sizes.length > 0

                  return (
                    <div
                      key={product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        gap: '16px',
                        borderRadius: '12px',
                        border: `1px solid ${qty > 0 ? 'var(--color-green)' : 'var(--color-gray-border)'}`,
                        background: qty > 0 ? 'var(--color-green-light)' : 'white',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Product Photo */}
                      <img
                        src={product.photo}
                        alt={product.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', background: '#f5f5f5' }}
                      />

                      {/* Product Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-gray-text)' }}>
                          {product.availability_status === 'seasonal' && (
                            <span className="status status-seasonal" style={{ fontSize: '10px', marginRight: '6px' }}>Seasonal</span>
                          )}
                          {product.facts?.harvest_window_days} days
                        </div>
                      </div>

                      {/* Size Selector */}
                      <div>
                        {hasSizes ? (
                          <select
                            className="form-select"
                            value={selectedSize}
                            onChange={(e) => updateOrderItem(product.id, 'size', e.target.value)}
                            style={{ width: '110px', fontSize: '13px', padding: '6px 8px', height: 'auto' }}
                          >
                            {product.available_sizes.map(size => (
                              <option key={size} value={size}>
                                {size === 'container' ? 'Container' : size}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--color-gray-text)', fontStyle: 'italic' }}>No sizes</span>
                        )}
                      </div>

                      {/* Price */}
                      <div style={{ minWidth: '50px', textAlign: 'right', fontSize: '13px', color: 'var(--color-gray-text)' }}>
                        {unitPrice > 0 ? `\u20AC${unitPrice.toFixed(2)}` : ''}
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => updateOrderItem(product.id, 'quantity', qty - 1)}
                          disabled={qty === 0 || !hasSizes}
                          style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            border: '1px solid var(--color-gray-border)',
                            background: 'white', cursor: qty > 0 && hasSizes ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: qty === 0 ? 0.4 : 1, fontSize: '16px'
                          }}
                        >
                          -
                        </button>
                        <span style={{ width: '28px', textAlign: 'center', fontWeight: 600, fontSize: '15px' }}>{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateOrderItem(product.id, 'quantity', qty + 1)}
                          disabled={!hasSizes}
                          style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            border: '1px solid var(--color-gray-border)',
                            background: 'white', cursor: hasSizes ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="card">
              <h2 style={{ marginBottom: '20px' }}>Order History</h2>
              {orderHistory.length === 0 ? (
                <div className="empty-state">
                  <p>No order history yet for this kitchen.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Delivery Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map(order => (
                        <tr key={order.id}>
                          <td>
                            <strong>
                              {new Date(order.delivery_date).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </strong>
                          </td>
                          <td>
                            <div>
                              {order.items.map((item, i) => (
                                <div key={i} style={{ fontSize: '13px', color: i === 0 ? 'inherit' : 'var(--color-gray-text)' }}>
                                  {item.quantity}x {item.product_name} ({item.size})
                                </div>
                              ))}
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>&euro;{order.total.toFixed(2)}</td>
                          <td>
                            <span className={`status status-${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="card">
              <h2 style={{ marginBottom: '8px' }}>Production Tracking</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-gray-text)', marginBottom: '24px' }}>
                Current growing status for items in the standing order
              </p>

              {orderItems.length === 0 ? (
                <div className="empty-state">
                  <p>No items in standing order to track.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {orderItems.map(item => {
                    const product = products.find(p => p.id === item.product_id)
                    if (!product) return null
                    const stageInfo = calculateCurrentStage(product)

                    return (
                      <div key={item.product_id} style={{ padding: '16px', border: '1px solid var(--color-gray-border)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>{product.name}</div>
                            <div style={{ fontSize: '13px', color: 'var(--color-gray-text)' }}>
                              {item.quantity}x {item.size === 'container' ? 'Container' : item.size}
                            </div>
                          </div>
                          {stageInfo && (
                            <span className={`status status-${stageInfo.status === 'Ready' ? 'ready' : stageInfo.status === 'Growing' ? 'growing' : 'pending'}`}>
                              {stageInfo.status}
                            </span>
                          )}
                        </div>

                        {stageInfo && stageInfo.stages.length > 0 ? (
                          <div>
                            {/* Timeline Bar */}
                            <div className="stage-timeline">
                              {stageInfo.stages.map((gs, i) => (
                                <div
                                  key={i}
                                  className={`stage-segment ${i < stageInfo.activeIndex ? 'completed' : i === stageInfo.activeIndex ? 'active' : ''}`}
                                  title={`${getStageName(gs.stage)}: ${gs.duration} ${gs.unit}`}
                                />
                              ))}
                            </div>
                            {/* Stage Labels */}
                            <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
                              {stageInfo.stages.map((gs, i) => (
                                <div
                                  key={i}
                                  className={`stage-label ${i === stageInfo.activeIndex ? 'active' : ''}`}
                                  style={{ flex: 1 }}
                                >
                                  {getStageName(gs.stage)}
                                  <div style={{ fontSize: '10px' }}>
                                    {gs.duration}{gs.unit === 'hours' ? 'h' : 'd'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '13px', color: 'var(--color-gray-text)', fontStyle: 'italic' }}>
                            Growing stages not configured
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column — Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Kitchen Info */}
          <div className="card">
            <h2>Kitchen Info</h2>
            <div style={{ fontSize: '14px', marginTop: '12px' }}>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-gray-text)', letterSpacing: '0.05em', marginBottom: '2px' }}>Name</div>
                <div style={{ fontWeight: 500 }}>{kitchen?.kitchen_name}</div>
              </div>
              {kitchen?.contact_name && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-gray-text)', letterSpacing: '0.05em', marginBottom: '2px' }}>Contact</div>
                  <div>{kitchen.contact_name}</div>
                  {kitchen.contact_email && <div style={{ fontSize: '13px', color: 'var(--color-gray-text)' }}>{kitchen.contact_email}</div>}
                </div>
              )}
              <div>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-gray-text)', letterSpacing: '0.05em', marginBottom: '2px' }}>Status</div>
                <span className={`status status-${kitchen?.status}`}>{kitchen?.status}</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <h2>Order Summary</h2>
            {orderItems.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--color-gray-text)', fontStyle: 'italic', marginTop: '12px' }}>
                No items added yet
              </p>
            ) : (
              <div style={{ marginTop: '12px' }}>
                {orderItems.map(item => {
                  const product = products.find(p => p.id === item.product_id)
                  if (!product) return null
                  const unitPrice = product.prices?.[item.size] || 0
                  const lineTotal = unitPrice * item.quantity
                  return (
                    <div
                      key={item.product_id}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 0', borderBottom: '1px solid var(--color-gray-border)'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-gray-text)' }}>
                          {item.quantity}x {item.size === 'container' ? 'Container' : item.size}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>
                          {lineTotal > 0 ? `\u20AC${lineTotal.toFixed(2)}` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeOrderItem(item.product_id)}
                          style={{
                            background: 'none', border: 'none', color: '#ef476f',
                            cursor: 'pointer', fontSize: '16px', padding: '2px'
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  )
                })}

                {/* Totals */}
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '2px solid var(--color-dark)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-gray-text)' }}>Items</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{orderItems.length} products, {getTotalItems()} units</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700 }}>Total</span>
                    <span style={{ fontSize: '16px', fontWeight: 700 }}>&euro;{getOrderTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
              style={{ width: '100%' }}
            >
              {saving ? 'Saving...' : 'Save Standing Order'}
            </button>
            {orderItems.length > 0 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleClearOrder}
                style={{ width: '100%' }}
              >
                Clear Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
