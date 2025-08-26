import React, { useState } from 'react';
import { Plus, Edit, Eye, Trash2, Send, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { InvoiceForm } from './InvoiceForm';
import { Invoice, InvoiceStatus } from '../../types';

export function InvoiceList() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

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

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleDelete = (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      dispatch({ type: 'DELETE_INVOICE', payload: invoiceId });
    }
  };

  const handleStatusChange = (invoice: Invoice, newStatus: InvoiceStatus) => {
    const updatedInvoice = { ...invoice, status: newStatus };
    dispatch({ type: 'UPDATE_INVOICE', payload: updatedInvoice });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Invoices"
          subtitle={`${state.invoices.length} total invoices`}
          action={
            <Button
              icon={Plus}
              onClick={() => setShowForm(true)}
            >
              New Invoice
            </Button>
          }
        />

        {state.invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No invoices found. Create your first invoice to get started.</p>
            <Button
              icon={Plus}
              onClick={() => setShowForm(true)}
            >
              Create Invoice
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">
                        Created {formatDate(invoice.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.client.name}</div>
                      <div className="text-sm text-gray-500">{invoice.client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Eye}
                          onClick={() => {}}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Edit}
                          onClick={() => handleEdit(invoice)}
                        />
                        {invoice.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={Send}
                            onClick={() => handleStatusChange(invoice, 'sent')}
                          />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Download}
                          onClick={() => {}}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Trash2}
                          onClick={() => handleDelete(invoice.id)}
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
        <InvoiceForm
          invoice={editingInvoice}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}