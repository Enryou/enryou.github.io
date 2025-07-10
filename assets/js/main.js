// Main JavaScript file for Sam Kafai's Cybersecurity Portfolio

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

// Initialize all portfolio features
function initializePortfolio() {
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initCounters();
    initContactForm();
    initMatrixRain();
    initThemeEffects();
}

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
        
        // Add hover effect
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px var(--cyber-blue)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.textShadow = '';
            }
        });
    });
    
    // Mobile menu toggle (if needed)
    initMobileMenu();
}

// Mobile menu functionality
function initMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    // Create hamburger menu for mobile
    if (window.innerWidth <= 768) {
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '0';
        hamburger.style.cssText = `
            display: none;
            color: var(--cyber-blue);
            font-size: 1.5rem;
            cursor: pointer;
            @media (max-width: 768px) {
                display: block;
            }
        `;
        
        navbar.querySelector('.container').appendChild(hamburger);
        
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-active');
        });
    }
}

// Typing effect for hero section
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    const words = text.split(' ');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect after a delay
    setTimeout(typeEffect, 1000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .skill-category,
        .project-card,
        .cert-card,
        .stat-item,
        .link-card,
        .contact-card,
        .social-card
    `);
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Counter animations
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const current = parseInt(element.textContent) || 0;
        const increment = target / 100;
        
        if (current < target) {
            element.textContent = Math.ceil(current + increment);
            setTimeout(() => countUp(element), 20);
        } else {
            element.textContent = target;
        }
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formValues = Object.fromEntries(formData);
        
        // Simulate form submission
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        
        // In a real implementation, you would send the data to a server
        // Example: sendToServer(formValues);
    });
    
    // Form validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Form validation functions
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearFieldError(e);
    
    // Check required fields
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--cyber-red);
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = 'var(--cyber-red)';
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '';
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--cyber-green)' : 'var(--cyber-blue)'};
        color: var(--primary-dark);
        border-radius: 5px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Matrix rain effect enhancement
function initMatrixRain() {
    const matrixElements = document.querySelectorAll('.matrix-rain');
    
    matrixElements.forEach(element => {
        // Create matrix characters
        const chars = '01¢§¶®™´≠Ø±≥µ∑πªΩø¡ƒ∆» ÀÃÕŒœ“’ÿ€ﬁﬂ‡·‚‰ÊËÈÍÎÏÌÔÚÛ';
        const matrixChars = chars.split('');
        
        // Create falling characters
        for (let i = 0; i < 20; i++) {
            const span = document.createElement('span');
            span.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            span.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -20px;
                color: var(--cyber-green);
                font-family: var(--font-mono);
                font-size: ${Math.random() * 16 + 12}px;
                animation: matrix-fall ${Math.random() * 3 + 2}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
                opacity: ${Math.random() * 0.7 + 0.3};
            `;
            element.appendChild(span);
        }
    });
    
    // Add matrix fall animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrix-fall {
            0% { transform: translateY(-20px); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Theme effects and interactions
function initThemeEffects() {
    // Cyber glitch effect on hover
    const glitchElements = document.querySelectorAll('.hero-title, .page-title, .section-title');
    
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s ease-in-out';
        });
        
        element.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
    
    // Add glitch animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
        }
    `;
    document.head.appendChild(style);
    
    // Particle effect on click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cta-button')) {
            createParticleEffect(e.clientX, e.clientY);
        }
    });
}

// Particle effect function
function createParticleEffect(x, y) {
    const colors = ['var(--cyber-blue)', 'var(--cyber-green)', 'var(--cyber-purple)'];
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 100;
        const lifetime = 1000;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { 
                transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: lifetime,
            easing: 'ease-out'
        }).addEventListener('finish', () => {
            particle.remove();
        });
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, var(--cyber-blue), var(--cyber-green));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress if on a long page
if (document.body.offsetHeight > window.innerHeight * 2) {
    initScrollProgress();
}

// Performance optimization - lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
initLazyLoading();

// Console easter egg
console.log(`
    TPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPW
    Q  _____                   _  __        __       _                              Q
    Q / ____|                 | |/ /       / _|     (_)                             Q
    Q| (___   __ _ _ __ ___   | ' / __ _ _| |_ __ _  _                              Q
    Q \___ \ / _' | '_ ' _ \  |  < / _' |  _/ _' | |                               Q
    Q ____) | (_| | | | | | | | . \ (_| | || (_| | |                               Q
    Q|_____/ \__,_|_| |_| |_| |_|\_\__,_|_| \__,_|_|                               Q
    Q                                                                               Q
    Q                    CyberSecurity Professional                                 Q
    Q                                                                               Q
    Q  Welcome to my portfolio! If you're reading this, you might be interested     Q
    Q  in cybersecurity too. Feel free to explore the code and reach out if you'd  Q
    Q  like to collaborate on security projects.                                    Q
    Q                                                                               Q
    Q  Contact: sam.kafai@gmail.com                                                 Q
    Q  GitHub: https://github.com/Enryou                                           Q
    Q                                                                               Q
    ZPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP]
`);

// Export functions for potential use in other scripts
window.PortfolioUtils = {
    showNotification,
    createParticleEffect,
    initTypingEffect,
    initScrollAnimations
};