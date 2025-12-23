// ==================== ADMIN PANEL ====================
// Froakie TCG Admin – Product & Order Management
// ==================== ADMIN AUTH ====================

const ADMIN_PASSWORD = 'admin123'; // change later

document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');

    if (isLoggedIn === 'true') {
        showAdminPanel();
    }
});

function checkPassword(event) {
    event.preventDefault();

    const input = document.getElementById('admin-password');
    if (!input) return;

    if (input.value === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        showToast('Login successful', 'success');
    } else {
        showToast('Incorrect password', 'error');
        input.value = '';
        input.focus();
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

function showAdminPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
}


let currentEditingId = null;
let currentImageData = null;
let allOrders = [];
let currentSection = 'products';

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.API_CONFIG) {
        console.error('API_CONFIG not loaded');
        return;
    }

    await dataManager.refreshProducts();
    loadProductsTable();
    updateStatistics();
    updateCartCount();
});

// ==================== NAV ====================

function showSection(section) {
    currentSection = section;

    document.getElementById('products-tab').style.background =
        section === 'products' ? 'var(--primary-color)' : '#95a5a6';
    document.getElementById('orders-tab').style.background =
        section === 'orders' ? 'var(--primary-color)' : '#95a5a6';

    document.getElementById('section-title').textContent =
        section === 'products' ? 'Product Management' : 'Orders Management';

    document.getElementById('products-section').style.display =
        section === 'products' ? 'block' : 'none';
    document.getElementById('orders-section').style.display =
        section === 'orders' ? 'block' : 'none';

    document.getElementById('add-product-btn').style.display =
        section === 'products' ? 'inline-block' : 'none';

    if (section === 'orders') loadOrders();
}

// ==================== PRODUCTS ====================

function showAddProductForm() {
    currentEditingId = null;
    currentImageData = null;

    document.getElementById('form-title').textContent = 'Add New Product';
    document.getElementById('product-form-element').reset();
    document.getElementById('product-id').value = '';

    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    preview.classList.add('empty');

    document.getElementById('product-form').style.display = 'block';
    document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
}

async function loadProductsTable() {
    const products = dataManager.getProducts();
    const tbody = document.getElementById('products-table-body');

    if (!products.length) {
        tbody.innerHTML =
            '<tr><td colspan="7" style="text-align:center;padding:2rem;">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    products.forEach(p => tbody.appendChild(createProductRow(p)));
}

function createProductRow(product) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><img src="${product.image}" width="60"></td>
        <td>${product.name}</td>
        <td>₹${product.price.toFixed(2)}</td>
        <td>₹${product.marketPrice.toFixed(2)}</td>
        <td>${product.stock}</td>
        <td><a href="${product.marketUrl}" target="_blank">${product.marketSource}</a></td>
        <td>
            <button onclick="editProduct('${product._id}')">Edit</button>
            <button onclick="deleteProduct('${product._id}')">Delete</button>
        </td>
    `;
    return row;
}

function editProduct(id) {
    const product = dataManager.getProductById(id);
    if (!product) return;

    currentEditingId = id;
    currentImageData = product.image;

    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-market-price').value = product.marketPrice;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-market-url').value = product.marketUrl;
    document.getElementById('product-market-source').value = product.marketSource;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-image-url').value = product.image;

    document.getElementById('image-preview').innerHTML =
        `<img src="${product.image}" width="120">`;

    document.getElementById('product-form').style.display = 'block';
}

async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;

    try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/products/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error();

        await dataManager.refreshProducts();
        loadProductsTable();
        updateStatistics();
        showToast('Product deleted', 'success');
    } catch {
        showToast('Delete failed', 'error');
    }
}

async function saveProduct(e) {
    e.preventDefault();

    const data = {
        name: product-name.value.trim(),
        price: Number(product-price.value),
        stock: Number(product-stock.value),
        marketPrice: Number(product-market-price.value),
        description: product-description.value.trim(),
        marketUrl: product-market-url.value.trim(),
        marketSource: product-market-source.value.trim(),
        category: product-category.value,
        image:
            currentImageData ||
            product-image-url.value.trim() ||
            'https://via.placeholder.com/300x420?text=No+Image'
    };

    try {
        const url = currentEditingId
            ? `${API_CONFIG.BASE_URL}/api/products/${currentEditingId}`
            : `${API_CONFIG.BASE_URL}/api/products`;

        const method = currentEditingId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error();

        await dataManager.refreshProducts();
        cancelForm();
        loadProductsTable();
        updateStatistics();

        showToast(
            currentEditingId ? 'Product updated' : 'Product added',
            'success'
        );
    } catch {
        showToast('Save failed', 'error');
    }
}

function cancelForm() {
    document.getElementById('product-form').style.display = 'none';
    currentEditingId = null;
    currentImageData = null;
}

// ==================== ORDERS ====================

async function loadOrders() {
    try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/orders`);
        const data = await res.json();
        allOrders = data.orders || [];
        displayOrders(allOrders);
    } catch {
        showToast('Failed to load orders', 'error');
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';

    orders.forEach(o => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${o.orderId}</td>
            <td>${o.customer?.name || ''}</td>
            <td>${o.items?.length || 0}</td>
            <td>₹${o.total.toFixed(2)}</td>
            <td>${o.status}</td>
        `;
        tbody.appendChild(row);
    });
}

// ==================== COMMON ====================

function updateStatistics() {
    const products = dataManager.getProducts();
    stat-total-products.textContent = products.length;
}

function updateCartCount() {
    cart-count.textContent = dataManager.getCartItemCount();
}

function showToast(msg, type = 'info') {
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => (toast.className = 'toast'), 3000);
}

