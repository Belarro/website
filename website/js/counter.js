/**
 * BELARRO — Dynamic product counter from Supabase
 */

const SUPABASE_URL = 'https://gcgscmtjesyiziebutzw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3NjbXRqZXN5aXppZWJ1dHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDQwMjgsImV4cCI6MjA4NTYyMDAyOH0.Ikf7mpFUKPJx9wA827xHTxSV2u5JpWCPw7j6wiKbgN0'

async function updateProductCount() {
    try {
        // Exclude hidden products from count
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&availability_status=neq.hidden`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        })

        if (!response.ok) return

        const products = await response.json()
        const count = products.length

        // Update stat counters
        document.querySelectorAll('[data-count="varieties"]').forEach(el => {
            el.textContent = count + '+'
        })

        // Update text mentions
        document.querySelectorAll('[data-count-text="varieties"]').forEach(el => {
            const isGerman = document.documentElement.lang === 'de'
            if (isGerman) {
                el.textContent = `Drei Kategorien. ${count}+ Sorten.`
            } else {
                el.textContent = `Three categories. ${count}+ varieties.`
            }
        })

    } catch (error) {
        console.error('Error fetching product count:', error)
    }
}

document.addEventListener('DOMContentLoaded', updateProductCount)
