/**
 * API Service - Centralized API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
  pagination?: any;
}

class ApiService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Ensure endpoint starts with / and API_BASE_URL doesn't end with /
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    let normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Remove trailing slash to prevent redirects
    normalizedEndpoint = normalizedEndpoint.replace(/\/$/, '');
    // Remove trailing ? if present (empty query string)
    normalizedEndpoint = normalizedEndpoint.replace(/\?$/, '');
    const fullUrl = `${cleanBaseUrl}${normalizedEndpoint}`;

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  // Auth
  async register(userData: any) {
    return this.request('auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string) {
    return this.request('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async googleAuth(googleData: any) {
    return this.request('auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
  }

  // Products
  async getProducts(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`products?${queryString}`);
  }

  async getProduct(id: number) {
    return this.request(`products?id=${id}`);
  }

  async createProduct(productData: any) {
    return this.request('products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: number, productData: any) {
    return this.request(`products?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async updateOrder(id: number, orderData: any) {
    return this.request(`orders?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  async deleteProduct(id: number) {
    return this.request(`products?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Cart
  async getCart() {
    return this.request('cart');
  }

  async addToCart(productId: number, quantity: number = 1) {
    return this.request('cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCart(productId: number, quantity: number) {
    return this.request('cart', {
      method: 'PUT',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async removeFromCart(productId: number) {
    return this.request(`cart?product_id=${productId}`, {
      method: 'DELETE',
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request('wishlist');
  }

  async addToWishlist(productId: number) {
    return this.request('wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async removeFromWishlist(productId: number) {
    return this.request(`wishlist?product_id=${productId}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(params?: any) {
    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`orders?${queryString}`);
    }
    // No params - just request orders endpoint
    return this.request('orders');
  }

  async createOrder(orderData: any) {
    return this.request('orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: number) {
    // Validate ID before making request
    if (!id || isNaN(id) || id <= 0) {
      throw new Error('Invalid order ID');
    }
    return this.request(`orders?id=${id}`);
  }

  // Generic methods
  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async get(endpoint: string) {
    return this.request(endpoint);
  }

  // Invoices
  async generateInvoice(orderId: number) {
    return this.request('invoices/generate', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    });
  }

  async downloadInvoice(orderId: number): Promise<Blob> {
    const token = this.getToken();
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const url = `${cleanBaseUrl}/invoices/download?order_id=${orderId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to download invoice' }));
      throw new Error(error.message || 'Failed to download invoice');
    }

    return response.blob();
  }

  // Admin
  async getDashboard() {
    return this.request('admin/dashboard');
  }

  async getUsers(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`admin/users?${queryString}`);
  }

  async updateUser(id: number, userData: any) {
    return this.request(`admin/users?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number) {
    return this.request(`admin/users?id=${id}`, {
      method: 'DELETE',
    });
  }

  async importProducts(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/products/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  }

  async exportProducts() {
    return this.request('admin/products/export');
  }

  async getAnalytics(months: number = 12) {
    return this.request(`admin/analytics?months=${months}`);
  }

  // Shipping
  async getShippingMethods() {
    return this.request('shipping/methods');
  }

  async calculateShipping(shippingMethodId: number) {
    return this.request('shipping/calculate', {
      method: 'POST',
      body: JSON.stringify({ shipping_method_id: shippingMethodId }),
    });
  }
}

export const api = new ApiService();
export default api;

