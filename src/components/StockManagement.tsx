'use client';

import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Home, ShoppingBag, Factory, TrendingDown } from 'lucide-react';
import { StockRecord } from '../types/dashboard';
import { KpiCard } from './ui/KpiCard';
import { ChartWrapper } from './ui/ChartWrapper';

interface StockManagementProps {
  data: StockRecord[];
}

export default function StockManagement({ data }: StockManagementProps) {
  // Aggregate the most recent stock levels for each agency
  const latestStockByAgency = useMemo(() => {
    const agencies: Record<string, StockRecord> = {};
    // Sort by date to ensure we get the latest if multiple entries exist
    [...data].sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()).forEach(record => {
      agencies[record.AgencyName] = record;
    });
    return Object.values(agencies);
  }, [data]);

  const stats = useMemo(() => {
    let domestic = 0;
    let commercial = 0;
    let industrial = 0;
    let backlog = 0;

    latestStockByAgency.forEach(r => {
      domestic += r.DomesticClosingStock;
      commercial += r.CommercialClosingStock;
      industrial += (r.IndustrialClosingStock47_5 + r.IndustrialClosingStock425);
      backlog += r.DomesticBacklog;
    });

    return { domestic, commercial, industrial, backlog };
  }, [latestStockByAgency]);

  const top10Agencies = useMemo(() => {
    return [...latestStockByAgency]
      .sort((a, b) => b.DomesticClosingStock - a.DomesticClosingStock)
      .slice(0, 10)
      .map(r => ({
        name: r.AgencyName.length > 15 ? r.AgencyName.substring(0, 12) + '...' : r.AgencyName,
        Domestic: r.DomesticClosingStock,
        Commercial: r.CommercialClosingStock,
        Industrial: r.IndustrialClosingStock47_5 + r.IndustrialClosingStock425,
      }));
  }, [latestStockByAgency]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
        LPG Stock Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Domestic Stock (14.2kg)"
          value={stats.domestic}
          icon={<Home className="w-6 h-6 text-orange-600" />}
          className="border-orange-100 bg-orange-50/30"
          description="District Total"
        />
        <KpiCard
          title="Commercial Stock (19kg)"
          value={stats.commercial}
          icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
          className="border-blue-100 bg-blue-50/30"
          description="District Total"
        />
        <KpiCard
          title="Industrial Stock"
          value={stats.industrial}
          icon={<Factory className="w-6 h-6 text-purple-600" />}
          className="border-purple-100 bg-purple-50/30"
          description="Combined 47.5kg & 425kg"
        />
        <KpiCard
          title="Domestic Backlog"
          value={stats.backlog}
          icon={<TrendingDown className="w-6 h-6 text-red-600" />}
          className="border-red-100 bg-red-50/30"
          description="Pending Deliveries"
        />
      </div>

      <ChartWrapper title="Top 10 Agencies by Stock Levels">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={top10Agencies}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={70}
                style={{ fontSize: '12px' }}
            />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Bar dataKey="Domestic" fill="#f97316" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="Commercial" fill="#3b82f6" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="Industrial" fill="#a855f7" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
