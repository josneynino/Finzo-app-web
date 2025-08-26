import express from 'express';
import { getDatabase } from '../config/initDatabase.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const db = getDatabase();
    const { startDate, endDate } = req.query;
    
    let dateFilter = '';
    let params = [req.user.id];
    
    if (startDate && endDate) {
      dateFilter = 'AND issueDate >= ? AND issueDate <= ?';
      params.push(startDate, endDate);
    }
    
    // Get invoice statistics
    const invoiceStats = await db.get(`
      SELECT 
        COUNT(*) as totalInvoices,
        SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END) as totalIncome,
        SUM(CASE WHEN status = 'sent' THEN total ELSE 0 END) as pendingAmount,
        COUNT(CASE WHEN status = 'sent' THEN 1 END) as pendingInvoices,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdueInvoices,
        SUM(CASE WHEN status = 'overdue' THEN total ELSE 0 END) as overdueAmount
      FROM invoices 
      WHERE userId = ? ${dateFilter}
    `, params);
    
    // Get expense statistics
    let expenseDateFilter = '';
    let expenseParams = [req.user.id];
    
    if (startDate && endDate) {
      expenseDateFilter = 'AND date >= ? AND date <= ?';
      expenseParams.push(startDate, endDate);
    }
    
    const expenseStats = await db.get(`
      SELECT 
        SUM(amount) as totalExpenses,
        COUNT(*) as totalExpenseCount,
        SUM(CASE WHEN isDeductible = 1 THEN amount ELSE 0 END) as deductibleExpenses
      FROM expenses 
      WHERE userId = ? ${expenseDateFilter}
    `, expenseParams);
    
    // Calculate net income
    const totalIncome = invoiceStats.totalIncome || 0;
    const totalExpenses = expenseStats.totalExpenses || 0;
    const netIncome = totalIncome - totalExpenses;
    
    // Get recent invoices
    const recentInvoices = await db.all(`
      SELECT i.*, c.name as clientName, c.company as clientCompany
      FROM invoices i
      LEFT JOIN clients c ON i.clientId = c.id
      WHERE i.userId = ?
      ORDER BY i.createdAt DESC
      LIMIT 5
    `, [req.user.id]);
    
    // Get recent expenses
    const recentExpenses = await db.all(`
      SELECT *
      FROM expenses
      WHERE userId = ?
      ORDER BY createdAt DESC
      LIMIT 5
    `, [req.user.id]);
    
    // Get monthly income data for chart
    const monthlyIncome = await db.all(`
      SELECT 
        strftime('%Y-%m', issueDate) as month,
        SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END) as income
      FROM invoices 
      WHERE userId = ? AND status = 'paid'
      GROUP BY strftime('%Y-%m', issueDate)
      ORDER BY month DESC
      LIMIT 12
    `, [req.user.id]);
    
    // Get expense categories for chart
    const expenseCategories = await db.all(`
      SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM expenses 
      WHERE userId = ?
      GROUP BY category
      ORDER BY total DESC
    `, [req.user.id]);
    
    res.json({
      invoiceStats: {
        totalInvoices: invoiceStats.totalInvoices || 0,
        totalIncome,
        pendingAmount: invoiceStats.pendingAmount || 0,
        pendingInvoices: invoiceStats.pendingInvoices || 0,
        overdueInvoices: invoiceStats.overdueInvoices || 0,
        overdueAmount: invoiceStats.overdueAmount || 0
      },
      expenseStats: {
        totalExpenses,
        totalExpenseCount: expenseStats.totalExpenseCount || 0,
        deductibleExpenses: expenseStats.deductibleExpenses || 0
      },
      netIncome,
      recentInvoices,
      recentExpenses,
      charts: {
        monthlyIncome,
        expenseCategories
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get quick actions data
router.get('/quick-actions', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Get clients count
    const clientsCount = await db.get('SELECT COUNT(*) as count FROM clients WHERE userId = ?', [req.user.id]);
    
    // Get invoices by status
    const invoicesByStatus = await db.all(`
      SELECT status, COUNT(*) as count
      FROM invoices 
      WHERE userId = ?
      GROUP BY status
    `, [req.user.id]);
    
    // Get expenses by category
    const expensesByCategory = await db.all(`
      SELECT category, COUNT(*) as count, SUM(amount) as total
      FROM expenses 
      WHERE userId = ?
      GROUP BY category
      ORDER BY total DESC
      LIMIT 5
    `, [req.user.id]);
    
    res.json({
      clientsCount: clientsCount.count,
      invoicesByStatus,
      topExpenseCategories: expensesByCategory
    });
  } catch (error) {
    console.error('Get quick actions error:', error);
    res.status(500).json({ error: 'Failed to fetch quick actions data' });
  }
});

export default router;
