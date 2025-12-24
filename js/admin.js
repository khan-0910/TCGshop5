let currentEditingId = null;
let currentImageData = null;
let allOrders = [];

/* ------------------ TOAST ------------------ */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.className = 'toast', 3000);
}

/* ------------------ LOGIN ------------------ */
const ADMIN_PASSWORD = 'admin123';

function checkPassword(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        showToast('Login successful', 'success');
    } else {
        showToast('Incorrect password', 'error');
    }
}

function showAdminPanel() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

document.addEventListener('DOMContentLoaded', async () => {
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    }

    await dataManager.refreshProducts();
    loadProductsTable();
});

/* ------------------ PRODUCTS ------------------ */
function showAddProductForm() {
    currentEditingId = null;
    currentImageData = null;
    document.getElementById('product-form').style.display = 'block';
    document.getElementById('product-form-element').reset();
}

async function loadProductsTable() {
    const products = dataManager.getProducts();
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';

    products.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.name}</td>
            <td>₹${p.price}</td>
            <td>${p.stock}</td>
            <td>
                <button onclick="editProduct('${p._id}')">Edit</button>
                <button onclick="deleteProduct('${p._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editProduct(id) {
    const p = dataManager.getProductById(id);
    if (!p) return;

    currentEditingId = id;
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

async function saveProduct(e) {
    e.preventDefault();

    const productData = {
        name: product-name.value,
        price: Number(product-price.value),
        stock: Number(product-stock.value),
        marketPrice: Number(product-market-price.value),
        description: product-description.value,
        marketUrl: product-market-url.value,
        marketSource: product-market-source.value,
        category: product-category.value,
        image: currentImageData || product-image-url.value
    };

    const url = currentEditingId
        ? getApiUrl(`/api/products/${currentEditingId}`)
        : getApiUrl('/api/products');

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

    showToast('Product saved', 'success');
    await dataManager.refreshProducts();
    loadProductsTable();
    cancelForm();
}

async function deleteProduct(id) {
    if (!confirm('Delete product?')) return;

    const res = await fetch(getApiUrl(`/api/products/${id}`), {
        method: 'DELETE'
    });

    if (!res.ok) {
        showToast('Delete failed', 'error');
        return;
    }

    showToast('Deleted', 'success');
    await dataManager.refreshProducts();
    loadProductsTable();
}

function cancelForm() {
    document.getElementById('product-form').style.display = 'none';
}
