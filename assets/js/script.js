// ─── THEME TOGGLE ───
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

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
const words  = ['Design Engineer', 'Avionics Enthusiast', 'Embedded Systems', 'UAV Systems Engineer', 'CAD Designer'];
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
setTimeout(type, 800);

// ─── SCROLL REVEAL ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) fill.style.width = fill.dataset.w + '%';
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, [data-reveal]').forEach(el => observer.observe(el));

// Skill cards individually for bars
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.skill-fill');
      if (fill) setTimeout(() => fill.style.width = fill.dataset.w + '%', 200);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(c => skillObserver.observe(c));

// ─── COUNTER ───
function animateCounter(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
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
}, { threshold: 0.4 });
const heroEl = document.getElementById('hero');
if (heroEl) heroObserver.observe(heroEl);

// ─── PROJECT FILTER (optional, present only if buttons exist) ───
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
    btn.textContent = 'Message Sent!';
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
