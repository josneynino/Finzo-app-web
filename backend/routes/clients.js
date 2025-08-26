import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../config/initDatabase.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Validation middleware
const validateClient = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('company').optional().trim(),
  body('address').optional().trim(),
  body('phone').optional().trim(),
  body('taxId').optional().trim()
];

// Get all clients for user
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const clients = db.get('clients').filter({ userId: req.user.id }).sortBy('createdAt').value();
    res.json(clients);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const client = db.get('clients').find({ id: req.params.id, userId: req.user.id }).value();
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// Create new client
router.post('/', validateClient, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, company, address, phone, taxId } = req.body;
    const db = getDatabase();

    // Check if client with same email already exists for this user
    const existingClient = db.get('clients').find({ email, userId: req.user.id }).value();
    if (existingClient) {
      return res.status(409).json({ error: 'Client with this email already exists' });
    }

    const clientId = uuidv4();
    const newClient = {
      id: clientId,
      userId: req.user.id,
      name,
      email,
      company,
      address,
      phone,
      taxId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.get('clients').push(newClient).write();
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/:id', validateClient, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, company, address, phone, taxId } = req.body;
    const db = getDatabase();

    // Check if client exists and belongs to user
    const existingClient = db.get('clients').find({ id: req.params.id, userId: req.user.id }).value();
    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Check if email is already taken by another client
    const emailConflict = db.get('clients').find(c => c.email === email && c.userId === req.user.id && c.id !== req.params.id).value();
    if (emailConflict) {
      return res.status(409).json({ error: 'Client with this email already exists' });
    }

    db.get('clients')
      .find({ id: req.params.id, userId: req.user.id })
      .assign({ name, email, company, address, phone, taxId, updatedAt: new Date().toISOString() })
      .write();

    const updatedClient = db.get('clients').find({ id: req.params.id, userId: req.user.id }).value();
    res.json(updatedClient);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    // Check if client exists and belongs to user
    const existingClient = db.get('clients').find({ id: req.params.id, userId: req.user.id }).value();
    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    // Check if client has invoices
    const hasInvoices = db.get('invoices').find({ clientId: req.params.id }).value();
    if (hasInvoices) {
      return res.status(400).json({ error: 'Cannot delete client with existing invoices' });
    }
    db.get('clients').remove({ id: req.params.id, userId: req.user.id }).write();
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router;
