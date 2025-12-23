// Froakie TCG Store - Enhancement Features
// Dark Mode, Animations, Recently Viewed, and UI Enhancements

/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {
  initializeEnhancements();
});

function initializeEnhancements() {
  initDarkMode();
  initScrollEffects();
  initAnimations();
  initScrollToTop();
  initHeaderScroll();
  initQuickActions();
  renderRecentlyViewed();

  console.log('✨ Enhancements loaded successfully!');
}

/* ============================================
   DARK MODE TOGGLE
   ============================================ */
function initDarkMode() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (!document.querySelector('.theme-toggle')) {
    createThemeToggle();
  }

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
  const currentTheme =
    document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);

  showToast(
    `${newTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated!`,
    'info'
  );
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-toggle-icon');
  const text = document.querySelector('.theme-toggle-text');
  if (!icon || !text) return;

  if (theme === 'dark') {
    icon.textContent = '☀️';
    text.textContent = 'Light';
  } else {
    icon.textContent = '🌙';
    text.textContent = 'Dark';
  }
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */
function initScrollEffects() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.product-card').forEach((card) => {
    observer.observe(card);
  });
}

function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.pageYOffset > 100);
  });
}

/* ============================================
   QUICK ACTIONS (NO WISHLIST)
   ============================================ */
function initQuickActions() {
  document.querySelectorAll('.product-card').forEach((card) => {
    if (!card.querySelector('.quick-actions')) {
      addQuickActions(card);
    }
  });
}

function addQuickActions(card) {
  const productImage = card.querySelector('.product-image');
  if (!productImage) return;

  const productId =
    card.dataset.productId ||
    card.querySelector('[data-product-id]')?.dataset.productId;
  if (!productId) return;

  const quickActions = document.createElement('div');
  quickActions.className = 'quick-actions';
  quickActions.innerHTML = `
    <button
      class="quick-action-btn quick-view-btn"
      onclick="quickViewProduct('${productId}')"
      title="Quick view"
    >
      👁️
    </button>
  `;

  productImage.appendChild(quickActions);
}

function quickViewProduct(productId) {
  if (typeof viewProduct === 'function') {
    viewProduct(productId);
  }
}

/* ============================================
   RECENTLY VIEWED PRODUCTS
   ============================================ */
const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_RECENT_ITEMS = 6;

function addToRecentlyViewed(productId) {
  let recent =
    JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];

  productId = String(productId);

  recent = recent.filter((id) => id !== productId);
  recent.unshift(productId);

  if (recent.length > MAX_RECENT_ITEMS) {
    recent = recent.slice(0, MAX_RECENT_ITEMS);
  }

  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recent));
}

function renderRecentlyViewed() {
  const container = document.getElementById('recently-viewed');
  if (!container) return;

  const recent =
    JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];

  if (recent.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = '<h3>Recently Viewed</h3>';

  const grid = document.createElement('div');
  grid.className = 'products-grid';

  recent.forEach((id) => {
    const product = dataManager.getProductById(id);
    if (!product) return;

    const card = document.createElement('div');
    card.className = 'product-card scale-in';
    card.innerHTML = `
      <div class="product-image" onclick="viewProduct('${product.id}')">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h4 class="product-name">${product.name}</h4>
        <div class="product-price">₹${product.price}</div>
      </div>
    `;
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

/* ============================================
   SCROLL TO TOP
   ============================================ */
function initScrollToTop() {
  if (!document.querySelector('.scroll-to-top')) {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.innerHTML = '↑';
    btn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    const btn = document.querySelector('.scroll-to-top');
    if (!btn) return;
    btn.classList.toggle('visible', window.pageYOffset > 300);
  });
}

/* ============================================
   ANIMATIONS
   ============================================ */
function initAnimations() {
  const originalAddToCart = window.quickAddToCart;
  if (!originalAddToCart) return;

  window.quickAddToCart = function (productId) {
    const result = originalAddToCart(productId);
    animateCartIcon();
    return result;
  };
}

function animateCartIcon() {
  const cartLink = document.querySelector('nav a[href="cart.html"]');
  if (!cartLink) return;

  cartLink.classList.add('cart-icon-animated');
  setTimeout(
    () => cartLink.classList.remove('cart-icon-animated'),
    500
  );
}

/* ============================================
   TOAST NOTIFICATIONS
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
   GLOBAL EXPORTS
   ============================================ */
window.quickViewProduct = quickViewProduct;
window.showToast = showToast;
window.addToRecentlyViewed = addToRecentlyViewed;

console.log('🎨 Froakie TCG Enhancements (Recently Viewed enabled) loaded!');
