import { RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ClearButtonProps {
  onClear: () => void;
}

export function ClearButton({ onClear }: ClearButtonProps) {
  const { isDarkMode } = useTheme();

  return (
    <button
      onClick={onClear}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isDarkMode
          ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
          : 'bg-white hover:bg-slate-50 text-slate-700 shadow-md'
      }`}
      title="Clear all fields"
    >
      <RotateCcw size={18} />
      <span className="text-sm font-semibold">Clear All</span>
    </button>
  );
}
