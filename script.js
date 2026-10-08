/**
 * Personal Portfolio - Aradhana Bishnoi
 * Vanilla JavaScript: Navigation, Contact Validation, Active Spy & Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Dynamic Footer Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  if (navToggle && navMenu) {
    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      // Prevent background scrolling on small screens when mobile menu is open
      if (window.innerWidth <= 768) {
        document.body.style.overflow = isOpen ? 'hidden' : '';
      }
    };

    const closeMenu = () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (
        event &&
        event.target &&
        navMenu.classList.contains('open') &&
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (event) => {
      if (event && event.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Reset overflow on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // 3. Navbar Sticky Style on Scroll
  const handleNavbarScroll = () => {
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial run

  // 4. Active Navigation Link Highlighting (ScrollSpy)
  const sections = document.querySelectorAll('section[id]');

  const highlightActiveNav = () => {
    const scrollPos = window.scrollY + 120; // Offset for navbar

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  // 5. Scroll Reveal Animations (IntersectionObserver)
  const animatableSelectors = [
    '.section-header',
    '.about-card',
    '.timeline-item',
    '.skill-card',
    '.project-card',
    '.cert-card',
    '.contact-info-card',
    '.contact-form-card'
  ];

  const elementsToAnimate = document.querySelectorAll(animatableSelectors.join(','));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elementsToAnimate.forEach(el => {
      el.classList.add('fade-up-element');
      revealObserver.observe(el);
    });
  }

  // 6. Contact Form Validation & Submission
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit-btn');

    // Email regex validator (RFC 5322 standard simplified)
    const isValidEmail = (email) => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).trim());
    };

    // Helper to toggle error display
    const setFieldError = (input, errorEl, isError) => {
      if (isError) {
        input.classList.add('is-invalid');
        errorEl.classList.add('visible');
      } else {
        input.classList.remove('is-invalid');
        errorEl.classList.remove('visible');
      }
    };

    // Live validation clears on typing
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) {
        setFieldError(nameInput, nameError, false);
      }
    });

    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value)) {
        setFieldError(emailInput, emailError, false);
      }
    });

    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) {
        setFieldError(messageInput, messageError, false);
      }
    });

    // Form Submission Handling
    contactForm.addEventListener('submit', (e) => {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }

      let isValid = true;
      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const messageVal = messageInput.value.trim();

      // Validate Name
      if (nameVal.length < 2) {
        setFieldError(nameInput, nameError, true);
        isValid = false;
      } else {
        setFieldError(nameInput, nameError, false);
      }

      // Validate Email
      if (!isValidEmail(emailVal)) {
        setFieldError(emailInput, emailError, true);
        isValid = false;
      } else {
        setFieldError(emailInput, emailError, false);
      }

      // Validate Message
      if (messageVal.length < 10) {
        setFieldError(messageInput, messageError, true);
        isValid = false;
      } else {
        setFieldError(messageInput, messageError, false);
      }

      // If invalid, focus first error input
      if (!isValid) {
        if (nameVal.length < 2) {
          nameInput.focus();
        } else if (!isValidEmail(emailVal)) {
          emailInput.focus();
        } else {
          messageInput.focus();
        }
        return;
      }

      // Valid: Simulate sending state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending Message...</span>
      `;

      setTimeout(() => {
        // Success feedback
        formStatus.className = 'form-status success';
        formStatus.textContent = `Thank you, ${nameVal}! Your message has been received. I will get back to you soon.`;

        // Reset form inputs
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        // Auto hide success message after 7 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
          formStatus.className = 'form-status';
          formStatus.textContent = '';
          formStatus.style.display = '';
        }, 7000);
      }, 700);
    });
  }
});
