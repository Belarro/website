import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../lib/supabase'
import { categories, statusOptions } from '../data/mockData'

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

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading products...</p>
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
          <div style={{ fontSize: '14px', color: 'var(--color-gray-text)' }}>
            Manage your catalog ({filteredProducts.length} items)
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
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Sort</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: '#f4f5f7',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        {product.photo ? (
                          <img src={product.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ opacity: 0.3 }}>🌿</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{product.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', fontFamily: 'monospace' }}>{product.slug}</div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '13px',
                        padding: '4px 10px',
                        background: '#f4f5f7',
                        borderRadius: '4px',
                        fontWeight: 500
                      }}>
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusClass(product.availability_status)}>
                        {product.availability_status}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--color-gray-text)' }}>
                      {product.sort_order}
                    </td>
                    <td className="text-right">
                      <Link to={`/products/${product.id}`} className="btn btn-small btn-secondary">
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
