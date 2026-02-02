/**
 * BELARRO — Premium JavaScript
 * World-class interactions and animations
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

            // Prevent body scroll when menu is open
            document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile nav when clicking a link
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
                const headerHeight = document.querySelector('.header').offsetHeight;
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
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
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
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add reveal class to sections for animation
    document.querySelectorAll('.section, .problem-item, .category-item, .trust-item, .step-v').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // ========================================
    // Stats Counter Animation
    // ========================================
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    if (stats.length > 0) {
        const statsBar = document.querySelector('.stats-bar');
        if (statsBar) {
            statsObserver.observe(statsBar);
        }
    }

    function animateStats() {
        stats.forEach(stat => {
            const text = stat.textContent;
            const number = parseInt(text);

            if (!isNaN(number)) {
                const suffix = text.replace(number, '');
                let current = 0;
                const increment = number / 40;
                const duration = 1500;
                const stepTime = duration / 40;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        current = number;
                        clearInterval(counter);
                    }
                    stat.textContent = Math.round(current) + suffix;
                }, stepTime);
            }
        });
    }

    // ========================================
    // Button Ripple Effect
    // ========================================
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // Magnetic Button Effect
    // ========================================
    document.querySelectorAll('.btn-primary, .btn-large').forEach(button => {
        button.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-2px)`;
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ========================================
    // Parallax Effect for Hero
    // ========================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const heroHeight = hero.offsetHeight;

                    if (scrolled < heroHeight) {
                        const parallaxElements = hero.querySelectorAll('h1, .hero-subtitle, .hero-supporting');
                        parallaxElements.forEach((el, index) => {
                            const speed = 0.1 + (index * 0.05);
                            el.style.transform = `translateY(${scrolled * speed}px)`;
                        });
                    }
                });
            }
        });
    }

    // ========================================
    // Staggered Animation for Grid Items
    // ========================================
    const grids = document.querySelectorAll('.problem-grid, .categories-grid, .trust-grid');

    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 100}ms`;
        });
    });

    // ========================================
    // Form Enhancements
    // ========================================
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        // Floating label effect
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
    // Cursor Trail Effect (subtle)
    // ========================================
    let cursorTrail = [];
    const trailLength = 8;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${4 - (i * 0.4)}px;
            height: ${4 - (i * 0.4)}px;
            background: rgba(0, 0, 0, ${0.3 - (i * 0.03)});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s;
            opacity: 0;
        `;
        document.body.appendChild(dot);
        cursorTrail.push(dot);
    }

    let mouseX = 0, mouseY = 0;
    let trailPositions = [];

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorTrail.forEach(dot => {
            dot.style.opacity = '1';
        });
    });

    document.addEventListener('mouseleave', () => {
        cursorTrail.forEach(dot => {
            dot.style.opacity = '0';
        });
    });

    function animateCursor() {
        trailPositions.unshift({ x: mouseX, y: mouseY });
        trailPositions = trailPositions.slice(0, trailLength);

        cursorTrail.forEach((dot, index) => {
            const pos = trailPositions[index] || trailPositions[trailPositions.length - 1];
            if (pos) {
                dot.style.left = `${pos.x}px`;
                dot.style.top = `${pos.y}px`;
            }
        });

        requestAnimationFrame(animateCursor);
    }

    // Only enable cursor trail on desktop
    if (window.innerWidth > 768) {
        animateCursor();
    }

    // ========================================
    // Performance: Reduce animations on low-power devices
    // ========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('visible');
        });

        // Remove cursor trail
        cursorTrail.forEach(dot => dot.remove());
    }
    // ========================================
    // Language Preference
    // ========================================
    document.querySelectorAll('.lang-switch').forEach(link => {
        link.addEventListener('click', function () {
            // If the link goes to /de/, user wants German. Otherwise English.
            const isGerman = this.getAttribute('href').includes('/de');
            localStorage.setItem('belarro_lang', isGerman ? 'de' : 'en');
        });
    });
});
