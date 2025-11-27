import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Zap, Shield, ArrowRight, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setIsVisible(false);
    setTimeout(onStart, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        animate ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div
        className={`w-full max-w-2xl transition-all duration-700 transform ${
          animate
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-8'
        }`}
      >
        <div
          className={`rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-slate-600'
              : 'bg-gradient-to-br from-white via-cyan-50 to-blue-50 border-blue-200'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={handleStart}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all hover:scale-110 z-10 ${
              isDarkMode
                ? 'hover:bg-slate-700 text-slate-400'
                : 'hover:bg-blue-100 text-slate-500'
            }`}
          >
            <X size={24} />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Visual */}
            <div
              className={`p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden ${
                isDarkMode
                  ? 'bg-gradient-to-br from-blue-900/30 via-slate-800 to-slate-800'
                  : 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
              }`}
            >
              <div
                className={`absolute inset-0 opacity-10 ${
                  isDarkMode ? 'bg-grid' : ''
                }`}
              />

              <div className="relative z-10 space-y-6">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl ${
                  isDarkMode
                    ? 'bg-blue-900/50 border-2 border-blue-500/50'
                    : 'bg-white/20 border-2 border-white/30'
                }`}>
                  <TrendingUp
                    size={48}
                    className={isDarkMode ? 'text-blue-400' : 'text-white'}
                  />
                </div>

                <div>
                  <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-white'
                  }`}>
                    SightFlow Metrics
                  </h2>
                  <p className={`text-sm md:text-base ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-100'
                  }`}>
                    Intelligent LOS Forecasting
                  </p>
                </div>

                <div className="space-y-3 text-sm md:text-base">
                  <div className="flex items-center gap-2 justify-center">
                    <BarChart3 size={18} className={isDarkMode ? 'text-blue-400' : 'text-white'} />
                    <span className={isDarkMode ? 'text-blue-200' : 'text-blue-100'}>
                      Real-time Analytics
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Zap size={18} className={isDarkMode ? 'text-blue-400' : 'text-white'} />
                    <span className={isDarkMode ? 'text-blue-200' : 'text-blue-100'}>
                      Instant Calculations
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Shield size={18} className={isDarkMode ? 'text-blue-400' : 'text-white'} />
                    <span className={isDarkMode ? 'text-blue-200' : 'text-blue-100'}>
                      Works Offline
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Welcome to Smart Forecasting
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Analyze your supply chain performance with precision. Get instant insights, run unlimited scenarios, and export comprehensive reports—all in real-time.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Enter Your Metrics
                    </h4>
                    <p className={`text-xs md:text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Input demand and supply figures
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Get Instant Analysis
                    </h4>
                    <p className={`text-xs md:text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      View LOS and performance metrics
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Run Scenarios
                    </h4>
                    <p className={`text-xs md:text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Simulate and forecast outcomes
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={handleStart}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:scale-105"
                >
                  Get Started
                  <ArrowRight size={20} />
                </button>
                <p className={`text-xs text-center ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  No sign-up required • Works offline • Instant calculations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
