import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { ExpenseForm } from './ExpenseForm';
import { Expense } from '../../types';

export function ExpenseList() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.user?.preferredCurrency || 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      office_supplies: 'Office Supplies',
      software: 'Software',
      marketing: 'Marketing',
      travel: 'Travel',
      meals: 'Meals',
      equipment: 'Equipment',
      professional_services: 'Professional Services',
      other: 'Other',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleDelete = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = state.expenses.filter(exp => exp.id !== expenseId);
      dispatch({ type: 'SET_EXPENSES', payload: updatedExpenses });
    }
  };

  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const deductibleExpenses = state.expenses
    .filter(expense => expense.isDeductible)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-sm text-gray-600">Deductible</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(deductibleExpenses)}</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                state.expenses
                  .filter(exp => new Date(exp.date).getMonth() === new Date().getMonth())
                  .reduce((sum, exp) => sum + exp.amount, 0)
              )}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Expenses"
          subtitle={`${state.expenses.length} total expenses`}
          action={
            <Button
              icon={Plus}
              onClick={() => setShowForm(true)}
            >
              Add Expense
            </Button>
          }
        />

        {state.expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No expenses recorded yet. Add your first expense to get started.</p>
            <Button
              icon={Plus}
              onClick={() => setShowForm(true)}
            >
              Add Expense
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductible
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getCategoryLabel(expense.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        expense.isDeductible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {expense.isDeductible ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {expense.receipt && (
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={Upload}
                            onClick={() => {}}
                          />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Edit}
                          onClick={() => handleEdit(expense)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Trash2}
                          onClick={() => handleDelete(expense.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}