import React from 'react';
import { useApp } from '../../context/AppContext';

export function IncomeChart() {
  const { state } = useApp();

  // Mock data for the chart - in a real app, this would be calculated from invoice data
  const monthlyData = [
    { month: 'Jan', income: 4500, expenses: 1200 },
    { month: 'Feb', income: 5200, expenses: 1800 },
    { month: 'Mar', income: 4800, expenses: 1500 },
    { month: 'Apr', income: 6100, expenses: 2100 },
    { month: 'May', income: 5800, expenses: 1900 },
    { month: 'Jun', income: 6500, expenses: 2300 },
  ];

  const maxValue = Math.max(...monthlyData.flatMap(d => [d.income, d.expenses]));

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mr-3 shadow-sm"></div>
          <span className="text-gray-700 font-semibold">Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mr-3 shadow-sm"></div>
          <span className="text-gray-700 font-semibold">Expenses</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {monthlyData.map((data, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm items-center">
              <span className="font-bold text-gray-800">{data.month}</span>
              <div className="space-x-4">
                <span className="text-blue-600 font-bold">${data.income.toLocaleString()}</span>
                <span className="text-red-600 font-bold">${data.expenses.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex space-x-1 h-3 rounded-full overflow-hidden shadow-inner bg-gray-100">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-500 hover:scale-105"
                style={{ width: `${(data.income / maxValue) * 100}%` }}
              />
              <div 
                className="bg-gradient-to-r from-red-500 to-pink-600 transition-all duration-500 hover:scale-105"
                style={{ width: `${(data.expenses / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}