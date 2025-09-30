// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===== THEME MANAGEMENT =====
class ThemeManager {
  constructor() {
    this.themeToggle = $('#theme-toggle');
    this.body = document.body;
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.bindEvents();
  }

  bindEvents() {
    this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.body.className = this.body.className.replace(/theme-\w+/, '');
    this.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = $('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors = {
        light: '#ffffff',
        dark: '#0f172a'
      };
      metaThemeColor.setAttribute('content', colors[theme]);
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    
    // Add visual feedback
    this.themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
      this.themeToggle.style.transform = 'scale(1)';
    }, 150);
  }
}

// ===== NAVIGATION MANAGEMENT =====
class NavigationManager {
  constructor() {
    this.header = $('#header');
    this.navToggle = $('#nav-toggle');
    this.navMenu = $('#nav-menu');
    this.navLinks = $$('.nav__link');
    this.backToTop = $('#back-to-top');
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveLink();
  }

  bindEvents() {
    // Mobile menu toggle
    this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());
    
    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });
    
    // Smooth scrolling for anchor links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });
    
    // Header scroll effects
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 16));
    
    // Back to top button
    this.backToTop?.addEventListener('click', () => this.scrollToTop());
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navMenu?.contains(e.target) && !this.navToggle?.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
  }

  toggleMobileMenu() {
    const isOpen = this.navMenu?.classList.contains('show');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.navMenu?.classList.add('show');
    this.navToggle?.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update toggle icon
    const icon = this.navToggle?.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-times';
    }
  }

  closeMobileMenu() {
    this.navMenu?.classList.remove('show');
    this.navToggle?.classList.remove('active');
    document.body.style.overflow = '';
    
    // Update toggle icon
    const icon = this.navToggle?.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-bars';
    }
  }

  handleSmoothScroll(e) {
    const href = e.target.getAttribute('href');
    
    if (href?.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = $(`#${targetId}`);
      
      if (targetElement) {
        const headerHeight = this.header?.offsetHeight || 70;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    // Header background on scroll
    if (scrollY > 50) {
      this.header?.classList.add('scrolled');
    } else {
      this.header?.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (scrollY > 500) {
      this.backToTop?.classList.add('show');
    } else {
      this.backToTop?.classList.remove('show');
    }
    
    // Update active navigation link
    this.updateActiveLink();
  }

  updateActiveLink() {
    const sections = $$('section[id]');
    const headerHeight = this.header?.offsetHeight || 70;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const scrollPosition = window.scrollY;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        // Remove active class from all links
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current section link
        const activeLink = $(`.nav__link[href="#${section.id}"]`);
        activeLink?.classList.add('active');
      }
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  handleKeyboardNavigation(e) {
    // Alt + Arrow keys for section navigation
    if (e.altKey) {
      const sections = Array.from($$('section[id]'));
      const currentSection = sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });
      
      if (currentSection) {
        const currentIndex = sections.indexOf(currentSection);
        let targetIndex;
        
        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
          targetIndex = currentIndex + 1;
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
          targetIndex = currentIndex - 1;
        }
        
        if (targetIndex !== undefined) {
          e.preventDefault();
          const targetSection = sections[targetIndex];
          const headerHeight = this.header?.offsetHeight || 70;
          
          window.scrollTo({
            top: targetSection.offsetTop - headerHeight,
            behavior: 'smooth'
          });
        }
      }
    }
  }
}

// ===== SKILLS ANIMATION =====
class SkillsAnimator {
  constructor() {
    this.skillBars = $$('.skill-progress');
    this.animated = new Set();
    
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Intersection Observer for skills animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSkillBar(entry.target);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    });

    this.skillBars.forEach(bar => observer.observe(bar));
  }

  animateSkillBar(skillBar) {
    if (this.animated.has(skillBar)) return;
    
    const progress = skillBar.dataset.progress;
    if (progress) {
      // Animate width from 0 to target percentage
      skillBar.style.width = '0%';
      
      // Use RAF for smooth animation
      const startTime = performance.now();
      const duration = 1500; // 1.5 seconds
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress_ratio = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress_ratio, 3);
        const currentProgress = easeOut * parseInt(progress);
        
        skillBar.style.width = `${currentProgress}%`;
        
        if (progress_ratio < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
      this.animated.add(skillBar);
    }
  }
}

// ===== PROJECT FILTERING =====
class ProjectFilter {
  constructor() {
    this.filterButtons = $$('.filter-btn');
    this.projectCards = $$('.project-card');
    this.currentFilter = 'all';
    
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleFilter(e));
    });
  }

  handleFilter(e) {
    const filter = e.target.dataset.filter;
    
    if (filter === this.currentFilter) return;
    
    // Update active button
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter projects
    this.filterProjects(filter);
    this.currentFilter = filter;
  }

  filterProjects(filter) {
    this.projectCards.forEach((card, index) => {
      const categories = card.dataset.category?.split(' ') || [];
      const shouldShow = filter === 'all' || categories.includes(filter);
      
      // Add staggered animation delay
      const delay = index * 100;
      
      if (shouldShow) {
        setTimeout(() => {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          // Trigger reflow
          card.offsetHeight;
          
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, delay);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }
}

// ===== FORM VALIDATION =====
class ContactForm {
  constructor() {
    this.form = $('#contact-form');
    this.submitButton = this.form?.querySelector('button[type="submit"]');
    this.successMessage = $('#form-success');
    
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('.form__input');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) return;
    
    this.setLoading(true);
    
    try {
      // Use the actual form action if available
      const formAction = this.form.getAttribute('action');
      
      if (formAction && formAction.includes('formspree.io')) {
        // Submit to Formspree
        const formData = new FormData(this.form);
        const response = await fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          this.showSuccess();
          this.form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } else {
        // Fallback to simulation (for demo purposes)
        await this.simulateSubmission();
        this.showSuccess();
        this.form.reset();
      }
    } catch (error) {
      this.showError('An error occurred. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('.form__input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    }
    
    // Email validation
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }
    
    // Message length validation
    else if (name === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'Message must be at least 10 characters.';
    }
    
    this.displayFieldError(input, isValid, errorMessage);
    return isValid;
  }

  displayFieldError(input, isValid, errorMessage) {
    const errorElement = $(`#${input.name}-error`);
    
    if (errorElement) {
      if (isValid) {
        errorElement.textContent = '';
        input.classList.remove('error');
      } else {
        errorElement.textContent = errorMessage;
        input.classList.add('error');
      }
    }
  }

  clearError(input) {
    const errorElement = $(`#${input.name}-error`);
    if (errorElement && input.value.trim()) {
      errorElement.textContent = '';
      input.classList.remove('error');
    }
  }

  setLoading(loading) {
    if (loading) {
      this.submitButton?.classList.add('loading');
      this.submitButton?.setAttribute('disabled', 'true');
    } else {
      this.submitButton?.classList.remove('loading');
      this.submitButton?.removeAttribute('disabled');
    }
  }

  async simulateSubmission() {
    // Simulate API call delay
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  showSuccess() {
    this.successMessage?.classList.add('show');
    setTimeout(() => {
      this.successMessage?.classList.remove('show');
    }, 5000);
  }

  showError(message) {
    // You could implement a toast notification here
    alert(message);
  }
}

// ===== PIPELINE ANIMATION =====
class PipelineAnimator {
  constructor() {
    this.nodes = $$('.node');
    this.currentNode = 0;
    this.isRunning = false;
    
    this.init();
  }

  init() {
    this.startAnimation();
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAnimation();
      } else {
        this.startAnimation();
      }
    });
  }

  startAnimation() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.animateNodes();
  }

  stopAnimation() {
    this.isRunning = false;
  }

  animateNodes() {
    if (!this.isRunning) return;
    
    // Reset all nodes
    this.nodes.forEach(node => node.classList.remove('active'));
    
    // Activate current node
    if (this.nodes[this.currentNode]) {
      this.nodes[this.currentNode].classList.add('active');
    }
    
    // Move to next node
    this.currentNode = (this.currentNode + 1) % this.nodes.length;
    
    // Schedule next animation
    setTimeout(() => this.animateNodes(), 3000);
  }
}

// ===== CV DOWNLOAD MANAGER =====
class CVDownloadManager {
  constructor() {
    this.downloadButtons = $$('a[download]');
    this.init();
  }

  init() {
    this.downloadButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleDownload(e));
    });
  }

  async handleDownload(e) {
    const button = e.target.closest('a');
    const url = button.href;
    
    try {
      // Check if file exists
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok) {
        // File exists, allow download
        this.trackDownload(url);
  this.showNotification('CV download started...', 'success');
      } else {
        // File doesn't exist
        e.preventDefault();
  this.showNotification('CV temporarily unavailable. Please try again later.', 'error');
      }
    } catch (error) {
      e.preventDefault();
  this.showNotification('Download error. Please try again.', 'error');
    }
  }

  trackDownload(url) {
    // Analytics tracking could go here
    console.log('CV download tracked:', url);
  }

  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: '500',
      zIndex: '1000',
      transition: 'all 0.3s ease',
      transform: 'translateX(100%)',
      backgroundColor: type === 'success' ? '#10b981' : '#ef4444'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimator {
  constructor() {
    this.animatedElements = $$('.animate-on-scroll');
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
}

// ===== PERFORMANCE OPTIMIZER =====
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.prefetchCriticalResources();
  }

  lazyLoadImages() {
    const images = $$('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  prefetchCriticalResources() {
    // Prefetch critical CSS and fonts
    const criticalResources = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap'
    ];

    criticalResources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

// ===== SERVICE WORKER REGISTRATION =====
class ServiceWorkerManager {
  constructor() {
    this.init();
  }

  async init() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration.scope);
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }
}

// ===== APPLICATION INITIALIZATION =====
class Portfolio {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all components
      this.components.themeManager = new ThemeManager();
      this.components.navigationManager = new NavigationManager();
      this.components.skillsAnimator = new SkillsAnimator();
      this.components.projectFilter = new ProjectFilter();
      this.components.contactForm = new ContactForm();
      this.components.pipelineAnimator = new PipelineAnimator();
      this.components.cvDownloadManager = new CVDownloadManager();
      this.components.scrollAnimator = new ScrollAnimator();
      this.components.performanceOptimizer = new PerformanceOptimizer();
      this.components.serviceWorkerManager = new ServiceWorkerManager();

      console.log('Portfolio initialized successfully');
    } catch (error) {
      console.error('Error initializing portfolio:', error);
    }
  }

  // Public API for external access
  getComponent(name) {
    return this.components[name];
  }
}

// ===== GLOBAL ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// ===== INITIALIZE APPLICATION =====
const portfolio = new Portfolio();

// Make portfolio available globally for debugging
window.portfolio = portfolio;