import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AddContactModal } from '../components/AddContactModal';
import { useContacts } from '../hooks/useContacts';
import { Contact } from '../types';
import { Users, Plus, Search, Download, Upload, Trash2, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
export function ContactManagement() {
  const {
    contacts,
    addContact,
    deleteContact,
    bulkDeleteContacts,
    getStats
  } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const stats = getStats();
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchQuery === '' || contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || contact.phoneNumber.includes(searchQuery) || contact.village?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };
  const handleSelectContact = (id: string) => {
    setSelectedContacts(prev => prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]);
  };
  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedContacts.length} contacts?`)) {
      bulkDeleteContacts(selectedContacts);
      setSelectedContacts([]);
    }
  };
  const handleAddContact = (newContact: {
    name: string;
    phoneNumber: string;
    village: string;
  }) => {
    addContact(newContact);
  };
  return <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Contact Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage alert recipients - just name, phone, and village
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, phone, or village..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Contacts</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {stats.active}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Receiving Alerts</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {stats.receiving}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Bulk Actions */}
          {selectedContacts.length > 0 && <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {selectedContacts.length} contact
                  {selectedContacts.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedContacts([])}>
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>}

          {/* Contacts Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input type="checkbox" checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0} onChange={handleSelectAll} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Village / Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Alerts Sent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredContacts.map(contact => <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <input type="checkbox" checked={selectedContacts.includes(contact.id)} onChange={() => handleSelectContact(contact.id)} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-emerald-700">
                              {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {contact.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-slate-900">
                          <Phone className="w-4 h-4 mr-2 text-slate-400" />
                          {contact.phoneNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-slate-700">
                          <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                          {contact.village}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">
                          {contact.notificationsSent}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => {
                      if (confirm(`Delete ${contact.name}?`)) {
                        deleteContact(contact.id);
                      }
                    }} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>

              {filteredContacts.length === 0 && <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No contacts found</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {searchQuery ? 'Try adjusting your search' : 'Add your first contact to get started'}
                  </p>
                </div>}
            </div>
          </Card>

          {/* Info */}
          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>
              Showing {filteredContacts.length} of {contacts.length} contacts
            </p>
            <p className="text-xs text-slate-500">
              Capacity: {contacts.length} / 300+ contacts
            </p>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      <AddContactModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddContact} />
    </div>;
}