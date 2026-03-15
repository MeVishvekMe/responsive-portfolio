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
    // If user is at (or near) the very bottom of the page, force "contact" active
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 150;
    if (atBottom) {
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#contact');
        });
        return;
    }

    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

/* ── Contact form → EmailJS ── */
async function sendMail() {
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

    status.style.color = 'var(--text-dim)';
    status.textContent = '▸ Sending...';

    try {
        await emailjs.send(
            'service_o68rmtm',   // ← replace with your Service ID
            'template_itjyqck',  // ← replace with your Template ID
            {
                from_name: name,
                from_email: email,
                subject: subject || 'Portfolio Enquiry',
                message: message,
                to_email: 'methwani.vishvek09@gmail.com'
            }
        );

        status.style.color = 'var(--accent)';
        status.textContent = '▸ Message sent successfully!';
        document.getElementById('cf-name').value = '';
        document.getElementById('cf-email').value = '';
        document.getElementById('cf-subject').value = '';
        document.getElementById('cf-message').value = '';
    } catch (err) {
        status.style.color = 'var(--accent3)';
        status.textContent = '▸ Failed to send. Please try again.';
        console.error('EmailJS error:', err);
    }

    setTimeout(() => { status.textContent = ''; }, 5000);
}

// Allow Enter key in single-line fields to submit
document.querySelectorAll('#cf-name, #cf-email, #cf-subject').forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') sendMail(); });
});