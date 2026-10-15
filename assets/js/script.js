// ─── ACCESSIBILITY / PREFERENCES ───
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsRevealObserver = 'IntersectionObserver' in window;
if (supportsRevealObserver && !prefersReducedMotion) {
  document.body.classList.add('js-enabled');
}

// ─── THEME TOGGLE ───
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    themeToggle.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'dark' : 'light'} mode`);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

// ─── NAV SCROLL ───
const nav = document.getElementById('nav');
function handleScroll() {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

// ─── MOBILE DISCLOSURE NAVIGATION ───
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

function setMobileMenuOpen(isOpen) {
  if (!burger || !mobileMenu) return;
  mobileMenu.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  burger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  burger.querySelectorAll('span').forEach((span, index) => {
    span.style.transform = isOpen
      ? (index === 0 ? 'rotate(45deg) translate(5px,5px)' : 'rotate(-45deg) translate(5px,-5px)')
      : '';
  });
}

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    setMobileMenuOpen(!mobileMenu.classList.contains('open'));
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => setMobileMenuOpen(false));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
      setMobileMenuOpen(false);
      burger.focus();
    }
  });
}

// ─── ACTIVE NAV ───
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');
  let activeId = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) activeId = section.id;
  });
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

// ─── TYPEWRITER ───
const words = ['Design Engineer', 'Avionics Enthusiast', 'Embedded Systems', 'UAV Systems Engineer', 'CAD Designer'];
const tw = document.getElementById('typewriter');
if (tw && prefersReducedMotion) {
  tw.textContent = 'UAV Systems Engineer';
} else if (tw) {
  let wi = 0;
  let ci = 0;
  let deleting = false;
  function type() {
    const word = words[wi];
    tw.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length) {
      deleting = true;
      window.setTimeout(type, 1400);
      return;
    }
    if (deleting && ci < 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
      ci = 0;
    }
    window.setTimeout(type, deleting ? 50 : 90);
  }
  window.setTimeout(type, 800);
}

// ─── COUNTERS ───
function animateCounter(element) {
  if (element.dataset.done) return;
  element.dataset.done = '1';
  const target = Number(element.dataset.target);
  if (!Number.isFinite(target)) return;
  if (prefersReducedMotion) {
    element.textContent = String(target);
    return;
  }
  let current = 0;
  const step = Math.max(target / 40, 1);
  const interval = window.setInterval(() => {
    current = Math.min(current + step, target);
    element.textContent = String(Math.round(current));
    if (current >= target) window.clearInterval(interval);
  }, 40);
}

// ─── SCROLL REVEAL + SKILL BARS ───
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, [data-reveal]');
if (supportsRevealObserver && !prefersReducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) fill.style.width = `${fill.dataset.w}%`;
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach(element => observer.observe(element));

  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) window.setTimeout(() => { fill.style.width = `${fill.dataset.w}%`; }, 200);
      skillObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
  document.querySelectorAll('.skill-fill').forEach(fill => { fill.style.width = `${fill.dataset.w}%`; });
}

// Ensure hero counters still initialise even if the observer is unavailable.
const heroEl = document.getElementById('hero');
if (heroEl && (!supportsRevealObserver || prefersReducedMotion)) {
  heroEl.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
} else if (heroEl && supportsRevealObserver) {
  const heroObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    heroEl.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
    heroObserver.disconnect();
  }, { threshold: 0.4 });
  heroObserver.observe(heroEl);
}

// ─── PROJECT FILTER (only activates if filter controls are added) ───
document.querySelectorAll('.pf-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(item => item.classList.toggle('active', item === button));
    const filter = button.dataset.filter || 'all';
    document.querySelectorAll('.proj-card').forEach(card => {
      const category = card.dataset.cat;
      card.classList.toggle('hidden', filter !== 'all' && category !== filter);
    });
  });
});

// ─── CONTACT FORM ───
// There is no backend configured. Open a pre-filled email draft instead of falsely claiming delivery.
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:arundawn96058@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = document.getElementById('formStatus');
    if (status) status.textContent = 'Opening your email app with a draft. Please review it and press Send in your email app.';
    window.location.href = mailto;
  });
}

// ─── IN-PAGE LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    if (mobileMenu && mobileMenu.classList.contains('open') && link.classList.contains('mob-link')) {
      setMobileMenuOpen(false);
    }
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});
