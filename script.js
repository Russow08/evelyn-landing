/* ============================================
   EVELYN VALERIA — Interactividad
   ============================================ */

(function () {
  'use strict';

  /* ── Nav scroll effect ───────────────────── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // init

  /* ── AOS (micro scroll-reveal) ───────────── */
  const aosCandidates = document.querySelectorAll('[data-aos]');

  if ('IntersectionObserver' in window && aosCandidates.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    aosCandidates.forEach((el, i) => {
      el.style.transitionDelay = (i * 0.1) + 's';
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    aosCandidates.forEach((el) => el.classList.add('aos-visible'));
  }

  /* ── Smooth nav links ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── WhatsApp FAB pulse on idle ──────────── */
  const fab = document.querySelector('.fab-whatsapp');
  let idleTimer;

  function scheduleIdlePulse() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!fab) return;
      fab.classList.add('pulse');
      fab.addEventListener('animationend', () => fab.classList.remove('pulse'), { once: true });
    }, 8000);
  }

  // Add pulse keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    .fab-whatsapp.pulse {
      animation: fabPulse .7s ease both;
    }
    @keyframes fabPulse {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.18); }
      70%  { transform: scale(.95); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  scheduleIdlePulse();
  ['scroll', 'mousemove', 'keydown', 'touchstart'].forEach((ev) => {
    window.addEventListener(ev, scheduleIdlePulse, { passive: true });
  });

})();
