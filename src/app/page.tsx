'use client';

import { useState, useEffect } from 'react';
import CrisisManagement from '@/components/CrisisManagement';
import StockManagement from '@/components/StockManagement';
import { mockStockData, mockCrisisData } from '@/lib/mockData';
import { fetchStockData, fetchCrisisData } from '@/lib/dataFetcher';
import { StockRecord, CrisisRecord } from '@/types/dashboard';
import { RefreshCw, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const [stockData, setStockData] = useState<StockRecord[]>(mockStockData);
  const [crisisData, setCrisisData] = useState<CrisisRecord[]>(mockCrisisData);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    // Note: These URLs would be replaced with actual Google Sheet CSV export URLs
    const stockUrl = process.env.NEXT_PUBLIC_STOCK_CSV_URL;
    const crisisUrl = process.env.NEXT_PUBLIC_CRISIS_CSV_URL;

    if (stockUrl) {
      const freshStock = await fetchStockData(stockUrl);
      if (freshStock.length > 0) setStockData(freshStock);
    }

    if (crisisUrl) {
      const freshCrisis = await fetchCrisisData(crisisUrl);
      if (freshCrisis.length > 0) setCrisisData(freshCrisis);
    }

    setLastUpdated(new Date().toLocaleString());
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                LPG Crisis & Stock Dashboard
              </h1>
              <p className="text-gray-500 font-medium">District Administration Monitoring System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Last Updated</p>
              <p className="text-sm font-semibold text-gray-600">{lastUpdated}</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-semibold text-gray-700">Refresh Data</span>
            </button>
          </div>
        </header>

        <div className="space-y-12">
          <section>
            <CrisisManagement data={crisisData} />
          </section>

          <section>
            <StockManagement data={stockData} />
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Ludhiana District Administration. Internal Use Only.
          </p>
        </footer>
      </div>
    </main>
  );
}
