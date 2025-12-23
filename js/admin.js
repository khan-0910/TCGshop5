// Admin Panel functionality for Pokemon Cards Store
// Handles product management (CRUD operations) and order viewing

let currentEditingId = null;
let currentImageData = null;
let allOrders = [];
let currentSection = 'products';

// Initialize admin panel on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for dataManager to finish loading products from backend
    await dataManager.refreshProducts();
    
    loadProductsTable();
    updateStatistics();
    updateCartCount();
});

// Show section (Products or Orders)
function showSection(section) {
    currentSection = section;
    
    // Update tabs
    document.getElementById('products-tab').style.background = section === 'products' ? 'var(--primary-color)' : '#95a5a6';
    document.getElementById('orders-tab').style.background = section === 'orders' ? 'var(--primary-color)' : '#95a5a6';
    
    // Update title
    document.getElementById('section-title').textContent = section === 'products' ? 'Product Management' : 'Orders Management';
    
    // Show/hide sections
    document.getElementById('products-section').style.display = section === 'products' ? 'block' : 'none';
    document.getElementById('orders-section').style.display = section === 'orders' ? 'block' : 'none';
    
    // Show/hide add product button
    document.getElementById('add-product-btn').style.display = section === 'products' ? 'inline-block' : 'none';
    
    // Load orders if switching to orders section
    if (section === 'orders') {
        loadOrders();
    }
}

// ==================== PRODUCTS SECTION ====================

// Load products into table
async function loadProductsTable() {
    const products = dataManager.getProducts();
    const tbody = document.getElementById('products-table-body');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No products found. Add your first product!</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const row = createProductRow(product);
        tbody.appendChild(row);
    });
}

// Create table row for product
function createProductRow(product) {
    const row = document.createElement('tr');
    
    const stockClass = product.stock === 0 ? 'stock-out' : 
                       product.stock < 5 ? 'stock-low' : 'stock-good';
    
    const savings = product.marketPrice - product.price;
    const savingsPercent = ((savings / product.marketPrice) * 100).toFixed(0);
    const savingsBadge = savings > 0 ? 
        `<span style="color: var(--success-color); font-size: 0.85rem;">(${savingsPercent}% off)</span>` : '';
    
    row.innerHTML = `
        <td>
            <div class="product-image-cell">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/80?text=No+Image'">
            </div>
        </td>
        <td class="product-name-cell">${product.name}</td>
        <td class="price-cell">₹${product.price.toFixed(2)} ${savingsBadge}</td>
        <td class="market-price-cell">₹${product.marketPrice.toFixed(2)}</td>
        <td class="${stockClass}">${product.stock}</td>
        <td>
            <a href="${product.marketUrl}" target="_blank" class="market-link">
                ${product.marketSource} ↗
            </a>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn-edit" onclick="editProduct('${product._id || product.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteProduct('${product._id || product.id}')">Delete</button>
            </div>
        </td>
    `;
    
    return row;
}

// Show add product form
function showAddProductForm() {
    currentEditingId = null;
    currentImageData = null;
    document.getElementById('form-title').textContent = 'Add New Product';
    document.getElementById('product-form-element').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('image-preview').innerHTML = '';
    document.getElementById('image-preview').classList.add('empty');
    document.getElementById('product-form').style.display = 'block';
    document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
}

// Edit product
function editProduct(productId) {
    const product = dataManager.getProductById(productId);
    if (!product) return;
    
    currentEditingId = product._id || product.id;
    currentImageData = product.image;
    
    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('product-id').value = currentEditingId;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-market-price').value = product.marketPrice;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-market-url').value = product.marketUrl;
    document.getElementById('product-market-source').value = product.marketSource;
    document.getElementById('product-category').value = product.category || 'single-cards';
    document.getElementById('product-image-url').value = product.image.startsWith('http') ? product.image : '';
    
    // Show image preview
    const preview = document.getElementById('image-preview');
    preview.innerHTML = `<img src="${product.image}" alt="Preview">`;
    preview.classList.remove('empty');
    
    document.getElementById('product-form').style.display = 'block';
    document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
}

// Delete product
async function deleteProduct(productId) {
    const product = dataManager.getProductById(productId);
    if (!product) return;
    
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        showToast('Product deleted successfully', 'success');
        
        // Reload products from backend
        await dataManager.refreshProducts();
        loadProductsTable();
        updateStatistics();
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product. Please try again.', 'error');
    }
}

// Save product (add or update)
async function saveProduct(event) {
    event.preventDefault();
    
    const productData = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        marketPrice: parseFloat(document.getElementById('product-market-price').value),
        description: document.getElementById('product-description').value,
        marketUrl: document.getElementById('product-market-url').value,
        marketSource: document.getElementById('product-market-source').value,
        category: document.getElementById('product-category').value,
        image: currentImageData || document.getElementById('product-image-url').value || 'https://via.placeholder.com/300x420?text=No+Image'
    };
    
    // Validate market price
    if (productData.marketPrice < productData.price) {
        if (!confirm('Market price is lower than your price. This means your price is above market value. Continue anyway?')) {
            return;
        }
    }
    
    try {
        let response;
        
        if (currentEditingId) {
            // Update existing product
            response = await fetch(`${API_CONFIG.BASE_URL}/api/products/${currentEditingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            
            showToast('Product updated successfully', 'success');
        } else {
            // Add new product
            response = await fetch(`${API_CONFIG.BASE_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            
            showToast('Product added successfully', 'success');
        }
        
        // Reload products from backend
        await dataManager.refreshProducts();
        
        cancelForm();
        loadProductsTable();
        updateStatistics();
    } catch (error) {
        console.error('Error saving product:', error);
        
        // Show more detailed error message
        let errorMessage = 'Failed to save product. ';
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Cannot connect to backend server. Make sure the backend is running at ' + API_CONFIG.BASE_URL;
        } else if (error.message.includes('CORS')) {
            errorMessage += 'CORS error. Backend needs to allow requests from this domain.';
        } else {
            errorMessage += error.message || 'Please try again.';
        }
        
        showToast(errorMessage, 'error');
        
        // Also log the full error for debugging
        console.error('Full error details:', {
            message: error.message,
            stack: error.stack,
            apiUrl: API_CONFIG.BASE_URL
        });
    }
}

// Cancel form
function cancelForm() {
    document.getElementById('product-form').style.display = 'none';
    document.getElementById('product-form-element').reset();
    currentEditingId = null;
    currentImageData = null;
}

// Preview image from file upload
function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB', 'error');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        currentImageData = e.target.result;
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${currentImageData}" alt="Preview">`;
        preview.classList.remove('empty');
        
        // Clear URL input if file is uploaded
        document.getElementById('product-image-url').value = '';
    };
    
    reader.readAsDataURL(file);
}

// ==================== ORDERS SECTION ====================

// Load orders from backend
async function loadOrders() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        allOrders = data.orders || [];
        
        displayOrders(allOrders);
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Failed to load orders', 'error');
        document.getElementById('orders-table-body').innerHTML = 
            '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--danger-color);">Failed to load orders. Please try again.</td></tr>';
    }
}

// Display orders in table
function displayOrders(orders) {
    const tbody = document.getElementById('orders-table-body');
    const noOrders = document.getElementById('no-orders');
    
    if (orders.length === 0) {
        tbody.innerHTML = '';
        noOrders.style.display = 'block';
        return;
    }
    
    noOrders.style.display = 'none';
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        const row = createOrderRow(order);
        tbody.appendChild(row);
    });
}

// Create table row for order
function createOrderRow(order) {
    const row = document.createElement('tr');
    
    const statusClass = order.status === 'paid' ? 'status-paid' : 
                        order.status === 'pending' ? 'status-pending' : 'status-failed';
    
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const itemsCount = order.items ? order.items.length : 0;
    const itemsText = itemsCount === 1 ? '1 item' : `${itemsCount} items`;
    
    row.innerHTML = `
        <td><strong>${order.orderId}</strong></td>
        <td>
            <div>${order.customer?.name || 'N/A'}</div>
            <div style="font-size: 0.85rem; color: #666;">${order.customer?.email || ''}</div>
        </td>
        <td>${itemsText}</td>
        <td><strong>₹${order.total?.toFixed(2) || '0.00'}</strong></td>
        <td><span class="order-status ${statusClass}">${order.status.toUpperCase()}</span></td>
        <td>${date}</td>
        <td>
            <button class="btn-view-order" onclick="viewOrderDetails('${order._id || order.orderId}')">View Details</button>
        </td>
    `;
    
    return row;
}

// Filter orders by status
function filterOrders() {
    const filter = document.getElementById('order-status-filter').value;
    
    if (filter === 'all') {
        displayOrders(allOrders);
    } else {
        const filtered = allOrders.filter(order => order.status === filter);
        displayOrders(filtered);
    }
}

// View order details
function viewOrderDetails(orderId) {
    const order = allOrders.find(o => (o._id === orderId || o.orderId === orderId));
    
    if (!order) {
        showToast('Order not found', 'error');
        return;
    }
    
    const modal = document.getElementById('order-modal');
    const detailsDiv = document.getElementById('order-details');
    
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const statusClass = order.status === 'paid' ? 'status-paid' : 
                        order.status === 'pending' ? 'status-pending' : 'status-failed';
    
    let itemsHTML = '';
    if (order.items && order.items.length > 0) {
        itemsHTML = order.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>₹${item.price?.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td><strong>₹${(item.price * item.quantity).toFixed(2)}</strong></td>
            </tr>
        `).join('');
    }
    
    detailsDiv.innerHTML = `
        <h2>Order Details</h2>
        <div style="margin-bottom: 2rem;">
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Status:</strong> <span class="order-status ${statusClass}">${order.status.toUpperCase()}</span></p>
            ${order.razorpayPaymentId ? `<p><strong>Payment ID:</strong> ${order.razorpayPaymentId}</p>` : ''}
        </div>
        
        <h3>Customer Information</h3>
        <div style="margin-bottom: 2rem;">
            <p><strong>Name:</strong> ${order.customer?.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${order.customer?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
        </div>
        
        <h3>Shipping Address</h3>
        <div style="margin-bottom: 2rem;">
            <p>${order.customer?.address?.line1 || ''}</p>
            ${order.customer?.address?.line2 ? `<p>${order.customer.address.line2}</p>` : ''}
            ${order.customer?.address?.landmark ? `<p>Landmark: ${order.customer.address.landmark}</p>` : ''}
            <p>${order.customer?.address?.city || ''}, ${order.customer?.address?.state || ''} - ${order.customer?.address?.pincode || ''}</p>
        </div>
        
        <h3>Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
            <thead>
                <tr style="background: #f8f9fa;">
                    <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
                    <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid #dee2e6;">Price</th>
                    <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid #dee2e6;">Quantity</th>
                    <th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid #dee2e6;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>
        
        <h3>Order Summary</h3>
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Subtotal:</span>
                <span>₹${(order.total - order.tax - order.deliveryCharge).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Tax (18% GST):</span>
                <span>₹${order.tax?.toFixed(2) || '0.00'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Delivery (${order.deliveryType || 'Standard'}):</span>
                <span>₹${order.deliveryCharge?.toFixed(2) || '0.00'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 1rem; border-top: 2px solid #dee2e6; font-size: 1.2rem; font-weight: bold;">
                <span>Total:</span>
                <span style="color: var(--primary-color);">₹${order.total?.toFixed(2) || '0.00'}</span>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close order modal
function closeOrderModal() {
    document.getElementById('order-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('order-modal');
    if (event.target === modal) {
        closeOrderModal();
    }
}

// ==================== COMMON FUNCTIONS ====================

// Update statistics
function updateStatistics() {
    const products = dataManager.getProducts();
    
    // Total products
    document.getElementById('stat-total-products').textContent = products.length;
    
    // Total stock value
    const stockValue = products.reduce((total, product) => {
        return total + (product.price * product.stock);
    }, 0);
    document.getElementById('stat-stock-value').textContent = `₹${stockValue.toFixed(2)}`;
    
    // Low stock items (less than 5)
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).length;
    document.getElementById('stat-low-stock').textContent = lowStock;
    
    // Out of stock
    const outOfStock = products.filter(p => p.stock === 0).length;
    document.getElementById('stat-out-stock').textContent = outOfStock;
}

// Update cart count in header
function updateCartCount() {
    const count = dataManager.getCartItemCount();
    document.getElementById('cart-count').textContent = count;
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

// Listen for image URL input changes
document.addEventListener('DOMContentLoaded', function() {
    const imageUrlInput = document.getElementById('product-image-url');
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', function(e) {
            const url = e.target.value;
            if (url && url.startsWith('http')) {
                currentImageData = url;
                const preview = document.getElementById('image-preview');
                preview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<p style=color:red>Invalid image URL</p>'">`;
                preview.classList.remove('empty');
                
                // Clear file input if URL is entered
                document.getElementById('product-image-file').value = '';
            }
        });
    }
});
