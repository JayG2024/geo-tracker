// AI Provider Status Component
// Client-facing dashboard - NO API KEY VISIBILITY

import React from 'react';
import { CheckCircle, Shield, Zap, Brain, Globe, Search, TrendingUp } from 'lucide-react';

interface AIProviderStatusProps {
  className?: string;
}

const AIProviderStatus: React.FC<AIProviderStatusProps> = ({ className = '' }) => {
  // Client-facing view - only show service capabilities, not API keys
  
  const services = [
    {
      name: 'SEO Analysis',
      description: 'Google search visibility & technical SEO audit',
      icon: Search,
      status: 'active',
      features: ['SERP Rankings', 'Competitor Analysis', 'Technical SEO Score']
    },
    {
      name: 'Performance Metrics',
      description: 'Core Web Vitals & page speed optimization',
      icon: Zap,
      status: 'active',
      features: ['PageSpeed Score', 'Core Web Vitals', 'Mobile Performance']
    },
    {
      name: 'AI Visibility Testing',
      description: 'Multi-platform AI search presence analysis',
      icon: Brain,
      status: 'active',
      features: ['ChatGPT', 'Claude', 'Perplexity', 'Gemini']
    },
    {
      name: 'Global Coverage',
      description: 'International SEO and multi-language support',
      icon: Globe,
      status: 'active',
      features: ['US Market', 'Global Rankings', 'Local SEO']
    }
  ];

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Analysis Capabilities</h3>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-600">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  service.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    service.status === 'active' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    {service.status === 'active' && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {service.features.map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Enterprise-Grade Analysis</p>
            <p className="text-xs text-gray-600">
              Powered by industry-leading SEO tools and AI platforms
            </p>
          </div>
        </div>
      </div>

      {/* Service Health Summary */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">99.9%</p>
          <p className="text-xs text-gray-600">Uptime</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-600">AI Platforms</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">50+</p>
          <p className="text-xs text-gray-600">Metrics Analyzed</p>
        </div>
      </div>
    </div>
  );
};

export default AIProviderStatus;