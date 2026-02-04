import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productsApi } from '../lib/supabase'
import { categories, statusOptions } from '../data/mockData'
import ImageUpload from '../components/ImageUpload'
// v2 - Tags feature

export default function ProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 0,
    harvest_window_days: '',
    shelf_life_days: '',
    grown_medium: 'soil',
    notes_optional: '',
    service_fit: '',
    flavor_profile: '',
    description_chef: '',
    photo_url: null,
    photo_flip: 'none',
    tags: [],
    featured_homepage: false,
    // German translations
    name_de: '',
    flavor_profile_de: '',
    description_chef_de: '',
    service_fit_de: ''
  })

  const [newTag, setNewTag] = useState('')
  const [allTags, setAllTags] = useState([])
  const [featuredCount, setFeaturedCount] = useState(0)

  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(!isNew)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('en')

  useEffect(() => {
    if (!isNew) {
      loadProduct()
    }
    loadAllTags()
    loadFeaturedCount()
  }, [id, isNew])

  const loadFeaturedCount = async () => {
    try {
      const products = await productsApi.getAll()
      const count = products.filter(p => p.featured_homepage && p.id !== id).length
      setFeaturedCount(count)
    } catch (err) {
      console.error('Error loading featured count:', err)
    }
  }

  const loadAllTags = async () => {
    try {
      const tags = await productsApi.getAllTags()
      setAllTags(tags)
    } catch (err) {
      console.error('Error loading tags:', err)
    }
  }

  const loadProduct = async () => {
    try {
      setLoadingProduct(true)
      const product = await productsApi.getById(id)
      if (product) {
        setForm({
          name: product.name || '',
          slug: product.slug || '',
          category: product.category || 'microgreen',
          availability_status: product.availability_status || 'available',
          sort_order: product.sort_order || 0,
          harvest_window_days: product.facts?.harvest_window_days || '',
          shelf_life_days: product.facts?.shelf_life_days || '',
          grown_medium: product.facts?.grown_medium || 'soil',
          notes_optional: product.facts?.notes_optional || '',
          service_fit: product.service_fit || '',
          flavor_profile: product.flavor_profile || '',
          description_chef: product.description_chef || '',
          photo_url: product.photo || null,
          photo_flip: product.photo_flip || 'none',
          tags: Array.isArray(product.tags) ? product.tags : [],
          featured_homepage: product.featured_homepage || false,
          // German translations
          name_de: product.name_de || '',
          flavor_profile_de: product.flavor_profile_de || '',
          description_chef_de: product.description_chef_de || '',
          service_fit_de: product.service_fit_de || ''
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingProduct(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && isNew ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {})
    }))
  }

  const handleImageChange = (url) => {
    setForm(prev => ({ ...prev, photo_url: url }))
  }

  const addTag = () => {
    const tag = newTag.trim()
    const currentTags = Array.isArray(form.tags) ? form.tags : []
    if (tag && !currentTags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...currentTags, tag] }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const productData = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        category: form.category,
        availability_status: form.availability_status,
        sort_order: parseInt(form.sort_order) || 0,
        facts: {
          harvest_window_days: form.harvest_window_days,
          shelf_life_days: form.shelf_life_days,
          grown_medium: form.grown_medium,
          notes_optional: form.notes_optional
        },
        service_fit: form.service_fit,
        flavor_profile: form.flavor_profile,
        description_chef: form.description_chef,
        photo: form.photo_url,
        photo_flip: form.photo_flip,
        tags: form.tags,
        featured_homepage: form.featured_homepage,
        // German translations
        name_de: form.name_de,
        flavor_profile_de: form.flavor_profile_de,
        description_chef_de: form.description_chef_de,
        service_fit_de: form.service_fit_de
      }

      console.log('Saving product with tags:', form.tags)
      console.log('Full productData:', productData)

      if (isNew) {
        await productsApi.create(productData)
      } else {
        await productsApi.update(id, productData)
      }

      navigate('/products')
    } catch (err) {
      console.error('Save error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      try {
        await productsApi.delete(id)
        navigate('/products')
      } catch (err) {
        setError(err.message)
      }
    }
  }

  if (loadingProduct) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading product...</p>
      </div>
    )
  }

  const tabStyle = (tab) => ({
    padding: '8px 16px',
    border: 'none',
    background: activeTab === tab ? 'var(--color-primary)' : 'var(--color-light)',
    color: activeTab === tab ? 'white' : 'var(--color-dark)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to="/products" style={{ fontSize: '14px', color: 'var(--color-gray-text)', marginBottom: '4px', display: 'block', textDecoration: 'none' }}>&larr; Back to Products</Link>
          <h1>{isNew ? 'New Product' : form.name || 'Edit Product'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isNew && (
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
            Cancel
          </button>
          <button type="submit" form="product-form" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#ffebeb', color: '#ef476f', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
          Error: {error}
        </div>
      )}

      <form id="product-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>

          {/* Left Column: Main Info */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Product Information</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" style={tabStyle('en')} onClick={() => setActiveTab('en')}>
                  English
                </button>
                <button type="button" style={tabStyle('de')} onClick={() => setActiveTab('de')}>
                  Deutsch
                </button>
              </div>
            </div>

            {activeTab === 'en' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Product Name (English)</label>
                  <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                      {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select name="availability_status" className="form-select" value={form.availability_status} onChange={handleChange}>
                      {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group mt-lg">
                  <label className="form-label">Flavor Profile (English)</label>
                  <textarea
                    name="flavor_profile"
                    className="form-textarea"
                    value={form.flavor_profile}
                    onChange={handleChange}
                    placeholder="e.g. Sweet pea flavor with fresh crunchy texture..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Chef Description (English)</label>
                  <textarea
                    name="description_chef"
                    className="form-textarea"
                    value={form.description_chef}
                    onChange={handleChange}
                    style={{ minHeight: '120px' }}
                    placeholder="Detailed description for the chef catalog..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Fit (English)</label>
                  <textarea name="service_fit" className="form-textarea" value={form.service_fit} onChange={handleChange} rows={2} />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Produktname (Deutsch)</label>
                  <input
                    type="text"
                    name="name_de"
                    className="form-input"
                    value={form.name_de}
                    onChange={handleChange}
                    placeholder={form.name ? `Translate: ${form.name}` : ''}
                  />
                </div>

                <div style={{ padding: '12px', background: 'var(--color-light)', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-gray-text)' }}>
                    Category & Status are shared between languages
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Geschmacksprofil (Deutsch)</label>
                  <textarea
                    name="flavor_profile_de"
                    className="form-textarea"
                    value={form.flavor_profile_de}
                    onChange={handleChange}
                    placeholder={form.flavor_profile ? `Translate: ${form.flavor_profile}` : 'z.B. Süßer Erbsengeschmack mit frischer knuspriger Textur...'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Beschreibung für Köche (Deutsch)</label>
                  <textarea
                    name="description_chef_de"
                    className="form-textarea"
                    value={form.description_chef_de}
                    onChange={handleChange}
                    style={{ minHeight: '120px' }}
                    placeholder={form.description_chef ? `Translate: ${form.description_chef}` : 'Detaillierte Beschreibung für den Kochkatalog...'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Passend zu (Deutsch)</label>
                  <textarea
                    name="service_fit_de"
                    className="form-textarea"
                    value={form.service_fit_de}
                    onChange={handleChange}
                    rows={2}
                    placeholder={form.service_fit ? `Translate: ${form.service_fit}` : ''}
                  />
                </div>
              </>
            )}
          </div>

          {/* Right Column: Media & Specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Featured on Homepage */}
            <div className="card" style={{ background: form.featured_homepage ? '#e8f5e9' : 'white' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: featuredCount >= 6 && !form.featured_homepage ? 'not-allowed' : 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.featured_homepage}
                  onChange={(e) => {
                    if (e.target.checked && featuredCount >= 6) {
                      alert('Maximum 6 products can be featured on the homepage. Please uncheck another product first.')
                      return
                    }
                    setForm(prev => ({ ...prev, featured_homepage: e.target.checked }))
                  }}
                  disabled={featuredCount >= 6 && !form.featured_homepage}
                  style={{ width: '20px', height: '20px', cursor: featuredCount >= 6 && !form.featured_homepage ? 'not-allowed' : 'pointer' }}
                />
                <div>
                  <h2 style={{ margin: 0 }}>Featured on Homepage</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-gray-text)' }}>
                    {featuredCount >= 6 && !form.featured_homepage
                      ? `Already 6 products featured - uncheck another first`
                      : `Show this product on the main homepage (${featuredCount}/6 featured)`}
                  </p>
                </div>
              </label>
            </div>

            <div className="card">
              <h2>Media</h2>
              <ImageUpload value={form.photo_url} onChange={handleImageChange} flip={form.photo_flip} />

              {/* Photo Flip Control */}
              {form.photo_url && (
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label">Flip Image</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, photo_flip: 'none' }))}
                      style={{
                        padding: '8px 16px',
                        border: form.photo_flip === 'none' ? '2px solid var(--color-primary)' : '1px solid var(--color-gray)',
                        background: form.photo_flip === 'none' ? 'var(--color-primary)' : 'white',
                        color: form.photo_flip === 'none' ? 'white' : 'var(--color-dark)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      None
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, photo_flip: 'horizontal' }))}
                      style={{
                        padding: '8px 16px',
                        border: form.photo_flip === 'horizontal' ? '2px solid var(--color-primary)' : '1px solid var(--color-gray)',
                        background: form.photo_flip === 'horizontal' ? 'var(--color-primary)' : 'white',
                        color: form.photo_flip === 'horizontal' ? 'white' : 'var(--color-dark)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      ↔ Horizontal
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, photo_flip: 'vertical' }))}
                      style={{
                        padding: '8px 16px',
                        border: form.photo_flip === 'vertical' ? '2px solid var(--color-primary)' : '1px solid var(--color-gray)',
                        background: form.photo_flip === 'vertical' ? 'var(--color-primary)' : 'white',
                        color: form.photo_flip === 'vertical' ? 'white' : 'var(--color-dark)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      ↕ Vertical
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <h2>Specs</h2>
              <div className="form-group">
                <label className="form-label">Harvest Window (Days)</label>
                <input type="text" name="harvest_window_days" className="form-input" value={form.harvest_window_days} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input type="number" name="sort_order" className="form-input" value={form.sort_order} onChange={handleChange} />
              </div>
            </div>

            <div className="card">
              <h2>Tags</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-gray-text)', marginBottom: '12px' }}>
                Add tags for filtering on the website (e.g., Brassica, Asian, Spicy)
              </p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  className="form-input"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-secondary" onClick={addTag}>
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      background: '#2563eb',
                      color: '#ffffff',
                      borderRadius: '16px',
                      fontSize: '13px'
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '16px',
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {form.tags.length === 0 && (
                  <span style={{ fontSize: '13px', color: 'var(--color-gray-text)', fontStyle: 'italic' }}>
                    No tags added
                  </span>
                )}
              </div>

              {/* Existing tags suggestions */}
              {allTags.filter(tag => !form.tags.includes(tag)).length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-light)' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginBottom: '8px' }}>
                    Existing tags (click to add):
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {allTags.filter(tag => !form.tags.includes(tag)).map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }))}
                        style={{
                          padding: '4px 10px',
                          background: '#f3f4f6',
                          color: '#1f2937',
                          border: '1px solid #d1d5db',
                          borderRadius: '16px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#2563eb'
                          e.target.style.color = '#ffffff'
                          e.target.style.borderColor = '#2563eb'
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#f3f4f6'
                          e.target.style.color = '#1f2937'
                          e.target.style.borderColor = '#d1d5db'
                        }}
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
