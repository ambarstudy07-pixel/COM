'use client';

import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { AlertCircle, CheckCircle, Clock, PieChart as PieIcon } from 'lucide-react';
import { CrisisRecord } from '../types/dashboard';
import { KpiCard } from './ui/KpiCard';
import { ChartWrapper } from './ui/ChartWrapper';

interface CrisisManagementProps {
  data: CrisisRecord[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Resolved, In-Progress, Pending

export default function CrisisManagement({ data }: CrisisManagementProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const resolved = data.filter(r => r.CurrentStatus === 'Resolved').length;
    const inProgress = data.filter(r => r.CurrentStatus === 'In-Progress').length;
    const pending = data.filter(r => r.CurrentStatus === 'Pending').length;
    const rate = total > 0 ? (resolved / total) * 100 : 0;

    return { total, resolved, inProgress, pending, rate };
  }, [data]);

  const statusData = useMemo(() => [
    { name: 'Resolved', value: stats.resolved },
    { name: 'In-Progress', value: stats.inProgress },
    { name: 'Pending', value: stats.pending },
  ], [stats]);

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    data.forEach(r => {
      categories[r.Category] = (categories[r.Category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-red-500 pl-3">
        Crisis Management System
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Issues"
          value={stats.total}
          icon={<AlertCircle className="w-6 h-6" />}
        />
        <KpiCard
          title="Issues Resolved"
          value={stats.resolved}
          icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
          className="bg-emerald-50/50"
        />
        <KpiCard
          title="Pending / In-Progress"
          value={stats.pending + stats.inProgress}
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          className="bg-amber-50/50"
        />
        <KpiCard
          title="Resolution Rate"
          value={`${stats.rate.toFixed(1)}%`}
          icon={<PieIcon className="w-6 h-6 text-blue-600" />}
          className="bg-blue-50/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Issues Status Breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                isAnimationActive={false}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Issues by Category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </div>
  );
}
