// Froakie TCG Store - Enhancement Features
// Dark Mode, Wishlist, Animations, and Interactive Features

/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    initializeEnhancements();
});

function initializeEnhancements() {
    // Initialize all enhancement features
    initDarkMode();
    initScrollEffects();
    initWishlist();
    initAnimations();
    initScrollToTop();
    initHeaderScroll();
    initQuickActions();
    
    console.log('✨ Enhancements loaded successfully!');
}

/* ============================================
   DARK MODE TOGGLE
   ============================================ */
function initDarkMode() {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Create dark mode toggle button if it doesn't exist
    if (!document.querySelector('.theme-toggle')) {
        createThemeToggle();
    }
    
    // Add event listener to toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        updateThemeIcon(currentTheme);
    }
}

function createThemeToggle() {
    const nav = document.querySelector('nav ul');
    if (!nav) return;
    
    const themeToggleLi = document.createElement('li');
    themeToggleLi.innerHTML = `
        <button class="theme-toggle" aria-label="Toggle dark mode">
            <span class="theme-toggle-icon">🌙</span>
            <span class="theme-toggle-text">Dark</span>
        </button>
    `;
    nav.appendChild(themeToggleLi);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Show toast notification
    showToast(`${newTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated!`, 'info');
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle-icon');
    const text = document.querySelector('.theme-toggle-text');
    
    if (icon && text) {
        if (theme === 'dark') {
            icon.textContent = '☀️';
            text.textContent = 'Light';
        } else {
            icon.textContent = '🌙';
            text.textContent = 'Dark';
        }
    }
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */
function initScrollEffects() {
    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* ============================================
   WISHLIST FUNCTIONALITY
   ============================================ */
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function initWishlist() {
    updateWishlistBadge();
    createWishlistBadge();
}

function createWishlistBadge() {
    if (document.querySelector('.wishlist-badge')) return;
    
    const badge = document.createElement('div');
    badge.className = 'wishlist-badge';
    badge.innerHTML = `
        ❤️
        <span class="wishlist-count">${wishlist.length}</span>
    `;
    badge.addEventListener('click', showWishlist);
    document.body.appendChild(badge);
}

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        showToast('Added to wishlist! ❤️', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    updateWishlistButtons();
}

function updateWishlistBadge() {
    const badge = document.querySelector('.wishlist-count');
    if (badge) {
        badge.textContent = wishlist.length;
        badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        if (wishlist.includes(productId)) {
            btn.classList.add('active');
            btn.innerHTML = '❤️';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '🤍';
        }
    });
}

function showWishlist() {
    if (wishlist.length === 0) {
        showToast('Your wishlist is empty', 'info');
        return;
    }
    
    // Redirect to store page with wishlist filter
    window.location.href = 'index.html?wishlist=true';
}

/* ============================================
   QUICK ACTIONS
   ============================================ */
function initQuickActions() {
    // Add quick action buttons to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        if (!card.querySelector('.quick-actions')) {
            addQuickActions(card);
        }
    });
}

function addQuickActions(card) {
    const productImage = card.querySelector('.product-image');
    if (!productImage) return;
    
    const productId = card.dataset.productId || card.querySelector('[data-product-id]')?.dataset.productId;
    if (!productId) return;
    
    const quickActions = document.createElement('div');
    quickActions.className = 'quick-actions';
    quickActions.innerHTML = `
        <button class="quick-action-btn wishlist-btn" data-product-id="${productId}" 
                onclick="toggleWishlist('${productId}')" title="Add to wishlist">
            ${wishlist.includes(productId) ? '❤️' : '🤍'}
        </button>
        <button class="quick-action-btn quick-view-btn" data-product-id="${productId}" 
                onclick="quickViewProduct('${productId}')" title="Quick view">
            👁️
        </button>
    `;
    
    productImage.appendChild(quickActions);
}

function quickViewProduct(productId) {
    // Trigger the existing viewProduct function
    if (typeof viewProduct === 'function') {
        viewProduct(productId);
    }
}

/* ============================================
   SCROLL TO TOP BUTTON
   ============================================ */
function initScrollToTop() {
    // Create scroll to top button if it doesn't exist
    if (!document.querySelector('.scroll-to-top')) {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.addEventListener('click', scrollToTop);
        document.body.appendChild(scrollBtn);
    }
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        const scrollBtn = document.querySelector('.scroll-to-top');
        if (scrollBtn) {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/* ============================================
   ANIMATIONS
   ============================================ */
function initAnimations() {
    // Animate cart icon when items are added
    const originalAddToCart = window.quickAddToCart;
    if (originalAddToCart) {
        window.quickAddToCart = function(productId) {
            const result = originalAddToCart(productId);
            animateCartIcon();
            return result;
        };
    }
}

function animateCartIcon() {
    const cartLink = document.querySelector('nav a[href="cart.html"]');
    if (cartLink) {
        cartLink.classList.add('cart-icon-animated');
        setTimeout(() => {
            cartLink.classList.remove('cart-icon-animated');
        }, 500);
    }
}

/* ============================================
   LOADING STATES
   ============================================ */
function showLoadingOverlay() {
    if (document.querySelector('.loading-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

/* ============================================
   SKELETON LOADING
   ============================================ */
function showSkeletonCards(count = 6) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton skeleton-card';
        grid.appendChild(skeleton);
    }
}

/* ============================================
   ENHANCED TOAST NOTIFICATIONS
   ============================================ */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast') || createToast();
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function createToast() {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
    return toast;
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
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
}

/* ============================================
   EXPORT FUNCTIONS FOR GLOBAL USE
   ============================================ */
window.toggleWishlist = toggleWishlist;
window.quickViewProduct = quickViewProduct;
window.showToast = showToast;
window.showLoadingOverlay = showLoadingOverlay;
window.hideLoadingOverlay = hideLoadingOverlay;
window.showSkeletonCards = showSkeletonCards;

console.log('🎨 Froakie TCG Enhancements v1.0 loaded!');
