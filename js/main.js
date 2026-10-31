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
    // Backdrop for mobile nav
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    const closeMenu = () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      backdrop.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when tapping backdrop or clicking outside
    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') &&
          !navLinks.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close mobile menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close mobile menu when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        closeMenu();
      }
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
    threshold: 0.05,
    rootMargin: '0px 0px 60px 0px'
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

  // ---------- Smooth Scrolling for In-Page Anchor Links ----------
  const getNavbarOffset = () => {
    return navbar ? navbar.offsetHeight + 10 : 80;
  };

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offset = getNavbarOffset();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (history.pushState) {
          history.pushState(null, null, targetId);
        }

        document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(l => l.classList.remove('active'));
        if (!link.classList.contains('nav-cta')) {
          link.classList.add('active');
        }
      }
    });
  });

  // Handle direct hash navigation on page load
  if (window.location.hash) {
    const hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      setTimeout(() => {
        const offset = getNavbarOffset();
        const elementPosition = hashTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 200);
    }
  }

  // ---------- ScrollSpy for Active Menu State ----------
  const trackedSections = document.querySelectorAll('section[id]');
  const inPageNavLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)');

  const handleScrollSpy = () => {
    const scrollPos = window.scrollY + getNavbarOffset() + 40;
    let currentId = '';

    trackedSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = '#' + section.getAttribute('id');
      }
    });

    if (currentId) {
      inPageNavLinks.forEach(link => {
        if (link.getAttribute('href') === currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy(); // Initial call

  // ---------- Email Redirect & Quick Copy Helper ----------
  const initEmailHelper = () => {
    // Create toast container if it doesn't exist
    let toast = document.getElementById('emailToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'emailToast';
      toast.className = 'email-toast';
      toast.setAttribute('role', 'alert');
      toast.innerHTML = `
        <div class="email-toast-content">
          <div class="email-toast-title">
            <i class="fas fa-paper-plane"></i>
            <span id="emailToastTitle">Opened Gmail Compose</span>
          </div>
          <div class="email-toast-desc" id="emailToastDesc">Addressed to drem747@drem.com.ph</div>
          <div class="email-toast-actions">
            <button type="button" class="email-toast-btn copy-btn" id="emailToastCopy">
              <i class="fas fa-copy"></i> Copy Address
            </button>
            <a href="#" class="email-toast-btn app-btn" id="emailToastMailto">
              <i class="fas fa-envelope"></i> Default Mail App
            </a>
          </div>
        </div>
        <button type="button" class="email-toast-close" id="emailToastClose" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      `;
      document.body.appendChild(toast);
    }

    let toastTimer = null;
    const showToast = (email, title = 'Opened Gmail Compose') => {
      const titleEl = document.getElementById('emailToastTitle');
      const descEl = document.getElementById('emailToastDesc');
      const copyBtn = document.getElementById('emailToastCopy');
      const mailtoLink = document.getElementById('emailToastMailto');

      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = `Addressed to ${email}`;
      if (mailtoLink) {
        mailtoLink.href = `mailto:${email}?subject=${encodeURIComponent('Inquiry - Drem Industrial Sales, Inc.')}`;
      }
      if (copyBtn) {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Address';
        copyBtn.onclick = () => copyToClipboard(email, copyBtn);
      }

      toast.classList.add('show');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 7000);
    };

    const closeBtn = document.getElementById('emailToastClose');
    if (closeBtn) {
      closeBtn.onclick = () => {
        toast.classList.remove('show');
        if (toastTimer) clearTimeout(toastTimer);
      };
    }

    // Helper to copy to clipboard with fallback
    const copyToClipboard = (text, triggerEl) => {
      const originalHtml = triggerEl ? triggerEl.innerHTML : '';
      const handleSuccess = () => {
        if (triggerEl) {
          triggerEl.classList.add('copied');
          triggerEl.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => {
            triggerEl.classList.remove('copied');
            triggerEl.innerHTML = originalHtml;
          }, 2000);
        }
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(handleSuccess).catch(() => fallbackCopy(text, handleSuccess));
      } else {
        fallbackCopy(text, handleSuccess);
      }
    };

    const fallbackCopy = (text, callback) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        if (callback) callback();
      } catch (err) {
        console.error('Failed to copy text', err);
      }
      document.body.removeChild(textarea);
    };

    // Attach click handlers to email action buttons
    document.querySelectorAll('.email-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const email = btn.getAttribute('data-email') || 'drem747@drem.com.ph';
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Inquiry - Drem Industrial Sales, Inc.')}`;
        
        // Ensure link opens Gmail
        btn.setAttribute('href', gmailUrl);
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener noreferrer');

        // Show helper toast with fallback mail app and copy options
        setTimeout(() => {
          showToast(email);
        }, 300);
      });
    });

    // Attach click handlers to quick copy buttons
    document.querySelectorAll('.copy-pill, .copy-email-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const email = btn.getAttribute('data-email') || 'drem747@drem.com.ph';
        copyToClipboard(email, btn);
      });
    });
  };

  initEmailHelper();

  // ---------- Project Showcase Filtering & Lightbox Modal ----------
  const initProjectGallery = () => {
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    if (!projectCards.length) return;

    // Filter functionality
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter') || 'all';

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });

    // Lightbox modal functionality (Photo Zoom)
    if (modal) {
      const modalImg = document.getElementById('modalImg');
      const modalCategory = document.getElementById('modalCategory');
      const modalTitle = document.getElementById('modalTitle');
      const modalClose = document.getElementById('modalCloseBtn');
      const modalPrev = document.getElementById('modalPrevBtn');
      const modalNext = document.getElementById('modalNextBtn');

      let currentCardIndex = 0;
      const getVisibleCards = () => Array.from(projectCards).filter(c => !c.classList.contains('is-hidden'));

      const updateModal = (card) => {
        if (!card) return;
        const img = card.getAttribute('data-img');
        const title = card.getAttribute('data-title');
        const category = card.getAttribute('data-category-name');

        if (modalImg) {
          modalImg.src = img;
          modalImg.alt = title;
        }
        if (modalTitle) modalTitle.textContent = title;
        if (modalCategory) modalCategory.textContent = category;
      };

      const openModal = (card) => {
        const visible = getVisibleCards();
        currentCardIndex = visible.indexOf(card);
        updateModal(card);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      };

      const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      };

      projectCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
      });

      if (modalClose) modalClose.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      });

      const showPrev = () => {
        const visible = getVisibleCards();
        if (!visible.length) return;
        currentCardIndex = (currentCardIndex - 1 + visible.length) % visible.length;
        updateModal(visible[currentCardIndex]);
      };

      const showNext = () => {
        const visible = getVisibleCards();
        if (!visible.length) return;
        currentCardIndex = (currentCardIndex + 1) % visible.length;
        updateModal(visible[currentCardIndex]);
      };

      if (modalPrev) modalPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
      if (modalNext) modalNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    }
  };

  initProjectGallery();

});
