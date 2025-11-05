/* Enhanced site behavior and visuals
   - Canvas particles (performant)
   - Slide-in mobile nav (ARIA friendly)
   - Header/back-to-top with rAF throttle
   - Skill progress animation, portfolio filter, testimonials carousel
   - Contact form client-side validation
*/

(function () {
    'use strict';

    // Elements
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const themeToggle = document.getElementById('themeToggle');
    const navLinks = document.getElementById('nav-links');
    const backToTop = document.getElementById('backToTop');
    const particlesContainer = document.getElementById('particles');
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const navDots = document.querySelectorAll('.nav-dot');
    const contactForm = document.getElementById('contactForm');
    const hero = document.querySelector('.showcase');
    const heroContent = document.querySelector('.showcase-content');

    // Small utilities
    const q = (s, el = document) => el.querySelector(s);
    const qa = (s, el = document) => Array.from(el.querySelectorAll(s));

    // Throttle with requestAnimationFrame for scroll
    let latestKnownScrollY = 0;
    let ticking = false;

    function onScroll() {
        latestKnownScrollY = window.scrollY;
        requestTick();
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
        }
        ticking = true;
    }

    function updateOnScroll() {
        const y = latestKnownScrollY;
        if (y > 80) header.classList.add('scrolled'); else header.classList.remove('scrolled');
        if (y > 600) backToTop.classList.add('active'); else backToTop.classList.remove('active');
        ticking = false;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Smooth scroll for anchors
    qa('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = header.offsetHeight;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 8;
                window.scrollTo({ top, behavior: 'smooth' });
                // close mobile nav if open
                navLinks.classList.remove('open');
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // Back to top
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Improved mobile nav toggle
    function toggleNav(open) {
        const willOpen = (typeof open === 'boolean') ? open : !navLinks.classList.contains('open');
        navLinks.classList.toggle('open', willOpen);
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', String(willOpen));
            menuToggle.innerHTML = willOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => toggleNav());
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNav(); }
        });
    }

    // Theme handling: initialize from localStorage or prefers-color-scheme
    (function themeInit() {
        if (!themeToggle) return;
        const key = 'site-theme';
        function applyTheme(isLight) {
            if (isLight) {
                document.documentElement.classList.add('light-theme');
                themeToggle.setAttribute('aria-pressed', 'true');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                document.documentElement.classList.remove('light-theme');
                themeToggle.setAttribute('aria-pressed', 'false');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }

        // Determine initial theme
        const stored = localStorage.getItem(key);
        if (stored === 'light' || stored === 'dark') {
            applyTheme(stored === 'light');
        } else {
            const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
            applyTheme(prefersLight);
        }

        // Toggle handler
        themeToggle.addEventListener('click', () => {
            const isNowLight = !document.documentElement.classList.contains('light-theme');
            applyTheme(isNowLight);
            localStorage.setItem(key, isNowLight ? 'light' : 'dark');
        });
    })();

    // Close nav when clicking outside (on mobile)
    document.addEventListener('click', (e) => {
        const isClickInside = navLinks.contains(e.target) || (menuToggle && menuToggle.contains(e.target));
        if (!isClickInside && navLinks.classList.contains('open')) toggleNav(false);
    });

    // Hero subtle parallax on mouse move
    (function initHeroParallax() {
        if (!hero || !heroContent) return;
        const strength = 12; // px
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroContent.style.transform = `translate3d(${ -x * strength }px, ${ -y * (strength/2) }px, 0)`;
        });
        hero.addEventListener('mouseleave', () => heroContent.style.transform = 'translate3d(0,0,0)');
    })();

    // Canvas particles (performant)
    (function createCanvasParticles() {
        if (!particlesContainer) return;
        const canvas = document.createElement('canvas');
        particlesContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        let width = 0, height = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
        const colors = ['#8A2BE2', '#FF4D6D', '#00F5D4'];

        function resize() {
            width = particlesContainer.clientWidth;
            height = particlesContainer.clientHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        const particles = [];
        const max = Math.min(80, Math.round((width * height) / 15000) || 45);

        function initParticles() {
            particles.length = 0;
            const count = Math.max(30, Math.min(80, Math.round((window.innerWidth / 10))));
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 2.8 + 0.6,
                    c: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.6 + 0.12
                });
            }
        }

        function step() {
            ctx.clearRect(0, 0, width, height);
            for (let p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                ctx.beginPath();
                ctx.fillStyle = p.c;
                ctx.globalAlpha = p.alpha;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(step);
        }

        function onResize() { resize(); initParticles(); }
        window.addEventListener('resize', onResize);
        resize();
        initParticles();
        requestAnimationFrame(step);
    })();

    // Animate skill bars when in view
    (function animateSkillBars() {
        if (!skillProgressBars.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const target = Number(bar.dataset.width || 0);
                    bar.style.width = '0%';
                    setTimeout(() => { bar.style.width = target + '%'; }, 120);
                    io.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });

        skillProgressBars.forEach(b => io.observe(b));
    })();

    // Portfolio filters
    (function portfolioFilters() {
        if (!filterButtons.length) return;
        filterButtons.forEach(btn => btn.addEventListener('click', () => {
            filterButtons.forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            portfolioItems.forEach(item => {
                const cat = item.dataset.category;
                item.style.opacity = '0';
                item.style.pointerEvents = 'none';
                setTimeout(() => {
                    if (f === 'all' || f === cat) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                    setTimeout(() => { item.style.opacity = ''; item.style.pointerEvents = ''; }, 30);
                }, 150);
            });
        }));
    })();

    // Testimonials carousel
    (function testimonialsCarousel() {
        if (!testimonialSlides.length) return;
        let index = 0, intervalId = null;
        function show(i) {
            testimonialSlides.forEach(s => s.classList.remove('active'));
            navDots.forEach(d => d.classList.remove('active'));
            const idx = (i + testimonialSlides.length) % testimonialSlides.length;
            testimonialSlides[idx].classList.add('active');
            if (navDots[idx]) navDots[idx].classList.add('active');
            index = idx;
        }
        function next() { show(index + 1); }
        function start() { intervalId = setInterval(next, 5200); }
        function stop() { clearInterval(intervalId); intervalId = null; }

        navDots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); stop(); start(); }));
        testimonialSlides.forEach(s => s.addEventListener('mouseenter', stop));
        testimonialSlides.forEach(s => s.addEventListener('mouseleave', start));

        show(0); start();
    })();

    // Contact form validation and faux submit
    (function contactHandler() {
        if (!contactForm) return;
        const messageBox = document.createElement('div');
        messageBox.className = 'contact-message';
        messageBox.style.cssText = 'margin-bottom:12px;color:var(--light);';
        contactForm.prepend(messageBox);

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = contactForm;
            const name = form.querySelector('input[type="text"]')?.value.trim();
            const email = form.querySelector('input[type="email"]')?.value.trim();
            const message = form.querySelector('textarea')?.value.trim();

            function show(msg, ok = true) {
                messageBox.textContent = msg;
                messageBox.style.color = ok ? 'var(--accent)' : '#ff6b6b';
            }

            if (!name || !email || !message) { show('Please complete all required fields.', false); return; }
            if (!/^\S+@\S+\.\S+$/.test(email)) { show('Please enter a valid email address.', false); return; }

            // Show success UI and clear form (simulate asynchronous call)
            show('Sending message...');
            setTimeout(() => {
                show(`Thanks ${name}! Message received. I will reply shortly.`);
                form.reset();
            }, 900);
        });
    })();

    // Simple fade-in for sections when in view
    (function sectionFadeIn() {
        const elems = qa('section');
        const io = new IntersectionObserver((ens) => {
            ens.forEach(en => {
                if (en.isIntersecting) {
                    en.target.style.opacity = '1';
                    en.target.style.transform = 'translateY(0)';
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.12 });

        elems.forEach(e => {
            e.style.opacity = '0';
            e.style.transform = 'translateY(18px)';
            e.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            io.observe(e);
        });
    })();

    // Small startup fade
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity .45s ease';
        setTimeout(() => document.body.style.opacity = '1', 80);
    });

})();