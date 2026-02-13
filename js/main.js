/**
 * BELARRO — Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // Page Entry — fade in
    // ========================================
    requestAnimationFrame(() => {
        document.body.classList.add('page-ready');
    });

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
    // Page Transitions — fade out before navigating
    // ========================================
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || this.target === '_blank') return;
            e.preventDefault();
            document.body.classList.add('page-exit');
            setTimeout(() => { window.location.href = href; }, 150);
        });
    });

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
