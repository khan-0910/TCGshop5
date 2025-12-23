// Checkout functionality for Pokemon Cards Store
// Handles checkout form, delivery options, and payment processing

let selectedDelivery = 'regular';

const deliveryCharges = {
    regular: 100,
    premium: 200
};

document.addEventListener('DOMContentLoaded', async function () {
    await dataManager.refreshProducts();

    const cart = dataManager.getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'index.html';
        return;
    }

    loadCartPreview();
    updateOrderSummary();
    updateCartCount();
});

/* ================= CART PREVIEW ================= */

function loadCartPreview() {
    const cart = dataManager.getCart();
    const preview = document.getElementById('cart-items-preview');

    let html = '';
    cart.forEach(item => {
        const product = dataManager.getProductById(item.productId);
        if (!product) return;

        const subtotal = product.price * item.quantity;

        html += `
            <div class="cart-item-mini">
                <div class="item-mini-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="item-mini-details">
                    <div class="item-mini-name">${product.name}</div>
                    <div class="item-mini-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="item-mini-price">₹${subtotal.toFixed(2)}</div>
            </div>
        `;
    });

    preview.innerHTML = html;
}

/* ================= ORDER SUMMARY (NO TAX) ================= */

function updateOrderSummary() {
    const subtotal = dataManager.getCartTotal();
    const delivery = deliveryCharges[selectedDelivery];
    const total = subtotal + delivery;

    document.getElementById('summary-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('summary-delivery').textContent = `₹${delivery.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `₹${total.toFixed(2)}`;

    // Hide tax row completely if it exists
    const taxRow = document.getElementById('summary-tax');
    if (taxRow) taxRow.textContent = '₹0.00';
}

/* ================= DELIVERY ================= */

function selectDelivery(type) {
    selectedDelivery = type;

    document.querySelectorAll('.delivery-option').forEach(option => {
        option.classList.remove('selected');
    });

    event.currentTarget.classList.add('selected');
    updateOrderSummary();
}

/* ================= PLACE ORDER ================= */

function placeOrder() {
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const cart = dataManager.getCart();
    for (const item of cart) {
        const product = dataManager.getProductById(item.productId);
        if (!product || product.stock < item.quantity) {
            showToast('Some items are out of stock.', 'error');
            return;
        }
    }

    const customerInfo = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        address: {
            line1: document.getElementById('address-line1').value,
            line2: document.getElementById('address-line2').value,
            landmark: document.getElementById('address-landmark').value,
            pincode: document.getElementById('address-pincode').value,
            city: document.getElementById('address-city').value,
            state: document.getElementById('address-state').value
        },
        deliveryType: selectedDelivery,
        deliveryCharge: deliveryCharges[selectedDelivery]
    };

    const subtotal = dataManager.getCartTotal();
    const delivery = deliveryCharges[selectedDelivery];
    const total = subtotal + delivery;

    const amountInPaise = Math.round(total * 100);

    initializeRazorpayPayment(customerInfo, amountInPaise);
}

/* ================= RAZORPAY ================= */

async function initializeRazorpayPayment(customerInfo, amountInPaise) {
    try {
        const cart = dataManager.getCart();
        const items = cart.map(item => {
            const product = dataManager.getProductById(item.productId);
            return {
                productId: item.productId,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            };
        });

        // IMPORTANT: send PAise to backend
        const orderData = {
            amount: amountInPaise,
            currency: RAZORPAY_CONFIG.currency,
            customerInfo,
            items
        };

        const response = await fetch(getApiUrl(API_CONFIG.endpoints.createOrder), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.error);

        const options = {
            key: getRazorpayKeyId(),
            amount: result.razorpayOrder.amount, // ✅ paise
            currency: RAZORPAY_CONFIG.currency,
            name: RAZORPAY_CONFIG.storeName,
            order_id: result.razorpayOrder.id,
            handler: (response) => handlePaymentSuccess(response, result.orderId),
            prefill: {
                name: customerInfo.name,
                email: customerInfo.email,
                contact: customerInfo.phone
            },
            theme: { color: RAZORPAY_CONFIG.themeColor }
        };

        new Razorpay(options).open();

    } catch (error) {
        console.error(error);
        showToast('Failed to initialize payment: ' + error.message, 'error');
    }
}

/* ================= PAYMENT SUCCESS ================= */

async function handlePaymentSuccess(response, orderId) {
    try {
        const verifyResponse = await fetch(getApiUrl(API_CONFIG.endpoints.verifyPayment), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId
            })
        });

        const result = await verifyResponse.json();
        if (!result.success) throw new Error('Verification failed');

        dataManager.clearCart();
        alert('Payment successful! Order placed.');
        window.location.href = 'index.html';

    } catch (error) {
        alert('Payment succeeded but verification failed. Contact support.');
    }
}

/* ================= UI HELPERS ================= */

function updateCartCount() {
    document.getElementById('cart-count').textContent =
        dataManager.getCartItemCount();
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.className = 'toast', 3000);
}
