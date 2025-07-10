import React, { useState } from 'react';
import { 
  CircularScoreDisplay, 
  SpeedometerScore, 
  GradeDisplay, 
  MilestoneProgressBar,
  AnimatedScoreCounter 
} from './ScoreDisplayVariants';
import { FreemiumSuggestions, QuickWins, ScorePredictor } from './FreemiumSuggestions';
import { Button } from './ui/button';
import { Download, Share2, RefreshCw, TrendingUp, Award, Target, Zap } from 'lucide-react';

interface EnhancedResultsDisplayProps {
  analysis: any;
  url: string;
  onReanalyze?: () => void;
  onShare?: () => void;
  onDownloadPDF?: () => void;
}

export function EnhancedResultsDisplay({ 
  analysis, 
  url, 
  onReanalyze, 
  onShare, 
  onDownloadPDF 
}: EnhancedResultsDisplayProps) {
  const [displayMode, setDisplayMode] = useState<'circular' | 'speedometer' | 'grade' | 'progress' | 'animated'>('circular');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Convert recommendations to suggestions format
  const suggestions = analysis.recommendations?.map((rec: any, index: number) => ({
    id: `rec-${index}`,
    title: rec.issue || rec.title || 'Optimization Opportunity',
    impact: rec.priority === 'high' ? 'high' : rec.priority === 'medium' ? 'medium' : 'low',
    category: rec.category || 'General',
    preview: rec.impact || rec.description || 'Improve this aspect of your site',
    fullDetails: rec.solution,
    estimatedImprovement: rec.estimatedImprovement || '+2-5 points'
  })) || [];
  
  const renderScoreDisplay = () => {
    switch (displayMode) {
      case 'circular':
        return (
          <div className="flex justify-center gap-8">
            <CircularScoreDisplay 
              score={analysis.seo?.score || 0} 
              label="SEO Score" 
              type="seo"
            />
            <CircularScoreDisplay 
              score={analysis.geo?.score || 0} 
              label="GEO Score" 
              type="geo"
            />
          </div>
        );
      case 'speedometer':
        return (
          <div className="flex justify-center gap-8">
            <SpeedometerScore score={analysis.seo?.score || 0} label="SEO Score" type="seo" />
            <SpeedometerScore score={analysis.geo?.score || 0} label="GEO Score" type="geo" />
          </div>
        );
      case 'grade':
        return (
          <div className="flex justify-center gap-16">
            <GradeDisplay score={analysis.seo?.score || 0} label="SEO Grade" type="seo" />
            <GradeDisplay score={analysis.geo?.score || 0} label="GEO Grade" type="geo" />
          </div>
        );
      case 'progress':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <MilestoneProgressBar score={analysis.seo?.score || 0} label="SEO Performance" type="seo" />
            <MilestoneProgressBar score={analysis.geo?.score || 0} label="AI Visibility (GEO)" type="geo" />
          </div>
        );
      case 'animated':
        return (
          <div className="flex justify-center gap-16">
            <AnimatedScoreCounter score={analysis.seo?.score || 0} label="SEO Score" type="seo" />
            <AnimatedScoreCounter score={analysis.geo?.score || 0} label="GEO Score" type="geo" />
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
              <p className="text-sm text-gray-600 mt-1">{url}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onReanalyze}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-analyze
              </Button>
              <Button variant="outline" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={onDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Score Display Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Display Mode Selector */}
          <div className="flex justify-center gap-2 mb-8">
            {(['circular', 'speedometer', 'grade', 'progress', 'animated'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDisplayMode(mode)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  displayMode === mode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Score Display */}
          {renderScoreDisplay()}
          
          {/* Overall Performance Summary */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-full">
              <Award className="w-5 h-5" />
              <span className="font-medium">
                Overall Performance: {Math.round((analysis.seo?.score + analysis.geo?.score) / 2)}/100
              </span>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Speed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analysis.seo?.performance?.metrics?.speedIndex || 'N/A'}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Visibility</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analysis.geo?.aiVisibility?.platforms?.filter((p: any) => p.isVisible).length || 0}/4
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mobile Ready</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analysis.seo?.technical?.mobile?.isMobileFriendly ? 'Yes' : 'No'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <ScorePredictor 
              currentScore={Math.round((analysis.seo?.score + analysis.geo?.score) / 2)} 
              suggestions={suggestions}
            />
          </div>
        </div>
        
        {/* Recommendations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <FreemiumSuggestions 
                suggestions={suggestions} 
                showUpgradeModal={() => setShowUpgradeModal(true)}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <QuickWins suggestions={suggestions} />
            </div>
            
            {/* Upgrade CTA Card */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">
                Get Your Complete Action Plan
              </h3>
              <p className="text-purple-100 mb-4">
                Unlock detailed insights, implementation guides, and priority roadmap.
              </p>
              <Button 
                className="w-full bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => setShowUpgradeModal(true)}
              >
                Upgrade to Premium
              </Button>
              <p className="text-xs text-purple-200 mt-3 text-center">
                14-day free trial • No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
            <p className="text-gray-600 mb-6">
              Get access to all features and unlock your site's full potential.
            </p>
            {/* Add pricing plans here */}
            <Button 
              variant="outline" 
              onClick={() => setShowUpgradeModal(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}