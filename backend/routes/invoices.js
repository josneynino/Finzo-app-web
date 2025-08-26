import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../config/initDatabase.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Validation middleware
const validateInvoice = [
  body('clientId').notEmpty().withMessage('Client is required'),
  body('invoiceNumber').trim().notEmpty().withMessage('Invoice number is required'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be a positive number'),
  body('taxRate').isFloat({ min: 0, max: 1 }).withMessage('Tax rate must be between 0 and 1'),
  body('issueDate').isISO8601().withMessage('Valid issue date is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('notes').optional().trim(),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required')
];

const validateInvoiceItem = [
  body('items.*.description').trim().notEmpty().withMessage('Item description is required'),
  body('items.*.quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be greater than 0'),
  body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be positive')
];

// Get all invoices for user
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const invoices = await db.all(`
      SELECT i.*, c.name as clientName, c.email as clientEmail, c.company as clientCompany
      FROM invoices i
      LEFT JOIN clients c ON i.clientId = c.id
      WHERE i.userId = ?
      ORDER BY i.createdAt DESC
    `, [req.user.id]);
    
    // Get items for each invoice
    for (let invoice of invoices) {
      const items = await db.all('SELECT * FROM invoice_items WHERE invoiceId = ?', [invoice.id]);
      invoice.items = items;
    }
    
    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const invoice = await db.get(`
      SELECT i.*, c.name as clientName, c.email as clientEmail, c.company as clientCompany
      FROM invoices i
      LEFT JOIN clients c ON i.clientId = c.id
      WHERE i.id = ? AND i.userId = ?
    `, [req.params.id, req.user.id]);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Get invoice items
    const items = await db.all('SELECT * FROM invoice_items WHERE invoiceId = ?', [invoice.id]);
    invoice.items = items;
    
    res.json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Create new invoice
router.post('/', validateInvoice, validateInvoiceItem, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, invoiceNumber, subtotal, taxRate, taxAmount, total, issueDate, dueDate, notes, items } = req.body;
    const db = getDatabase();

    // Verify client exists and belongs to user
    const client = await db.get('SELECT * FROM clients WHERE id = ? AND userId = ?', [clientId, req.user.id]);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Check if invoice number already exists for this user
    const existingInvoice = await db.get('SELECT id FROM invoices WHERE invoiceNumber = ? AND userId = ?', [invoiceNumber, req.user.id]);
    if (existingInvoice) {
      return res.status(409).json({ error: 'Invoice number already exists' });
    }

    const invoiceId = uuidv4();
    
    // Create invoice
    await db.run(`
      INSERT INTO invoices (id, userId, clientId, invoiceNumber, subtotal, taxRate, taxAmount, total, issueDate, dueDate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [invoiceId, req.user.id, clientId, invoiceNumber, subtotal, taxRate, taxAmount, total, issueDate, dueDate, notes]);

    // Create invoice items
    for (const item of items) {
      const itemId = uuidv4();
      await db.run(`
        INSERT INTO invoice_items (id, invoiceId, description, quantity, unitPrice, total)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [itemId, invoiceId, item.description, item.quantity, item.unitPrice, item.total]);
    }

    // Get created invoice with items
    const newInvoice = await db.get(`
      SELECT i.*, c.name as clientName, c.email as clientEmail, c.company as clientCompany
      FROM invoices i
      LEFT JOIN clients c ON i.clientId = c.id
      WHERE i.id = ?
    `, [invoiceId]);
    
    const invoiceItems = await db.all('SELECT * FROM invoice_items WHERE invoiceId = ?', [invoiceId]);
    newInvoice.items = invoiceItems;
    
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Update invoice
router.put('/:id', validateInvoice, validateInvoiceItem, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, invoiceNumber, subtotal, taxRate, taxAmount, total, issueDate, dueDate, notes, items } = req.body;
    const db = getDatabase();

    // Check if invoice exists and belongs to user
    const existingInvoice = await db.get('SELECT * FROM invoices WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
    if (!existingInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Verify client exists and belongs to user
    const client = await db.get('SELECT * FROM clients WHERE id = ? AND userId = ?', [clientId, req.user.id]);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Check if invoice number is already taken by another invoice
    const invoiceNumberConflict = await db.get('SELECT id FROM invoices WHERE invoiceNumber = ? AND userId = ? AND id != ?', [invoiceNumber, req.user.id, req.params.id]);
    if (invoiceNumberConflict) {
      return res.status(409).json({ error: 'Invoice number already exists' });
    }

    // Update invoice
    await db.run(`
      UPDATE invoices 
      SET clientId = ?, invoiceNumber = ?, subtotal = ?, taxRate = ?, taxAmount = ?, total = ?, 
          issueDate = ?, dueDate = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ? AND userId = ?
    `, [clientId, invoiceNumber, subtotal, taxRate, taxAmount, total, issueDate, dueDate, notes, req.params.id, req.user.id]);

    // Delete existing items and create new ones
    await db.run('DELETE FROM invoice_items WHERE invoiceId = ?', [req.params.id]);
    
    for (const item of items) {
      const itemId = uuidv4();
      await db.run(`
        INSERT INTO invoice_items (id, invoiceId, description, quantity, unitPrice, total)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [itemId, req.params.id, item.description, item.quantity, item.unitPrice, item.total]);
    }

    // Get updated invoice with items
    const updatedInvoice = await db.get(`
      SELECT i.*, c.name as clientName, c.email as clientEmail, c.company as clientCompany
      FROM invoices i
      LEFT JOIN clients c ON i.clientId = c.id
      WHERE i.id = ?
    `, [req.params.id]);
    
    const invoiceItems = await db.all('SELECT * FROM invoice_items WHERE invoiceId = ?', [req.params.id]);
    updatedInvoice.items = invoiceItems;
    
    res.json(updatedInvoice);
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Update invoice status
router.patch('/:id/status', [
  body('status').isIn(['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const db = getDatabase();

    // Check if invoice exists and belongs to user
    const existingInvoice = await db.get('SELECT * FROM invoices WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
    if (!existingInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    await db.run('UPDATE invoices SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?', [status, req.params.id, req.user.id]);
    
    const updatedInvoice = await db.get('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
    
    res.json(updatedInvoice);
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ error: 'Failed to update invoice status' });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const db = getDatabase();

    // Check if invoice exists and belongs to user
    const existingInvoice = await db.get('SELECT * FROM invoices WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
    if (!existingInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Delete invoice items first (due to foreign key constraint)
    await db.run('DELETE FROM invoice_items WHERE invoiceId = ?', [req.params.id]);
    
    // Delete invoice
    await db.run('DELETE FROM invoices WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
    
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
