import express from 'express';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../config/initDatabase.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Validation middleware
const validateExpense = [
  body('description').trim().isLength({ min: 2 }).withMessage('Description must be at least 2 characters'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('category').isIn(['office_supplies', 'software', 'marketing', 'travel', 'meals', 'equipment', 'professional_services', 'other']).withMessage('Invalid category'),
  body('vendor').trim().notEmpty().withMessage('Vendor is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('receipt').optional().trim(),
  body('isDeductible').isBoolean().withMessage('isDeductible must be a boolean')
];

// Get all expenses for user
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const { page = 1, limit = 20, category, startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM expenses WHERE userId = ?';
    let params = [req.user.id];
    
    // Add filters
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const expenses = await db.all(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM expenses WHERE userId = ?';
    let countParams = [req.user.id];
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    if (startDate) {
      countQuery += ' AND date >= ?';
      countParams.push(startDate);
    }
    
    if (endDate) {
      countQuery += ' AND date <= ?';
      countParams.push(endDate);
    }
    
    const countResult = await db.get(countQuery, countParams);
    const total = countResult.total;
    
    res.json({
      expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Get single expense
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const expense = await db.get('SELECT * FROM expenses WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// Create new expense
router.post('/', validateExpense, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { description, amount, category, vendor, date, receipt, isDeductible } = req.body;
    const db = getDatabase();

    const expenseId = uuidv4();
    await db.run(`
      INSERT INTO expenses (id, userId, description, amount, category, vendor, date, receipt, isDeductible)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [expenseId, req.user.id, description, amount, category, vendor, date, receipt, isDeductible]);

    const newExpense = await db.get('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update expense
router.put('/:id', validateExpense, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { description, amount, category, vendor, date, receipt, isDeductible } = req.body;
    const db = getDatabase();

    // Check if expense exists and belongs to user
    const existingExpense = await db.get('SELECT * FROM expenses WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await db.run(`
      UPDATE expenses 
      SET description = ?, amount = ?, category = ?, vendor = ?, date = ?, receipt = ?, isDeductible = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ? AND userId = ?
    `, [description, amount, category, vendor, date, receipt, isDeductible, req.params.id, req.user.id]);

    const updatedExpense = await db.get('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    
    res.json(updatedExpense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const db = getDatabase();

    // Check if expense exists and belongs to user
    const existingExpense = await db.get('SELECT * FROM expenses WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await db.run('DELETE FROM expenses WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Get expense statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const db = getDatabase();
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT category, SUM(amount) as total, COUNT(*) as count FROM expenses WHERE userId = ?';
    let params = [req.user.id];
    
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }
    
    query += ' GROUP BY category ORDER BY total DESC';
    
    const categoryStats = await db.all(query, params);
    
    // Get total expenses
    let totalQuery = 'SELECT SUM(amount) as total, COUNT(*) as count FROM expenses WHERE userId = ?';
    let totalParams = [req.user.id];
    
    if (startDate) {
      totalQuery += ' AND date >= ?';
      totalParams.push(startDate);
    }
    
    if (endDate) {
      totalQuery += ' AND date <= ?';
      totalParams.push(endDate);
    }
    
    const totalStats = await db.get(totalQuery, totalParams);
    
    res.json({
      categoryStats,
      totalStats: {
        total: totalStats.total || 0,
        count: totalStats.count || 0
      }
    });
  } catch (error) {
    console.error('Get expense stats error:', error);
    res.status(500).json({ error: 'Failed to fetch expense statistics' });
  }
});

export default router;
