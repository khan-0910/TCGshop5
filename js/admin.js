// ==================== ADMIN PANEL ====================

let currentEditingId = null;
let currentImageData = null;
let allOrders = [];
let currentSection = 'products';

// Init
document.addEventListener('DOMContentLoaded', async () => {
    await dataManager.refreshProducts();
    loadProductsTable();
    updateStatistics();
    updateCartCount();
});

// ==================== SECTIONS ====================

function showSection(section) {
    currentSection = section;

    document.getElementById('products-tab').style.background =
        section === 'products' ? 'var(--primary-color)' : '#95a5a6';
    document.getElementById('orders-tab').style.background =
        section === 'orders' ? 'var(--primary-color)' : '#95a5a6';

    document.getElementById('products-section').style.display =
        section === 'products' ? 'block' : 'none';
    document.getElementById('orders-section').style.display =
        section === 'orders' ? 'block' : 'none';

    document.getElementById('add-product-btn').style.display =
        section === 'products' ? 'inline-block' : 'none';

    if (section === 'orders') loadOrders();
}

// ==================== PRODUCTS ====================

function loadProductsTable() {
    const tbody = document.getElementById('products-table-body');
    const products = dataManager.getProducts();

    tbody.innerHTML = '';

    if (!products.length) {
        tbody.innerHTML =
            `<tr><td colspan="7" style="text-align:center">No products</td></tr>`;
        return;
    }

    products.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${p.image}" width="60"></td>
            <td>${p.name}</td>
            <td>₹${p.price.toFixed(2)}</td>
            <td>₹${p.marketPrice.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td>${p.marketSource}</td>
            <td>
                <button onclick="editProduct('${p._id}')">Edit</button>
                <button onclick="deleteProduct('${p._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddProductForm() {
    currentEditingId = null;
    currentImageData = null;
    document.getElementById('product-form').style.display = 'block';
}

function editProduct(id) {
    const p = dataManager.getProductById(id);
    if (!p) return;

    currentEditingId = id;
    currentImageData = p.image;

    document.getElementById('product-name').value = p.name;
    document.getElementById('product-price').value = p.price;
    document.getElementById('product-stock').value = p.stock;
    document.getElementById('product-market-price').value = p.marketPrice;
    document.getElementById('product-description').value = p.description;
    document.getElementById('product-market-url').value = p.marketUrl;
    document.getElementById('product-market-source').value = p.marketSource;
    document.getElementById('product-category').value = p.category;

    document.getElementById('product-form').style.display = 'block';
}

async function deleteProduct(id) {
    if (!confirm('Delete product?')) return;

    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) return showToast('Delete failed', 'error');

    await dataManager.refreshProducts();
    loadProductsTable();
    updateStatistics();
    showToast('Product deleted', 'success');
}

async function saveProduct(e) {
    e.preventDefault();

    const data = {
        name: productName.value,
        price: Number(productPrice.value),
        stock: Number(productStock.value),
        marketPrice: Number(productMarketPrice.value),
        description: productDescription.value,
        marketUrl: productMarketUrl.value,
        marketSource: productMarketSource.value,
        category: productCategory.value,
        image: currentImageData || productImageUrl.value
    };

    const url = currentEditingId
        ? `/api/products/${currentEditingId}`
        : `/api/products`;

    const method = currentEditingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) return showToast('Save failed', 'error');

    await dataManager.refreshProducts();
    loadProductsTable();
    updateStatistics();
    showToast('Saved', 'success');
    cancelForm();
}

function cancelForm() {
    document.getElementById('product-form').style.display = 'none';
    currentEditingId = null;
}

// ==================== ORDERS ====================

async function loadOrders() {
    const res = await fetch('/api/orders');
    if (!res.ok) return;

    const { orders } = await res.json();
    allOrders = orders;
}

// ==================== STATS ====================

function updateStatistics() {
    const products = dataManager.getProducts();
    statTotalProducts.textContent = products.length;
    statStockValue.textContent = '₹' +
        products.reduce((s, p) => s + p.price * p.stock, 0).toFixed(2);
}

function updateCartCount() {
    cartCount.textContent = dataManager.getCartItemCount();
}
