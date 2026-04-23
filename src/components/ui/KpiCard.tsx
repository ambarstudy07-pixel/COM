import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  description?: string;
}

export function KpiCard({ title, value, icon, className, description }: KpiCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-sm border border-gray-100", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
          {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        </div>
        {icon && <div className="p-3 bg-blue-50 rounded-lg text-blue-600">{icon}</div>}
      </div>
    </div>
  );
}
