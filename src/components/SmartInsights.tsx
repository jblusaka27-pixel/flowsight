import { Lightbulb, AlertCircle, TrendingUp, Target } from 'lucide-react';
import { LOSResult } from '../utils/calculations';
import { useTheme } from '../context/ThemeContext';

interface SmartInsightsProps {
  result: LOSResult;
  desiredLos: number;
  sellOutHl: number;
  sellInHl: number;
}

export function SmartInsights({ result, desiredLos, sellOutHl, sellInHl }: SmartInsightsProps) {
  const { isDarkMode } = useTheme();

  const generateInsights = () => {
    const insights: Array<{
      type: 'critical' | 'warning' | 'success' | 'info';
      title: string;
      message: string;
      icon: typeof AlertCircle;
    }> = [];

    const gap = desiredLos - result.currentLos;
    const casesGap = Math.abs(result.casesNeeded);

    if (result.currentLos < 93) {
      insights.push({
        type: 'critical',
        title: 'Critical Coverage',
        message: `Your coverage is ${(93 - result.currentLos).toFixed(1)}% below the minimum threshold. Immediate action needed to increase sales or reduce inventory.`,
        icon: AlertCircle,
      });
    }

    if (gap > 5) {
      insights.push({
        type: 'warning',
        title: 'Below Target',
        message: `You need to sell ${casesGap.toFixed(0)} additional cases to reach your ${desiredLos.toFixed(0)}% target. Focus on accelerating sales velocity.`,
        icon: TrendingUp,
      });
    }

    if (result.currentLos > desiredLos + 10) {
      insights.push({
        type: 'warning',
        title: 'Excess Inventory',
        message: `Coverage is ${(result.currentLos - desiredLos).toFixed(1)}% above target. Consider reducing incoming orders or increasing promotional activities.`,
        icon: AlertCircle,
      });
    }

    if (result.losAfterReceiving < result.currentLos && result.losAfterReceiving > 0) {
      insights.push({
        type: 'info',
        title: 'Receiving Impact',
        message: `Incoming stock will decrease coverage to ${result.losAfterReceiving.toFixed(1)}%. Plan sales initiatives accordingly.`,
        icon: TrendingUp,
      });
    }

    if (result.currentLos >= 93 && result.currentLos <= 103) {
      insights.push({
        type: 'success',
        title: 'Optimal Performance',
        message: `Excellent! Your coverage is in the optimal range. Maintain current execution and monitor demand patterns regularly.`,
        icon: Target,
      });
    }

    const sellInCases = sellInHl / 0.09;
    const sellOutCases = sellOutHl / 0.09;
    const turnoverRatio = sellOutCases / sellInCases;

    if (turnoverRatio < 0.7) {
      insights.push({
        type: 'warning',
        title: 'Low Turnover',
        message: `Current turnover ratio is ${(turnoverRatio * 100).toFixed(1)}%. Product may be under-performing; consider reviewing demand forecasts.`,
        icon: AlertCircle,
      });
    }

    return insights.slice(0, 3);
  };

  const insights = generateInsights();

  const getInsightColors = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          bg: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
          border: isDarkMode ? 'border-red-800' : 'border-red-200',
          icon: isDarkMode ? 'text-red-400' : 'text-red-600',
          title: isDarkMode ? 'text-red-300' : 'text-red-700',
          text: isDarkMode ? 'text-red-200' : 'text-red-600',
        };
      case 'warning':
        return {
          bg: isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50',
          border: isDarkMode ? 'border-orange-800' : 'border-orange-200',
          icon: isDarkMode ? 'text-orange-400' : 'text-orange-600',
          title: isDarkMode ? 'text-orange-300' : 'text-orange-700',
          text: isDarkMode ? 'text-orange-200' : 'text-orange-600',
        };
      case 'success':
        return {
          bg: isDarkMode ? 'bg-green-900/20' : 'bg-green-50',
          border: isDarkMode ? 'border-green-800' : 'border-green-200',
          icon: isDarkMode ? 'text-green-400' : 'text-green-600',
          title: isDarkMode ? 'text-green-300' : 'text-green-700',
          text: isDarkMode ? 'text-green-200' : 'text-green-600',
        };
      default:
        return {
          bg: isDarkMode ? 'bg-cyan-900/20' : 'bg-cyan-50',
          border: isDarkMode ? 'border-cyan-800' : 'border-cyan-200',
          icon: isDarkMode ? 'text-cyan-400' : 'text-cyan-600',
          title: isDarkMode ? 'text-cyan-300' : 'text-cyan-700',
          text: isDarkMode ? 'text-cyan-200' : 'text-cyan-600',
        };
    }
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className={`backdrop-blur-sm rounded-xl shadow-xl p-6 border animate-slideUp transition-all duration-300 ${
      isDarkMode
        ? 'bg-slate-800/90 border-slate-700'
        : 'bg-white/90 border-cyan-100'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-cyan-100'}`}>
          <Lightbulb size={20} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
        </div>
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          Smart Insights
        </h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          const colors = getInsightColors(insight.type);

          return (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 transition-all animate-slideUp hover:shadow-md ${colors.bg} ${colors.border}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <Icon size={18} className={`flex-shrink-0 mt-0.5 ${colors.icon}`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm mb-1 ${colors.title}`}>
                    {insight.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${colors.text}`}>
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
