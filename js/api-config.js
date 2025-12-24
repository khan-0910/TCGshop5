// API Configuration
// Backend API URL - Update this with your deployed backend URL

// Backend API URL
const API_CONFIG = {
    BASE_URL: 'https://backend-for-tcgshop.onrender.com',

    endpoints: {
        products: '/api/products',
        productById: (id) => `/api/products/${id}`,
        orders: '/api/orders',
        createOrder: '/api/create-order',
        verifyPayment: '/api/verify-payment',
        initialize: '/api/initialize'
    }
};

// Build full API URL
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Safe API request helper
async function apiRequest(endpoint, options = {}) {
    const url = getApiUrl(endpoint);

    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });

    // Handle non-JSON responses safely
    const text = await response.text();

    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
}



// Helper function to make API requests with error handling
async function apiRequest(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };
    
    try {
        const response = await fetch(url, defaultOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}


