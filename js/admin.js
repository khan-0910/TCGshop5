// Admin Panel functionality for Pokemon Cards Store
// Handles product management (CRUD operations) and order viewing

let currentEditingId = null;
let currentImageData = null;
let allOrders = [];
let currentSection = 'products';

/* ==================== INIT ==================== */

document.addEventListener('DOMContentLoaded', async () => {
    await dataManager.refreshProducts();
    loadProductsTable();
    updateStatistics();
    updateCartCount();
});

/* ==================== SECTION SWITCH ==================== */

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

/* ==================== PRODUCTS ==================== */

function loadProductsTable() {
    const products = dataManager.getProducts();
    const tbody = document.getElementById('products-table-body');

    if (!products.length) {
        tbody.innerHTML =
            `<tr><td colspan="7" style="text-align:center;padding:2rem;">
                No products found. Add your first product!
            </td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    products.forEach(p => tbody.appendChild(createProductRow(p)));
}

function createProductRow(product) {
    const row = document.createElement('tr');

    const stockClass =
        product.stock === 0 ? 'stock-out' :
        product.stock < 5 ? 'stock-low' : 'stock-good';

    row.innerHTML = `
        <td><img src="${product.image}" width="60"></td>
        <td>${product.name}</td>
        <td>₹${product.price.toFixed(2)}</td>
        <td>₹${product.marketPrice.toFixed(2)}</td>
        <td class="${stockClass}">${product.stock}</td>
        <td>
            <button onclick="editProduct('${product._id}')">Edit</button>
            <button onclick="deleteProduct('${product._id}')">Delete</button>
        </td>
    `;
    return row;
}

function showAddProductForm() {
    currentEditingId = null;
    currentImageData = null;
    document.getElementById('product-form-element').reset();
    document.getElementById('product-form').style.display = 'block';
}

/* ==================== EDIT ==================== */

function editProduct(id) {
    const product = dataManager.getProductById(id);
    if (!product) return;

    currentEditingId = id;
    currentImageData = product.image;

    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-market-price').value = product.marketPrice;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-market-url').value = product.marketUrl;
    document.getElementById('product-market-source').value = product.marketSource;
    document.getElementById('product-category').value = product.category;

    document.getElementById('product-form').style.display = 'block';
}

/* ==================== DELETE ==================== */

async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;

    const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/products/${id}`,
        { method: 'DELETE' }
    );

    if (!res.ok) {
        showToast('Delete failed', 'error');
        return;
    }

    await dataManager.refreshProducts();
    loadProductsTable();
    updateStatistics();
    showToast('Product deleted', 'success');
}

/* ==================== SAVE ==================== */

async function saveProduct(e) {
    e.preventDefault();

    const productData = {
        name: product-name.value.trim(),
        price: Number(product-price.value),
        stock: Number(product-stock.value),
        marketPrice: Number(product-market-price.value),
        description: product-description.value.trim(),
        marketUrl: product-market-url.value.trim(),
        marketSource: product-market-source.value.trim(),
        category: product-category.value,
        image: currentImageData || product-image-url.value
    };

    const url = currentEditingId
        ? `${API_CONFIG.BASE_URL}/api/products/${currentEditingId}`
        : `${API_CONFIG.BASE_URL}/api/products`;

    const method = currentEditingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });

    if (!res.ok) {
        showToast('Save failed', 'error');
        return;
    }

    await dataManager.refreshProducts();
    loadProductsTable();
    updateStatistics();
    cancelForm();
    showToast('Product saved', 'success');
}

function cancelForm() {
    document.getElementById('product-form').style.display = 'none';
    currentEditingId = null;
    currentImageData = null;
}

/* ==================== ORDERS ==================== */

async function loadOrders() {
    const res = await fetch(`${API_CONFIG.BASE_URL}/api/orders`);
    const data = await res.json();
    allOrders = data.orders || [];
    displayOrders(allOrders);
}

function displayOrders(orders) {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';
    orders.forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${o.orderId}</td>
            <td>${o.status}</td>
            <td>₹${o.total.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

/* ==================== STATS ==================== */

function updateStatistics() {
    const products = dataManager.getProducts();
    stat-total-products.textContent = products.length;
}

function updateCartCount() {
    cart-count.textContent = dataManager.getCartItemCount();
}

function showToast(msg, type) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => t.className = 'toast', 3000);
}
