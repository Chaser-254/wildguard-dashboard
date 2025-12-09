import { useState } from 'react';
import { Contact, ContactStatus, ContactCategory, BulkImportResult } from '../types';

// Simplified mock data - just essential fields
const generateMockContacts = (): Contact[] => {
  const villages = ['Mtakuja', 'Kimana', 'Kuku', 'Rombo', 'Loitokitok'];
  const names = ['John Mwangi', 'Sarah Wanjiku', 'David Kamau', 'Grace Njeri', 'Peter Ochieng', 'Mary Akinyi', 'James Kipchoge', 'Lucy Wambui', 'Daniel Otieno', 'Faith Nyambura', 'Joseph Mutua', 'Jane Wairimu', 'Samuel Kimani', 'Rose Muthoni', 'Patrick Kariuki', 'Agnes Wangari', 'Michael Omondi', 'Catherine Njoki', 'Francis Kibet', 'Elizabeth Wanjiru', 'Thomas Maina', 'Margaret Nyokabi', 'Robert Cheruiyot', 'Anne Wangui', 'George Onyango', 'Susan Njambi', 'William Koech', 'Esther Wambui', 'Charles Mutiso', 'Rebecca Wairimu'];
  return names.map((name, index) => ({
    id: `contact-${index + 1}`,
    name,
    phoneNumber: `+254 7${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    alternatePhone: undefined,
    email: undefined,
    category: 'FARMER',
    village: villages[Math.floor(Math.random() * villages.length)],
    region: 'Kajiado County',
    status: 'ACTIVE',
    receiveAlerts: true,
    preferredLanguage: 'sw',
    notificationsSent: Math.floor(Math.random() * 20),
    lastNotified: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    addedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    addedBy: 'admin@wildguard.org',
    notes: undefined
  }));
};
export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>(generateMockContacts());

  // Simplified add contact - only requires name, phone, village
  const addContact = (simpleContact: {
    name: string;
    phoneNumber: string;
    village: string;
  }) => {
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: simpleContact.name,
      phoneNumber: simpleContact.phoneNumber,
      alternatePhone: undefined,
      email: undefined,
      category: 'FARMER',
      // Default to farmer
      village: simpleContact.village,
      region: 'Kajiado County',
      // Default region
      status: 'ACTIVE',
      // Default to active
      receiveAlerts: true,
      // Default to receiving alerts
      preferredLanguage: 'sw',
      // Default to Swahili
      notificationsSent: 0,
      lastNotified: undefined,
      addedAt: new Date().toISOString(),
      addedBy: 'current-user',
      // In real app, get from auth context
      notes: undefined
    };
    setContacts(prev => [newContact, ...prev]);
    return newContact;
  };
  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => contact.id === id ? {
      ...contact,
      ...updates
    } : contact));
  };
  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };
  const bulkDeleteContacts = (ids: string[]) => {
    setContacts(prev => prev.filter(contact => !ids.includes(contact.id)));
  };
  const importContactsFromCSV = (csvData: string): BulkImportResult => {
    const lines = csvData.split('\n').filter(line => line.trim());
    const successful = Math.floor(lines.length * 0.9);
    const failed = Math.floor(lines.length * 0.05);
    const duplicates = lines.length - successful - failed;
    return {
      successful,
      failed,
      duplicates,
      errors: failed > 0 ? [{
        row: 5,
        error: 'Invalid phone number format'
      }, {
        row: 12,
        error: 'Missing required field: name'
      }] : []
    };
  };
  const getContactsByCategory = (category: ContactCategory) => {
    return contacts.filter(c => c.category === category);
  };
  const getContactsByVillage = (village: string) => {
    return contacts.filter(c => c.village === village);
  };
  const getActiveContacts = () => {
    return contacts.filter(c => c.status === 'ACTIVE' && c.receiveAlerts);
  };
  const searchContacts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return contacts.filter(c => c.name.toLowerCase().includes(lowerQuery) || c.phoneNumber.includes(query) || c.village?.toLowerCase().includes(lowerQuery));
  };
  const getStats = () => {
    return {
      total: contacts.length,
      active: contacts.filter(c => c.status === 'ACTIVE').length,
      receiving: contacts.filter(c => c.receiveAlerts).length,
      farmers: contacts.filter(c => c.category === 'FARMER').length,
      unverified: contacts.filter(c => c.status === 'UNVERIFIED').length
    };
  };
  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    bulkDeleteContacts,
    importContactsFromCSV,
    getContactsByCategory,
    getContactsByVillage,
    getActiveContacts,
    searchContacts,
    getStats
  };
}