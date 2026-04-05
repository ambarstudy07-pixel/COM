import React, { useState, useMemo } from 'react';
import { Search, Calendar, LayoutDashboard } from 'lucide-react';
import { mockData } from '../data/mockData';
import KPICards from './KPICards';
import StockBarChart from './StockBarChart';
import AgencyDataTable from './AgencyDataTable';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const dates = [...new Set(mockData.map(item => item.Date))].sort().reverse();
    return dates[0] || '';
  });

  const availableDates = useMemo(() => {
    return [...new Set(mockData.map(item => item.Date))].sort().reverse();
  }, []);

  const filteredData = useMemo(() => {
    return mockData.filter(item => {
      const matchesDate = item.Date === selectedDate;
      const matchesSearch = item['Agency Name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item['Agency ID'].toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesSearch;
    });
  }, [selectedDate, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans">
      {/* Sidebar/Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">LPG Stock Monitor</h1>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ludhiana District Administration</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                Live Monitoring
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search agency name or ID..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {availableDates.map(date => (
                <option key={date} value={date}>{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          <KPICards data={filteredData} />

          <div className="grid grid-cols-1 gap-8">
            <StockBarChart data={filteredData} />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 px-1">Agency Breakdown</h3>
              <AgencyDataTable data={filteredData} />
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-200 mt-12">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Ludhiana District Administration. Data updated daily from Master Stock Sheet.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
