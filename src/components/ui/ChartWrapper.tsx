import React from 'react';

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartWrapper({ title, children, className }: ChartWrapperProps) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      <div className="w-full h-[350px]">
        {children}
      </div>
    </div>
  );
}
