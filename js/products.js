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

    const tags = product.tags && Array.isArray(product.tags) ? product.tags.join(',') : ''

    return `
        <div class="variety-card" data-category="${product.category}" data-tags="${tags}">
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

// Collect all unique tags from products
function collectTags(products) {
    const tags = new Set()
    products.forEach(p => {
        if (p.tags && Array.isArray(p.tags)) {
            p.tags.forEach(tag => tags.add(tag))
        }
    })
    return Array.from(tags).sort()
}

// Create tag filter buttons
function createTagFilters(tags) {
    if (tags.length === 0) return ''

    return `
        <div class="tag-filters" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px;">
            ${tags.map(tag => `
                <button class="tag-filter-btn" data-tag="${tag}" style="
                    padding: 6px 14px;
                    border: 1px solid var(--accent);
                    background: transparent;
                    color: var(--accent);
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.2s ease;
                ">${tag}</button>
            `).join('')}
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

    // Collect tags and add tag filters to the filter section
    const tags = collectTags(products)
    const filterSection = document.querySelector('.filter-section')
    if (filterSection) {
        const existingTagFilters = filterSection.querySelector('.tag-filters')
        if (existingTagFilters) existingTagFilters.remove()
        filterSection.insertAdjacentHTML('beforeend', createTagFilters(tags))
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
    const tagBtns = document.querySelectorAll('.tag-filter-btn')
    const cards = document.querySelectorAll('.variety-card')
    const headers = document.querySelectorAll('.variety-category-header-row')

    // Category filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'))
            btn.classList.add('active')

            // Clear tag filter selection
            tagBtns.forEach(t => {
                t.style.background = 'transparent'
                t.style.color = 'var(--accent)'
            })

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

    // Tag filters
    tagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isActive = btn.style.background !== 'transparent' && btn.style.background !== ''

            // Toggle tag button state
            tagBtns.forEach(t => {
                t.style.background = 'transparent'
                t.style.color = 'var(--accent)'
            })

            if (!isActive) {
                btn.style.background = 'var(--accent)'
                btn.style.color = 'white'
            }

            const selectedTag = isActive ? null : btn.getAttribute('data-tag')
            const currentCategoryFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all'

            cards.forEach(card => {
                const category = card.getAttribute('data-category')
                const cardTags = card.getAttribute('data-tags')?.split(',') || []

                const matchesCategory = currentCategoryFilter === 'all' ||
                    category === currentCategoryFilter ||
                    (currentCategoryFilter === 'microgreen' && category === 'mix')

                const matchesTag = !selectedTag || cardTags.includes(selectedTag)

                if (matchesCategory && matchesTag) {
                    card.style.display = 'flex'
                } else {
                    card.style.display = 'none'
                }
            })

            // Show/hide headers based on visible cards
            headers.forEach(header => {
                const headerCat = header.getAttribute('data-category-header')
                const visibleCards = document.querySelectorAll(`.variety-card[data-category="${headerCat}"]:not([style*="display: none"])`)
                const mixCards = headerCat === 'microgreen' ?
                    document.querySelectorAll('.variety-card[data-category="mix"]:not([style*="display: none"])') : []

                if (visibleCards.length > 0 || mixCards.length > 0) {
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
