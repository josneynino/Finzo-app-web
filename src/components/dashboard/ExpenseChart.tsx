import React from 'react';
import { useApp } from '../../context/AppContext';

export function ExpenseChart() {
  const { state } = useApp();

  // Calculate expense categories
  const categoryTotals = state.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels = {
    office_supplies: 'Office Supplies',
    software: 'Software',
    marketing: 'Marketing',
    travel: 'Travel',
    meals: 'Meals',
    equipment: 'Equipment',
    professional_services: 'Professional Services',
    other: 'Other',
  };

  const colors = [
    'bg-gradient-to-r from-blue-500 to-cyan-600',
    'bg-gradient-to-r from-green-500 to-emerald-600',
    'bg-gradient-to-r from-yellow-500 to-orange-600',
    'bg-gradient-to-r from-red-500 to-pink-600',
    'bg-gradient-to-r from-purple-500 to-indigo-600',
    'bg-gradient-to-r from-indigo-500 to-purple-600',
    'bg-gradient-to-r from-pink-500 to-rose-600',
    'bg-gradient-to-r from-gray-500 to-slate-600',
  ];

  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const chartData = Object.entries(categoryTotals).map(([category, amount], index) => ({
    category: categoryLabels[category as keyof typeof categoryLabels],
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    color: colors[index % colors.length],
  }));

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 font-medium">No expenses recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chartData.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm items-center">
            <span className="font-bold text-gray-800">{item.category}</span>
            <span className="text-gray-700 font-bold">${item.amount.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
            <div
              className={`h-3 rounded-full ${item.color} transition-all duration-500 hover:scale-105 shadow-sm`}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 font-medium">
            {item.percentage.toFixed(1)}% of total expenses
          </div>
        </div>
      ))}
    </div>
  );
}