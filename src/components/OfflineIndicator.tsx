import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      const timer = setTimeout(() => setShowIndicator(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator && isOnline) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 z-50 ${
        isOnline
          ? isDarkMode
            ? 'bg-green-900/80 text-green-100 border border-green-700'
            : 'bg-green-100 text-green-800 border border-green-300'
          : isDarkMode
          ? 'bg-red-900/80 text-red-100 border border-red-700'
          : 'bg-red-100 text-red-800 border border-red-300'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi size={18} />
          <span className="text-sm font-medium">Back online</span>
        </>
      ) : (
        <>
          <WifiOff size={18} />
          <span className="text-sm font-medium">Offline mode</span>
        </>
      )}
    </div>
  );
}
