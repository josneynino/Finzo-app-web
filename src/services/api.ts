import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = 'http://localhost:3001/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finzoflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('finzoflow_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Login
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('finzoflow_token', token);
    return user;
  },

  // Registro
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    businessName?: string;
    address?: string;
    taxId?: string;
    preferredCurrency?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    localStorage.setItem('finzoflow_token', token);
    return user;
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('finzoflow_token');
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('finzoflow_token');
  },
};

// Servicios de usuarios
export const userService = {
  // Obtener perfil
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (profileData: {
    name?: string;
    businessName?: string;
    address?: string;
    taxId?: string;
    preferredCurrency?: string;
  }) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Servicios de clientes
export const clientService = {
  // Obtener todos los clientes
  getAll: async () => {
    const response = await api.get('/clients');
    return response.data;
  },

  // Obtener cliente por ID
  getById: async (id: string) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  // Crear cliente
  create: async (clientData: {
    name: string;
    email: string;
    company?: string;
    address?: string;
    phone?: string;
    taxId?: string;
  }) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  // Actualizar cliente
  update: async (id: string, clientData: {
    name: string;
    email: string;
    company?: string;
    address?: string;
    phone?: string;
    taxId?: string;
  }) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  // Eliminar cliente
  delete: async (id: string) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

// Servicios de facturas
export const invoiceService = {
  // Obtener todas las facturas
  getAll: async () => {
    const response = await api.get('/invoices');
    return response.data;
  },

  // Obtener factura por ID
  getById: async (id: string) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  // Crear factura
  create: async (invoiceData: {
    clientId: string;
    invoiceNumber: string;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    issueDate: string;
    dueDate: string;
    notes?: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
  }) => {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  },

  // Actualizar factura
  update: async (id: string, invoiceData: {
    clientId: string;
    invoiceNumber: string;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    issueDate: string;
    dueDate: string;
    notes?: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
  }) => {
    const response = await api.put(`/invoices/${id}`, invoiceData);
    return response.data;
  },

  // Actualizar estado de factura
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/invoices/${id}/status`, { status });
    return response.data;
  },

  // Eliminar factura
  delete: async (id: string) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },
};

// Servicios de gastos
export const expenseService = {
  // Obtener todos los gastos
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  // Obtener gasto por ID
  getById: async (id: string) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  // Crear gasto
  create: async (expenseData: {
    description: string;
    amount: number;
    category: string;
    vendor: string;
    date: string;
    receipt?: string;
    isDeductible: boolean;
  }) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  // Actualizar gasto
  update: async (id: string, expenseData: {
    description: string;
    amount: number;
    category: string;
    vendor: string;
    date: string;
    receipt?: string;
    isDeductible: boolean;
  }) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  // Eliminar gasto
  delete: async (id: string) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  // Obtener estadísticas de gastos
  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/expenses/stats/summary', { params });
    return response.data;
  },
};

// Servicios del dashboard
export const dashboardService = {
  // Obtener estadísticas del dashboard
  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/dashboard/stats', { params });
    return response.data;
  },

  // Obtener acciones rápidas
  getQuickActions: async () => {
    const response = await api.get('/dashboard/quick-actions');
    return response.data;
  },
};

export default api;
