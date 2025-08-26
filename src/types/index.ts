// Core types for FinzoFlow application
export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  address?: string;
  taxId?: string;
  preferredCurrency: string;
  avatar?: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  address?: string;
  phone?: string;
  taxId?: string;
  createdAt: Date;
}

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client: Client;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseCategory = 
  | 'office_supplies' 
  | 'software' 
  | 'marketing' 
  | 'travel' 
  | 'meals' 
  | 'equipment' 
  | 'professional_services' 
  | 'other';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  vendor: string;
  date: Date;
  receipt?: string;
  isDeductible: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  pendingInvoices: number;
  overDueInvoices: number;
  monthlyGrowth: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}