import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const AgencyDataTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 opacity-40" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ChevronUp className="w-4 h-4 ml-1 text-blue-600" /> :
      <ChevronDown className="w-4 h-4 ml-1 text-blue-600" />;
  };

  const HeaderCell = ({ label, sortKey, align = "left" }) => (
    <th
      className={`px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors ${align === 'right' ? 'text-right' : ''}`}
      onClick={() => requestSort(sortKey)}
    >
      <div className={`flex items-center ${align === 'right' ? 'justify-end' : ''}`}>
        <span>{label}</span>
        {getSortIcon(sortKey)}
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b">
            <tr>
              <HeaderCell label="Agency ID" sortKey="Agency ID" />
              <HeaderCell label="Agency Name" sortKey="Agency Name" />
              <HeaderCell label="14.2 KG" sortKey="Closing Stock (14.2 KG)" align="right" />
              <HeaderCell label="19 KG" sortKey="Closing Stock (19 KG)" align="right" />
              <HeaderCell label="47.5 KG" sortKey="Closing Stock (47.5 KG)" align="right" />
              <HeaderCell label="425 KG" sortKey="Closing Stock (425 KG)" align="right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedData.length > 0 ? (
              sortedData.map((agency) => (
                <tr key={agency['Agency ID']} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{agency['Agency ID']}</td>
                  <td className="px-6 py-4 text-gray-600">{agency['Agency Name']}</td>
                  <td className="px-6 py-4 text-right text-blue-600 font-semibold">{agency['Closing Stock (14.2 KG)']}</td>
                  <td className="px-6 py-4 text-right text-green-600 font-semibold">{agency['Closing Stock (19 KG)']}</td>
                  <td className="px-6 py-4 text-right text-orange-600 font-semibold">{agency['Closing Stock (47.5 KG)']}</td>
                  <td className="px-6 py-4 text-right text-purple-600 font-semibold">{agency['Closing Stock (425 KG)']}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic bg-gray-50/30">
                  No records found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgencyDataTable;
