// ===== Countdown Timer =====
function updateCountdown() {
    const target = new Date('2026-09-27T14:00:00+07:00');
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('countdown-timer').innerHTML =
            '<p style="text-align:center;color:var(--red-text);font-size:1.1rem;padding:20px;">🎓 Lễ tốt nghiệp đang diễn ra!</p>';
        return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById('days').textContent = String(d).padStart(2, '0');
    document.getElementById('hours').textContent = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ===== Photo Handling =====
const photo = document.getElementById('grad-photo');
const placeholder = document.getElementById('photo-placeholder');

photo.addEventListener('error', () => {
    photo.style.display = 'none';
    placeholder.style.display = 'flex';
});

// Handle case where image already failed before JS loaded
if (photo.complete && photo.naturalWidth === 0) {
    photo.style.display = 'none';
    placeholder.style.display = 'flex';
}

// ===== Navbar Active State =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

function updateActiveNav() {
    let current = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ===== Smooth scroll for nav links =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            const offset = 60;
            const y = targetEl.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
});

// ===== RSVP Form → Google Sheets =====
// ⬇️ PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE ⬇️
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwgHNXjtXkMBwKxPp3vq9D_bfSg-sV_rY_iHgEI4r-CVrJY1mFgatuYVaSSopkZkRR/exec';

document.getElementById('rsvp-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    const form = new FormData(this);
    const data = {
        name: form.get('name'),
        attendance: form.get('attendance'),
        message: form.get('message'),
        time: new Date().toLocaleString('vi-VN')
    };

    // Show loading state
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;

    try {
        // Send to Google Sheets
        if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        // Show success
        this.style.display = 'none';
        document.getElementById('rsvp-success').style.display = 'block';

        setTimeout(() => {
            this.reset();
            this.style.display = 'flex';
            document.getElementById('rsvp-success').style.display = 'none';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 4000);

    } catch (err) {
        console.error('RSVP error:', err);
        submitBtn.textContent = 'Lỗi! Thử lại';
        submitBtn.disabled = false;
        setTimeout(() => { submitBtn.textContent = originalText; }, 2000);
    }
});

// ===== Intersection Observer for fade-in =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.card, .rsvp-card, .hero-left, .hero-right').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
