import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const StockBarChart = ({ data }) => {
  // Transform data for chart if necessary, but the structure is already close
  const chartData = data.map(item => ({
    name: item['Agency Name'],
    '14.2 KG': item['Closing Stock (14.2 KG)'],
    '19 KG': item['Closing Stock (19 KG)'],
    '47.5 KG': item['Closing Stock (47.5 KG)'],
    '425 KG': item['Closing Stock (425 KG)'],
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Agency-wise Stock Levels</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend verticalAlign="top" align="right" height={36} />
            <Bar dataKey="14.2 KG" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="19 KG" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="47.5 KG" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="425 KG" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockBarChart;
