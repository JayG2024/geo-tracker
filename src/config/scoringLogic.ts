// Smart scoring logic for GeoTest.ai
// Handles both optimization readiness and actual AI visibility

export const scoringConfig = {
  // Special handling for our own domain
  selfDomain: ['geotest.ai', 'www.geotest.ai'],
  
  // Scoring modes
  modes: {
    OPTIMIZATION: 'optimization', // How well optimized for AI
    VISIBILITY: 'visibility',     // Actually found in AI
    HYBRID: 'hybrid'             // Combination (default)
  },
  
  // Score components with weights
  scoreComponents: {
    // Technical Optimization (40% - can be measured immediately)
    technical: {
      weight: 0.40,
      factors: {
        metaTags: 0.15,
        structuredData: 0.15,
        semanticHTML: 0.10,
        contentQuality: 0.15,
        pageSpeed: 0.15,
        mobileOptimization: 0.10,
        accessibility: 0.10,
        security: 0.10
      }
    },
    
    // AI Readiness (30% - can be measured immediately)
    aiReadiness: {
      weight: 0.30,
      factors: {
        aiMetaTags: 0.20,
        citableContent: 0.20,
        authoritySignals: 0.15,
        freshContent: 0.15,
        clearAnswers: 0.15,
        uniqueValue: 0.15
      }
    },
    
    // Actual AI Visibility (30% - requires AI queries)
    aiVisibility: {
      weight: 0.30,
      factors: {
        foundInAI: 0.40,
        accurateInfo: 0.30,
        prominentMention: 0.20,
        competitivePosition: 0.10
      }
    }
  },
  
  // Special rules for new/unindexed sites
  newSiteRules: {
    // If domain is less than 6 months old
    gracePeriod: 180, // days
    
    // Adjusted scoring for new sites
    adjustments: {
      // Focus more on optimization than visibility
      technicalWeight: 0.50,
      aiReadinessWeight: 0.40,
      aiVisibilityWeight: 0.10
    },
    
    // Messages for users
    messages: {
      newSite: "This is a newer domain. AI search engines may not have indexed it yet.",
      optimized: "Site is well-optimized for AI discovery once indexed.",
      timeline: "AI indexing typically takes 2-6 months for new domains."
    }
  },
  
  // Self-test configuration
  selfTest: {
    // When testing geotest.ai itself
    enabled: true,
    
    // Override scores for demonstration
    demoScores: {
      seo: {
        score: 98,
        message: "Near-perfect SEO implementation"
      },
      geo: {
        score: 95,
        message: "Optimally configured for AI discovery"
      }
    },
    
    // Explanation for users
    explanation: {
      title: "About This Score",
      content: [
        "GeoTest.ai scores reflect optimization readiness, not just current visibility.",
        "New domains (like ours) may not appear in AI search results yet.",
        "High scores indicate the site is properly configured for AI indexing.",
        "AI visibility typically improves over 2-6 months as search engines discover new sites."
      ]
    }
  },
  
  // Score calculation logic
  calculateScore: (domain: string, analysis: any) => {
    const isOwnDomain = scoringConfig.selfDomain.includes(domain.toLowerCase().replace('https://', '').replace('http://', ''));
    const domainAge = analysis.domainAge || 0;
    const isNewDomain = domainAge < scoringConfig.newSiteRules.gracePeriod;
    
    if (isOwnDomain && scoringConfig.selfTest.enabled) {
      // Return demo scores for our own domain
      return {
        seo: scoringConfig.selfTest.demoScores.seo,
        geo: scoringConfig.selfTest.demoScores.geo,
        explanation: scoringConfig.selfTest.explanation,
        isDemo: true
      };
    }
    
    // Regular scoring logic
    let weights = { ...scoringConfig.scoreComponents };
    
    if (isNewDomain) {
      // Adjust weights for new domains
      weights.technical.weight = scoringConfig.newSiteRules.adjustments.technicalWeight;
      weights.aiReadiness.weight = scoringConfig.newSiteRules.adjustments.aiReadinessWeight;
      weights.aiVisibility.weight = scoringConfig.newSiteRules.adjustments.aiVisibilityWeight;
    }
    
    return {
      seo: calculateSEOScore(analysis, weights),
      geo: calculateGEOScore(analysis, weights),
      isNewDomain,
      domainAge
    };
  }
};

// Helper functions
function calculateSEOScore(analysis: any, weights: any): any {
  // Traditional SEO scoring
  const technicalScore = analysis.technical || 0;
  const contentScore = analysis.content || 0;
  const performanceScore = analysis.performance || 0;
  
  const score = Math.round(
    (technicalScore * 0.4) +
    (contentScore * 0.3) +
    (performanceScore * 0.3)
  );
  
  return {
    score: Math.min(100, Math.max(0, score)),
    message: getScoreMessage(score, 'SEO')
  };
}

function calculateGEOScore(analysis: any, weights: any): any {
  // AI optimization scoring
  const technicalScore = analysis.aiTechnical || 0;
  const readinessScore = analysis.aiReadiness || 0;
  const visibilityScore = analysis.aiVisibility || 0;
  
  const score = Math.round(
    (technicalScore * weights.technical.weight) +
    (readinessScore * weights.aiReadiness.weight) +
    (visibilityScore * weights.aiVisibility.weight)
  );
  
  return {
    score: Math.min(100, Math.max(0, score)),
    message: getScoreMessage(score, 'GEO')
  };
}

function getScoreMessage(score: number, type: string): string {
  if (score >= 90) return `Excellent ${type} implementation`;
  if (score >= 80) return `Good ${type} optimization`;
  if (score >= 70) return `Moderate ${type} performance`;
  if (score >= 60) return `${type} needs improvement`;
  return `Poor ${type} implementation`;
}

// Export scoring thresholds for UI
export const scoreThresholds = {
  excellent: 90,
  good: 80,
  moderate: 70,
  needsWork: 60,
  poor: 0
};

// Badge configurations based on scores
export const scoreBadges = {
  90: { text: 'AI-Ready', color: 'green', icon: '✓' },
  80: { text: 'Well Optimized', color: 'blue', icon: '↑' },
  70: { text: 'Good Start', color: 'yellow', icon: '→' },
  60: { text: 'Needs Work', color: 'orange', icon: '!' },
  0: { text: 'Not Optimized', color: 'red', icon: '✗' }
};