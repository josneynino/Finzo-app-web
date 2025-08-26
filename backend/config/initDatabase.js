import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export async function initDatabase() {
  try {
    // Initialize lowdb with JSON file
    const adapter = new FileSync(path.join(__dirname, '../database.json'));
    db = low(adapter);
    
    // Set default data structure
    db.defaults({
      users: [],
      clients: [],
      invoices: [],
      invoiceItems: [],
      expenses: []
    }).write();
    
    // Insert initial data
    await insertInitialData();
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function insertInitialData() {
  // Check if demo user exists
  const existingUser = db.get('users').find({ email: 'demo@finzoflow.com' }).value();
  
  if (!existingUser) {
    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = {
      id: 'demo-user-1',
      email: 'demo@finzoflow.com',
      password: hashedPassword,
      name: 'John Doe',
      businessName: 'FinzoFlow Solutions',
      address: '123 Main St, City, State 12345',
      taxId: 'TAX123456',
      preferredCurrency: 'USD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.get('users').push(demoUser).write();

    // Create demo clients
    const demoClients = [
      {
        id: 'client-1',
        userId: 'demo-user-1',
        name: 'Acme Corp',
        email: 'contact@acme.com',
        company: 'Acme Corporation',
        address: '456 Business Ave, Business City',
        phone: '+1 234-567-8900',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'client-2',
        userId: 'demo-user-1',
        name: 'Tech Solutions Inc',
        email: 'info@techsolutions.com',
        company: 'Tech Solutions Inc',
        address: '789 Innovation Dr, Tech City',
        phone: '+1 234-567-8901',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    db.get('clients').push(...demoClients).write();

    // Create demo invoices
    const demoInvoices = [
      {
        id: 'invoice-1',
        userId: 'demo-user-1',
        clientId: 'client-1',
        invoiceNumber: 'INV-2024-001',
        subtotal: 5000,
        taxRate: 0.21,
        taxAmount: 1050,
        total: 6050,
        status: 'paid',
        issueDate: '2024-01-15',
        dueDate: '2024-02-15',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'invoice-2',
        userId: 'demo-user-1',
        clientId: 'client-2',
        invoiceNumber: 'INV-2024-002',
        subtotal: 3000,
        taxRate: 0.21,
        taxAmount: 630,
        total: 3630,
        status: 'sent',
        issueDate: '2024-01-20',
        dueDate: '2024-02-20',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    db.get('invoices').push(...demoInvoices).write();

    // Create demo invoice items
    const demoItems = [
      {
        id: 'item-1',
        invoiceId: 'invoice-1',
        description: 'Web Development Services',
        quantity: 1,
        unitPrice: 5000,
        total: 5000,
        createdAt: new Date().toISOString()
      },
      {
        id: 'item-2',
        invoiceId: 'invoice-2',
        description: 'Consulting Services',
        quantity: 20,
        unitPrice: 150,
        total: 3000,
        createdAt: new Date().toISOString()
      }
    ];
    
    db.get('invoiceItems').push(...demoItems).write();

    // Create demo expenses
    const demoExpenses = [
      {
        id: 'expense-1',
        userId: 'demo-user-1',
        description: 'Adobe Creative Suite',
        amount: 59.99,
        category: 'software',
        vendor: 'Adobe',
        date: '2024-01-10',
        isDeductible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'expense-2',
        userId: 'demo-user-1',
        description: 'Office Supplies',
        amount: 125.50,
        category: 'office_supplies',
        vendor: 'Office Depot',
        date: '2024-01-12',
        isDeductible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    db.get('expenses').push(...demoExpenses).write();

    console.log('✅ Demo data inserted successfully');
  }
}

export function getDatabase() {
  return db;
}
