'use client';

import { useState, useEffect, useCallback } from 'react';
import CrisisManagement from '@/components/CrisisManagement';
import StockManagement from '@/components/StockManagement';
import { fetchStockData, fetchCrisisData } from '@/lib/dataFetcher';
import { StockRecord, CrisisRecord } from '@/types/dashboard';
import { RefreshCw, LayoutDashboard, AlertTriangle, Loader2 } from 'lucide-react';

const STOCK_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQYCk4qaTVSOnbdRtHnamkmKR5cDx3f7ed1TLEeBQyrdhQigA7F66EQaTVTpHWpcNT3mFj7TLv6BvUq/pub?gid=3040553&single=true&output=csv';
const CRISIS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT67ZOWHXlpMhT0G9jVskTgRCpS7CPMsOlC3bSG8F3O_4qnU0F7pfPd_j-HGTKEAn7KbjhP9unmDA3q/pub?gid=1274080822&single=true&output=csv';

export default function DashboardPage() {
  const [stockData, setStockData] = useState<StockRecord[]>([]);
  const [crisisData, setCrisisData] = useState<CrisisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setLoading(true);
    setError(null);

    try {
      const [freshStock, freshCrisis] = await Promise.all([
        fetchStockData(STOCK_CSV_URL),
        fetchCrisisData(CRISIS_CSV_URL)
      ]);

      if (freshStock.length === 0 && freshCrisis.length === 0) {
        throw new Error('Failed to fetch data from live sources.');
      }

      setStockData(freshStock);
      setCrisisData(freshCrisis);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => loadData(true);

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

        {error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex items-center gap-4 text-red-800">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Failed to load dashboard data</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Fetching latest records from Google Sheets...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <CrisisManagement data={crisisData} />
            </section>

            <section>
              <StockManagement data={stockData} />
            </section>
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-gray-200 text-center space-y-4">
          <p className="text-sm text-gray-500 max-w-3xl mx-auto italic">
            Wherever faculty is organized from outside for lectures or course development, the funds shall be shared by the district administration. Each Party shall bear its own operational costs incidental to its respective responsibilities.
          </p>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Ludhiana District Administration. Internal Use Only.
          </p>
        </footer>
      </div>
    </main>
  );
}
