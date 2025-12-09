import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, BarChart3, Settings, ShieldAlert, Radio, Send, Users } from 'lucide-react';
export function Sidebar() {
  const navItems = [{
    to: '/',
    icon: LayoutDashboard,
    label: 'Dashboard'
  }, {
    to: '/history',
    icon: History,
    label: 'Alert History'
  }, {
    to: '/analytics',
    icon: BarChart3,
    label: 'Analytics'
  }, {
    to: '/notifications',
    icon: Send,
    label: 'Notifications'
  }, {
    to: '/contacts',
    icon: Users,
    label: 'Contacts'
  }];
  return <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              WildGuard Plus
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Menu
        </p>
        {navItems.map(item => <NavLink key={item.to} to={item.to} className={({
        isActive
      }) => `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-emerald-600/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>)}

        <div className="pt-8">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            System
          </p>
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors text-left">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Radio className="w-5 h-5 text-emerald-500" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">System Online</p>
            <p className="text-xs text-emerald-500">Monitoring active</p>
          </div>
        </div>
      </div>
    </div>;
}