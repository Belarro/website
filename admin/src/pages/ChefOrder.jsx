import { useState, useEffect } from 'react'
import { mockProducts } from '../data/mockData'

export default function ChefOrder() {
    const [order, setOrder] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState('shoot') // shoot, microgreen, petite_herb

    // Initialize with some products "pre-selected" to simulate a standing order
    useEffect(() => {
        // Simulate fetching the chef's standing order
        const initialOrder = mockProducts.slice(0, 5).map(p => ({
            id: p.id,
            qty: 2
        }))
        setOrder(initialOrder)
    }, [])

    const getQty = (id) => {
        const item = order.find(i => i.id === id)
        return item ? item.qty : 0
    }

    const updateQty = (id, delta) => {
        setOrder(prev => {
            const existing = prev.find(i => i.id === id)
            if (existing) {
                const newQty = Math.max(0, existing.qty + delta)
                return newQty === 0
                    ? prev.filter(i => i.id !== id)
                    : prev.map(i => i.id === id ? { ...i, qty: newQty } : i)
            } else if (delta > 0) {
                return [...prev, { id, qty: delta }]
            }
            return prev
        })
    }

    const getTotalTrays = () => order.reduce((acc, curr) => acc + curr.qty, 0)

    const categories = [
        { id: 'shoot', label: 'Shoots' },
        { id: 'microgreen', label: 'Microgreens' },
        { id: 'petite_herb', label: 'Petite Herbs' }
    ]

    const filteredProducts = mockProducts.filter(p => p.category === activeTab || (activeTab === 'microgreen' && p.category === 'mix'))

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            alert('Standing order updated for next Tuesday!');
        }, 800)
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
            <div className="page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <span className="badge badge-tag" style={{ marginBottom: '8px', display: 'inline-block' }}>Next Delivery: Tue, Oct 24</span>
                        <h1>My Weekly Order</h1>
                        <p style={{ color: 'var(--color-gray-text)' }}>Adjust your standing order for next week.</p>
                    </div>
                    <div style={{ textAlign: 'center', background: 'var(--color-gray-50)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700' }}>{getTotalTrays()}</div>
                        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-text)' }}>Trays</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '16px' }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '100px',
                            border: 'none',
                            background: activeTab === cat.id ? 'black' : 'transparent',
                            color: activeTab === cat.id ? 'white' : 'var(--color-gray-text)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
                {filteredProducts.map(product => {
                    const qty = getQty(product.id);
                    return (
                        <div key={product.id} className="card" style={{ display: 'flex', alignItems: 'center', padding: '12px', gap: '16px' }}>
                            <img
                                src={product.photo}
                                alt={product.name}
                                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px', background: '#f5f5f5' }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600' }}>{product.name}</div>
                                <div style={{ fontSize: '13px', color: 'var(--color-gray-text)' }}>{product.facts?.harvest_window_days} days • {product.availability_status}</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => updateQty(product.id, -1)}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--color-gray-border)',
                                        background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    -
                                </button>
                                <span style={{ width: '24px', textAlign: 'center', fontWeight: '600' }}>{qty}</span>
                                <button
                                    type="button"
                                    onClick={() => updateQty(product.id, 1)}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--color-gray-border)',
                                        background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Floating Action Bar */}
            <div style={{
                position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                width: '90%', maxWidth: '600px', background: 'white', padding: '12px 24px',
                borderRadius: '100px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100
            }}>
                <div>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Total: {getTotalTrays()} Trays</span>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{ borderRadius: '100px', padding: '10px 24px' }}
                >
                    {submitting ? 'Updating...' : 'Update Order'}
                </button>
            </div>

        </div>
    )
}
