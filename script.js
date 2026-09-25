// ===== Countdown Timer =====
function updateCountdown() {
    const targetDate = new Date('2026-09-27T14:00:00+07:00');
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '🎉';
        document.getElementById('hours').textContent = '';
        document.getElementById('minutes').textContent = '';
        document.getElementById('seconds').textContent = '';
        document.querySelectorAll('.countdown-separator').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.countdown-label').forEach(el => el.style.display = 'none');
        const timer = document.getElementById('countdown-timer');
        timer.innerHTML = '<div style="text-align:center;"><p style="font-size:2rem;">🎉</p><p style="font-family:var(--font-display);font-size:1.5rem;color:var(--color-gold-light);">Lễ tốt nghiệp đang diễn ra!</p></div>';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ===== Particle System =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.fadeDirection * 0.003;

        if (this.opacity <= 0.05 || this.opacity >= 0.6) {
            this.fadeDirection *= -1;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 83, ${this.opacity})`;
        ctx.fill();
    }
}

const particles = [];
const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===== Confetti Effect =====
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#d4a853', '#f0d68a', '#b8892e', '#c9956b', '#fff5e0', '#ff6b8a', '#4ecdc4'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 8 + 4) + 'px';
        confetti.style.height = (Math.random() * 8 + 4) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.animationDuration = (Math.random() * 4 + 3) + 's';
        confetti.style.animationDelay = (Math.random() * 8) + 's';

        confettiContainer.appendChild(confetti);
    }
}

createConfetti();

// ===== Scroll Animation (Intersection Observer) =====
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ===== RSVP Form =====
const STORAGE_KEY = 'graduation_rsvps';

function getRSVPs() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveRSVP(data) {
    const rsvps = getRSVPs();
    rsvps.unshift(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvps));
}

function renderWishes() {
    const wishesList = document.getElementById('wishes-list');
    const rsvps = getRSVPs();

    if (rsvps.length === 0) {
        wishesList.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);font-style:italic;">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc! 🌟</p>';
        return;
    }

    wishesList.innerHTML = rsvps.map(rsvp => {
        const statusMap = {
            'yes': '✅ Sẽ tham dự',
            'maybe': '🤔 Có thể tham dự',
            'no': '😢 Không thể tham dự'
        };

        const guestText = rsvp.guests > 0 ? ` (+${rsvp.guests} người)` : '';

        return `
            <div class="wish-card">
                <p class="wish-name">${escapeHtml(rsvp.name)}${guestText}</p>
                <p class="wish-status">${statusMap[rsvp.attendance] || ''} • ${rsvp.time || ''}</p>
                ${rsvp.message ? `<p class="wish-message">"${escapeHtml(rsvp.message)}"</p>` : ''}
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Form submission
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        attendance: formData.get('attendance'),
        guests: formData.get('guests'),
        message: formData.get('message'),
        time: new Date().toLocaleString('vi-VN')
    };

    saveRSVP(data);

    // Show success message
    document.getElementById('rsvp-form').style.display = 'none';
    document.getElementById('rsvp-success').style.display = 'block';

    // Trigger confetti burst
    burstConfetti();

    // Refresh wishes
    renderWishes();

    // Reset form after delay
    setTimeout(() => {
        document.getElementById('rsvp-form').reset();
        document.getElementById('rsvp-form').style.display = 'block';
        document.getElementById('rsvp-success').style.display = 'none';
    }, 5000);
});

// Confetti burst on submit
function burstConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#d4a853', '#f0d68a', '#ff6b8a', '#4ecdc4', '#ffd93d', '#ff9a9e', '#a18cd1'];

    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = (40 + Math.random() * 20) + '%';
        confetti.style.top = '50%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        confetti.style.opacity = '1';

        confettiContainer.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

// Initial render
renderWishes();

// ===== Smooth Parallax on Hero =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    const scrollY = window.scrollY;

    if (scrollY < window.innerHeight) {
        hero.style.transform = `translateY(${scrollY * 0.3}px)`;
        hero.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
    }
});

// ===== Add subtle glow effect on mouse move =====
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.detail-card, .invitation-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        }
    });
});
