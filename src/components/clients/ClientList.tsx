import React, { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { ClientForm } from './ClientForm';
import { Client } from '../../types';

export function ClientList() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const handleDelete = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      const updatedClients = state.clients.filter(client => client.id !== clientId);
      dispatch({ type: 'SET_CLIENTS', payload: updatedClients });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Clients"
          subtitle={`${state.clients.length} total clients`}
          action={
            <Button
              icon={Plus}
              onClick={() => setShowForm(true)}
            >
              Add Client
            </Button>
          }
        />

        {state.clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No clients found. Add your first client to get started.</p>
            <Button
              icon={Plus}
              onClick={() => setShowForm(true)}
            >
              Add Client
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.clients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Edit}
                      onClick={() => handleEdit(client)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Trash2}
                      onClick={() => handleDelete(client.id)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    {client.company && (
                      <p className="text-sm text-gray-600">{client.company}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>

                  {client.address && (
                    <div className="text-sm text-gray-600">
                      <p>{client.address}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Added {formatDate(client.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {showForm && (
        <ClientForm
          client={editingClient}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}