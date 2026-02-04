import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsApi, kitchensApi, usersApi } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    kitchens: 0,
    users: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Fetch products count
      let productCount = 0
      try {
        const products = await productsApi.getAll()
        productCount = products.filter(p => p.availability_status !== 'hidden').length
      } catch (err) {
        console.log('Products table may not exist yet')
      }

      // Fetch kitchens count
      let kitchenCount = 0
      try {
        const kitchens = await kitchensApi.getAll()
        kitchenCount = kitchens ? kitchens.filter(k => k.status === 'active').length : 0
      } catch (err) {
        console.log('Kitchens table may not exist yet')
      }

      // Fetch users count
      let userCount = 0
      try {
        const users = await usersApi.getAll()
        userCount = users ? users.filter(u => u.status === 'active').length : 0
      } catch (err) {
        console.log('Users table may not exist yet')
      }

      setStats({
        products: productCount,
        kitchens: kitchenCount,
        users: userCount
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '48px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Overview</h1>
          <p style={{ fontSize: '16px', color: 'var(--color-gray-text)' }}>Welcome back, Admin</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="status status-available">System Normal</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <Link to="/products" className="card" style={{ textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="card-title" style={{ fontSize: '48px', letterSpacing: '-0.03em' }}>
              {loading ? '...' : stats.products}
            </div>
            <div className="card-meta" style={{ marginTop: '8px' }}>Live Products</div>
            <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--color-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
              Catalog updated today
            </div>
          </div>
        </Link>

        <Link to="/kitchens" className="card" style={{ textDecoration: 'none' }}>
          <div className="card-title" style={{ fontSize: '48px', letterSpacing: '-0.03em' }}>
            {loading ? '...' : stats.kitchens}
          </div>
          <div className="card-meta" style={{ marginTop: '8px' }}>Active Kitchens</div>
          <div style={{ marginTop: '24px', fontSize: '13px', color: stats.kitchens > 0 ? 'var(--color-green)' : 'var(--color-gray-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            {stats.kitchens > 0 && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>}
            {stats.kitchens > 0 ? '100% On-time this week' : 'No kitchens registered yet'}
          </div>
        </Link>

        <Link to="/users" className="card" style={{ textDecoration: 'none' }}>
          <div className="card-title" style={{ fontSize: '48px', letterSpacing: '-0.03em' }}>
            {loading ? '...' : stats.users}
          </div>
          <div className="card-meta" style={{ marginTop: '8px' }}>System Users</div>
          <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--color-gray-text)', fontWeight: 600 }}>
            {stats.users > 0 ? 'Access Controls Active' : 'No users added yet'}
          </div>
        </Link>
      </div>

      <div className="mt-xl" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginTop: '48px' }}>
        <div className="card" style={{ minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Recent Activity</h2>
            <button className="btn btn-secondary" style={{ height: '32px', padding: '0 16px', fontSize: '12px' }}>filter</button>
          </div>

          <div className="empty-state" style={{ padding: '48px', textAlign: 'center', border: '2px dashed var(--color-gray-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px', opacity: 0.2 }}>📦</div>
            <p style={{ fontWeight: 500 }}>No recent orders to display</p>
            <div style={{ fontSize: '13px', color: 'var(--color-gray-text)', marginTop: '8px' }}>Chef ordering features are being rolled out.</div>
          </div>
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: '24px' }}>
            <h2 style={{ marginBottom: '24px' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/products/new" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                <span style={{ marginRight: '12px', fontSize: '18px' }}>+</span> Add New Product
              </Link>
              <Link to="/kitchens/new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <span style={{ marginRight: '12px', fontSize: '18px' }}>Restaurant</span> Register Kitchen
              </Link>
              <Link to="/users/new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <span style={{ marginRight: '12px', fontSize: '18px' }}>Team</span> Invite Member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
