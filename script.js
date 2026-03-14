/* ── Custom cursor ── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .proj-card, .exp-item, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '14px'; cursor.style.height = '14px';
        ring.style.width = '48px'; ring.style.height = '48px';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '8px'; cursor.style.height = '8px';
        ring.style.width = '32px'; ring.style.height = '32px';
    });
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting)
            setTimeout(() => entry.target.classList.add('visible'), 80);
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Stagger grid children
document.querySelectorAll(
    '.proj-grid .reveal, .exp-grid .reveal, .skills-grid .reveal, .ongoing-grid .reveal'
).forEach((el, i) => {
    el.style.transitionDelay = (i * 80) + 'ms';
});

/* ── Progress bars ── */
const progressObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting)
            entry.target.querySelectorAll('.progress-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
    });
}, { threshold: 0.3 });

document.querySelectorAll('.ongoing-card').forEach(c => progressObserver.observe(c));

/* ── Active nav on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

/* ── Contact form → mailto ── */
function sendMail() {
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();
    const status = document.getElementById('form-status');

    if (!name || !email || !message) {
        status.style.color = 'var(--accent3)';
        status.textContent = '▸ Please fill in name, email, and message.';
        return;
    }

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href =
        `mailto:methwani.vishvek09@gmail.com` +
        `?subject=${encodeURIComponent(subject || 'Portfolio Enquiry')}` +
        `&body=${encodeURIComponent(body)}`;

    status.style.color = 'var(--accent)';
    status.textContent = '▸ Opening your mail client...';
    setTimeout(() => { status.textContent = ''; }, 4000);
}

// Allow Enter key in single-line fields to submit
document.querySelectorAll('#cf-name, #cf-email, #cf-subject').forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') sendMail(); });
});
