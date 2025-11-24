import { Clock, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { getHistory, clearHistory, deleteHistoryItem } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

interface HistoryPanelProps {
  onLoadHistory: (sellOut: string, sellIn: string, desired: string) => void;
}

export function HistoryPanel({ onLoadHistory }: HistoryPanelProps) {
  const { isDarkMode } = useTheme();
  const [history, setHistory] = useState(getHistory());
  const [isOpen, setIsOpen] = useState(false);

  const handleClearAll = () => {
    if (confirm('Clear all calculation history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  };

  const handleLoad = (sellOut: number, sellIn: number, desired: number) => {
    onLoadHistory(sellOut.toString(), sellIn.toString(), desired.toString());
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setHistory(getHistory());
          setIsOpen(true);
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          isDarkMode
            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            : 'bg-white hover:bg-slate-50 text-slate-700 shadow-md'
        }`}
      >
        <Clock size={18} />
        <span className="text-sm font-semibold">History ({getHistory().length})</span>
      </button>
    );
  }

  return (
    <div className={`backdrop-blur-sm rounded-xl shadow-xl p-6 border transition-all duration-300 ${
      isDarkMode
        ? 'bg-slate-800/90 border-slate-700'
        : 'bg-white/90 border-cyan-100'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={20} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} />
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Recent Calculations
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                isDarkMode
                  ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300'
                  : 'bg-red-50 hover:bg-red-100 text-red-600'
              }`}
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 rounded-lg transition-all ${
              isDarkMode
                ? 'hover:bg-slate-700 text-slate-400'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className={`text-sm text-center py-8 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          No calculation history yet
        </p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                isDarkMode
                  ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                  : 'bg-slate-50 border-slate-200 hover:border-cyan-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => handleLoad(item.sellOutHl, item.sellInHl, item.desiredLos)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Sell Out:</span>
                      <span className={`ml-1 font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {item.sellOutHl} hl
                      </span>
                    </div>
                    <div>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Sell In:</span>
                      <span className={`ml-1 font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {item.sellInHl} hl
                      </span>
                    </div>
                    <div>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>LOS:</span>
                      <span className={`ml-1 font-semibold ${
                        item.currentLos < 93
                          ? 'text-red-500'
                          : item.currentLos <= 103
                          ? 'text-green-500'
                          : 'text-orange-500'
                      }`}>
                        {item.currentLos.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className={`p-1 rounded transition-all ${
                    isDarkMode
                      ? 'hover:bg-red-900/30 text-red-400'
                      : 'hover:bg-red-50 text-red-500'
                  }`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
