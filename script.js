// ==========================================================================
// Theme (dark mode) toggle
// NOTE: The <head> of each page contains a small inline script that sets
// data-theme before paint to prevent a flash of the wrong theme on nav.
// ==========================================================================

(function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
        toggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
        toggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });

    // Sync initial aria state with whatever the FOUC-prevention script decided
    const initial = document.documentElement.getAttribute('data-theme') || 'light';
    toggle.setAttribute('aria-pressed', initial === 'dark' ? 'true' : 'false');
    toggle.setAttribute('aria-label', initial === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
})();

// ==========================================================================
// Mobile navigation menu
// ==========================================================================

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const btn = document.querySelector('.mobile-menu-btn');
    if (!navLinks) return;

    const isOpen = navLinks.classList.toggle('active');
    if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

document.addEventListener('click', (event) => {
    const nav = document.querySelector('nav');
    const navLinks = document.getElementById('navLinks');
    const btn = document.querySelector('.mobile-menu-btn');
    if (!nav || !navLinks) return;

    if (!nav.contains(event.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
});

// ==========================================================================
// Skill bars — animate from 0 to target width on scroll into view.
// Target width is stored in data-width="85" (number, interpreted as percent).
// ==========================================================================

function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress[data-width]');
    if (!bars.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        bars.forEach((bar) => {
            bar.style.width = bar.getAttribute('data-width') + '%';
        });
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target.getAttribute('data-width');
                // requestAnimationFrame lets the browser commit width: 0 first, so the
                // CSS transition runs. Without this, setting width in the same frame
                // the element is painted can skip the animation.
                requestAnimationFrame(() => {
                    entry.target.style.width = target + '%';
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach((bar) => observer.observe(bar));
}

// ==========================================================================
// Fade-in on scroll — any element with .fade-in class gets .is-visible when
// it scrolls into view. Skipped entirely under prefers-reduced-motion.
// ==========================================================================

function initFadeInObserver() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el) => observer.observe(el));
}

// ==========================================================================
// Smooth scroll for in-page anchor links
// ==========================================================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ==========================================================================
// Projects page — renders cards from PROJECTS array defined in projects-data.js
// (Only runs if the grid element is present on the page.)
// ==========================================================================

function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid || typeof PROJECTS === 'undefined') return;

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    grid.innerHTML = PROJECTS.map((p) => `
        <article class="project-card fade-in">
            ${p.status === 'draft' ? '<div class="project-ribbon">In Progress</div>' : ''}
            <span class="project-type">${esc(p.type || 'Project')}</span>
            <h3>${esc(p.title)}</h3>
            <p class="project-hook">${esc(p.hook)}</p>
            <div class="project-tools">
                ${(p.tools || []).map((t) => `<span>${esc(t)}</span>`).join('')}
            </div>
            ${p.details ? `
                <details class="project-details">
                    <summary>View details</summary>
                    <div class="project-details-content">${p.details}</div>
                </details>
            ` : ''}
        </article>
    `).join('');
}

// ==========================================================================
// Init
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    initSkillBars();
    initFadeInObserver();
    initSmoothScroll();
});
