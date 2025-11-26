import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BeforeInstallPromptEvent extends Event {
  prompt?: () => Promise<void>;
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    if (deferredPrompt.prompt) {
      await deferredPrompt.prompt();
      const { outcome } = await (deferredPrompt.userChoice || Promise.resolve({ outcome: 'dismissed' }));
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-24 left-4 right-4 z-40 animate-slideDown">
      <div
        className={`rounded-xl shadow-xl border p-4 flex items-center justify-between gap-4 transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-cyan-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-cyan-900/30' : 'bg-cyan-100'
          }`}>
            <Download size={20} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} />
          </div>
          <div>
            <p className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Install SightFlow Metrics
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Works offline and on home screen
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all hover:scale-105 whitespace-nowrap"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className={`p-2 rounded-lg transition-all hover:scale-110 ${
              isDarkMode
                ? 'hover:bg-slate-700 text-slate-400'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
