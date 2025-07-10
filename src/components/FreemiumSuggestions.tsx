import React, { useState } from 'react';
import { Lock, Unlock, ChevronRight, AlertCircle, CheckCircle, XCircle, TrendingUp, Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface Suggestion {
  id: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  preview: string;
  fullDetails?: string;
  estimatedImprovement?: string;
}

interface FreemiumSuggestionsProps {
  suggestions: Suggestion[];
  showUpgradeModal?: () => void;
}

export function FreemiumSuggestions({ suggestions, showUpgradeModal }: FreemiumSuggestionsProps) {
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);
  const [showTeaser, setShowTeaser] = useState(false);
  
  // Show only first 3 suggestions for free users
  const freeSuggestions = suggestions.slice(0, 3);
  const premiumSuggestions = suggestions.slice(3);
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Free Suggestions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Top Optimization Opportunities
        </h3>
        
        {freeSuggestions.map((suggestion, index) => (
          <div 
            key={suggestion.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setExpandedPreview(expandedPreview === suggestion.id ? null : suggestion.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                    {getImpactIcon(suggestion.impact)}
                    {suggestion.impact} impact
                  </span>
                  <span className="text-xs text-gray-500">{suggestion.category}</span>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                <p className="text-sm text-gray-600">{suggestion.preview}</p>
                
                {expandedPreview === suggestion.id && suggestion.estimatedImprovement && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Potential improvement:</strong> {suggestion.estimatedImprovement}
                    </p>
                  </div>
                )}
              </div>
              
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedPreview === suggestion.id ? 'rotate-90' : ''
              }`} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Premium Suggestions Teaser */}
      {premiumSuggestions.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50 to-gray-100 rounded-lg"></div>
          
          <div className="space-y-4 opacity-60">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-400" />
                {premiumSuggestions.length} More Advanced Optimizations
              </h3>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTeaser(!showTeaser)}
                className="text-gray-600"
              >
                {showTeaser ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </>
                )}
              </Button>
            </div>
            
            {showTeaser && premiumSuggestions.slice(0, 2).map((suggestion) => (
              <div key={suggestion.id} className="border border-dashed rounded-lg p-4 relative">
                <div className="blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                      {getImpactIcon(suggestion.impact)}
                      {suggestion.impact} impact
                    </span>
                    <span className="text-xs text-gray-500">{suggestion.category}</span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600">{suggestion.preview.substring(0, 50)}...</p>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Upgrade CTA */}
          <div className="relative z-10 mt-6 text-center">
            <Button 
              onClick={showUpgradeModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Unlock All {suggestions.length} Recommendations
            </Button>
            
            <p className="text-sm text-gray-600 mt-2">
              Get detailed implementation guides and priority roadmap
            </p>
          </div>
        </div>
      )}
      
      {/* Benefits of upgrading */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          What's included in the full report?
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
            <span className="text-gray-700">Step-by-step implementation guides</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
            <span className="text-gray-700">Priority roadmap with timeline</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
            <span className="text-gray-700">Code examples and templates</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
            <span className="text-gray-700">Expected impact metrics</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
            <span className="text-gray-700">Competitor comparison insights</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
            <span className="text-gray-700">Monthly progress tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Wins Component
export function QuickWins({ suggestions }: { suggestions: Suggestion[] }) {
  const quickWins = suggestions.filter(s => s.impact === 'low').slice(0, 3);
  
  return (
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        Quick Wins You Can Implement Today
      </h4>
      
      <div className="space-y-2">
        {quickWins.map((win) => (
          <div key={win.id} className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-800 font-medium">{win.title}</p>
              <p className="text-xs text-green-700 mt-0.5">{win.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Score Improvement Predictor
export function ScorePredictor({ currentScore, suggestions }: { currentScore: number; suggestions: Suggestion[] }) {
  const calculatePotentialScore = () => {
    let improvement = 0;
    suggestions.forEach(s => {
      if (s.impact === 'high') improvement += 5;
      else if (s.impact === 'medium') improvement += 3;
      else improvement += 1;
    });
    return Math.min(100, currentScore + improvement);
  };
  
  const potentialScore = calculatePotentialScore();
  const improvement = potentialScore - currentScore;
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Your Potential Score
      </h4>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        <div>
          <div className="text-3xl font-bold text-gray-600">{currentScore}</div>
          <div className="text-sm text-gray-500">Current</div>
        </div>
        
        <ArrowRight className="w-6 h-6 text-blue-600" />
        
        <div>
          <div className="text-3xl font-bold text-blue-600">{potentialScore}</div>
          <div className="text-sm text-gray-500">Potential</div>
        </div>
      </div>
      
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
        <TrendingUp className="w-4 h-4" />
        +{improvement} points possible
      </div>
      
      <p className="text-sm text-gray-600 mt-4">
        By implementing all recommendations
      </p>
    </div>
  );
}