/* ╔════════════════════════════════════════════════════════════════╗
   ║  ZAIZKUU PORTFOLIO — Scripts                                 ║
   ╚════════════════════════════════════════════════════════════════╝ */

(function () {
  'use strict';

  // ── DOM Refs ─────────────────────────────────────────────────
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const cursorGlow = document.getElementById('cursorGlow');
  const hero = document.getElementById('hero');
  const reveals = document.querySelectorAll('.reveal');
  const navAnchors = document.querySelectorAll('.nav__link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const contactForm = document.getElementById('contactForm');

  // ── Nav Scroll Background ────────────────────────────────────
  function handleNavScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // ── Mobile Menu ──────────────────────────────────────────────
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ── Active Nav Link on Scroll ────────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav);

  // ── Scroll Reveal (IntersectionObserver) ─────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  reveals.forEach(el => revealObserver.observe(el));

  // ── Cursor Glow (Hero only) ──────────────────────────────────
  let glowActive = false;

  function updateGlow(e) {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  }

  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => updateGlow(e));

    // Check if over hero
    const rect = hero.getBoundingClientRect();
    const overHero = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );

    if (overHero && !glowActive) {
      cursorGlow.classList.add('active');
      glowActive = true;
    } else if (!overHero && glowActive) {
      cursorGlow.classList.remove('active');
      glowActive = false;
    }
  });

  // ── Project Filter ───────────────────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.style.animation = 'none';
          card.offsetHeight; // force reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ── Tilt effect on bento cards ───────────────────────────────
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Contact Form ─────────────────────────────────────────────
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<span>Sent! ✓</span>';
      btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 2500);
    });
  }

  // ── Smooth Scroll for all anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Staggered reveal for bento cards ─────────────────────────
  const bentoCards = document.querySelectorAll('.bento__card');
  bentoCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // ── Text Scramble Effect (Hero Description) ──────────────────
  const scrambleEl = document.querySelector('[data-scramble]');
  if (scrambleEl) {
    const finalText = scrambleEl.textContent;
    const chars = '!<>-_\\/[]{}—=+*^?#_░▒▓';
    let frame = 0;
    const totalFrames = finalText.length * 3;

    function scrambleStep() {
      let output = '';
      const progress = frame / totalFrames;

      for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === ' ') {
          output += ' ';
        } else if (i / finalText.length < progress) {
          output += finalText[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      scrambleEl.textContent = output;
      frame++;

      if (frame <= totalFrames) {
        requestAnimationFrame(scrambleStep);
      } else {
        scrambleEl.textContent = finalText;
      }
    }

    // Start after other animations settle
    setTimeout(scrambleStep, 2000);
  }

})();
