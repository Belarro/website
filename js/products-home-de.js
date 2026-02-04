/**
 * BELARRO — Dynamic Homepage Products from Supabase (German)
 * Loads featured products for the German homepage showcase
 */

(function() {
const SUPABASE_URL = 'https://gcgscmtjesyiziebutzw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3NjbXRqZXN5aXppZWJ1dHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDQwMjgsImV4cCI6MjA4NTYyMDAyOH0.Ikf7mpFUKPJx9wA827xHTxSV2u5JpWCPw7j6wiKbgN0'

// Fetch featured products from Supabase
async function fetchFeaturedProducts() {
    try {
        // Try to fetch products marked as featured_homepage first
        let featured = []
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&featured_homepage=eq.true&availability_status=neq.hidden&order=sort_order.asc&limit=6`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Cache-Control': 'no-cache'
                },
                cache: 'no-store'
            })
            if (response.ok) {
                featured = await response.json()
            }
        } catch (e) {
            console.log('Featured query failed, using fallback')
        }

        // If no featured products or query failed, fall back to first 6 available products
        if (!featured || featured.length === 0) {
            const fallbackResponse = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&availability_status=neq.hidden&order=sort_order.asc&limit=6`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Cache-Control': 'no-cache'
                },
                cache: 'no-store'
            })
            if (!fallbackResponse.ok) throw new Error('Failed to fetch products')
            return await fallbackResponse.json()
        }

        return featured
    } catch (error) {
        console.error('Error fetching featured products:', error)
        return null
    }
}

// Generate HTML for a single product card (German)
function createProductCard(product) {
    // Use German translations if available
    const name = product.name_de || product.name
    const serviceFit = product.service_fit_de || product.service_fit || 'Vielseitig'
    const flavorProfile = product.flavor_profile_de || product.flavor_profile || ''
    const description = product.description_chef_de || product.description_chef || ''

    // Photo flip transform
    const flipStyle = product.photo_flip === 'horizontal' ? 'transform: scaleX(-1);'
        : product.photo_flip === 'vertical' ? 'transform: scaleY(-1);'
        : ''

    return `
        <div class="variety-card">
            <div class="variety-image-wrapper">
                <img src="${product.photo || 'https://images.unsplash.com/photo-1599307409240-cf178b30d885?auto=format&fit=crop&q=80&w=600'}"
                     alt="${name}" class="variety-image" loading="lazy" style="${flipStyle}">
                <div class="variety-overlay">Passt zu: ${serviceFit}</div>
            </div>
            <div class="variety-content">
                <div class="variety-header">
                    <span class="variety-name">${name}</span>
                </div>
                <div class="variety-flavor">${flavorProfile}</div>
                <div class="variety-description">${description}</div>
            </div>
        </div>
    `
}

// Render featured products on homepage
async function renderHomepageProducts() {
    console.log('renderHomepageProducts called')
    const container = document.querySelector('.homepage-varieties-showcase')
    console.log('Container found:', container)
    if (!container) return

    // Show loading state
    container.innerHTML = '<div style="text-align: center; padding: 48px; grid-column: 1/-1;"><p>Laden...</p></div>'

    const products = await fetchFeaturedProducts()
    console.log('Products fetched:', products)

    if (!products || products.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 48px; grid-column: 1/-1;"><p>Keine Produkte verfügbar.</p></div>'
        return
    }

    const html = products.map(createProductCard).join('')
    console.log('HTML generated, length:', html.length)
    container.innerHTML = html
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', renderHomepageProducts)
})();
