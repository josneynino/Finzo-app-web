import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Expense, ExpenseCategory } from '../../types';

interface ExpenseFormProps {
  expense?: Expense | null;
  onClose: () => void;
}

export function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount || 0,
    category: expense?.category || 'other' as ExpenseCategory,
    vendor: expense?.vendor || '',
    date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isDeductible: expense?.isDeductible || true,
  });

  const categoryOptions = [
    { value: 'office_supplies', label: 'Office Supplies' },
    { value: 'software', label: 'Software' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'professional_services', label: 'Professional Services' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (formData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const expenseData: Expense = {
      id: expense?.id || Date.now().toString(),
      description: formData.description,
      amount: formData.amount,
      category: formData.category,
      vendor: formData.vendor,
      date: new Date(formData.date),
      isDeductible: formData.isDeductible,
      createdAt: expense?.createdAt || new Date(),
    };

    if (expense) {
      const updatedExpenses = state.expenses.map(exp => 
        exp.id === expense.id ? expenseData : exp
      );
      dispatch({ type: 'SET_EXPENSES', payload: updatedExpenses });
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: expenseData });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={expense ? 'Edit Expense' : 'Add Expense'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Enter expense description"
            required
          />
          <Input
            type="number"
            label="Amount"
            value={formData.amount}
            onChange={(value) => setFormData({ ...formData, amount: Number(value) })}
            placeholder="0.00"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value as ExpenseCategory })}
            required
          />
          <Input
            label="Vendor"
            value={formData.vendor}
            onChange={(value) => setFormData({ ...formData, vendor: value })}
            placeholder="Enter vendor name"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Date"
            value={formData.date}
            onChange={(value) => setFormData({ ...formData, date: value })}
            required
          />
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isDeductible}
                onChange={(e) => setFormData({ ...formData, isDeductible: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Tax deductible</span>
            </label>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Upload receipt (optional)</p>
            <Button type="button" variant="outline" size="sm">
              Choose File
            </Button>
          </div>
        </div>

        <div className="flex space-x-3 pt-6">
          <Button type="submit" fullWidth>
            {expense ? 'Update Expense' : 'Add Expense'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}