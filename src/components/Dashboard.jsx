import { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, LayoutDashboard, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import Papa from 'papaparse';
import { mockData } from '../data/mockData';
import KPICards from './KPICards';
import StockBarChart from './StockBarChart';
import AgencyDataTable from './AgencyDataTable';

// Replace with your Google Sheets CSV Export URL
// To get this: File > Share > Publish to web > Select Sheet and CSV format
const GOOGLE_SHEET_CSV_URL = '';

const Dashboard = () => {
  const [data, setData] = useState(mockData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('overall');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchData = async () => {
    if (!GOOGLE_SHEET_CSV_URL) {
      console.log("No Google Sheet URL provided, using mock data.");
      return;
    }

    setIsLoading(true);
    setError(null);

    Papa.parse(GOOGLE_SHEET_CSV_URL, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setData(results.data);
          setLastRefreshed(new Date());
        }
        setIsLoading(false);
      },
      error: (err) => {
        console.error("Error fetching CSV:", err);
        setError("Failed to fetch data from Google Sheets. Using offline data.");
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableDates = useMemo(() => {
    const dates = [...new Set(data.map(item => item.Date))].filter(Boolean).sort().reverse();
    return dates;
  }, [data]);


  const processedData = useMemo(() => {
    if (selectedDate === 'overall') {
      // Get the latest entry for each unique agency
      const agencyMap = new Map();
      // Sort data by date ascending so later dates overwrite
      [...data].sort((a, b) => new Date(a.Date) - new Date(b.Date)).forEach(item => {
        if (item['Agency ID']) {
          agencyMap.set(item['Agency ID'], item);
        }
      });
      return Array.from(agencyMap.values());
    }

    return data.filter(item => item.Date === selectedDate);
  }, [data, selectedDate]);

  const filteredData = useMemo(() => {
    return processedData.filter(item => {
      const matchesSearch = (item['Agency Name'] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item['Agency ID'] || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [processedData, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">LPG Stock Monitor</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                   Ludhiana District Administration
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                Live Data
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center text-amber-800 text-sm">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search agency name or ID..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span>Last Sync: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select
                className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer pr-4"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="overall">Overall Status (Latest)</option>
                <option disabled>──────────</option>
                {availableDates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
               <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                 {selectedDate === 'overall' ? 'Current Aggregate Stock' : `Stock for ${new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
               </h2>
               {selectedDate === 'overall' && (
                 <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">Showing latest available per agency</span>
               )}
            </div>
            <KPICards data={filteredData} />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <StockBarChart data={filteredData} />
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-bold text-gray-800">Agency-wise Detailed Breakdown</h3>
                <span className="text-xs text-gray-500 font-medium">{filteredData.length} Agencies Found</span>
              </div>
              <AgencyDataTable data={filteredData} />
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} Ludhiana District Administration.
          </p>
          <div className="flex items-center space-x-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operational Dashboard</span>
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
