import React from 'react';
import { 
  TrendingUp, 
  Brain, 
  Download, 
  Share2, 
  CheckCircle, 
  XCircle,
  Globe,
  Sparkles,
  BarChart3,
  Lock,
  AlertTriangle,
  Target,
  Shield,
  Zap,
  Activity,
  Link2,
  Search,
  MessageSquare
} from 'lucide-react';
import { CombinedAnalysis, Recommendation } from '../types/analysis';
import { 
  generateDetailedInsights, 
  generateCompetitorInsights,
  generateActionableRecommendations 
} from '../services/enhancedAnalysis';

interface Props {
  analysis: CombinedAnalysis;
  onGeneratePDF: () => void;
  onShare: () => void;
  isFreeTier?: boolean;
}

const SEOGEOResultsSinglePage: React.FC<Props> = ({ 
  analysis, 
  onGeneratePDF, 
  onShare,
  isFreeTier = false 
}) => {
  // Generate enhanced insights
  const detailedInsights = generateDetailedInsights(analysis);
  const competitorInsights = generateCompetitorInsights(analysis);
  const enhancedRecommendations = generateActionableRecommendations(analysis);

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
              <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Premium Feature</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900">{rec.title}</h4>
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[rec.priority]}`}>
              {rec.priority}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {effortIcons[rec.effort]} {rec.effort}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Impact: {rec.impact}</span>
          <span>•</span>
          <span>Category: {rec.category}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Analysis Results for {analysis.url}
            </h2>
            <p className="text-gray-600 mt-1">
              {new Date(analysis.timestamp).toLocaleString()}
            </p>
          </div>
          
          <div className="flex gap-3">
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
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Executive Summary</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">{detailedInsights.summary}</p>
      </div>

      {/* Critical Issues Alert */}
      {detailedInsights.criticalIssues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-xl font-bold text-red-900">Critical Issues Requiring Immediate Attention</h3>
          </div>
          <ul className="space-y-3">
            {detailedInsights.criticalIssues.map((issue, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-red-800">{issue}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 1. Overview Section - Main Scores */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Overall Website Performance</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {renderScoreCircle(analysis.overallScore, 'Overall Score', 'large')}
          {renderScoreCircle(analysis.seo.score, 'SEO Score')}
          {renderScoreCircle(analysis.geo.score, 'GEO Score')}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-center text-gray-700">
            Your website scores <span className={`font-bold ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}/100
            </span> overall, combining traditional SEO ({analysis.seo.score}/100) 
            and AI search visibility ({analysis.geo.score}/100).
          </p>
        </div>
      </div>

      {/* 2. Quick Wins */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-green-600" />
          <h3 className="text-xl font-bold text-gray-900">Top 3 Quick Wins</h3>
        </div>
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

      {/* 3. SEO Details */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Traditional SEO Analysis</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Technical SEO */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Technical SEO</h4>
            <div className="space-y-2">
              {Object.entries({
                'Page Speed': analysis?.seo?.technical?.pageSpeed,
                'Mobile Responsive': analysis?.seo?.technical?.mobileResponsive,
                'HTTPS Enabled': analysis?.seo?.technical?.httpsEnabled,
                'XML Sitemap': analysis?.seo?.technical?.xmlSitemap,
                'Structured Data': analysis?.seo?.technical?.structuredData
              }).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{key}</span>
                  {typeof value === 'boolean' ? (
                    value ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )
                  ) : (
                    <span className={`font-medium ${getScoreColor(typeof value === 'number' ? value : 0)}`}>
                      {typeof value === 'number' ? value : 0}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Optimization */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Content Optimization</h4>
            <div className="space-y-2">
              {Object.entries({
                'Title Tag': analysis?.seo?.content?.titleTag,
                'Meta Description': analysis?.seo?.content?.metaDescription,
                'Heading Structure': analysis?.seo?.content?.headingStructure,
                'Content Length': `${analysis?.seo?.content?.contentLength ?? ''} words`,
                'Readability Score': analysis?.seo?.content?.readabilityScore
              }).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
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

      {/* 4. GEO (AI Search) Details */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">AI Search (GEO) Analysis</h3>
        </div>
        
        <div className="space-y-6">
          {/* AI Visibility */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">AI Platform Visibility</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(analysis?.geo?.aiVisibility || {}).map(([platform, visible]) => (
                <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700 capitalize">{platform}</span>
                  {visible ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Visible
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-400">
                      <XCircle className="w-4 h-4 mr-1" />
                      Not Found
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ranking Factors */}
          {/* Removed: analysis.geo.rankingFactors (not in GEOMetrics) */}
          {/* Content Optimization Status */}
          {/* Removed: analysis.geo.contentOptimization (not in GEOMetrics) */}
        </div>
      </div>

      {/* 5. Competitor Comparison */}
      {!isFreeTier && analysis.competitorComparison.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Competitor Comparison</h3>
          <div className="space-y-4">
            {analysis.competitorComparison.map((comp, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{comp.name}</p>
                  <p className="text-sm text-gray-600">{comp.url}</p>
                </div>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-sm text-gray-500">SEO</p>
                    <p className={`font-bold ${getScoreColor(comp.seoScore)}`}>
                      {comp.seoScore}
                    </p>
                  </div>
                  <div>
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

      {/* 6. All Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <h3 className="text-xl font-bold text-gray-900">All Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          {analysis.recommendations.map((rec, index) => renderRecommendation(rec, index))}
        </div>
        
        {isFreeTier && (
          <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
            <h4 className="text-lg font-bold mb-2">Unlock {analysis.recommendations.length - 3} More Recommendations</h4>
            <p className="text-blue-100 mb-4">
              Get access to all recommendations, detailed analysis, and PDF reports
            </p>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOGEOResultsSinglePage;