import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X, Plus, Phone, MapPin, User } from 'lucide-react';
interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: {
    name: string;
    phoneNumber: string;
    village: string;
  }) => void;
}
export function AddContactModal({
  isOpen,
  onClose,
  onAdd
}: AddContactModalProps) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [village, setVillage] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    phoneNumber?: string;
    village?: string;
  }>({});
  if (!isOpen) return null;
  const validateForm = () => {
    const newErrors: {
      name?: string;
      phoneNumber?: string;
      village?: string;
    } = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    if (!village.trim()) {
      newErrors.village = 'Village/Location is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        village: village.trim()
      });
      // Reset form
      setName('');
      setPhoneNumber('');
      setVillage('');
      setErrors({});
      onClose();
    }
  };
  const handleClose = () => {
    setName('');
    setPhoneNumber('');
    setVillage('');
    setErrors({});
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Plus className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Add New Contact
            </h2>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., John Mwangi" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 transition-colors ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-emerald-500'}`} />
            </div>
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="e.g., +254 712 345 678" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 transition-colors ${errors.phoneNumber ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-emerald-500'}`} />
            </div>
            {errors.phoneNumber && <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Village/Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Village / Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={village} onChange={e => setVillage(e.target.value)} placeholder="e.g., Mtakuja Village" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 transition-colors ${errors.village ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-emerald-500'}`} />
            </div>
            {errors.village && <p className="text-sm text-red-600 mt-1">{errors.village}</p>}
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 This contact will automatically receive wildlife alerts for
              their village.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </form>
      </div>
    </div>;
}