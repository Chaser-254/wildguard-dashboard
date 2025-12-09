import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, Eye, Users } from 'lucide-react';
import { UserRole } from '../types';
export function UserMenu() {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  if (!user) return null;
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4" />;
      case 'RANGER':
        return <User className="w-4 h-4" />;
      case 'OBSERVER':
        return <Eye className="w-4 h-4" />;
      case 'COMMUNITY':
        return <Users className="w-4 h-4" />;
    }
  };
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700';
      case 'RANGER':
        return 'bg-blue-100 text-blue-700';
      case 'OBSERVER':
        return 'bg-amber-100 text-amber-700';
      case 'COMMUNITY':
        return 'bg-emerald-100 text-emerald-700';
    }
  };
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  return <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-3 hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors">
        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
          {getInitials(user.name)}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500">{user.organization}</p>
        </div>
      </button>

      {isOpen && <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 overflow-hidden">
            {/* User Info */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-slate-600 truncate">
                    {user.email}
                  </p>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span>{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Organization</p>
              <p className="text-sm font-medium text-slate-900">
                {user.organization}
              </p>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="w-full px-4 py-3 text-left flex items-center space-x-2 text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </>}
    </div>;
}