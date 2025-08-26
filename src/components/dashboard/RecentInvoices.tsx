import React from 'react';
import { Eye, Send, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../types';

export function RecentInvoices() {
  const { state } = useApp();
  const recentInvoices = state.invoices.slice(0, 5);

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

  const getStatusBadge = (status: InvoiceStatus) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    const icons = {
      draft: Eye,
      sent: Send,
      viewed: Eye,
      paid: DollarSign,
      overdue: Eye,
      cancelled: Eye,
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (recentInvoices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No invoices found. Create your first invoice to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="space-y-4">
        {recentInvoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all duration-300 hover:scale-105 border border-white/20 shadow-sm hover:shadow-md">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    {invoice.client.name}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(invoice.total)}
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  Due: {formatDate(invoice.dueDate)}
                </p>
              </div>
              {getStatusBadge(invoice.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}