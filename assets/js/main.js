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
        delay: 0,
        disableOnInteraction: false,
      },
      speed: 5000,
      slidesPerView: 'auto',
      spaceBetween: 30,
      allowTouchMove: true,
      pagination: {
        el: '.clients-swiper .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.clients-swiper .swiper-button-next',
        prevEl: '.clients-swiper .swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 50,
        },
      },
      on: {
        beforeInit: function() {
          // Duplicate slides for seamless loop
          const slides = this.el.querySelectorAll('.swiper-slide');
          slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            this.el.querySelector('.swiper-wrapper').appendChild(clone);
          });
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

// ===== PRODUCT MODAL =====
function initProductModal() {
  const modal = safeQuerySelector('#productModal');
  const modalTitle = safeQuerySelector('#modalTitle');
  const modalBody = safeQuerySelector('#modalBody');
  const modalClose = safeQuerySelector('#modalClose');
  const learnMoreBtns = safeQuerySelectorAll('.learn-more-btn');

  if (!modal || !modalTitle || !modalBody || !modalClose) return;

  // Product data
  const productData = {
    'sanitary-vending': {
      title: 'Sanitary Napkin Vending Machine',
<<<<<<< HEAD
      image: 'assets/img/sanitary_vending.jpg',
=======
      image: 'assets/img/optimized/sanitary_vending.webp',
>>>>>>> 0bea03dea2aeebc423ce7c80d1931501a1b1389c
      description: 'Automated dispensing system with secure storage and easy maintenance for schools, offices, and public spaces.',
      features: [
        'Automated dispensing with coin/token operation',
        'Secure storage with anti-theft protection',
        'Low maintenance and robust build quality',
        'Suitable for high-traffic areas',
        'Easy refilling and monitoring system'
      ],
      applications: ['Schools', 'Offices', 'Hospitals', 'Public Facilities']
    },
    'incinerator': {
      title: 'Sanitary Napkin Disposal (Incinerator)',
      image: 'assets/img/incinerator.jpeg',
      description: 'Safe and hygienic disposal system with minimal emissions, designed for institutional use.',
      features: [
        'Safe disposal with minimal emissions',
        'Compact design with rapid cycle time',
        'Temperature control and safety mechanisms',
        'Easy operation and maintenance',
        'Environmentally compliant design'
      ],
      applications: ['Educational Institutions', 'Healthcare Facilities', 'Corporate Offices', 'Public Buildings']
    },
    'digital-board': {
      title: 'Digital Learning Board',
      image: 'assets/img/digital board.jpeg',
      description: 'Interactive learning solution with multi-touch support and seamless classroom integration.',
      features: [
        'Multi-touch interactive display',
        'High-resolution 4K display quality',
        'Built-in educational software',
        'Wireless connectivity options',
        'Durable and easy to maintain'
      ],
      applications: ['Classrooms', 'Training Centers', 'Conference Rooms', 'Libraries']
    },
    'desktop-laptop': {
      title: 'Desktop & Laptop',
      image: 'assets/img/Desktop & Laptop.jpg',
      description: 'High-performance desktops and laptops designed for reliable computing in education, business, and training environments.',
      features: [
        'Latest-generation processors for fast performance',
        'Full HD / 4K display options with crisp visuals',
        'SSD + HDD storage configurations',
        'Lightweight laptops and powerful desktops available',
        'Comprehensive connectivity: USB, HDMI, Wi-Fi, Bluetooth'
      ],
      applications: [
        'Computer Labs',
        'Corporate Offices',
        'Educational Institutions',
        'Training Centers',
        'Remote Work & Online Learning'
      ]
    },
    'projector': {
      title: 'Educational Projector',
      image: 'assets/img/projector.svg',
      description: 'High-brightness projectors optimized for education and training environments.',
      features: [
        'High brightness (3000+ lumens)',
        'Full HD 1080p resolution',
        'Multiple connectivity options',
        'Long lamp life (10,000+ hours)',
        'Portable and ceiling mount options'
      ],
      applications: ['Auditoriums', 'Lecture Halls', 'Meeting Rooms', 'Training Facilities']
    },
    'ptz-camera': {
      title: 'PTZ Camera for Video Conferencing',
      image: 'assets/img/ptz camera.jpeg',
      description: 'Professional pan-tilt-zoom cameras for high-quality video conferencing and surveillance.',
      features: [
        'Smooth pan-tilt-zoom operation',
        '4K Ultra HD video quality',
        'Auto-tracking and preset positions',
        'Low-light performance',
        'Network connectivity and remote control'
      ],
      applications: ['Conference Rooms', 'Auditoriums', 'Control Rooms', 'Broadcasting']
    },
    'air-conditioner': {
      title: 'Institutional Air Conditioner',
      image: 'assets/img/ac full img.jpg',
      description: 'Energy-efficient cooling solutions designed for institutional and commercial spaces.',
      features: [
        'High energy efficiency rating',
        'Quiet operation technology',
        'Advanced filtration system',
        'Smart temperature control',
        'Professional installation included'
      ],
      applications: ['Offices', 'Server Rooms', 'Meeting Halls', 'Institutional Buildings']
    },
    'led-tv': {
      title: 'Professional LED TV',
      image: 'assets/img/O9FG5V0.jpg',
      description: 'High-quality displays for digital signage, presentations, and institutional communication.',
      features: [
        '4K Ultra HD resolution',
        'Commercial-grade durability',
        'Multiple input connectivity',
        'Wall-mount and stand options',
        'Extended warranty coverage'
      ],
      applications: ['Reception Areas', 'Meeting Rooms', 'Digital Signage', 'Information Displays']
    },
    'chapati-machine': {
      title: 'Automated Roti/Chapati Making Machine',
      image: 'assets/img/chapati_machine.jpeg',
      description: 'High-capacity automated system for consistent quality roti production in institutional kitchens.',
      features: [
        'High output capacity (1000+ rotis/hour)',
        'Consistent size and thickness',
        'Easy cleaning and maintenance',
        'Food-grade stainless steel construction',
        'Automatic temperature control'
      ],
      applications: ['Institutional Canteens', 'Hostels', 'Hospitals', 'Large Kitchens']
    }
  };

  function openModal(productId) {
    const product = productData[productId];
    if (!product) return;

    modalTitle.textContent = product.title;
    modalBody.innerHTML = `
      <div class="modal-product-image">
        <img src="${product.image}" alt="${product.title}" style="width: 100%; max-width: 400px; height: auto; border-radius: var(--radius-lg); margin-bottom: var(--spacing-lg);">
      </div>
      <div class="modal-product-info">
        <p style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-xl);">${product.description}</p>
        
        <div class="product-features" style="margin-bottom: var(--spacing-xl);">
          <h4 style="font-size: var(--font-size-xl); margin-bottom: var(--spacing-md); color: var(--primary-blue);">Key Features:</h4>
          <ul style="list-style: none; padding: 0;">
            ${product.features.map(feature => `
              <li style="display: flex; align-items: center; margin-bottom: var(--spacing-sm);">
                <i class="fas fa-check" style="color: var(--success); margin-right: var(--spacing-sm);"></i>
                ${feature}
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="product-applications" style="margin-bottom: var(--spacing-xl);">
          <h4 style="font-size: var(--font-size-xl); margin-bottom: var(--spacing-md); color: var(--primary-blue);">Applications:</h4>
          <div class="application-tags" style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
            ${product.applications.map(app => `
              <span class="tag" style="background: var(--light-blue); color: var(--primary-blue); padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius-md); font-size: var(--font-size-sm);">${app}</span>
            `).join('')}
          </div>
        </div>

        <div class="modal-actions" style="display: flex; gap: var(--spacing-md); justify-content: center;">
          <a href="contact.html" class="btn btn-primary" style="flex: 1; max-width: 200px;">
            <i class="fas fa-calculator"></i>
            Request Quote
          </a>
          <a href="contact.html" class="btn btn-outline" style="flex: 1; max-width: 200px;">
            <i class="fas fa-phone"></i>
            Contact Us
          </a>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Event listeners
  learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.getAttribute('data-product');
      openModal(productId);
    });
  });

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
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
    initProductModal();
    
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
