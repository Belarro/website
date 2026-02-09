/**
 * BELARRO — Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // Mobile Navigation
    // ========================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMobile = document.querySelector('.nav-mobile');

    if (navToggle && navMobile) {
        navToggle.addEventListener('click', function () {
            navMobile.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
        });

        navMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                navMobile.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Header Scroll Effect
    // ========================================
    const header = document.querySelector('header');
    const hasHero = document.querySelector('.hero');
    let ticking = false;

    // Pages without a full-image hero always get solid header
    if (!hasHero && header) {
        header.classList.add('scrolled');
    }

    function updateHeader() {
        if (!hasHero) { ticking = false; return; }

        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // ========================================
    // Scroll Reveal Animation
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        revealObserver.observe(el);
    });

    // ========================================
    // Form Enhancements
    // ========================================
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // ========================================
    // Reduced Motion Support
    // ========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }

    // ========================================
    // Hero Stats Count-Up Animation
    // ========================================
    const countEls = document.querySelectorAll('[data-count-to]');
    if (countEls.length) {
        let counted = false;

        function animateCount(el, delay) {
            const target = parseInt(el.getAttribute('data-count-to'), 10);
            const suffix = el.getAttribute('data-count-suffix') || '';
            el.textContent = '0' + suffix;
            if (target === 0) return;
            setTimeout(function () {
                const duration = 1400;
                const start = performance.now();
                function step(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target) + suffix;
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            }, delay);
        }

        function startCounting() {
            if (counted) return;
            counted = true;
            if (prefersReducedMotion.matches) {
                countEls.forEach(el => {
                    el.textContent = el.getAttribute('data-count-to') + (el.getAttribute('data-count-suffix') || '');
                });
            } else {
                countEls.forEach((el, i) => animateCount(el, 100 + i * 120));
            }
        }

        const heroContent = document.querySelector('.hero-content');
        if (heroContent && heroContent.classList.contains('fade-in')) {
            if (heroContent.classList.contains('visible')) {
                setTimeout(startCounting, 400);
            } else {
                const mo = new MutationObserver(function () {
                    if (heroContent.classList.contains('visible')) {
                        mo.disconnect();
                        setTimeout(startCounting, 400);
                    }
                });
                mo.observe(heroContent, { attributes: true, attributeFilter: ['class'] });
                setTimeout(function () { mo.disconnect(); startCounting(); }, 4000);
            }
        } else {
            startCounting();
        }
    }

    // ========================================
    // Language Preference
    // ========================================
    document.querySelectorAll('.lang-switch').forEach(link => {
        link.addEventListener('click', function () {
            const isGerman = this.getAttribute('href').includes('/de');
            localStorage.setItem('belarro_lang', isGerman ? 'de' : 'en');
        });
    });
});
