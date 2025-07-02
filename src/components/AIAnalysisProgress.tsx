import React from 'react';
import { Brain, Loader, CheckCircle, AlertCircle } from 'lucide-react';

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

const AIAnalysisProgress: React.FC<AIAnalysisProgressProps> = ({ 
  providers, 
  isAnalyzing,
  onCancel 
}) => {
  const overallProgress = providers.reduce((sum, p) => sum + p.progress, 0) / providers.length;
  const completedProviders = providers.filter(p => p.status === 'complete').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium 3-AI Analysis in Progress</h2>
          <p className="text-gray-600">
            {completedProviders}/{providers.length} premium AI providers completed
          </p>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-900">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* AI Provider Progress */}
        <div className="space-y-4 mb-8">
          {providers.map((provider, index) => (
            <div key={provider.name} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${provider.color}`}>
                    <span className="text-lg">{provider.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{provider.name}</h4>
                    <p className="text-sm text-gray-600">{provider.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {provider.status === 'complete' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {provider.status === 'processing' && (
                    <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                  )}
                  {provider.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {provider.progress}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    provider.status === 'complete' ? 'bg-green-500' :
                    provider.status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${provider.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Analysis Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">3-AI Consensus Building</h4>
              <p className="text-blue-700 text-sm mt-1">
                GPT-4, Enhanced Gemini Pro, and Claude 3.5 analyze different aspects of your website. 
                Results will be combined using advanced consensus algorithms for maximum accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {isAnalyzing && onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel Analysis
            </button>
          )}
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing with premium AI engines...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisProgress;