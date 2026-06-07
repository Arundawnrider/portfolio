// ─── LOADER ───
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const fill   = document.querySelector('.loader-fill');
  const pct    = document.getElementById('loaderPct');
  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 15, 100);
    fill.style.width = p + '%';
    pct.textContent  = Math.round(p) + '%';
    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        loader.classList.add('hidden');
        startReveal();
      }, 300);
    }
  }, 60);
});

// ─── CURSOR ───
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
document.addEventListener('mousemove', e => {
  cursor.style.left      = e.clientX + 'px';
  cursor.style.top       = e.clientY + 'px';
  cursorTrail.style.left = e.clientX + 'px';
  cursorTrail.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button, .pf-btn, .proj-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px';
    cursor.style.height = '20px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '10px';
    cursor.style.height = '10px';
  });
});

// ─── NAV SCROLL ───
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
});

// ─── BURGER MENU ───
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  }
});
document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ─── ACTIVE NAV ───
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('[data-nav]');
  sections.forEach(sec => {
    const top    = sec.offsetTop - 100;
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`[data-nav][href="#${sec.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}

// ─── TYPEWRITER ───
const words  = ['UAV Researcher', 'CFD Engineer', 'Embedded Developer', 'ARIES Co-founder'];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');
function type() {
  if (!tw) return;
  const word = words[wi];
  tw.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  if (!deleting && ci > word.length)      { deleting = true; setTimeout(type, 1400); return; }
  if (deleting && ci < 0)                  { deleting = false; wi = (wi + 1) % words.length; ci = 0; }
  setTimeout(type, deleting ? 50 : 90);
}
setTimeout(type, 1000);

// ─── HERO CANVAS PARTICLE FIELD ───
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function Particle() {
  this.x    = Math.random() * canvas.width;
  this.y    = Math.random() * canvas.height;
  this.vx   = (Math.random() - 0.5) * 0.4;
  this.vy   = (Math.random() - 0.5) * 0.4;
  this.r    = Math.random() * 1.5 + 0.3;
  this.life = Math.random();
}
for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56,189,248,0.6)';
    ctx.fill();
    // lines
    particles.slice(i + 1).forEach(q => {
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(56,189,248,${(1 - dist / 120) * 0.15})`;
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// ─── SCROLL REVEAL ───
function startReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Skill bars
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) fill.style.width = fill.dataset.w + '%';
        // Counters
        entry.target.querySelectorAll('.stat-num[data-target]').forEach(counter => {
          animateCounter(counter);
        });
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, [data-reveal]').forEach(el => observer.observe(el));
}

// Also observe skill cards individually for bars
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.skill-fill');
      if (fill) setTimeout(() => fill.style.width = fill.dataset.w + '%', 200);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(c => skillObserver.observe(c));

// Counter
function animateCounter(el) {
  const target = +el.dataset.target;
  let current  = 0;
  const step   = target / 40;
  const iv = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current);
    if (current >= target) clearInterval(iv);
  }, 40);
}

// Stat counters on hero visibility
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });
const heroEl = document.getElementById('hero');
if (heroEl) heroObserver.observe(heroEl);

// ─── PROJECT FILTER ───
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.proj-card').forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

// ─── CONTACT FORM ───
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"] span');
    btn.textContent = 'Message Sent! ✓';
    form.reset();
    setTimeout(() => btn.textContent = 'Send Message', 3000);
  });
}

// ─── SMOOTH SCROLL FOR NAV LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
