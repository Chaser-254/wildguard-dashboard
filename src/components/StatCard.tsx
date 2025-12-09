import React from 'react';
import { Card, CardContent } from './ui/Card';
import { BoxIcon } from 'lucide-react';
interface StatCardProps {
  label: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'emerald' | 'amber' | 'blue' | 'slate';
}
export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = 'emerald'
}: StatCardProps) {
  const colorStyles = {
    emerald: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
    blue: 'text-blue-600 bg-blue-50',
    slate: 'text-slate-600 bg-slate-50'
  };
  return <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            {trend && <p className={`text-xs mt-1 font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}
                {trend.value}% from yesterday
              </p>}
          </div>
          <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>;
}