import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, Brain, Globe, Zap, CheckCircle } from 'lucide-react';

interface Props {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  isFreeTier?: boolean;
  scansRemaining?: number;
}

const SEOGEOAnalysisForm: React.FC<Props> = ({ 
  onAnalyze, 
  isLoading, 
  isFreeTier = false,
  scansRemaining = 999 
}) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      onAnalyze(urlObj.href);
      setUrl('');
    } catch {
      setError('Please enter a valid URL');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            GEO AI Testing Platform
          </h1>
          <p className="text-xl text-blue-100 mb-2">
            Test your website's visibility across AI search engines and chatbots
          </p>
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              <span className="text-sm">ChatGPT & Claude</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">Perplexity & Gemini</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Real-Time Testing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Form */}
      <div className="p-8">
        {/* Welcome Message */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Unlimited AI Visibility Testing</h4>
              <p className="text-green-700 text-sm mt-1">
                Test how AI search engines see and rank your website. Completely free, no limits!
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="website-url">
              Website URL
            </label>
            <div className="relative">
              <input
                id="website-url"
                name="website-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com or https://example.com"
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || (isFreeTier && scansRemaining === 0)}
              />
              <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* What We Analyze */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Traditional SEO Analysis</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>✓ Technical SEO health</li>
                    <li>✓ Content optimization</li>
                    <li>✓ Page speed & Core Web Vitals</li>
                    <li>✓ Mobile responsiveness</li>
                    <li>✓ Schema & structured data</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white p-2 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Search (GEO) Analysis</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>✓ AI visibility score</li>
                    <li>✓ ChatGPT, Claude, Perplexity presence</li>
                    <li>✓ Information accuracy check</li>
                    <li>✓ AI-friendly content structure</li>
                    <li>✓ Competitive AI positioning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (isFreeTier && scansRemaining === 0)}
            className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all ${
              isLoading || (isFreeTier && scansRemaining === 0)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing SEO + GEO Performance...
              </span>
            ) : isFreeTier && scansRemaining === 0 ? (
              'No Free Scans Remaining - Upgrade to Continue'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Analyze Website (Free)
              </span>
            )}
          </button>

          {/* Trust Signals */}
          <div className="text-center text-sm text-gray-500">
            <p>Trusted by 500+ businesses • No credit card required</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SEOGEOAnalysisForm;