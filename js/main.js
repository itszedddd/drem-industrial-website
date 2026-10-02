/* ============================================
   DREM Industrial Sales - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Navbar Scroll Effect ----------
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Initial check

  // ---------- Mobile Menu Toggle ----------
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Scroll Animations ----------
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animateElements.forEach(el => observer.observe(el));

  // ---------- Counter Animation ----------
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
        animateCounter(el, target, suffix);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target, suffix) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.innerHTML = Math.floor(current) + suffix;
    }, stepTime);
  }

  // ---------- Back to Top Button ----------
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Contact Form Handling ----------
  const contactForm = document.getElementById('contactForm');
  const formContent = document.getElementById('formContent');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      const inputs = contactForm.querySelectorAll('[required]');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = 'var(--error)';
          setTimeout(() => {
            input.style.borderColor = '';
          }, 2000);
        }
      });

      if (!valid) return;

      // Simulate form submission
      const submitBtn = contactForm.querySelector('.btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        if (formContent) formContent.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
        submitBtn.innerHTML = originalText;
        submitBtn.style.pointerEvents = '';
      }, 1500);
    });
  }

  // ---------- Active Nav Link ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ---------- Inner Page Navbar (always scrolled for non-hero pages) ----------
  const hero = document.querySelector('.hero');
  if (!hero && navbar) {
    navbar.classList.add('scrolled');
    window.removeEventListener('scroll', handleNavbarScroll);
  }

});
