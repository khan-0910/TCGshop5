// API Configuration
// Backend API URL - Update this with your deployed backend URL

const API_CONFIG = {
    // Backend API Base URL
    BASE_URL: 'https://backend-for-tcgshop.onrender.com',
    
    // API Endpoints
    endpoints: {
        // Product endpoints
        products: '/api/products',
        productById: (id) => `/api/products/${id}`,
        
        // Order endpoints
        createOrder: '/api/create-order',
        verifyPayment: '/api/verify-payment',
        orders: '/api/orders',
        orderById: (id) => `/api/orders/${id}`,
        
        // Initialize endpoint
        initialize: '/api/initialize',
        
        // Health check
        health: '/'
    },
    
    // Request timeout (milliseconds)
    timeout: 30000,
    
    // Retry configuration
    retry: {
        attempts: 3,
        delay: 1000
    }
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return `${API_CONFIG.baseURL}${endpoint}`;
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

