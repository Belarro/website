/**
 * BELARRO — Dynamic product counter + count-up animation
 */

(function () {

    const SUPABASE_URL = 'https://gcgscmtjesyiziebutzw.supabase.co'
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ3NjbXRqZXN5aXppZWJ1dHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDQwMjgsImV4cCI6MjA4NTYyMDAyOH0.Ikf7mpFUKPJx9wA827xHTxSV2u5JpWCPw7j6wiKbgN0'

    // Count-up animation for a single element
    function animateCountUp(el, delay) {
        const target = parseInt(el.getAttribute('data-count-to'), 10)
        const suffix = el.getAttribute('data-count-suffix') || ''
        const duration = target === 0 ? 400 : 1400

        // Show 0 immediately
        el.textContent = '0' + suffix

        setTimeout(function () {
            if (target === 0) return

            const start = performance.now()

            function update(now) {
                const elapsed = now - start
                const progress = Math.min(elapsed / duration, 1)
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3)
                const current = Math.round(eased * target)
                el.textContent = current + suffix

                if (progress < 1) {
                    requestAnimationFrame(update)
                }
            }

            requestAnimationFrame(update)
        }, delay)
    }

    // Start all count-up animations
    function initCountUpAnimation() {
        const statElements = document.querySelectorAll('[data-count-to]')
        if (!statElements.length) return

        // Respect reduced motion — show final values, no animation
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            statElements.forEach(function (el) {
                var target = el.getAttribute('data-count-to')
                var suffix = el.getAttribute('data-count-suffix') || ''
                el.textContent = target + suffix
            })
            return
        }

        // Stagger each stat with a small delay
        statElements.forEach(function (el, i) {
            animateCountUp(el, 400 + i * 150)
        })
    }

    // Fetch live product count from Supabase
    async function updateProductCount() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            })

            if (!response.ok) return

            const products = await response.json()
            const count = products.length

            // Update stat counters with live count
            document.querySelectorAll('[data-count="varieties"]').forEach(el => {
                el.setAttribute('data-count-to', count)
                el.setAttribute('data-count-suffix', '+')
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

    // Run immediately — script is loaded at bottom of body, DOM is ready
    // Fetch live count, then animate. If fetch fails, animate with defaults.
    updateProductCount()
        .then(function () {
            initCountUpAnimation()
        })
        .catch(function () {
            initCountUpAnimation()
        })

})()
