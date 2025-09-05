// Purchase URL constant
const PURCHASE_URL = 'https://eletronicos-lp.pay.yampi.com.br/r/8MK259K7AJ';

// Mobile-optimized purchase function - FIXED VERSION
function redirectToPurchase(button) {
    console.log('redirectToPurchase called with button:', button);
    
    // Prevent double clicks
    if (button && button.disabled) {
        console.log('Button already disabled, preventing double click');
        return;
    }
    
    console.log('Purchase button clicked:', button ? button.textContent : 'no button reference');
    
    // Disable button temporarily to prevent double clicks
    if (button) {
        button.disabled = true;
        button.style.opacity = '0.7';
    }
    
    // Add haptic feedback on mobile
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
    
    // Visual feedback
    if (button) {
        button.style.transform = 'scale(0.95)';
        button.style.background = '#16A34A';
    }
    
    // Redirect to purchase page
    console.log('Redirecting to:', PURCHASE_URL);
    
    try {
        // Multiple fallback methods for redirect
        if (window.open(PURCHASE_URL, '_blank')) {
            console.log('Window.open successful');
        } else {
            // Fallback 1: Direct location assignment
            window.location.href = PURCHASE_URL;
            console.log('Using location.href fallback');
        }
    } catch (error) {
        console.error('Redirect error:', error);
        // Fallback 2: Create temporary link and click it
        const link = document.createElement('a');
        link.href = PURCHASE_URL;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('Using link click fallback');
    }
    
    // Reset button state after delay
    setTimeout(() => {
        if (button) {
            button.style.transform = 'scale(1)';
            button.style.background = '#22C55E';
            button.style.opacity = '1';
            button.disabled = false;
        }
    }, 1000);
}

// Global click handler for purchase buttons - CRITICAL FIX
function handlePurchaseClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Global purchase click handler triggered');
    console.log('Event target:', event.target);
    console.log('Event target classes:', event.target.className);
    
    const button = event.target;
    redirectToPurchase(button);
}

// Smooth scroll to checkout section (mobile optimized)
function scrollToCheckout() {
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) {
        // Use smooth scrolling with mobile-friendly offset
        const offsetTop = checkoutSection.offsetTop - 20;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Mobile-optimized counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    let hasAnimated = false;
    
    function updateCounter() {
        if (hasAnimated) return;
        
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
        } else {
            element.textContent = target;
            hasAnimated = true;
        }
        
        if (start < target) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// Intersection Observer for mobile-optimized animations
function createMobileObserver() {
    // More generous threshold for mobile
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate statistics
                if (entry.target.classList.contains('stat-number')) {
                    const target = parseInt(entry.target.dataset.target);
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
                
                // Animate benefit cards
                if (entry.target.classList.contains('benefit-card')) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
                
                // Animate testimonial cards
                if (entry.target.classList.contains('testimonial-card')) {
                    entry.target.classList.add('animate-left');
                    observer.unobserve(entry.target);
                }
                
                // Animate feature items
                if (entry.target.classList.contains('feature-item')) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
    
    document.querySelectorAll('.benefit-card').forEach(card => {
        observer.observe(card);
    });
    
    document.querySelectorAll('.testimonial-card').forEach(card => {
        observer.observe(card);
    });
    
    document.querySelectorAll('.feature-item').forEach(item => {
        observer.observe(item);
    });
}

// Mobile-optimized touch interactions
function addTouchInteractions() {
    // Enhanced button interactions
    document.querySelectorAll('.btn-cta').forEach(button => {
        // Touch start effect
        button.addEventListener('touchstart', (e) => {
            button.style.transform = 'scale(0.98)';
            button.style.opacity = '0.9';
        }, { passive: true });
        
        // Touch end effect
        button.addEventListener('touchend', (e) => {
            setTimeout(() => {
                if (!button.disabled) {
                    button.style.transform = 'scale(1)';
                    button.style.opacity = '1';
                }
            }, 100);
        }, { passive: true });
        
        // Touch cancel (if user drags away)
        button.addEventListener('touchcancel', (e) => {
            if (!button.disabled) {
                button.style.transform = 'scale(1)';
                button.style.opacity = '1';
            }
        }, { passive: true });
    });
    
    // Card hover effects on touch devices
    document.querySelectorAll('.benefit-card, .testimonial-card').forEach(card => {
        card.addEventListener('touchstart', (e) => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        }, { passive: true });
        
        card.addEventListener('touchend', (e) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            }, 200);
        }, { passive: true });
    });
}

// Performance optimization for mobile
function optimizeForMobile() {
    // Debounced scroll handler
    let scrollTimeout;
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                // Minimal scroll effects for better performance
                const scrolled = window.pageYOffset;
                
                // Only apply parallax on larger screens
                if (window.innerWidth > 768) {
                    const hero = document.querySelector('.hero');
                    if (hero && scrolled < window.innerHeight) {
                        const rate = scrolled * -0.2;
                        hero.style.transform = `translateY(${rate}px)`;
                    }
                }
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
    });
}

// Mobile-specific price highlighting
function addMobilePriceEffects() {
    const priceElements = document.querySelectorAll('.price-main');
    
    priceElements.forEach(price => {
        // Touch-friendly price interaction
        price.addEventListener('touchstart', (e) => {
            price.style.transform = 'scale(1.05)';
            price.style.textShadow = '0 0 15px rgba(34, 197, 94, 0.6)';
        }, { passive: true });
        
        price.addEventListener('touchend', (e) => {
            setTimeout(() => {
                price.style.transform = 'scale(1)';
                price.style.textShadow = '0 0 10px rgba(34, 197, 94, 0.3)';
            }, 200);
        }, { passive: true });
    });
}

// Mobile urgency timer with better performance
function addMobileUrgencyTimer() {
    const urgencyText = document.querySelector('.urgency-text');
    if (urgencyText) {
        let isVisible = true;
        
        // Use CSS animations instead of JavaScript for better performance
        urgencyText.style.animation = 'pulse 2s infinite';
        
        // Optional: Add occasional color change
        setInterval(() => {
            if (isVisible) {
                urgencyText.style.background = '#DC2626';
            } else {
                urgencyText.style.background = '#EF4444';
            }
            isVisible = !isVisible;
        }, 3000);
    }
}

// Handle orientation change on mobile
function handleOrientationChange() {
    window.addEventListener('orientationchange', () => {
        // Small delay to ensure the orientation change is complete
        setTimeout(() => {
            // Recalculate viewport height for mobile browsers
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // Refresh any height-dependent calculations
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });
}

// Improved mobile viewport handling
function setMobileViewport() {
    // Set custom viewport height property for mobile browsers
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update on resize
    window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, { passive: true });
}

// Enhanced button setup for mobile - CRITICAL FIX
function setupMobileButtons() {
    console.log('Setting up mobile buttons...');
    
    // Find all purchase buttons
    const buttons = document.querySelectorAll('.btn-cta, [onclick*="redirectToPurchase"]');
    console.log('Found buttons:', buttons.length);
    
    buttons.forEach((button, index) => {
        console.log(`Setting up button ${index + 1}:`, button.textContent.trim());
        
        // Remove any existing onclick attributes to avoid conflicts
        button.removeAttribute('onclick');
        
        // Ensure buttons are properly configured for mobile
        button.style.touchAction = 'manipulation';
        button.style.userSelect = 'none';
        button.style.webkitUserSelect = 'none';
        button.style.webkitTapHighlightColor = 'transparent';
        button.style.cursor = 'pointer';
        button.style.pointerEvents = 'auto';
        
        // Remove any existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add the click event listener to the new button
        newButton.addEventListener('click', handlePurchaseClick, { passive: false });
        
        // Also add touch event for mobile
        newButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Touch end on button:', newButton.textContent.trim());
            handlePurchaseClick(e);
        }, { passive: false });
        
        console.log(`Button ${index + 1} configured successfully`);
    });
    
    // Also add global event delegation as fallback
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-cta') || 
            e.target.textContent.includes('COMPRAR AGORA') ||
            e.target.textContent.includes('DESENVOLVER INTELIGÊNCIA')) {
            
            e.preventDefault();
            e.stopPropagation();
            console.log('Global event delegation triggered');
            handlePurchaseClick(e);
        }
    });
    
    console.log('Mobile buttons setup completed');
}

// Preload critical resources
function preloadResources() {
    // Preload the purchase page
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://eletronicos-lp.pay.yampi.com.br';
    document.head.appendChild(link);
}

// Enhanced scroll-to-top functionality for mobile
function addScrollToTop() {
    let scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #22C55E;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        font-weight: bold;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'scale(1)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'scale(0)';
        }
    }, { passive: true });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Mobile-optimized app initializing...');
    
    // Set up mobile viewport
    setMobileViewport();
    
    // Handle orientation changes
    handleOrientationChange();
    
    // CRITICAL: Setup mobile buttons first
    setupMobileButtons();
    
    // Initialize intersection observer
    createMobileObserver();
    
    // Add mobile touch interactions
    addTouchInteractions();
    
    // Optimize for mobile performance
    optimizeForMobile();
    
    // Add mobile-specific effects
    addMobilePriceEffects();
    addMobileUrgencyTimer();
    
    // Add scroll to top
    addScrollToTop();
    
    // Preload resources
    preloadResources();
    
    // Add smooth entrance animations with mobile-friendly delays
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-image');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 300);
    
    // Double-check button setup after everything is loaded
    setTimeout(() => {
        const allButtons = document.querySelectorAll('.btn-cta');
        console.log('Final button check - found buttons:', allButtons.length);
        
        allButtons.forEach((btn, idx) => {
            console.log(`Final check button ${idx + 1}:`, btn.textContent.trim());
            
            // Add additional onclick as ultimate fallback
            btn.onclick = function(e) {
                e.preventDefault();
                console.log('Fallback onclick triggered for:', this.textContent.trim());
                redirectToPurchase(this);
                return false;
            };
        });
        
        console.log('Mobile-optimized app initialized successfully');
    }, 1000);
});

// Add CSS for mobile optimizations
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    /* Mobile-specific CSS enhancements */
    .hero-title,
    .hero-subtitle,
    .hero-image {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease-out;
    }
    
    /* Scroll to top button enhancements */
    .scroll-to-top:active {
        transform: scale(0.95) !important;
    }
    
    /* Better mobile card transitions */
    .benefit-card,
    .testimonial-card {
        transition: all 0.3s ease-out;
    }
    
    /* Mobile-optimized focus states */
    @media (max-width: 768px) {
        .btn-cta:focus {
            outline: 3px solid rgba(34, 197, 94, 0.5);
            outline-offset: 3px;
        }
    }
    
    /* Prevent text selection on interactive elements */
    .btn-cta,
    .price-main,
    .urgency-text {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    /* Better mobile tap targets */
    @media (max-width: 768px) {
        .feature-item {
            min-height: 60px;
            padding: 16px;
        }
        
        .testimonial-card {
            padding: 20px;
            margin-bottom: 4px;
        }
        
        .benefit-card {
            padding: 24px;
            margin-bottom: 4px;
        }
    }
    
    /* Optimize text rendering on mobile */
    body {
        text-rendering: optimizeSpeed;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    
    /* Enhanced button styles for better mobile interaction */
    .btn-cta {
        cursor: pointer !important;
        pointer-events: auto !important;
        z-index: 100 !important;
        position: relative !important;
        touch-action: manipulation !important;
    }
    
    .btn-cta:hover {
        opacity: 0.9;
    }
    
    .btn-cta:active {
        transform: scale(0.95) !important;
        background: #16A34A !important;
    }
    
    .btn-cta:disabled {
        opacity: 0.7;
        pointer-events: none;
    }
`;

document.head.appendChild(mobileStyles);