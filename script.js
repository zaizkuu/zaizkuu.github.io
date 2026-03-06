/* ╔════════════════════════════════════════════════════════════════╗
   ║  ZAIZKUU PORTFOLIO — MinimalFolio-Inspired Scripts           ║
   ╚════════════════════════════════════════════════════════════════╝ */

(function () {
  'use strict';

  // ── Init AOS ────────────────────────────────────────────────
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  // ── DOM Refs ────────────────────────────────────────────────
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const sidebar = document.getElementById('sidebarNav');
  const overlay = document.getElementById('navOverlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav__link');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');

  // ── Header Scroll ───────────────────────────────────────────
  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);

    // Back to top visibility
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ── Sidebar Navigation ──────────────────────────────────────
  function openNav() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', openNav);
  navClose.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  // ── Active Nav Link on Scroll ───────────────────────────────
  function highlightNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        sidebarLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav);

  // ── Smooth Scroll ───────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Portfolio Filters ───────────────────────────────────────
  const filterBtns = document.querySelectorAll('.portfolio-filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('portfolio-item--hidden');
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.classList.add('portfolio-item--hidden');
        }
      });
    });
  });

  // ── Skill Bar Animation ─────────────────────────────────────
  const skillBars = document.querySelectorAll('.skill-bar__fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Re-trigger width (it's set as inline style)
        const targetWidth = entry.target.style.width;
        entry.target.style.width = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            entry.target.style.width = targetWidth;
          });
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ── Stat Counter Animation ──────────────────────────────────
  const statNumbers = document.querySelectorAll('.about__stat-number');

  function animateCounter(el) {
    if (el.classList.contains('counted')) return;

    const rawText = el.textContent.trim();
    const suffix = rawText.replace(/[0-9]/g, '');
    const target = parseInt(rawText);
    if (isNaN(target)) return;

    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
        el.classList.add('counted');
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

  statNumbers.forEach(el => statObserver.observe(el));

  // ── Lightbox ────────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.portfolio-item__overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
      const img = overlay.closest('.portfolio-item__media').querySelector('.portfolio-item__image');
      if (!img) return;
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

  // ── Fade-in-up animation keyframes (for filter) ─────────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

})();
