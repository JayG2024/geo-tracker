// AI Provider Status Component
// Production dashboard for AI service monitoring

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Settings, Eye, EyeOff } from 'lucide-react';
import { getAIStatus } from '../services/aiAnalysis';
import { isProductionReady } from '../config/aiConfig';

interface AIProviderStatusProps {
  className?: string;
}

const AIProviderStatus: React.FC<AIProviderStatusProps> = ({ className = '' }) => {
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [productionStatus, setProductionStatus] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    const status = getAIStatus();
    const prodStatus = isProductionReady();
    setAiStatus(status);
    setProductionStatus(prodStatus);
  }, []);

  if (!aiStatus || !productionStatus) {
    return <div className={`animate-pulse bg-gray-100 rounded-lg h-24 ${className}`}></div>;
  }

  const getStatusIcon = (available: boolean) => {
    return available ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusColor = (available: boolean) => {
    return available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">AI Provider Status</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Settings className="w-4 h-4" />
          </button>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            productionStatus.ready ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {productionStatus.ready ? 'Production Ready' : 'Development Mode'}
          </span>
        </div>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {aiStatus.providers.map((provider: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{provider.name}</h4>
              {getStatusIcon(provider.available)}
            </div>
            <p className="text-sm text-gray-600 mb-2">{provider.specialty}</p>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.available)}`}>
              {provider.available ? 'Connected' : 'Mock Mode'}
            </span>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{aiStatus.availableProviders}/4</div>
          <div className="text-sm text-gray-600">Active Providers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(productionStatus.ready ? 95 : 75)}%
          </div>
          <div className="text-sm text-gray-600">System Readiness</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {aiStatus.configuration.consensus.weightingStrategy.charAt(0).toUpperCase() + 
             aiStatus.configuration.consensus.weightingStrategy.slice(1)}
          </div>
          <div className="text-sm text-gray-600">Consensus Method</div>
        </div>
      </div>

      {/* Production Issues */}
      {!productionStatus.ready && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-yellow-800">Production Setup Required</h4>
              <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                {productionStatus.issues.map((issue: string, index: number) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Configuration */}
      {showDetails && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Configuration Details</h4>
            <button
              onClick={() => setShowKeys(!showKeys)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
            >
              {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showKeys ? 'Hide' : 'Show'} Keys</span>
            </button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Timeout:</span>
                <span className="ml-2 text-gray-600">{aiStatus.configuration.timeout}ms</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Retry Attempts:</span>
                <span className="ml-2 text-gray-600">{aiStatus.configuration.retryAttempts}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Min Providers:</span>
                <span className="ml-2 text-gray-600">{aiStatus.configuration.consensus.minProvidersRequired}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Confidence Threshold:</span>
                <span className="ml-2 text-gray-600">{aiStatus.configuration.consensus.confidenceThreshold}</span>
              </div>
            </div>

            {showKeys && (
              <div className="bg-gray-50 rounded-lg p-3 mt-3">
                <h5 className="font-medium text-gray-900 mb-2">API Key Status</h5>
                <div className="space-y-2 font-mono text-xs">
                  {Object.entries(productionStatus.providers).map(([provider, valid]) => (
                    <div key={provider} className="flex justify-between">
                      <span className="capitalize">{provider}:</span>
                      <span className={valid ? 'text-green-600' : 'text-red-600'}>
                        {valid ? '✓ Valid' : '✗ Invalid/Missing'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Quick setup:</span>
          <button className="text-sm text-blue-600 hover:text-blue-800 underline">
            Add API Keys
          </button>
          <button className="text-sm text-blue-600 hover:text-blue-800 underline">
            Test Connections
          </button>
          <button className="text-sm text-blue-600 hover:text-blue-800 underline">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIProviderStatus;