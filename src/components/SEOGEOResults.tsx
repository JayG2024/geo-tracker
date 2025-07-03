import React, { useState } from 'react';
import { 
  Brain, 
  Download, 
  Share2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Globe,
  Sparkles,
  BarChart3,
  Lock
} from 'lucide-react';
import { CombinedAnalysis, Recommendation } from '../types/analysis';

interface Props {
  analysis: CombinedAnalysis;
  onGeneratePDF: () => void;
  onShare: () => void;
  isFreeTier?: boolean;
}

const SEOGEOResults: React.FC<Props> = ({ 
  analysis, 
  onGeneratePDF, 
  onShare,
  isFreeTier = false 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'geo' | 'recommendations'>('overview');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  const renderScoreCircle = (score: number, label: string, size: 'large' | 'medium' = 'medium') => {
    const sizeClasses = size === 'large' 
      ? 'w-32 h-32 text-3xl' 
      : 'w-24 h-24 text-2xl';

    return (
      <div className="flex flex-col items-center">
        <div className={`${sizeClasses} ${getScoreBg(score)} rounded-full flex items-center justify-center relative`}>
          <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className={getScoreColor(score)}
              strokeDasharray={`${score * 2.83} 283`}
              opacity="0.3"
            />
          </svg>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
        <p className={`text-xs ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
      </div>
    );
  };

  const renderRecommendation = (rec: Recommendation, index: number) => {
    const priorityColors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    const effortIcons = {
      easy: '⚡',
      medium: '⏱️',
      hard: '🔨'
    };

    return (
      <div key={index} className={`border rounded-lg p-4 ${isFreeTier && index > 2 ? 'opacity-50 relative' : ''}`}>
        {isFreeTier && index > 2 && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Premium Feature</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[rec.priority]}`}>
              {rec.priority.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              {rec.category === 'both' ? 'SEO + GEO' : rec.category.toUpperCase()}
            </span>
          </div>
          <span className="text-lg" title={`Effort: ${rec.effort}`}>
            {effortIcons[rec.effort]}
          </span>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Impact: {rec.impact}</span>
          <span className="text-gray-500">Time: {rec.estimatedTime}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Analysis Results for {analysis.title}
            </h2>
            <p className="text-gray-600">{analysis.url}</p>
            <p className="text-sm text-gray-500 mt-1">
              Analyzed on {new Date(analysis.lastAnalyzed).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onShare}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={onGeneratePDF}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isFreeTier 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={isFreeTier}
            >
              <Download className="w-4 h-4" />
              {isFreeTier ? 'PDF (Premium)' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'seo', label: 'SEO Details', icon: Globe },
            { id: 'geo', label: 'GEO Details', icon: Brain },
            { id: 'recommendations', label: 'Recommendations', icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Scores */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              Overall Website Performance
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {renderScoreCircle(analysis.overallScore, 'Overall Score', 'large')}
              {renderScoreCircle(analysis.seo.score, 'SEO Score')}
              {renderScoreCircle(analysis.geo.score, 'GEO Score')}
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <p className="text-center text-gray-700">
                Your website scores <span className={`font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}/100
                </span> overall, combining traditional SEO ({analysis.seo.score}/100) 
                and AI search visibility ({analysis.geo.score}/100).
              </p>
            </div>
          </div>

          {/* Quick Wins */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 3 Quick Wins
            </h3>
            <div className="space-y-3">
              {analysis.recommendations
                .filter(r => r.effort === 'easy' && r.priority !== 'low')
                .slice(0, 3)
                .map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{rec.title}</p>
                      <p className="text-sm text-gray-600">{rec.impact}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Competitor Comparison */}
          {!isFreeTier && analysis.competitorComparison.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Competitor Comparison
              </h3>
              <div className="space-y-4">
                {analysis.competitorComparison.map((comp, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{comp.name}</p>
                      <p className="text-sm text-gray-600">{comp.url}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">SEO</p>
                        <p className={`font-bold ${getScoreColor(comp.seoScore)}`}>
                          {comp.seoScore}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">GEO</p>
                        <p className={`font-bold ${getScoreColor(comp.geoScore)}`}>
                          {comp.geoScore}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Traditional SEO Analysis
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Technical SEO */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Technical SEO</h4>
              <div className="space-y-2">
                {Object.entries({
                  'Page Speed': analysis?.seo?.technical?.pageSpeed,
                  'Mobile Responsive': analysis?.seo?.technical?.mobileResponsive,
                  'HTTPS Enabled': analysis?.seo?.technical?.httpsEnabled,
                  'XML Sitemap': analysis?.seo?.technical?.xmlSitemap,
                  'Structured Data': analysis?.seo?.technical?.structuredData
                }).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{key}</span>
                    {typeof value === 'boolean' ? (
                      value ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )
                    ) : (
                      <span className={`font-medium ${getScoreColor(value as number)}`}>
                        {value}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content Optimization */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Content Optimization</h4>
              <div className="space-y-2">
                {Object.entries({
                  'Title Tag': analysis?.seo?.content?.titleTag,
                  'Meta Description': analysis?.seo?.content?.metaDescription,
                  'Heading Structure': analysis?.seo?.content?.headingStructure,
                  'Content Length': `${analysis?.seo?.content?.contentLength ?? ''} words`,
                  'Readability Score': analysis?.seo?.content?.readabilityScore
                }).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{key}</span>
                    {typeof value === 'boolean' ? (
                      value ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )
                    ) : (
                      <span className="font-medium text-gray-900">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isFreeTier && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Lock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800 font-medium">Unlock Full SEO Analysis</p>
              <p className="text-blue-600 text-sm">
                Get detailed Core Web Vitals, backlink analysis, and more
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'geo' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            AI Search (GEO) Analysis
          </h3>
          
          <div className="space-y-6">
            {/* AI Visibility */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">AI Platform Visibility</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(analysis?.geo?.aiVisibility || {}).map(([platform, visible]) => {
                  if (platform === 'score') return null;
                  return (
                    <div key={platform} className={`p-3 rounded-lg text-center ${
                      visible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className="text-sm font-medium capitalize">{platform}</p>
                      {visible ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mx-auto mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Information Accuracy */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Information Accuracy</h4>
              <div className="space-y-2">
                {Object.entries({
                  'Business Name': analysis?.geo?.informationAccuracy?.businessNameCorrect,
                  'Services Listed': analysis?.geo?.informationAccuracy?.servicesAccurate,
                  'Contact Info': analysis?.geo?.informationAccuracy?.contactInfoCorrect,
                  'Location': analysis?.geo?.informationAccuracy?.locationAccurate
                }).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{key}</span>
                    {value ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Accurate
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        Needs Update
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Position */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">AI Search Performance</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Mention Rate</span>
                  <span className="font-medium">{analysis.geo.competitivePosition.mentionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${analysis.geo.competitivePosition.mentionRate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  How often AI mentions you vs competitors in relevant queries
                </p>
              </div>
            </div>

            {isFreeTier && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <Lock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-purple-800 font-medium">Unlock Full GEO Analysis</p>
                <p className="text-purple-600 text-sm">
                  Get query-by-query analysis, AI response examples, and optimization strategies
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Optimization Recommendations
            </h3>
            {isFreeTier && (
              <span className="text-sm text-gray-500">
                Showing 3 of {analysis.recommendations.length} recommendations
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            {analysis.recommendations.map((rec, i) => renderRecommendation(rec, i))}
          </div>

          {isFreeTier && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
              <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">
                Unlock {analysis.recommendations.length - 3} More Recommendations
              </h4>
              <p className="text-gray-600 mb-4">
                Get access to all optimization strategies, priority roadmap, and implementation guides
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SEOGEOResults;