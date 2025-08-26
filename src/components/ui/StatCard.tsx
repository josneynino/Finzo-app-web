import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  color = 'blue' 
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg',
    green: 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg',
    yellow: 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg',
    red: 'bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg',
    purple: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg',
    gray: 'bg-gradient-to-br from-gray-500 to-slate-600 text-white shadow-lg',
  };

  const changeClasses = {
    positive: 'text-green-400 font-semibold',
    negative: 'text-red-400 font-semibold',
    neutral: 'text-gray-300 font-semibold',
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-gray-800 transition-colors">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${changeClasses[changeType]}`}>
              {changeType === 'positive' && '+'}
              {change}% from last month
            </p>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}