
// Enhanced UI/Accessibility JS
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navItems = document.querySelectorAll('.nav-item');

    // Helper: safe toggle for sidebar
    function toggleSidebar(open) {
        if (!sidebar) return;
        if (typeof open === 'boolean') {
            sidebar.classList.toggle('active', open);
        } else {
            sidebar.classList.toggle('active');
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isOpen = sidebar && sidebar.classList.contains('active');
            toggleSidebar(!isOpen);
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
        });

        // Allow closing with Escape key for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
                toggleSidebar(false);
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }

    // Handle clicking nav items: set active and close on mobile
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            if (window.innerWidth <= 768) {
                toggleSidebar(false);
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Update active navigation based on scroll position
    const sections = document.querySelectorAll('.section');
    function updateActiveOnScroll() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.querySelector('a') && item.querySelector('a').getAttribute('href');
            if (href === `#${current}`) {
                item.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
    updateActiveOnScroll();

    // Smooth scrolling for in-page links (enhanced for older browsers)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').slice(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // update URL hash without jumping
                history.pushState(null, '', `#${targetId}`);
                // move focus for accessibility
                targetEl.setAttribute('tabindex', '-1');
                targetEl.focus({ preventScroll: true });
            }
        });
    });
});
