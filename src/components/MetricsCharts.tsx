import { useTheme } from '../context/ThemeContext';
import { LOSResult } from '../utils/calculations';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts';

interface MetricsChartsProps {
  result: LOSResult;
  desiredLos: number;
  sellOutHl: number;
  sellInHl: number;
}

export function MetricsCharts({
  result,
  desiredLos,
  sellOutHl,
  sellInHl,
}: MetricsChartsProps) {
  const { isDarkMode } = useTheme();

  const chartColors = {
    primary: isDarkMode ? '#06b6d4' : '#0891b2',
    secondary: isDarkMode ? '#14b8a6' : '#14b8a6',
    accent: isDarkMode ? '#fbbf24' : '#f59e0b',
    danger: isDarkMode ? '#ef4444' : '#dc2626',
    success: isDarkMode ? '#10b981' : '#059669',
    background: isDarkMode ? '#1e293b' : '#f8fafc',
    text: isDarkMode ? '#e2e8f0' : '#1e293b',
    gridColor: isDarkMode ? '#475569' : '#e2e8f0',
  };

  const losComparisonData = [
    {
      name: 'Current',
      value: Math.round(result.currentLos * 100) / 100,
      fill: result.currentLos < desiredLos ? chartColors.danger : chartColors.success,
    },
    {
      name: 'Target',
      value: desiredLos,
      fill: chartColors.primary,
    },
  ];

  const scenarioData = [
    {
      name: 'Current',
      los: Math.round(result.currentLos * 100) / 100,
      cases: Math.round(result.sellOutCases),
    },
    {
      name: 'After Selling',
      los: Math.round(result.losAfterSelling * 100) / 100,
      cases: Math.round(result.newSellOutCases),
    },
    {
      name: 'After Receiving',
      los: Math.round(result.losAfterReceiving * 100) / 100,
      cases: Math.round(result.newSellInCases),
    },
    {
      name: 'Predicted',
      los: Math.round(result.predictedLos * 100) / 100,
      cases: Math.round(result.adjustedSellOut),
    },
  ];

  const supplyDemandData = [
    {
      name: 'Demand',
      value: Math.round(sellOutHl * 100) / 100,
      fill: chartColors.accent,
    },
    {
      name: 'Supply',
      value: Math.round(sellInHl * 100) / 100,
      fill: chartColors.primary,
    },
  ];

  const statusData = [
    {
      name: 'Coverage',
      value: Math.max(Math.round(result.currentLos), 0),
      fill: result.currentLos < 93 ? chartColors.danger : result.currentLos > 105 ? chartColors.accent : chartColors.success,
    },
    {
      name: 'Gap to Target',
      value: Math.abs(desiredLos - result.currentLos),
      fill: chartColors.gridColor,
    },
  ];

  const tooltipStyle = {
    backgroundColor: chartColors.background,
    border: `1px solid ${chartColors.gridColor}`,
    borderRadius: '8px',
    color: chartColors.text,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className={`rounded-xl shadow-lg p-6 sm:p-8 border transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-800/50 border-slate-700'
            : 'bg-white/90 border-cyan-100'
        }`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Current vs Target LOS
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={losComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridColor} />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {losComparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-xl shadow-lg p-6 sm:p-8 border transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-800/50 border-slate-700'
            : 'bg-white/90 border-cyan-100'
        }`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Supply vs Demand
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={supplyDemandData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value} hl`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {supplyDemandData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`rounded-xl shadow-lg p-6 sm:p-8 border transition-all duration-300 ${
        isDarkMode
          ? 'bg-slate-800/50 border-slate-700'
          : 'bg-white/90 border-cyan-100'
      }`}>
        <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          LOS Scenario Analysis
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={scenarioData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridColor} />
            <XAxis dataKey="name" stroke={chartColors.text} />
            <YAxis yAxisId="left" stroke={chartColors.text} label={{ value: 'LOS %', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" stroke={chartColors.text} label={{ value: 'Cases', angle: 90, position: 'insideRight' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar yAxisId="left" dataKey="los" fill={chartColors.primary} radius={[8, 8, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="cases" stroke={chartColors.accent} strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className={`rounded-xl shadow-lg p-6 sm:p-8 border transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-800/50 border-slate-700'
            : 'bg-white/90 border-cyan-100'
        }`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Coverage Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridColor} />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-xl shadow-lg p-6 sm:p-8 border transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-800/50 border-slate-700'
            : 'bg-white/90 border-cyan-100'
        }`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Key Performance Indicators
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-200/30">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Current LOS</span>
              <span className="text-2xl font-bold text-cyan-600">{result.currentLos.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-teal-500/10 to-green-500/10 border border-teal-200/30">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Target LOS</span>
              <span className="text-2xl font-bold text-teal-600">{desiredLos.toFixed(2)}%</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-lg border ${
              result.currentLos < desiredLos
                ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200/30'
                : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200/30'
            }`}>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Variance</span>
              <span className={`text-2xl font-bold ${
                result.currentLos < desiredLos ? 'text-red-600' : 'text-green-600'
              }`}>
                {(result.currentLos - desiredLos).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-200/30">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Cases Needed</span>
              <span className="text-2xl font-bold text-amber-600">{result.casesNeeded.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
