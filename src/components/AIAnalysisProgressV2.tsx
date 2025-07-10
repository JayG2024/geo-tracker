import React, { useEffect, useState } from 'react';
import { Brain, Loader, CheckCircle, AlertCircle, Sparkles, Zap, Search, BarChart } from 'lucide-react';

interface AIProvider {
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
  specialty: string;
  color: string;
  icon: string;
}

interface AIAnalysisProgressProps {
  providers: AIProvider[];
  isAnalyzing: boolean;
  onCancel?: () => void;
}

const AIAnalysisProgressV2: React.FC<AIAnalysisProgressProps> = ({ 
  providers, 
  isAnalyzing,
  onCancel 
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const overallProgress = providers.reduce((sum, p) => sum + p.progress, 0) / providers.length;
  const completedProviders = providers.filter(p => p.status === 'complete').length;
  
  useEffect(() => {
    // Smooth animation for overall progress
    const timer = setTimeout(() => {
      setAnimatedProgress(overallProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [overallProgress]);

  // Animated background particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 z-50 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-white rounded-full opacity-10 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl p-8 w-full max-w-3xl shadow-2xl transform scale-100 animate-fadeIn">
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse"></div>
        
        <div className="relative">
          {/* Header with animated logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-5 rounded-full w-20 h-20 mx-auto mb-4 animate-spin-slow">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              AI-Powered Analysis in Progress
            </h2>
            <p className="text-lg text-gray-600">
              <span className="text-blue-600 font-semibold">{completedProviders}</span> of{' '}
              <span className="text-purple-600 font-semibold">{providers.length}</span> AI engines completed
            </p>
          </div>

          {/* Large prominent overall progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Overall Analysis Progress
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {Math.round(animatedProgress)}%
              </span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-shimmer"
              ></div>
              <div 
                className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-6 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                style={{ width: `${animatedProgress}%` }}
              >
                {animatedProgress > 10 && (
                  <Zap className="w-4 h-4 text-white animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* AI Provider cards with enhanced styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {providers.map((provider, index) => (
              <div 
                key={provider.name} 
                className={`relative border-2 rounded-xl p-5 transition-all duration-300 ${
                  provider.status === 'processing' 
                    ? 'border-blue-300 bg-blue-50 shadow-lg scale-105' 
                    : provider.status === 'complete'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {provider.status === 'processing' && (
                  <div className="absolute inset-0 rounded-xl bg-blue-400 opacity-10 animate-pulse"></div>
                )}
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${provider.color} ${
                        provider.status === 'processing' ? 'animate-bounce' : ''
                      }`}>
                        <span className="text-2xl">{provider.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{provider.name}</h4>
                        <p className="text-sm text-gray-600">{provider.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {provider.status === 'complete' && (
                        <CheckCircle className="w-6 h-6 text-green-500 animate-scale-in" />
                      )}
                      {provider.status === 'processing' && (
                        <div className="relative">
                          <Loader className="w-6 h-6 text-blue-500 animate-spin" />
                          <div className="absolute inset-0 w-6 h-6 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                        </div>
                      )}
                      {provider.status === 'error' && (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className={`${
                        provider.status === 'processing' ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {provider.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 relative overflow-hidden ${
                          provider.status === 'complete' ? 'bg-green-500' :
                          provider.status === 'error' ? 'bg-red-500' :
                          'bg-gradient-to-r from-blue-500 to-purple-500'
                        }`}
                        style={{ width: `${provider.progress}%` }}
                      >
                        {provider.status === 'processing' && (
                          <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced status message */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300 rounded-xl p-5 mb-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 text-lg mb-1">Deep AI Analysis Underway</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Our advanced AI engines are thoroughly analyzing your website's SEO performance, content quality, 
                  technical optimization, and AI visibility across multiple platforms. This comprehensive analysis 
                  typically takes 30-60 seconds.
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm text-blue-700">
                  <span className="flex items-center gap-1">
                    <BarChart className="w-4 h-4" />
                    Analyzing {Math.round(animatedProgress * 1.5)} data points
                  </span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    {4 - completedProviders} engines running
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action section */}
          <div className="flex justify-center items-center space-x-4">
            {isAnalyzing && (
              <div className="flex items-center space-x-3 px-6 py-3 bg-gray-100 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-gray-700 font-medium">Processing with premium AI engines</span>
              </div>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scale-in {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AIAnalysisProgressV2;