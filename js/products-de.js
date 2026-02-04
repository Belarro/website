/**
 * BELARRO — Dynamic Products from Supabase (German)
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

// Generate HTML for a single product card (uses German fields if available, falls back to English)
function createProductCard(product) {
    const statusBadge = product.availability_status === 'seasonal'
        ? '<span class="badge badge-seasonal">Saisonal</span>'
        : ''

    // Use German translations if available, otherwise fall back to English
    const name = product.name_de || product.name
    const serviceFit = product.service_fit_de || product.service_fit || 'Vielseitig'
    const flavorProfile = product.flavor_profile_de || product.flavor_profile || ''
    const description = product.description_chef_de || product.description_chef || ''

    const tags = product.tags && Array.isArray(product.tags) ? product.tags.join(',') : ''

    // Photo flip transform
    const flipStyle = product.photo_flip === 'horizontal' ? 'transform: scaleX(-1);'
        : product.photo_flip === 'vertical' ? 'transform: scaleY(-1);'
        : ''

    return `
        <div class="variety-card" data-category="${product.category}" data-tags="${tags}">
            <div class="variety-image-wrapper">
                <img src="${product.photo || 'https://images.unsplash.com/photo-1599307409240-cf178b30d885?auto=format&fit=crop&q=80&w=600'}"
                     alt="${name}" class="variety-image" loading="lazy" style="${flipStyle}">
                <div class="variety-overlay">Passt zu: ${serviceFit}</div>
            </div>
            <div class="variety-content">
                <div class="variety-header">
                    <span class="variety-name">${name}</span>
                    ${statusBadge ? `<div class="variety-badges">${statusBadge}</div>` : ''}
                </div>
                <div class="variety-flavor">${flavorProfile}</div>
                <div class="variety-description">${description}</div>
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
    container.innerHTML = '<div style="text-align: center; padding: 48px;"><p>Sorten werden geladen...</p></div>'

    const products = await fetchProducts()

    if (!products || products.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 48px;"><p>Derzeit keine Produkte verfügbar.</p></div>'
        return
    }

    // Collect tags and add tag filters to the filter bar
    const tags = collectTags(products)
    const filterBar = document.querySelector('.filter-bar')
    if (filterBar) {
        const existingTagFilters = filterBar.querySelector('.tag-filters')
        if (existingTagFilters) existingTagFilters.remove()
        filterBar.insertAdjacentHTML('afterend', createTagFilters(tags))
    }

    // Group products by category
    const shoots = products.filter(p => p.category === 'shoot')
    const microgreens = products.filter(p => p.category === 'microgreen' || p.category === 'mix')
    const herbs = products.filter(p => p.category === 'petite_herb')

    let html = ''

    // Shoots
    if (shoots.length > 0) {
        html += createCategoryHeader('01', 'Sprossen', 'Substanzielle Textur, süßer Geschmack. Perfekt für Salate und Garnituren.', 'shoot')
        html += shoots.map(createProductCard).join('')
    }

    // Microgreens
    if (microgreens.length > 0) {
        html += createCategoryHeader('02', 'Microgreens', 'Konzentrierter Geschmack in kleiner Form. Intensiver Geschmack, feine Präsentation.', 'microgreen')
        html += microgreens.map(createProductCard).join('')
    }

    // Petite Herbs
    if (herbs.length > 0) {
        html += createCategoryHeader('03', 'Feinkräuter', 'Voller Kräutergeschmack, feine Präsentation. Länger gezüchtet für entwickelten Geschmack.', 'petite_herb')
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
