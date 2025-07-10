import { useState, useEffect } from 'react';

export interface EnhancedSuggestion {
  id: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  preview: string;
  fullDetails?: string;
  estimatedImprovement?: string;
  implementationTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export function useEnhancedResults(analysis: any) {
  const [suggestions, setSuggestions] = useState<EnhancedSuggestion[]>([]);
  
  useEffect(() => {
    if (!analysis?.recommendations) return;
    
    // Transform recommendations into enhanced suggestions
    const enhancedSuggestions = analysis.recommendations.map((rec: any, index: number) => {
      // Determine impact based on priority and score potential
      const impact = rec.priority === 'high' ? 'high' : 
                    rec.priority === 'medium' ? 'medium' : 'low';
      
      // Add implementation details
      const implementationTime = 
        impact === 'high' ? '1-2 weeks' :
        impact === 'medium' ? '2-3 days' : '1 day';
      
      const difficulty = 
        impact === 'high' ? 'hard' :
        impact === 'medium' ? 'medium' : 'easy';
      
      // Calculate estimated improvement
      const baseImprovement = 
        impact === 'high' ? 5 :
        impact === 'medium' ? 3 : 1;
      
      const estimatedImprovement = `+${baseImprovement}-${baseImprovement + 2} points`;
      
      return {
        id: `suggestion-${index}`,
        title: rec.issue || rec.title || 'Optimization Opportunity',
        impact,
        category: rec.category || 'General',
        preview: rec.impact || rec.description || 'Improve this aspect of your site',
        fullDetails: rec.solution,
        estimatedImprovement,
        implementationTime,
        difficulty
      };
    });
    
    // Sort by impact (high > medium > low)
    enhancedSuggestions.sort((a: EnhancedSuggestion, b: EnhancedSuggestion) => {
      const impactOrder = { high: 0, medium: 1, low: 2 };
      return impactOrder[a.impact] - impactOrder[b.impact];
    });
    
    setSuggestions(enhancedSuggestions);
  }, [analysis]);
  
  // Add some example AI-specific suggestions if GEO score is low
  useEffect(() => {
    if (analysis?.geo?.score < 70 && suggestions.length < 10) {
      const aiSuggestions: EnhancedSuggestion[] = [
        {
          id: 'ai-1',
          title: 'Add Structured Data for AI Understanding',
          impact: 'high',
          category: 'AI Optimization',
          preview: 'Implement Schema.org markup to help AI platforms understand your content better',
          fullDetails: 'Add FAQ, HowTo, and Organization schema to make your content more accessible to AI',
          estimatedImprovement: '+5-7 points',
          implementationTime: '1 week',
          difficulty: 'medium'
        },
        {
          id: 'ai-2',
          title: 'Create AI-Friendly Content Structure',
          impact: 'medium',
          category: 'Content',
          preview: 'Organize content with clear headings and concise answers to common questions',
          fullDetails: 'Structure your content in Q&A format with definitive answers that AI can easily extract',
          estimatedImprovement: '+3-5 points',
          implementationTime: '3-4 days',
          difficulty: 'easy'
        },
        {
          id: 'ai-3',
          title: 'Improve Content Authority Signals',
          impact: 'high',
          category: 'Authority',
          preview: 'Add author bios, citations, and trust signals to establish expertise',
          fullDetails: 'Include author credentials, cite authoritative sources, and display trust badges',
          estimatedImprovement: '+4-6 points',
          implementationTime: '1 week',
          difficulty: 'medium'
        }
      ];
      
      setSuggestions(prev => [...prev, ...aiSuggestions]);
    }
  }, [analysis, suggestions.length]);
  
  return {
    suggestions,
    totalSuggestions: suggestions.length,
    highImpactCount: suggestions.filter(s => s.impact === 'high').length,
    quickWins: suggestions.filter(s => s.impact === 'low' && s.difficulty === 'easy'),
    estimatedTotalImprovement: calculateTotalImprovement(suggestions)
  };
}

function calculateTotalImprovement(suggestions: EnhancedSuggestion[]): number {
  let total = 0;
  suggestions.forEach(s => {
    if (s.impact === 'high') total += 6;
    else if (s.impact === 'medium') total += 4;
    else total += 2;
  });
  return Math.min(total, 100); // Cap at 100
}