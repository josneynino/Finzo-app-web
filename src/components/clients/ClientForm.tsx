import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Client } from '../../types';

interface ClientFormProps {
  client?: Client | null;
  onClose: () => void;
}

export function ClientForm({ client, onClose }: ClientFormProps) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    company: client?.company || '',
    address: client?.address || '',
    phone: client?.phone || '',
    taxId: client?.taxId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a client name');
      return;
    }

    if (!formData.email.trim()) {
      alert('Please enter an email address');
      return;
    }

    const clientData: Client = {
      id: client?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      company: formData.company,
      address: formData.address,
      phone: formData.phone,
      taxId: formData.taxId,
      createdAt: client?.createdAt || new Date(),
    };

    if (client) {
      const updatedClients = state.clients.map(c => 
        c.id === client.id ? clientData : c
      );
      dispatch({ type: 'SET_CLIENTS', payload: updatedClients });
    } else {
      dispatch({ type: 'ADD_CLIENT', payload: clientData });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={client ? 'Edit Client' : 'Add Client'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Client Name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            placeholder="Enter client name"
            required
          />
          <Input
            type="email"
            label="Email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            placeholder="client@example.com"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company (Optional)"
            value={formData.company}
            onChange={(value) => setFormData({ ...formData, company: value })}
            placeholder="Company name"
          />
          <Input
            type="tel"
            label="Phone (Optional)"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <Input
          label="Address (Optional)"
          value={formData.address}
          onChange={(value) => setFormData({ ...formData, address: value })}
          placeholder="Street address, city, state, ZIP"
        />

        <Input
          label="Tax ID (Optional)"
          value={formData.taxId}
          onChange={(value) => setFormData({ ...formData, taxId: value })}
          placeholder="Tax identification number"
        />

        <div className="flex space-x-3 pt-6">
          <Button type="submit" fullWidth>
            {client ? 'Update Client' : 'Add Client'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}