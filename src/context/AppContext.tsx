import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Invoice, Client, Expense, DashboardStats } from '../types';
import { authService, clientService, invoiceService, expenseService, dashboardService } from '../services/api';
import toast from 'react-hot-toast';

interface AppState {
  user: User | null;
  invoices: Invoice[];
  clients: Client[];
  expenses: Expense[];
  dashboardStats: DashboardStats;
  isLoading: boolean;
  currentView: string;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_INVOICES'; payload: Invoice[] }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_VIEW'; payload: string };

const initialState: AppState = {
  user: null,
  invoices: [],
  clients: [],
  expenses: [],
  dashboardStats: {
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    pendingInvoices: 0,
    overDueInvoices: 0,
    monthlyGrowth: 0,
  },
  isLoading: false,
  currentView: 'dashboard',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    businessName?: string;
    address?: string;
    taxId?: string;
    preferredCurrency?: string;
  }) => Promise<void>;
  logout: () => void;
  loadInitialData: () => Promise<void>;
  calculateDashboardStats: () => void;
  addClient: (clientData: any) => Promise<void>;
  updateClient: (id: string, clientData: any) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addInvoice: (invoiceData: any) => Promise<void>;
  updateInvoice: (id: string, invoiceData: any) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  addExpense: (expenseData: any) => Promise<void>;
  updateExpense: (id: string, expenseData: any) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(inv => 
          inv.id === action.payload.id ? action.payload : inv
        )
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(inv => inv.id !== action.payload)
      };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client => 
          client.id === action.payload.id ? action.payload : client
        )
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload)
      };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense => 
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const user = await authService.getCurrentUser();
          dispatch({ type: 'SET_USER', payload: user });
          await loadInitialData();
        } catch (error) {
          console.error('Auth check failed:', error);
          authService.logout();
        }
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.login(email, password);
      dispatch({ type: 'SET_USER', payload: user });
      await loadInitialData();
      toast.success('¡Bienvenido a FinzoFlow!');
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    businessName?: string;
    address?: string;
    taxId?: string;
    preferredCurrency?: string;
  }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.register(userData);
      dispatch({ type: 'SET_USER', payload: user });
      await loadInitialData();
      toast.success('¡Cuenta creada exitosamente!');
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.error || 'Error al crear cuenta';
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_INVOICES', payload: [] });
    dispatch({ type: 'SET_CLIENTS', payload: [] });
    dispatch({ type: 'SET_EXPENSES', payload: [] });
    toast.success('Sesión cerrada exitosamente');
  };

  const loadInitialData = async () => {
    try {
      // Cargar datos desde la API
      const [clients, invoices, expenses] = await Promise.all([
        clientService.getAll(),
        invoiceService.getAll(),
        expenseService.getAll()
      ]);

      dispatch({ type: 'SET_CLIENTS', payload: clients });
      dispatch({ type: 'SET_INVOICES', payload: invoices });
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
    } catch (error) {
      console.error('Failed to load initial data:', error);
      toast.error('Error al cargar los datos');
    }
  };

  const calculateDashboardStats = () => {
    const totalIncome = state.invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
    
    const totalExpenses = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netIncome = totalIncome - totalExpenses;
    const pendingInvoices = state.invoices.filter(inv => inv.status === 'sent').length;
    const overDueInvoices = state.invoices.filter(inv => 
      inv.status === 'overdue' || (inv.status === 'sent' && new Date(inv.dueDate) < new Date())
    ).length;

    const stats: DashboardStats = {
      totalIncome,
      totalExpenses,
      netIncome,
      pendingInvoices,
      overDueInvoices,
      monthlyGrowth: 12.5,
    };

    dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
  };

  // Funciones CRUD para clientes
  const addClient = async (clientData: any) => {
    try {
      const newClient = await clientService.create(clientData);
      dispatch({ type: 'ADD_CLIENT', payload: newClient });
      toast.success('Cliente agregado exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al agregar cliente';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateClient = async (id: string, clientData: any) => {
    try {
      const updatedClient = await clientService.update(id, clientData);
      dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
      toast.success('Cliente actualizado exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar cliente';
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await clientService.delete(id);
      dispatch({ type: 'DELETE_CLIENT', payload: id });
      toast.success('Cliente eliminado exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al eliminar cliente';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Funciones CRUD para facturas
  const addInvoice = async (invoiceData: any) => {
    try {
      const newInvoice = await invoiceService.create(invoiceData);
      dispatch({ type: 'ADD_INVOICE', payload: newInvoice });
      toast.success('Factura creada exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al crear factura';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateInvoice = async (id: string, invoiceData: any) => {
    try {
      const updatedInvoice = await invoiceService.update(id, invoiceData);
      dispatch({ type: 'UPDATE_INVOICE', payload: updatedInvoice });
      toast.success('Factura actualizada exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar factura';
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await invoiceService.delete(id);
      dispatch({ type: 'DELETE_INVOICE', payload: id });
      toast.success('Factura eliminada exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al eliminar factura';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Funciones CRUD para gastos
  const addExpense = async (expenseData: any) => {
    try {
      const newExpense = await expenseService.create(expenseData);
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      toast.success('Gasto agregado exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al agregar gasto';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateExpense = async (id: string, expenseData: any) => {
    try {
      const updatedExpense = await expenseService.update(id, expenseData);
      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
      toast.success('Gasto actualizado exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar gasto';
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expenseService.delete(id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      toast.success('Gasto eliminado exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al eliminar gasto';
      toast.error(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    if (state.user) {
      calculateDashboardStats();
    }
  }, [state.invoices, state.expenses]);

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      login, 
      register,
      logout, 
      loadInitialData,
      calculateDashboardStats,
      addClient,
      updateClient,
      deleteClient,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      addExpense,
      updateExpense,
      deleteExpense
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}