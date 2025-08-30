// Modern Portfolio JavaScript - Advanced Interactions & Animations

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeCursor();
    initializeScrollEffects();
    initializeTypingAnimation();
    initializeCounters();
    initializeSkillBars();
    initializeProjectFilters();
    initializeContactForm();
    initializeParallax();
    initializeIntersectionObserver();
    initializeCVDownload();
});

// Custom Cursor Effect
function initializeCursor() {
    const cursor = document.querySelector('.cursor-follower');
    const cursorDot = document.querySelector('.cursor-dot');
    
    if (!cursor || !cursorDot) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        // Smooth cursor follower
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
        
        // Instant dot
        dotX = mouseX;
        dotY = mouseY;
        cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(1.5)';
            cursor.style.opacity = '0.6';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
            cursor.style.opacity = '0.3';
        });
    });
}

// Navigation Effects
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

// Typing Animation
function initializeTypingAnimation() {
    const subtitleText = document.querySelector('.subtitle-text');
    const cursor = document.querySelector('.typing-cursor');
    
    if (!subtitleText || !cursor) return;
    
    const texts = [
        'DevOps & Cloud Engineer',
        'Infrastructure Automation Expert',
        'Kubernetes Specialist',
        'AWS Solutions Architect',
        'CI/CD Pipeline Builder'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            subtitleText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            subtitleText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before starting new text
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    typeWriter();
}

// Animated Counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (target === 3 ? '+' : target === 50 ? '+' : '');
            }
        };
        
        updateCounter();
    };
    
    // Trigger counters when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Skill Bar Animations
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Project Filtering
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact Form
function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon i');
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateForm(data)) return;
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        btnIcon.className = 'fas fa-spinner fa-spin';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state
            btnText.textContent = 'Message Sent!';
            btnIcon.className = 'fas fa-check';
            submitBtn.style.background = 'var(--success-color)';
            
            // Reset form
            form.reset();
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset button after delay
            setTimeout(() => {
                btnText.textContent = 'Send Message';
                btnIcon.className = 'fas fa-paper-plane';
                submitBtn.style.background = 'var(--gradient-primary)';
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            // Error state
            btnText.textContent = 'Try Again';
            btnIcon.className = 'fas fa-exclamation-triangle';
            submitBtn.style.background = 'var(--error-color)';
            showNotification('Failed to send message. Please try again.', 'error');
            
            setTimeout(() => {
                btnText.textContent = 'Send Message';
                btnIcon.className = 'fas fa-paper-plane';
                submitBtn.style.background = 'var(--gradient-primary)';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}

// Form Validation
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject.trim().length < 3) {
        errors.push('Please enter a subject');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('. '), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 20px',
        borderRadius: '12px',
        background: type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--primary-color)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: '10000',
        boxShadow: 'var(--shadow-xl)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll Effects
function initializeScrollEffects() {
    // Smooth scrolling for anchor links (robust fallback to top)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // If href is just '#' or refers to top/home, scroll to top
            if (!href || href === '#' || href === '#top' || href === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Fallback: if target not found, scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
    
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-arrow');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        // Hide scroll indicator after scrolling
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }
}

// Parallax Effects
function initializeParallax() {
    const shapes = document.querySelectorAll('.shape');
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
        
        floatingIcons.forEach((icon, index) => {
            const speed = (index + 1) * 0.05;
            icon.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Intersection Observer for Animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Special handling for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
                
                // Special handling for skill categories
                if (entry.target.classList.contains('skill-category')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
                
                // Special handling for project cards
                if (entry.target.classList.contains('project-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
                
                // Special handling for contact sections
                if (entry.target.classList.contains('contact-info') || entry.target.classList.contains('contact-form-container')) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 200);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .skill-category, 
        .project-card, 
        .timeline-item, 
        .contact-info, 
        .contact-form-container,
        .text-reveal
    `);
    
    animateElements.forEach(el => observer.observe(el));
}

// Initialize Basic Animations
function initializeAnimations() {
    // Add loading class to body
    document.body.classList.add('loaded');
    
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Animate floating icons
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        }, 1000 + (index * 200));
    });
}

// Project Card Interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
        
        // Animate overlay
        const overlay = this.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        
        // Hide overlay
        const overlay = this.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
    
    // Arrow key navigation for sections
    if (e.altKey) {
        const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];
        const currentHash = window.location.hash.slice(1) || 'home';
        const currentIndex = sections.indexOf(currentHash);
        
        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            e.preventDefault();
            document.querySelector(`#${sections[currentIndex + 1]}`).scrollIntoView({
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            document.querySelector(`#${sections[currentIndex - 1]}`).scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`🚀 Portfolio loaded in ${Math.round(loadTime)}ms`);
    
    // Track Core Web Vitals
    if ('web-vital' in window) {
        // This would integrate with actual web vitals library
        console.log('📊 Tracking Core Web Vitals');
    }
});

// Easter Eggs
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Activate matrix effect
        document.body.style.filter = 'hue-rotate(180deg) saturate(200%)';
        showNotification('🎉 Konami Code activated! You found the easter egg!', 'success');
        
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 5000);
    }
});

// Console signature
console.log(`
🎨 Portfolio Design System
━━━━━━━━━━━━━━━━━━━━━━━━━
👨‍💻 Developer: Otniel Tamini
🚀 Role: DevOps & Cloud Engineer
💼 Portfolio: Modern & Interactive
🎯 Purpose: Showcase technical skills
📧 Contact: otnieltamini@gmail.com
━━━━━━━━━━━━━━━━━━━━━━━━━
Built with ❤️ and modern web technologies
`);

// Theme toggler (for future implementation)
function initializeThemeToggler() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// CV Download functionality
function initializeCVDownload() {
    const cvLinks = document.querySelectorAll('a[href*="cv.pdf"], a[href*="CV.pdf"]');
    
    cvLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if file exists
            fetch(this.href, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        showNotification('📄 CV download started! Thank you for your interest.', 'success');
                        // Track download analytics if needed
                        trackCVDownload();
                    } else {
                        e.preventDefault();
                        showNotification('📋 CV will be available soon. Please contact me directly for now.', 'info');
                    }
                })
                .catch(() => {
                    e.preventDefault();
                    showNotification('📋 CV will be available soon. Please use the contact form to reach out.', 'info');
                });
        });
        
        // Add hover effect to CV buttons
        link.addEventListener('mouseenter', function() {
            if (this.classList.contains('cv-download-btn') || this.classList.contains('nav-cv')) {
                this.style.transform += ' scale(1.05)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (this.classList.contains('cv-download-btn') || this.classList.contains('nav-cv')) {
                this.style.transform = this.style.transform.replace(' scale(1.05)', '');
            }
        });
    });
}

// Track CV downloads (for analytics)
function trackCVDownload() {
    const downloadTime = new Date().toISOString();
    console.log(`📊 CV downloaded at: ${downloadTime}`);
    
    // You can integrate with analytics services here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cv_download', {
            'event_category': 'engagement',
            'event_label': 'CV Download',
            'value': 1
        });
    }
}
