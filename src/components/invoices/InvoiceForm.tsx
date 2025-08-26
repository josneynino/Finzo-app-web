import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Invoice, InvoiceItem, Client } from '../../types';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onClose: () => void;
}

export function InvoiceForm({ invoice, onClose }: InvoiceFormProps) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    invoiceNumber: invoice?.invoiceNumber || `INV-${Date.now()}`,
    clientId: invoice?.clientId || '',
    items: invoice?.items || [{
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }],
    taxRate: invoice?.taxRate || 0.21,
    notes: invoice?.notes || '',
    issueDate: invoice?.issueDate ? new Date(invoice.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
  });

  const clientOptions = state.clients.map(client => ({
    value: client.id,
    label: client.name,
  }));

  const selectedClient = state.clients.find(c => c.id === formData.clientId);

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: updatedItems });
    }
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * formData.taxRate;
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !selectedClient) {
      alert('Please select a client');
      return;
    }

    if (!formData.dueDate) {
      alert('Please select a due date');
      return;
    }

    const invoiceData: Invoice = {
      id: invoice?.id || Date.now().toString(),
      invoiceNumber: formData.invoiceNumber,
      clientId: formData.clientId,
      client: selectedClient,
      items: formData.items,
      subtotal,
      taxRate: formData.taxRate,
      taxAmount,
      total,
      status: invoice?.status || 'draft',
      issueDate: new Date(formData.issueDate),
      dueDate: new Date(formData.dueDate),
      notes: formData.notes,
      createdAt: invoice?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (invoice) {
      dispatch({ type: 'UPDATE_INVOICE', payload: invoiceData });
    } else {
      dispatch({ type: 'ADD_INVOICE', payload: invoiceData });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={invoice ? 'Edit Invoice' : 'Create Invoice'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Invoice Number"
            value={formData.invoiceNumber}
            onChange={(value) => setFormData({ ...formData, invoiceNumber: value })}
            required
          />
          <Select
            label="Client"
            options={clientOptions}
            value={formData.clientId}
            onChange={(value) => setFormData({ ...formData, clientId: value })}
            placeholder="Select a client"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Issue Date"
            value={formData.issueDate}
            onChange={(value) => setFormData({ ...formData, issueDate: value })}
            required
          />
          <Input
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(value) => setFormData({ ...formData, dueDate: value })}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Items</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={addItem}
            >
              Add Item
            </Button>
          </div>
          
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(value) => updateItem(index, 'description', value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(value) => updateItem(index, 'quantity', Number(value))}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(value) => updateItem(index, 'unitPrice', Number(value))}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    value={item.total.toFixed(2)}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tax Rate:</span>
              <div className="w-20">
                <Input
                  type="number"
                  value={formData.taxRate * 100}
                  onChange={(value) => setFormData({ ...formData, taxRate: Number(value) / 100 })}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span>Tax Amount:</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Input
          label="Notes (Optional)"
          value={formData.notes}
          onChange={(value) => setFormData({ ...formData, notes: value })}
          placeholder="Additional notes or terms..."
        />

        <div className="flex space-x-3 pt-6">
          <Button type="submit" fullWidth>
            {invoice ? 'Update Invoice' : 'Create Invoice'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}