import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../lib/supabase'
import { categories, statusOptions, growingStageOptions } from '../data/mockData'

const getStageLabel = (value) => {
  const stage = growingStageOptions.find(s => s.value === value)
  return stage ? stage.label : value
}

const formatDuration = (duration, unit) => {
  if (unit === 'hours') return `${duration}h`
  return `${duration}d`
}

const getGrowStagesText = (stages) => {
  if (!stages || stages.length === 0) return null
  return stages.map(s => `${getStageLabel(s.stage)} ${formatDuration(s.duration, s.unit)}`).join(' → ')
}

const getTotalGrowTime = (stages) => {
  if (!stages || stages.length === 0) return null
  let totalHours = 0
  stages.forEach(s => {
    if (s.stage === 'soaking') return
    totalHours += s.unit === 'hours' ? s.duration : s.duration * 24
  })
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  if (days === 0) return `${hours}h`
  if (hours === 0) return `${days}d`
  return `${days}d ${hours}h`
}

const getPricesText = (product) => {
  const { available_sizes: sizes, prices, container_box_size } = product
  if (!sizes || sizes.length === 0) return null
  return sizes.map(size => {
    const price = prices && prices[size]
    let label = price ? `${size}: €${price.toFixed(2)}` : size
    if (size === 'container' && container_box_size) {
      label += ` (${container_box_size})`
    }
    return label
  }).join(' · ')
}

const getCompleteness = (product) => {
  let filled = 0
  let total = 3
  if (product.available_sizes && product.available_sizes.length > 0) filled++
  if (product.growing_stages && product.growing_stages.length > 0) filled++
  if (product.yield_per_tray) filled++
  if (filled === total) return 'complete'
  if (filled === 0) return 'empty'
  return 'partial'
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productsApi.getAll()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    if (categoryFilter !== 'all' && product.category !== categoryFilter) return false
    if (statusFilter !== 'all' && product.availability_status !== statusFilter) return false
    return true
  })

  const getCategoryLabel = (value) => {
    const cat = categories.find(c => c.value === value)
    return cat ? cat.label : value
  }

  const getStatusClass = (status) => {
    return `status status-${status}`
  }

  // Stats
  const completeCount = filteredProducts.filter(p => getCompleteness(p) === 'complete').length
  const partialCount = filteredProducts.filter(p => getCompleteness(p) === 'partial').length
  const emptyCount = filteredProducts.filter(p => getCompleteness(p) === 'empty').length

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
        <button onClick={loadProducts} className="btn btn-secondary">Try Again</button>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <div style={{ fontSize: '14px', color: 'var(--color-gray-text)', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>{filteredProducts.length} items</span>
            <span style={{ color: '#22c55e' }}>{completeCount} complete</span>
            {partialCount > 0 && <span style={{ color: '#f59e0b' }}>{partialCount} partial</span>}
            {emptyCount > 0 && <span style={{ color: '#ef476f' }}>{emptyCount} missing data</span>}
          </div>
        </div>
        <Link to="/products/new" className="btn btn-primary">
          + New Product
        </Link>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div className="filters">
          <div style={{ flex: 1, fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'center' }}>
            Filter Views:
          </div>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Status</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products found. {products.length === 0 ? 'Add your first product!' : 'Try adjusting your filters.'}</p>
            {products.length > 0 && (
              <button onClick={() => { setCategoryFilter('all'); setStatusFilter('all'); }} className="btn btn-secondary btn-small">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="table product-data-table">
              <thead>
                <tr>
                  <th style={{ width: '4px', padding: 0 }}></th>
                  <th style={{ width: '56px' }}>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Sizes & Prices</th>
                  <th className="text-right" style={{ width: '80px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const completeness = getCompleteness(product)
                  const hasSizes = product.available_sizes && product.available_sizes.length > 0
                  const hasStages = product.growing_stages && product.growing_stages.length > 0
                  const hasYield = !!product.yield_per_tray

                  return (
                    <tr key={product.id} className={`product-row product-row--${completeness}`}>
                      <td className="product-row-indicator" style={{ padding: 0, width: '4px' }}>
                        <div className={`completeness-bar completeness-${completeness}`} />
                      </td>
                      <td style={{ padding: '12px 12px 12px 16px', verticalAlign: 'top' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          background: '#f4f5f7',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px'
                        }}>
                          {product.photo ? (
                            <img src={product.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ opacity: 0.3 }}>🌿</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-dark)', marginBottom: '2px' }}>{product.name}</div>
                        {/* Sub-row: growing stages + yield */}
                        <div className="product-subrow">
                          {hasStages ? (
                            <span className="product-stages">
                              {getGrowStagesText(product.growing_stages)}
                              <span className="product-total-time">= {getTotalGrowTime(product.growing_stages)}</span>
                            </span>
                          ) : (
                            <span className="product-missing">No growing stages</span>
                          )}
                          <span className="product-subrow-divider">·</span>
                          {hasYield ? (
                            <span className="product-yield">Yield: {product.yield_per_tray}</span>
                          ) : (
                            <span className="product-missing">No yield</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top' }}>
                        <span style={{
                          fontSize: '12px',
                          padding: '3px 8px',
                          background: '#f4f5f7',
                          borderRadius: '4px',
                          fontWeight: 500
                        }}>
                          {getCategoryLabel(product.category)}
                        </span>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top' }}>
                        <span className={getStatusClass(product.availability_status)}>
                          {product.availability_status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top' }}>
                        {hasSizes ? (
                          <div className="product-prices">
                            {getPricesText(product)}
                          </div>
                        ) : (
                          <span className="product-missing">No sizes configured</span>
                        )}
                      </td>
                      <td className="text-right" style={{ padding: '12px', verticalAlign: 'top' }}>
                        <Link to={`/products/${product.id}`} className="btn btn-small btn-secondary">
                          Edit
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
