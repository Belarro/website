/**
 * BELARRO — Dynamic Products from Supabase
 */

const SUPABASE_URL = 'https://gcgscmtjesyiziebutzw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3NjbXRqZXN5aXppZWJ1dHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDQwMjgsImV4cCI6MjA4NTYyMDAyOH0.Ikf7mpFUKPJx9wA827xHTxSV2u5JpWCPw7j6wiKbgN0'

// Fetch products from Supabase (excludes hidden products)
async function fetchProducts() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&availability_status=neq.hidden&order=sort_order.asc`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        })

        if (!response.ok) throw new Error('Failed to fetch products')

        return await response.json()
    } catch (error) {
        console.error('Error fetching products:', error)
        return null
    }
}

// Generate HTML for a single product card
function createProductCard(product) {
    const statusBadge = product.availability_status === 'seasonal'
        ? '<span class="badge badge-seasonal">Seasonal</span>'
        : ''

    return `
        <div class="variety-card" data-category="${product.category}">
            <div class="variety-image-wrapper">
                <img src="${product.photo || 'https://images.unsplash.com/photo-1599307409240-cf178b30d885?auto=format&fit=crop&q=80&w=600'}"
                     alt="${product.name}" class="variety-image" loading="lazy">
                <div class="variety-overlay">Fit: ${product.service_fit || 'Versatile'}</div>
            </div>
            <div class="variety-content">
                <div class="variety-header">
                    <span class="variety-name">${product.name}</span>
                    ${statusBadge ? `<div class="variety-badges">${statusBadge}</div>` : ''}
                </div>
                <div class="variety-flavor">${product.flavor_profile || ''}</div>
                <div class="variety-description">${product.description_chef || ''}</div>
            </div>
        </div>
    `
}

// Generate category header
function createCategoryHeader(number, title, description, category) {
    return `
        <div class="variety-category-header-row" data-category-header="${category}" ${number !== '01' ? 'style="margin-top: 64px;"' : ''}>
            <span class="variety-category-number">${number}</span>
            <h2>${title}</h2>
            <p>${description}</p>
        </div>
    `
}

// Render all products
async function renderProducts() {
    const container = document.querySelector('.varieties-showcase')
    if (!container) return

    // Show loading state
    container.innerHTML = '<div style="text-align: center; padding: 48px;"><p>Loading varieties...</p></div>'

    const products = await fetchProducts()

    if (!products || products.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 48px;"><p>No products available at this time.</p></div>'
        return
    }

    // Group products by category
    const shoots = products.filter(p => p.category === 'shoot')
    const microgreens = products.filter(p => p.category === 'microgreen' || p.category === 'mix')
    const herbs = products.filter(p => p.category === 'petite_herb')

    let html = ''

    // Shoots
    if (shoots.length > 0) {
        html += createCategoryHeader('01', 'Shoots', 'Substantial texture, sweet flavor. Perfect for salads and garnishes.', 'shoot')
        html += shoots.map(createProductCard).join('')
    }

    // Microgreens
    if (microgreens.length > 0) {
        html += createCategoryHeader('02', 'Microgreens', 'Concentrated flavor in small form. Intense taste, delicate presentation.', 'microgreen')
        html += microgreens.map(createProductCard).join('')
    }

    // Petite Herbs
    if (herbs.length > 0) {
        html += createCategoryHeader('03', 'Petite Herbs', 'Full herb flavor, delicate presentation. Grown longer for developed taste.', 'petite_herb')
        html += herbs.map(createProductCard).join('')
    }

    container.innerHTML = html

    // Re-initialize filter functionality
    initFilters()
}

// Initialize filter buttons
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn')
    const cards = document.querySelectorAll('.variety-card')
    const headers = document.querySelectorAll('.variety-category-header-row')

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'))
            btn.classList.add('active')

            const filter = btn.getAttribute('data-filter')

            cards.forEach(card => {
                const category = card.getAttribute('data-category')
                if (filter === 'all' || category === filter || (filter === 'microgreen' && category === 'mix')) {
                    card.style.display = 'flex'
                } else {
                    card.style.display = 'none'
                }
            })

            headers.forEach(header => {
                const headerCat = header.getAttribute('data-category-header')
                if (filter === 'all' || headerCat === filter) {
                    header.style.display = 'flex'
                } else {
                    header.style.display = 'none'
                }
            })
        })
    })
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', renderProducts)
