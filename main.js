// PHASE 3: NAVBAR MODULE (main.js)
// Implements scroll behavior and accessible mobile menu navigation.

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initHeroReveal();
  initTypewriter();
  initScrollReveal();
  initCaseStudies();
  initHeroParallax();
});

/**
 * Hero Staggered Reveal on Mount
 * Adds .hero-loaded class after a single frame to trigger CSS transitions.
 */
function initHeroReveal() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  // Use requestAnimationFrame to ensure DOM is painted first,
  // then add class to trigger transitions from the hidden state.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hero.classList.add('hero-loaded');
    });
  });

  // Mobile: tap-to-toggle the name fill effect
  const nameWrap = hero.querySelector('.hero-name-wrap');
  if (nameWrap) {
    nameWrap.addEventListener('click', () => {
      nameWrap.classList.toggle('name-active');
    });
  }
}

/**
 * 1. Navbar Scroll Status
 * Adds 'scrolled' class when page is scrolled down to trigger border/shadow styling.
 */
function initNavbarScroll() {
  const header = document.getElementById('header-container');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 15) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/**
 * 2. Mobile Menu Navigation & Drawer Toggle
 */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav) return;

  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('active');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
  };

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('active');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
  };

  const toggleMenu = () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Toggle button click listener
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close drawer when clicking a mobile nav link
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link, .btn');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
      toggle.focus(); // Restore keyboard focus
    }
  });

  // Close menu when clicking outside of the drawer
  document.addEventListener('click', (e) => {
    const isClickInsideMenu = mobileNav.contains(e.target);
    const isClickInsideToggle = toggle.contains(e.target);
    if (!isClickInsideMenu && !isClickInsideToggle && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * 3. Typewriter Animation for Specializations
 * Cycles through specified roles with character typing and erasing animation.
 * Respects prefers-reduced-motion.
 */
function initTypewriter() {
  const typedTextSpan = document.querySelector('.typed-text');
  const cursorSpan = document.querySelector('.typed-cursor');
  if (!typedTextSpan) return;

  const roles = [
    'Full Stack Developer',
    'Flutter Developer',
    'Backend Developer',
    'Junior Mobile Developer',
    'AI & RAG Developer'
  ];

  const typingSpeed = 80;
  const erasingSpeed = 40;
  const newRoleDelay = 2000; // Delay before roles
  let roleIndex = 0;
  let charIndex = 0;

  // Respect reduced motion: display the first role statically and hide cursor
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    typedTextSpan.textContent = roles[0];
    if (cursorSpan) cursorSpan.style.display = 'none';
    return;
  }

  function type() {
    if (charIndex < roles[roleIndex].length) {
      if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
      typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      cursorSpan.classList.remove('typing');
      setTimeout(erase, newRoleDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
      typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      cursorSpan.classList.remove('typing');
      roleIndex++;
      if (roleIndex >= roles.length) roleIndex = 0;
      setTimeout(type, 500);
    }
  }

  // Start the animation with a small delay
  setTimeout(type, 1000);
}

/**
 * 4. Scroll Reveal Animation Trigger
 * Uses IntersectionObserver to reveal sections and cards.
 * Also calculates stagger animation delays dynamically.
 * Respects prefers-reduced-motion.
 */
function initScrollReveal() {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) return; // Skip if user prefers reduced motion

  // Handle stagger container children
  const staggerContainers = document.querySelectorAll('.stagger-container');
  staggerContainers.forEach(container => {
    const items = container.querySelectorAll('.stagger-item');
    items.forEach((item, index) => {
      item.style.setProperty('--stagger-index', index);
    });
  });

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Trigger slightly before element is fully visible
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // Contact section reveal observer
  const contactSections = document.querySelectorAll('.contact-section');
  const contactObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1
  });

  contactSections.forEach(sec => {
    contactObserver.observe(sec);
  });
}

/**
 * 5. Project Card 3D Flip Case Studies
 * Toggles the 3D flip state on project cards and shifts keyboard focus appropriately.
 */
function initCaseStudies() {
  const frontTriggers = document.querySelectorAll('.case-study-trigger');
  const backTriggers = document.querySelectorAll('.case-study-back-trigger');

  frontTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const card = trigger.closest('.project-card');
      if (card) {
        card.classList.add('is-flipped');
        
        // Focus management: Shift focus to the "Back" button on the flipped face
        const backBtn = card.querySelector('.case-study-back-trigger');
        if (backBtn) {
          setTimeout(() => backBtn.focus(), 100);
        }
      }
    });
  });

  backTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const card = trigger.closest('.project-card');
      if (card) {
        card.classList.remove('is-flipped');
        
        // Focus management: Shift focus back to the front "View Case Study" button
        const frontBtn = card.querySelector('.case-study-trigger');
        if (frontBtn) {
          setTimeout(() => frontBtn.focus(), 100);
        }
      }
    });
  });
}

/**
 * 6. Hero Parallax Scroll Effect
 * Moves the hero elements at different rates to create depth (parallax).
 * Respects prefers-reduced-motion.
 */
function initHeroParallax() {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) return;

  const nameWrap = document.querySelector('.hero-name-wrap');
  const portraitArea = document.querySelector('.hero-portrait-area');
  const bottomRow = document.querySelector('.hero-bottom-row');

  if (!portraitArea) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollValue = window.scrollY;
        // Only apply parallax when hero is in view
        if (scrollValue < window.innerHeight) {
          // Each layer moves at a different rate for depth
          portraitArea.style.translate = `0 ${scrollValue * 0.15}px`;

          if (nameWrap) {
            nameWrap.style.translate = `0 ${scrollValue * 0.06}px`;
          }

          if (bottomRow) {
            bottomRow.style.translate = `0 ${scrollValue * 0.04}px`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

