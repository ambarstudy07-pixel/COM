import React from 'react';
import { Package } from 'lucide-react';

const KPICard = ({ title, value, color }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color} flex items-center space-x-4`}>
      <div className={`p-3 rounded-full bg-gray-50`}>
        <Package className="w-6 h-6 text-gray-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const KPICards = ({ data }) => {
  const totals = {
    '14.2 KG': data.reduce((sum, item) => sum + (item['Closing Stock (14.2 KG)'] || 0), 0),
    '19 KG': data.reduce((sum, item) => sum + (item['Closing Stock (19 KG)'] || 0), 0),
    '47.5 KG': data.reduce((sum, item) => sum + (item['Closing Stock (47.5 KG)'] || 0), 0),
    '425 KG': data.reduce((sum, item) => sum + (item['Closing Stock (425 KG)'] || 0), 0),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KPICard title="Total 14.2 KG" value={totals['14.2 KG']} color="border-blue-500" />
      <KPICard title="Total 19 KG" value={totals['19 KG']} color="border-green-500" />
      <KPICard title="Total 47.5 KG" value={totals['47.5 KG']} color="border-orange-500" />
      <KPICard title="Total 425 KG" value={totals['425 KG']} color="border-purple-500" />
    </div>
  );
};

export default KPICards;
