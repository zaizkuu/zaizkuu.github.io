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

  // ── Tilt effect on bento / project / code cards ─────────────
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

  // ── Lightbox for Project Images ─────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.project-card__preview').forEach(preview => {
    const img = preview.querySelector('.project-card__image');
    if (!img) return;

    preview.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });

  // ── Contact Form ─────────────────────────────────────────────
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<span>Sent! ✓</span>';
      btn.style.background = 'linear-gradient(135deg, #7B4040, #C07868)';
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

  // ── Staggered reveal for project cards ──────────────────────
  document.querySelectorAll('.project-card.reveal').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.15}s`;
  });

  // ── Staggered reveal for cert cards ─────────────────────────
  document.querySelectorAll('.cert-card.reveal').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.2}s`;
  });

  // ── Observe hero split reveals ──────────────────────────────
  document.querySelectorAll('.hero__col.reveal, .hero__center.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Hero Name Letter-by-Letter Animation ───────────────────
  const heroName = document.querySelector('.hero__name');
  if (heroName) {
    const text = heroName.textContent;
    heroName.innerHTML = '';
    Array.from(text).forEach((char, i) => {
      if (char === ' ') {
        const space = document.createElement('span');
        space.className = 'letter-space';
        heroName.appendChild(space);
      } else {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        span.style.transitionDelay = `${0.8 + i * 0.05}s`;
        heroName.appendChild(span);
      }
    });

    // Trigger after hero becomes visible
    const nameObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroName.querySelectorAll('.letter').forEach(l => l.classList.add('visible'));
          nameObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    nameObserver.observe(heroName);
  }

  // ── Stat Counter Animation ─────────────────────────────────
  const statCards = document.querySelectorAll('.stat-card');

  function animateCounter(card) {
    const numEl = card.querySelector('.stat-card__number');
    if (!numEl || card.classList.contains('counted')) return;

    const rawText = numEl.textContent.trim();
    const suffix = rawText.replace(/[0-9]/g, '');  // e.g. "+"
    const target = parseInt(rawText);
    if (isNaN(target)) return;

    let current = 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      numEl.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        numEl.textContent = target + suffix;
        card.classList.add('counted');
      }
    }

    requestAnimationFrame(update);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => statObserver.observe(card));

  // ── Staggered Contact Card Reveals ─────────────────────────
  document.querySelectorAll('.contact__social-card.reveal').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });
  // ── Futuristic Text Resolve / Scramble Effect ───────────────
  const resolveChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>[]{}|/\\';
  const resolveEls = document.querySelectorAll('[data-resolve]');

  function scrambleResolve(el, delay = 0) {
    const finalText = el.textContent;
    const len = finalText.length;
    let resolved = 0;
    const speed = 1;              // chars resolved per frame
    const scrambleFrames = 3;     // frames of scramble before resolving each char
    let frame = 0;

    // Start with scrambled text
    el.textContent = Array.from(finalText).map(c =>
      c === ' ' ? ' ' : resolveChars[Math.floor(Math.random() * resolveChars.length)]
    ).join('');
    el.classList.add('resolve--active');

    function tick() {
      if (resolved >= len) {
        el.textContent = finalText;
        el.classList.remove('resolve--active');
        el.classList.add('resolve--done');
        return;
      }

      frame++;

      // Build the display string
      let display = '';
      for (let i = 0; i < len; i++) {
        if (i < resolved) {
          display += finalText[i];           // already decoded
        } else if (finalText[i] === ' ') {
          display += ' ';                    // keep spaces
        } else {
          display += resolveChars[Math.floor(Math.random() * resolveChars.length)];
        }
      }
      el.textContent = display;

      // Every N frames, lock in one more real character
      if (frame % scrambleFrames === 0) {
        resolved += speed;
      }

      requestAnimationFrame(tick);
    }

    setTimeout(() => requestAnimationFrame(tick), delay);
  }

  // Observer triggers the scramble resolve when visible
  const resolveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('resolve--done')) {
        const idx = Array.from(resolveEls).indexOf(entry.target);
        scrambleResolve(entry.target, idx * 800); // stagger each paragraph
        resolveObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  resolveEls.forEach(el => {
    el.dataset.resolveOriginal = el.textContent;  // store original
    resolveObserver.observe(el);
  });

})();
