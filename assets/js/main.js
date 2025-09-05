/**
 * SK Enterprises - Main JavaScript File
 * Handles all interactive functionality for the website
 */

// ===== UTILITY FUNCTIONS =====
function safeQuerySelector(selector) {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn(`Selector "${selector}" not found:`, error);
    return null;
  }
}

function safeQuerySelectorAll(selector) {
  try {
    return document.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Selector "${selector}" not found:`, error);
    return [];
  }
}

// ===== MOBILE NAVIGATION =====
function initMobileNavigation() {
  const hamburger = safeQuerySelector('#hamburger');
  const navMobile = safeQuerySelector('#navMobile');
  let overlay = safeQuerySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }
  
  if (hamburger && navMobile) {
    // Populate mobile menu from desktop links if needed
    const desktopLinks = safeQuerySelectorAll('.nav-desktop .nav-link');
    if (desktopLinks.length > 0 && navMobile.children.length <= 1) {
      let content = navMobile.querySelector('.nav-mobile-content');
      if (!content) {
        content = document.createElement('div');
        content.className = 'nav-mobile-content';
        navMobile.appendChild(content);
      }
      content.innerHTML = '';
      desktopLinks.forEach(link => {
        const a = document.createElement('a');
        a.href = link.getAttribute('href') || '#';
        a.className = 'nav-mobile-link';
        a.innerHTML = link.innerHTML;
        content.appendChild(a);
      });
    }

    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.contains('active');
      
      // Toggle hamburger animation
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', !isActive);
      
      // Toggle mobile navigation
      navMobile.classList.toggle('active');
      overlay.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'auto' : 'hidden';
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
        hamburger.classList.remove('active');
        navMobile.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
      }
    });
    
    // Close when clicking overlay
    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMobile.classList.remove('active');
      overlay.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = 'auto';
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = safeQuerySelectorAll('.nav-mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMobile.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
      });
    });
  }
}

// ===== HEADER SCROLL BEHAVIOR =====
function initHeaderScrollBehavior() {
  const header = safeQuerySelector('.site-header');
  if (!header) return;
  
  let lastScrollTop = 0;
  let ticking = false;
  let progressBar = safeQuerySelector('.scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
  }
  
  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    
    // Add scrolled class for styling
    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header based on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
}

// ===== ACTIVE NAV HIGHLIGHT =====
function initActiveNavHighlight() {
  const links = safeQuerySelectorAll('.nav-desktop .nav-link, .nav-mobile-link');
  if (links.length === 0) return;
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    if (href === '' || href === '#') return;
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ===== SWIPER INITIALIZATION =====
function initSwipers() {
  // Hero Swiper
  const heroSwiper = safeQuerySelector('.hero-swiper');
  if (heroSwiper && typeof Swiper !== 'undefined') {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: '.hero-swiper .swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.hero-swiper .swiper-button-next',
        prevEl: '.hero-swiper .swiper-button-prev',
      },
      keyboard: {
        enabled: true,
      },
      a11y: {
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
      },
    });
  }
  
  // Clients Swiper
  const clientsSwiper = safeQuerySelector('.clients-swiper');
  if (clientsSwiper && typeof Swiper !== 'undefined') {
    new Swiper('.clients-swiper', {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.clients-swiper .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.clients-swiper .swiper-button-next',
        prevEl: '.clients-swiper .swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 50,
        },
      },
      on: {
        slideChange: function() {
          // Pause autoplay on hover
          this.autoplay.stop();
          setTimeout(() => {
            this.autoplay.start();
          }, 3000);
        }
      }
    });
  }
  
  // Gallery Swiper
  const gallerySwiper = safeQuerySelector('.gallery-swiper');
  if (gallerySwiper && typeof Swiper !== 'undefined') {
    new Swiper('.gallery-swiper', {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.gallery-swiper .swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.gallery-swiper .swiper-button-next',
        prevEl: '.gallery-swiper .swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },
    });
  }
  
  // Gallery Main Swiper (for gallery page)
  const galleryMainSwiper = safeQuerySelector('.gallery-main-swiper');
  if (galleryMainSwiper && typeof Swiper !== 'undefined') {
    new Swiper('.gallery-main-swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: '.gallery-main-swiper .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.gallery-main-swiper .swiper-button-next',
        prevEl: '.gallery-main-swiper .swiper-button-prev',
      },
    });
  }
}

// ===== AOS INITIALIZATION =====
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
      delay: 0,
    });
  }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  const anchorLinks = safeQuerySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      e.preventDefault();
      
      const target = safeQuerySelector(href);
      if (target) {
        const headerHeight = safeQuerySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== CONTACT FORM HANDLING =====
function initContactForm() {
  const contactForm = safeQuerySelector('#contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      const organization = formData.get('organization') || '';
      const subject = formData.get('subject') || '';
      const message = formData.get('message') || '';
      
      // Validate required fields
      if (!name || !email || !phone || !subject || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Create email body
      const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone}
${organization ? `Organization: ${organization}` : ''}
Subject: ${subject}

Message:
${message}

---
Sent from SK Enterprises website contact form
      `.trim();
      
      // Create mailto link
      const mailtoLink = `mailto:skenterprises.patna01@gmail.com?subject=${encodeURIComponent('Website Inquiry - ' + subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success message
      setTimeout(() => {
        alert('Thank you for your inquiry! Your email client should open with the pre-filled message. If it doesn\'t open automatically, please email us directly at skenterprises.patna01@gmail.com');
      }, 500);
    });
  }
}

// ===== GALLERY FILTERS =====
function initGalleryFilters() {
  const filterButtons = safeQuerySelectorAll('.filter-btn');
  const galleryItems = safeQuerySelectorAll('.gallery-grid-item');
  
  if (filterButtons.length === 0 || galleryItems.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter gallery items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.classList.remove('hidden');
        } else {
          item.style.display = 'none';
          item.classList.add('hidden');
        }
      });
    });
  });
}

// ===== FAQ FUNCTIONALITY =====
function initFAQ() {
  const faqItems = safeQuerySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });
}

// ===== FLOATING WHATSAPP BUTTON =====
function initWhatsAppButton() {
  // Check if button already exists
  if (safeQuerySelector('.whatsapp-float')) return;
  
  const whatsappBtn = document.createElement('a');
  whatsappBtn.href = 'https://wa.me/918210197286';
  whatsappBtn.target = '_blank';
  whatsappBtn.rel = 'noopener noreferrer';
  whatsappBtn.className = 'whatsapp-float';
  whatsappBtn.setAttribute('aria-label', 'Chat with us on WhatsApp');
  whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
  
  // Add click tracking
  whatsappBtn.addEventListener('click', () => {
    // Analytics tracking could go here
    console.log('WhatsApp button clicked');
  });
  
  document.body.appendChild(whatsappBtn);
}

// ===== FOOTER YEAR UPDATE =====
function updateFooterYear() {
  const yearElements = safeQuerySelectorAll('#currentYear, #year');
  const currentYear = new Date().getFullYear();
  
  yearElements.forEach(element => {
    if (element) {
      element.textContent = currentYear;
    }
  });
}

// ===== LAZY LOADING IMAGES =====
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    const lazyImages = safeQuerySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// ===== PERFORMANCE OPTIMIZATION =====
function initPerformanceOptimizations() {
  // Preload critical resources
  const criticalImages = [
    'assets/img/banner 1.jpg',
    'assets/img/banner 2.jpg',
    'assets/img/banner 3.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initAccessibility() {
  // Skip to main content link
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.className = 'skip-link sr-only';
  skipLink.textContent = 'Skip to main content';
  skipLink.addEventListener('focus', () => skipLink.classList.remove('sr-only'));
  skipLink.addEventListener('blur', () => skipLink.classList.add('sr-only'));
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Keyboard navigation for mobile menu
  const hamburger = safeQuerySelector('#hamburger');
  if (hamburger) {
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
      }
    });
  }
  
  // Focus management for modals/dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close mobile menu on escape
      const navMobile = safeQuerySelector('#navMobile');
      if (navMobile && navMobile.classList.contains('active')) {
        hamburger?.click();
      }
    }
  });
}

// ===== ERROR HANDLING =====
function initErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Could send to analytics service
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to analytics service
  });
}

// ===== MAIN INITIALIZATION =====
function init() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    return;
  }
  
  try {
    // Initialize all functionality
    initMobileNavigation();
    initHeaderScrollBehavior();
    initActiveNavHighlight();
    initSmoothScrolling();
    initContactForm();
    initGalleryFilters();
    initFAQ();
    initWhatsAppButton();
    updateFooterYear();
    initLazyLoading();
    initPerformanceOptimizations();
    initAccessibility();
    initErrorHandling();
    
    // Initialize external libraries when available
    if (typeof Swiper !== 'undefined') {
      initSwipers();
    } else {
      console.warn('Swiper library not loaded');
    }
    
    if (typeof AOS !== 'undefined') {
      initAOS();
    } else {
      console.warn('AOS library not loaded');
    }
    
    console.log('SK Enterprises website initialized successfully');
    
  } catch (error) {
    console.error('Error initializing website:', error);
  }
}

// ===== GLOBAL FUNCTIONS =====
// Make contact form handler available globally for inline event handlers
window.handleContactSubmit = function(e) {
  const contactForm = safeQuerySelector('#contactForm');
  if (contactForm) {
    const event = new Event('submit', { bubbles: true, cancelable: true });
    contactForm.dispatchEvent(event);
  }
  return false;
};

// ===== START INITIALIZATION =====
init();

// ===== EXPORT FOR MODULE SYSTEMS =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    initSwipers,
    initAOS,
    initMobileNavigation,
    initContactForm
  };
}
