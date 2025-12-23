// Store functionality for Pokemon Cards Store
// Handles product display, search, filtering, and add to cart

let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';

// Initialize store on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for dataManager to finish loading products from backend
    await dataManager.refreshProducts();
    
    loadProducts();
    updateCartCount();
    setupEventListeners();
});

// Load and display products
function loadProducts() {
    allProducts = dataManager.getProducts();
    
    // Check if category filter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category && category !== 'all') {
        filterByCategory(category);
    } else {
        // Show random products on homepage
        displayRandomProducts(12);
    }
}

// Display random products (for homepage)
function displayRandomProducts(count = 12) {
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    filteredProducts = shuffled.slice(0, Math.min(count, shuffled.length));
    displayProducts(filteredProducts);
    updateCategoryTitle('Featured Products');
}

// Filter products by category
function filterByCategory(category) {
    currentCategory = category;
    
    if (category === 'all') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(p => p.category === category);
    }
    
    displayProducts(filteredProducts);
    updateCategoryTitle(category);
    
    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url);
    
    // Update category filter dropdown
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.value = category;
    }
}

// Update category title
function updateCategoryTitle(category) {
    const titleElement = document.getElementById('category-title');
    if (!titleElement) return;
    
    const titles = {
        'all': 'All Products',
        'single-cards': 'Single Cards',
        'sealed-bundles': 'Sealed Bundles',
        'booster-boxes': 'Sealed Booster Boxes',
        'collection-boxes': 'Special Collection Boxes'
    };
    
    titleElement.textContent = titles[category] || category;
}

// Display products in grid
function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    const noProducts = document.getElementById('no-products');
    
    if (products.length === 0) {
        grid.style.display = 'none';
        noProducts.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noProducts.style.display = 'none';
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stockStatus = product.stock > 0 ? 'in-stock' : 'out-of-stock';
    const stockText = product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock';
    
    // Calculate savings
    const savings = product.marketPrice - product.price;
    const savingsPercent = ((savings / product.marketPrice) * 100).toFixed(0);
    
    // Use the ID that exists (either id or _id)
    const productId = product.id || product._id;
    
    card.innerHTML = `
        <div class="product-image" onclick="viewProduct('${productId}')" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x420?text=No+Image'">
            ${savings > 0 ? `<div class="savings-badge">Save ${savingsPercent}%</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="price-container">
                <div class="price-row">
                    <span class="price-label">Our Price:</span>
                    <span class="product-price">₹${product.price.toFixed(2)}</span>
                </div>
                <div class="price-row market">
                    <span class="price-label">Market:</span>
                    <span class="market-price">₹${product.marketPrice.toFixed(2)}</span>
                </div>
            </div>
            <div class="stock-status ${stockStatus}">
                <span>${stockText}</span>
            </div>
            <div class="card-actions">
                <button class="btn-add-cart" onclick="quickAddToCart('${productId}')" ${product.stock === 0 ? 'disabled' : ''}>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// View product details - redirect to product detail page
function viewProduct(productId) {
    // Redirect to product detail page
    window.location.href = `product-detail.html?id=${productId}`;
}

// Quick add to cart from product card
function quickAddToCart(productId) {
    // Ensure productId is treated as string for consistency
    const result = dataManager.addToCart(String(productId), 1);
    
    if (result.success) {
        showToast('Added to cart!', 'success');
        updateCartCount();
        loadProducts(); // Refresh to update stock display
    } else {
        showToast(result.message, 'error');
    }
}

// Add to cart from modal (if modal is still used)
function addToCartFromModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    const productId = String(modal.dataset.productId);
    const quantity = parseInt(document.getElementById('modal-quantity').value);
    
    const result = dataManager.addToCart(productId, quantity);
    
    if (result.success) {
        showToast(`Added ${quantity} item(s) to cart!`, 'success');
        updateCartCount();
        loadProducts(); // Refresh to update stock display
        modal.style.display = 'none';
    } else {
        showToast(result.message, 'error');
    }
}

// Toggle wishlist from modal
function toggleWishlistFromModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    const productId = String(modal.dataset.productId);
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.findIndex(id => String(id) === productId);
    
    const wishlistBtn = document.getElementById('modal-wishlist-btn');
    const wishlistIcon = document.getElementById('modal-wishlist-icon');
    
    if (index > -1) {
        wishlist.splice(index, 1);
        wishlistIcon.textContent = '🤍';
        wishlistBtn.textContent = '🤍 Add to Wishlist';
        showToast('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        wishlistIcon.textContent = '❤️';
        wishlistBtn.innerHTML = '<span id="modal-wishlist-icon">❤️</span> In Wishlist';
        showToast('Added to wishlist!', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Update cart count in header
function updateCartCount() {
    const count = dataManager.getCartItemCount();
    document.getElementById('cart-count').textContent = count;
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    // If searching, search within current category or all products
    const searchBase = currentCategory === 'all' ? allProducts : 
                       allProducts.filter(p => p.category === currentCategory);
    
    filteredProducts = searchBase.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
}

// Sort products
function sortProducts() {
    const sortValue = document.getElementById('sort-select').value;
    
    switch(sortValue) {
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'stock-desc':
            filteredProducts.sort((a, b) => b.stock - a.stock);
            break;
    }
    
    displayProducts(filteredProducts);
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Search
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchProducts);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
    
    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProducts);
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterByCategory(this.value);
        });
    }
    
    // Modal (if exists)
    const modal = document.getElementById('product-modal');
    if (modal) {
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        const modalAddToCart = document.getElementById('modal-add-to-cart');
        if (modalAddToCart) {
            modalAddToCart.addEventListener('click', addToCartFromModal);
        }
    }
}
