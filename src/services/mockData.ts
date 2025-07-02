import { AnalysisResult, Project, GeographicData, KeywordRanking, Citation, Competitor, TechnicalIssue, Recommendation, LocalMarketOpportunity, CustomerBehaviorPattern, GeoROIProjection, GeoSuccessMetric, GeoImplementationPhase, GeoChallengesSolution, LocalCompetitorAnalysis, LocalCompetitor, GeoPerformanceMetrics } from '../types';
import { performMultiAIAnalysis, ConsensusAnalysis } from './aiAnalysis';

// Use your actual CSV data for analysis results
const CSV_ANALYSES = [
  {
    overall_score: 75,
    geo_score: 70, 
    ai_score: 80,
    technical_score: 85,
    market_position: 65,
    estimated_roi: 125000,
    url: 'https://techcorp-solutions.com',
    client_name: 'TechCorp Solutions'
  },
  {
    overall_score: 85,
    geo_score: 78,
    ai_score: 92, 
    technical_score: 88,
    market_position: 80,
    estimated_roi: 185000,
    url: 'https://bestrestaurants.com',
    client_name: 'Local Restaurant Group'
  }
];

export const generateMockAnalysis = (url: string): AnalysisResult => {
  // Pick one of the CSV results (alternate between them)
  const csvData = CSV_ANALYSES[Math.floor(Math.random() * CSV_ANALYSES.length)];
  
  const mockRecommendations: Recommendation[] = [
    {
      id: '1',
      category: 'geo',
      priority: 'high',
      title: 'Optimize for Generative AI Citations',
      description: 'AI consensus indicates 40% improvement potential through comprehensive GEO optimization focusing on citation-worthy content creation.',
      impact: 'High - Can improve AI discoverability by 40-60% within 30 days',
      effort: 'Medium - 2-3 hours of initial setup plus ongoing content optimization',
      timeline: '1-2 weeks for setup, ongoing optimization'
    },
    {
      id: '2',
      category: 'geo',
      priority: 'high',
      title: 'Enhance E-E-A-T Signal Strength',
      description: 'Establish comprehensive Expertise, Experience, Authoritativeness, and Trustworthiness signals for AI system recognition.',
      impact: 'High - Increases AI trust and citation potential by 35%',
      effort: 'High - Expert content creation and authority building required',
      timeline: '2-4 weeks for initial implementation'
    },
    {
      id: '3',
      category: 'geo',
      priority: 'medium',
      title: 'Implement Advanced Structured Data',
      description: 'Create comprehensive structured data markup optimized for AI system understanding and content interpretation.',
      impact: 'Medium - 25% increase in AI system content comprehension',
      effort: 'High - Technical implementation and content markup',
      timeline: '4-6 weeks for complete implementation'
    },
    {
      id: '4',
      category: 'geo',
      priority: 'medium',
      title: 'Develop Topical Authority Clusters',
      description: 'Create interconnected content clusters that establish comprehensive topical authority for generative AI systems.',
      impact: 'Medium - Improves topic relevance and AI citation probability',
      effort: 'Medium - Content strategy and interlinking optimization',
      timeline: 'Ongoing initiative with setup in 1-2 weeks'
    }
  ];

  const mockLocalMarketOpportunities: LocalMarketOpportunity[] = [
    {
      area: 'AI-First Content Strategy',
      population: 45000,
      marketSize: '$12.5M annually',
      competitionLevel: 'medium',
      opportunityScore: 85,
      keyInsights: [
        'High potential for AI system citations and references',
        'Limited competitors with strong GEO optimization',
        'Growing demand for authoritative, AI-discoverable content',
        'Strong foundation for generative search visibility'
      ],
      actionItems: [
        'Develop citation-worthy content and resources',
        'Optimize for conversational AI query patterns',
        'Create authoritative topic cluster architecture',
        'Target natural language processing compatibility'
      ],
      timeToCapture: '3-6 months',
      estimatedRevenue: 185000
    },
    {
      area: 'E-E-A-T Authority Building',
      population: 78000,
      marketSize: '$8.3M annually',
      competitionLevel: 'low',
      opportunityScore: 92,
      keyInsights: [
        'Underserved opportunity for expertise demonstration',
        'Strong potential for trust signal establishment',
        'Growing AI system emphasis on authoritative sources',
        'Limited quality expertise content in market'
      ],
      actionItems: [
        'Launch comprehensive expert content strategy',
        'Develop industry thought leadership positioning',
        'Build authoritative backlink and citation network',
        'Optimize for expertise and experience validation'
      ],
      timeToCapture: '2-4 months',
      estimatedRevenue: 145000
    },
    {
      area: 'Structured Data Optimization',
      population: 25000,
      marketSize: '$15.8M annually',
      competitionLevel: 'high',
      opportunityScore: 73,
      keyInsights: [
        'High-value technical optimization opportunity',
        'Competitive advantage through advanced markup',
        'Opportunity for enhanced AI comprehension',
        'Strong potential for rich result generation'
      ],
      actionItems: [
        'Implement comprehensive schema markup strategy',
        'Target AI-specific structured data formats',
        'Build advanced semantic content architecture',
        'Create machine-readable expertise indicators'
      ],
      timeToCapture: '6-12 months',
      estimatedRevenue: 225000
    }
  ];

  const mockCustomerBehaviorPatterns: CustomerBehaviorPattern[] = [
    {
      location: 'Primary Service Area',
      searchPatterns: [
        'Conversational AI queries increase 300% year-over-year',
        'Voice searches dominate with 78% natural language format',
        'Generative AI responses growing 45% in relevance',
        'Citation-based queries peak during research phases'
      ],
      peakActivityHours: ['8-10 AM', '12-2 PM', '5-7 PM', '8-10 PM'],
      preferredDevices: ['Mobile (78%)', 'Desktop (18%)', 'Tablet (4%)'],
      seasonalTrends: [
        'Q1: 25% increase in expert validation searches',
        'Q2: Peak activity for authoritative source seeking',
        'Q3: AI-generated content verification spikes',
        'Q4: Citation and reference validation increases'
      ],
      localPreferences: [
        'Strong preference for authoritative sources (85%)',
        'Expert credentials highly influential (92%)',
        'Citation transparency across multiple sources',
        'AI-generated recommendation trust development'
      ],
      conversionTriggers: [
        'Expert validation and credentials visibility',
        'Comprehensive, citation-worthy content depth',
        'Authoritative source references and backlinks',
        'AI system recognition and featured positioning'
      ],
      averageJourneyLength: '3-5 AI interactions over 2-7 days'
    }
  ];

  const mockGeoROIProjection: GeoROIProjection = {
    initialInvestment: 15000,
    monthlyROI: [2500, 4200, 6800, 9500, 12300, 15800, 18200, 21500, 24800, 27200, 29500, 32000],
    yearOneROI: 185000,
    yearTwoROI: 285000,
    yearThreeROI: 425000,
    breakEvenPoint: '3.2 months',
    riskFactors: [
      'AI algorithm updates affecting content ranking',
      'Increased competition for authoritative positioning',
      'Changes in generative AI citation patterns',
      'Evolution of E-E-A-T signal requirements'
    ],
    conservativeEstimate: 145000,
    optimisticEstimate: 235000,
    keyDrivers: [
      'Citation-worthy content creation and optimization',
      'E-E-A-T signal enhancement and validation',
      'Structured data implementation for AI comprehension',
      'Topical authority development and maintenance',
      'Generative AI query pattern optimization'
    ]
  };

  const mockGeoSuccessMetrics: GeoSuccessMetric[] = [
    {
      metric: 'Citation Worthiness Score',
      currentValue: csvData.geo_score,
      targetValue: 90,
      timeframe: '6 months',
      measurementMethod: 'AI citation tracking + content authority assessment',
      importance: 'critical',
      industryBenchmark: 75
    },
    {
      metric: 'E-E-A-T Signal Strength',
      currentValue: 65,
      targetValue: 95,
      timeframe: '3 months',
      measurementMethod: 'Expertise indicators and authority validation',
      importance: 'critical',
      industryBenchmark: 80
    },
    {
      metric: 'Structured Data Completeness',
      currentValue: 72,
      targetValue: 98,
      timeframe: '4 months',
      measurementMethod: 'Schema markup audit and AI comprehension testing',
      importance: 'high',
      industryBenchmark: 85
    },
    {
      metric: 'Topical Authority Score',
      currentValue: 4.2,
      targetValue: 4.7,
      timeframe: '6 months',
      measurementMethod: 'Topic cluster analysis and expertise measurement',
      importance: 'high',
      industryBenchmark: 4.3
    },
    {
      metric: 'AI Discoverability Index',
      currentValue: 15,
      targetValue: 3,
      timeframe: '4 months',
      measurementMethod: 'Generative AI visibility tracking tools',
      importance: 'critical',
      industryBenchmark: 8
    },
    {
      metric: 'Content Depth Score',
      currentValue: 1250,
      targetValue: 3500,
      timeframe: '6 months',
      measurementMethod: 'Comprehensive content analysis and coverage assessment',
      importance: 'high',
      industryBenchmark: 2200
    }
  ];

  const mockGeoImplementationTimeline: GeoImplementationPhase[] = [
    {
      phase: 1,
      title: 'GEO Foundation & AI Optimization',
      duration: '2-3 weeks',
      tasks: [
        {
          taskName: 'Complete E-E-A-T Signal Audit',
          description: 'Comprehensive assessment of Expertise, Experience, Authoritativeness, and Trustworthiness signals',
          estimatedHours: 8,
          skillRequired: 'GEO specialist',
          priority: 'high',
          deliverable: 'Complete E-E-A-T assessment with enhancement roadmap'
        },
        {
          taskName: 'AI Citation Opportunity Research',
          description: 'Identify and prioritize citation-worthy content opportunities for AI systems',
          estimatedHours: 12,
          skillRequired: 'Content strategist',
          priority: 'high',
          deliverable: 'Citation opportunity matrix with AI discoverability focus'
        },
        {
          taskName: 'Structured Data Architecture',
          description: 'Design comprehensive structured data strategy for AI comprehension',
          estimatedHours: 6,
          skillRequired: 'Technical SEO specialist',
          priority: 'medium',
          deliverable: 'Advanced schema markup implementation plan'
        }
      ],
      expectedOutcomes: [
        '20-30% improvement in AI system recognition',
        'Enhanced citation worthiness assessment',
        'Clear roadmap for GEO optimization'
      ],
      dependencies: ['Content audit completion', 'Technical access verification'],
      resources: ['GEO analysis tools', 'AI tracking platforms'],
      milestones: ['E-E-A-T baseline established', 'Citation strategy approved', 'Technical foundation ready'],
      riskLevel: 'low'
    },
    {
      phase: 2,
      title: 'Authority Building & Content Optimization',
      duration: '4-6 weeks',
      tasks: [
        {
          taskName: 'Citation-Worthy Content Creation',
          description: 'Develop comprehensive, authoritative content designed for AI system citations',
          estimatedHours: 20,
          skillRequired: 'Expert content creator',
          priority: 'high',
          deliverable: 'Portfolio of citation-worthy resources and content'
        },
        {
          taskName: 'Topical Authority Development',
          description: 'Create interconnected content clusters establishing comprehensive topic expertise',
          estimatedHours: 30,
          skillRequired: 'Content strategist + Subject matter expert',
          priority: 'high',
          deliverable: 'Topical authority architecture with expert validation'
        },
        {
          taskName: 'AI Query Optimization',
          description: 'Optimize content for natural language and conversational AI query patterns',
          estimatedHours: 10,
          skillRequired: 'GEO specialist',
          priority: 'medium',
          deliverable: 'AI-optimized content with natural language focus'
        }
      ],
      expectedOutcomes: [
        '35-45% improvement in AI discoverability',
        'Increased citation potential and authority signals',
        'Enhanced generative search compatibility'
      ],
      dependencies: ['Content strategy approval', 'Expert contributor access'],
      resources: ['Expert interview budget', 'Authority validation tools'],
      milestones: ['First authority content published', 'Topic cluster activated', 'AI optimization deployed'],
      riskLevel: 'medium'
    },
    {
      phase: 3,
      title: 'Advanced GEO & Monitoring',
      duration: '6-8 weeks',
      tasks: [
        {
          taskName: 'Advanced Structured Data Implementation',
          description: 'Deploy comprehensive schema markup optimized for AI system understanding',
          estimatedHours: 15,
          skillRequired: 'Technical GEO specialist',
          priority: 'medium',
          deliverable: 'Complete structured data implementation with AI focus'
        },
        {
          taskName: 'Citation Network Development',
          description: 'Build authoritative citation network through expert partnerships and validation',
          estimatedHours: 25,
          skillRequired: 'Authority building specialist',
          priority: 'high',
          deliverable: 'Comprehensive citation and authority network'
        },
        {
          taskName: 'GEO Performance Monitoring',
          description: 'Implement advanced tracking for AI discoverability and citation metrics',
          estimatedHours: 8,
          skillRequired: 'Analytics specialist',
          priority: 'medium',
          deliverable: 'Complete GEO monitoring and AI tracking dashboard'
        }
      ],
      expectedOutcomes: [
        '50-60% improvement in overall AI system recognition',
        'Dominant position in topic authority and citations',
        'Sustainable GEO optimization framework'
      ],
      dependencies: ['Technical implementation access', 'Expert partnership agreements'],
      resources: ['Advanced GEO tools', 'AI monitoring platforms'],
      milestones: ['Structured data live', 'Citation network established', 'Monitoring dashboard active'],
      riskLevel: 'low'
    }
  ];

  const mockGeoChallengesAndSolutions: GeoChallengesSolution[] = [
    {
      challenge: 'AI Algorithm Updates Affecting Visibility',
      impact: 'high',
      probability: 'high',
      solution: 'Focus on fundamental GEO principles and diversified AI system optimization',
      preventiveMeasures: [
        'Continuous AI algorithm monitoring',
        'Diversified content strategy updates',
        'Regular E-E-A-T signal assessment',
        'Proactive citation network maintenance'
      ],
      contingencyPlan: 'Quick adaptation protocol with emergency GEO optimization measures',
      estimatedCost: 5000,
      timeToResolve: '3-6 months'
    },
    {
      challenge: 'Increased Competition for Authority Positioning',
      impact: 'medium',
      probability: 'medium',
      solution: 'Maintain specialized expertise focus and unique content differentiation',
      preventiveMeasures: [
        'Regular competitive authority analysis',
        'Continuous expert content creation',
        'Strategic citation relationship building',
        'Advanced topical authority development'
      ],
      contingencyPlan: 'Enhanced expertise demonstration with validation protocols',
      estimatedCost: 2500,
      timeToResolve: '1-2 months'
    },
    {
      challenge: 'Citation Network Validation Issues',
      impact: 'high',
      probability: 'low',
      solution: 'Proactive citation quality management with expert validation protocols',
      preventiveMeasures: [
        'Comprehensive source quality auditing',
        'Regular expert validation processes',
        'Transparent citation documentation',
        'Authority signal monitoring system'
      ],
      contingencyPlan: 'Emergency citation rehabilitation with expert testimony services',
      estimatedCost: 3500,
      timeToResolve: '2-4 months'
    }
  ];

  const mockLocalCompetitors: LocalCompetitor[] = [
    {
      name: 'Authority Content Solutions',
      website: 'authoritycontentsolutions.com',
      marketShare: 18.5,
      geoStrength: 85,
      weaknesses: [
        'Limited AI optimization focus',
        'Inconsistent E-E-A-T signal implementation',
        'Outdated structured data strategy',
        'Poor citation network development'
      ],
      strengths: [
        'Established content authority',
        'Strong expert contributor network',
        'Comprehensive topic coverage',
        'Good traditional SEO foundation'
      ],
      geoStrategy: [
        'Traditional authority building approach',
        'Active expert content creation',
        'Consistent thought leadership publishing',
        'Good citation profile maintenance'
      ],
      locations: ['Digital Authority', 'Expert Content'],
      customerBase: 'Primarily B2B expertise seeking, some AI system optimization',
      pricingStrategy: 'Premium pricing for authoritative content',
      marketingApproach: ['Expert positioning', 'Authority content', 'Citation building']
    },
    {
      name: 'AI-First Optimization Group',
      website: 'aifirstoptimization.com',
      marketShare: 15.2,
      geoStrength: 78,
      weaknesses: [
        'Limited traditional authority signals',
        'Inconsistent expert validation',
        'Technical focus over content depth',
        'Weak citation network development'
      ],
      strengths: [
        'Advanced AI optimization techniques',
        'Strong technical implementation',
        'Modern GEO approach',
        'Good structured data foundation'
      ],
      geoStrategy: [
        'AI-first optimization focus',
        'Technical GEO implementation',
        'Advanced structured data deployment',
        'Generative search targeting'
      ],
      locations: ['Technical AI Optimization', 'Advanced GEO'],
      customerBase: 'Mix of technical and content-focused clients',
      pricingStrategy: 'Technology-based pricing for AI optimization',
      marketingApproach: ['Technical expertise', 'AI innovation', 'GEO leadership']
    },
    {
      name: 'Traditional Authority Builders',
      website: 'traditionalauthority.com',
      marketShare: 12.8,
      geoStrength: 72,
      weaknesses: [
        'Limited AI system understanding',
        'Outdated optimization approaches',
        'Poor generative search preparation',
        'Traditional citation focus only'
      ],
      strengths: [
        'Strong traditional authority foundation',
        'Established expert relationships',
        'Comprehensive content libraries',
        'Long-term client relationships'
      ],
      geoStrategy: [
        'Traditional authority building methods',
        'Expert content development',
        'Conventional citation strategies',
        'Standard thought leadership approaches'
      ],
      locations: ['Traditional Authority', 'Expert Content'],
      customerBase: 'Primarily traditional content and authority focused',
      pricingStrategy: 'Value-based pricing with established methods',
      marketingApproach: ['Traditional authority', 'Expert positioning', 'Conventional content']
    }
  ];

  const mockLocalCompetitorAnalysis: LocalCompetitorAnalysis = {
    mainCompetitors: mockLocalCompetitors,
    marketDynamics: [
      'Rapidly evolving AI optimization landscape with emerging GEO opportunities',
      'High demand for expert validation and authority signal development',
      'Growing emphasis on citation worthiness and AI system recognition',
      'Strong focus on E-E-A-T signals and expertise demonstration',
      'Increasing need for AI-first content strategies and optimization'
    ],
    competitiveAdvantages: [
      'Comprehensive GEO optimization approach combining AI-first strategies',
      'Advanced E-E-A-T signal development and expert validation systems',
      'Superior AI system compatibility and citation optimization',
      'Strong technical foundation with content authority integration',
      'Proactive generative search optimization and monitoring'
    ],
    threats: [
      'Well-established competitors with strong traditional authority networks',
      'Potential for new AI-first optimization services with aggressive strategies',
      'Changes in AI system citation and authority recognition patterns',
      'Economic factors affecting investment in comprehensive GEO strategies'
    ],
    opportunities: [
      'Underserved market for comprehensive AI optimization and GEO services',
      'Growing demand for integrated authority building and technical optimization',
      'Opportunity for thought leadership in emerging GEO methodologies',
      'Strategic partnerships with AI platforms and expert validation services'
    ],
    marketGaps: [
      'Limited comprehensive GEO optimization service availability',
      'Insufficient AI-first content strategy development',
      'Lack of integrated E-E-A-T and technical optimization approaches',
      'Poor understanding of generative search optimization requirements'
    ],
    strategicRecommendations: [
      'Focus on comprehensive GEO service differentiation and AI-first positioning',
      'Develop advanced E-E-A-T enhancement capabilities and expert validation systems',
      'Build strategic partnerships to expand AI optimization and authority building capacity',
      'Implement data-driven GEO strategies and continuous AI system adaptation',
      'Create premium service tiers for comprehensive authority and technical optimization'
    ]
  };

  const mockGeoPerformanceMetrics: GeoPerformanceMetrics = {
    localSearchVisibility: csvData.geo_score,
    googleMyBusinessScore: 68,
    localCitationConsistency: 72,
    reviewScore: 84,
    localKeywordRankings: 76,
    nearMeSearchPerformance: 65,
    localTrafficShare: 42,
    conversionRateByLocation: [
      { location: 'Authority Content', rate: 3.8 },
      { location: 'Expert Validation', rate: 4.2 },
      { location: 'AI Optimization', rate: 2.9 },
      { location: 'Citation Network', rate: 3.5 }
    ],
    localBrandAwareness: 58,
    competitivePositioning: 71
  };

  const mockGeographicData: GeographicData[] = [
    { location: 'AI Authority Building', visibility: 85, searchVolume: 12500, competition: 78, opportunities: 15 },
    { location: 'Expert Content Creation', visibility: 72, searchVolume: 9800, competition: 65, opportunities: 28 },
    { location: 'Citation Network Development', visibility: 68, searchVolume: 7200, competition: 82, opportunities: 22 },
    { location: 'Structured Data Optimization', visibility: 79, searchVolume: 6400, competition: 58, opportunities: 18 },
    { location: 'E-E-A-T Signal Enhancement', visibility: 91, searchVolume: 4200, competition: 45, opportunities: 12 }
  ];

  const mockKeywordRankings: KeywordRanking[] = [
    { keyword: 'AI citation optimization', currentRank: 8, searchVolume: 8900, difficulty: 65, trend: 'up' },
    { keyword: 'GEO expertise signals', currentRank: 12, searchVolume: 5400, difficulty: 72, trend: 'stable' },
    { keyword: 'generative search optimization', currentRank: 6, searchVolume: 3200, difficulty: 58, trend: 'up' },
    { keyword: 'E-E-A-T signal development', currentRank: 15, searchVolume: 2800, difficulty: 55, trend: 'down' },
    { keyword: 'AI authority building', currentRank: 4, searchVolume: 1900, difficulty: 48, trend: 'up' }
  ];

  const mockCitations: Citation[] = [
    { source: 'AI Research Database', status: 'verified', accuracy: 95, authority: 98 },
    { source: 'Expert Validation Network', status: 'verified', accuracy: 92, authority: 85 },
    { source: 'Authority Content Registry', status: 'unverified', accuracy: 88, authority: 82 },
    { source: 'Citation Quality Index', status: 'inconsistent', accuracy: 65, authority: 45 },
    { source: 'Expert Authority Council', status: 'verified', accuracy: 90, authority: 78 },
    { source: 'GEO Optimization Directory', status: 'inconsistent', accuracy: 70, authority: 65 }
  ];

  const mockCompetitors: Competitor[] = [
    { name: 'Authority Content Solutions', url: 'authoritycontentsolutions.com', overallScore: 82, geoScore: 85, aiScore: 75, marketShare: 18.5 },
    { name: 'AI-First Optimization Group', url: 'aifirstoptimization.com', overallScore: 78, geoScore: 78, aiScore: 78, marketShare: 15.2 },
    { name: 'Traditional Authority Builders', url: 'traditionalauthority.com', overallScore: 68, geoScore: 72, aiScore: 65, marketShare: 12.8 },
    { name: 'Expert Citation Network', url: 'expertcitationnetwork.com', overallScore: 71, geoScore: 68, aiScore: 74, marketShare: 8.1 }
  ];

  const mockTechnicalIssues: TechnicalIssue[] = [
    {
      type: 'AI-Optimized Schema Markup',
      severity: 'high',
      description: 'Missing or incomplete structured data markup specifically optimized for AI system comprehension',
      impact: 'Reduces AI discoverability by 25% and limits citation potential in generative responses',
      solution: 'Implement comprehensive AI-focused schema markup with expertise and authority indicators'
    },
    {
      type: 'E-E-A-T Signal Consistency',
      severity: 'medium',
      description: 'Inconsistent Expertise, Experience, Authoritativeness, and Trustworthiness signals across content',
      impact: 'Confuses AI systems and reduces authority recognition potential',
      solution: 'Audit and standardize E-E-A-T indicators across all content and expert validation systems'
    },
    {
      type: 'Citation-Worthy Content Depth',
      severity: 'medium',
      description: 'Content lacks the depth and comprehensiveness required for AI system citations',
      impact: 'Poor citation potential leading to reduced AI visibility and authority recognition',
      solution: 'Enhance content depth with comprehensive coverage, expert insights, and authoritative source integration'
    }
  ];

  // Enhanced GEO strategy advantages based on AI optimization analysis
  const mockGeoStrategyAdvantages: string[] = [
    'Dominate AI-generated responses where 76% of users trust expert-validated information',
    'Build stronger authority recognition through comprehensive E-E-A-T signal optimization',
    'Achieve higher citation rates (4.2x higher) compared to traditional content optimization approaches',
    'Reduce content validation costs by 45% through systematic AI optimization and expert positioning',
    'Establish barriers to entry for competitors through advanced GEO authority and citation network building',
    'Capitalize on generative search trends with 78% of AI responses favoring comprehensive, expert-validated content',
    'Leverage citation network effects which are 5x more effective for AI system recognition and trust',
    'Build sustainable competitive advantages through expert validation systems and authority network development',
    'Respond quickly to AI algorithm changes through flexible GEO optimization and monitoring systems',
    'Create multiple authority streams across different AI platforms and generative search systems'
  ];

  // Generate mock GEO-specific scores
  const mockGeoScores = {
    citationWorthiness: 72 + Math.random() * 23,
    eeatSignalStrength: 68 + Math.random() * 27,
    structuredDataScore: 75 + Math.random() * 20,
    contentDepthScore: 79 + Math.random() * 18,
    topicalAuthorityScore: 74 + Math.random() * 21
  };

  // Return comprehensive analysis using your exact CSV data enhanced with GEO insights
  return {
    id: Math.random().toString(36).substr(2, 9),
    url,
    timestamp: new Date(),
    overallScore: csvData.overall_score,
    geoVisibilityScore: csvData.geo_score,
    aiSearchScore: csvData.ai_score,
    technicalSeoScore: csvData.technical_score,
    citationScore: Math.round((csvData.geo_score + csvData.ai_score) / 2),
    contentScore: Math.round((csvData.overall_score + csvData.technical_score) / 2),
    schemaScore: Math.round(csvData.market_position),
    competitorRank: Math.floor(Math.random() * 5) + 1,
    totalCompetitors: 12,
    estimatedROI: csvData.estimated_roi,
    recommendations: mockRecommendations,
    geographicData: mockGeographicData,
    keywordRankings: mockKeywordRankings,
    citations: mockCitations,
    competitors: mockCompetitors,
    technicalIssues: mockTechnicalIssues,
    
    // Enhanced GEO-specific data
    geoStrategyAdvantages: mockGeoStrategyAdvantages,
    localMarketOpportunities: mockLocalMarketOpportunities,
    customerBehaviorPatterns: mockCustomerBehaviorPatterns,
    geoRoiProjection: mockGeoROIProjection,
    geoSuccessMetrics: mockGeoSuccessMetrics,
    geoImplementationTimeline: mockGeoImplementationTimeline,
    geoChallengesAndSolutions: mockGeoChallengesAndSolutions,
    localCompetitorAnalysis: mockLocalCompetitorAnalysis,
    geoPerformanceMetrics: mockGeoPerformanceMetrics,

    // NEW: Generative Engine Optimization (GEO) focused fields
    citationWorthinessScore: Math.round(mockGeoScores.citationWorthiness),
    eeatSignalStrengthScore: Math.round(mockGeoScores.eeatSignalStrength),
    structuredDataScore: Math.round(mockGeoScores.structuredDataScore),
    contentDepthScore: Math.round(mockGeoScores.contentDepthScore),
    topicalAuthorityScore: Math.round(mockGeoScores.topicalAuthorityScore),
    analysisSummaryText: `Comprehensive GEO analysis reveals ${csvData.overall_score}/100 optimization potential with strong foundation for AI discoverability. The website demonstrates ${Math.round(mockGeoScores.eeatSignalStrength) >= 80 ? 'strong' : 'developing'} E-E-A-T signals with ${Math.round(mockGeoScores.citationWorthiness) >= 75 ? 'excellent' : 'good'} citation worthiness for AI systems. Key opportunities include enhanced structured data implementation, topical authority development, and comprehensive expert validation systems that position content for optimal generative search visibility and citation potential.`,
    actionableRecommendationsText: `Priority GEO actions: 1) Enhance E-E-A-T signals through comprehensive expert content validation and authoritative source integration, 2) Implement advanced structured data markup specifically optimized for AI system comprehension and citation recognition, 3) Develop citation-worthy resources that establish definitive topical authority and expert positioning, 4) Create content clusters targeting generative AI query patterns and natural language processing compatibility, 5) Optimize for conversational search queries and AI-generated response inclusion through strategic authority building and expert validation protocols.`,
    topicalOpportunities: [
      'AI-first content strategy development with expert validation systems',
      'Comprehensive E-E-A-T signal enhancement and authority building programs',
      'Advanced structured data implementation for optimal AI system comprehension and citation potential'
    ]
  };
};

// Enhanced multi-AI analysis function
export const createMultiAIAnalysis = async (
  url: string, 
  onProgress?: (provider: string, progress: number) => void
): Promise<AnalysisResult> => {
  try {
    // Perform multi-AI analysis
    const consensus = await performMultiAIAnalysis(url, {
      location: 'United States',
      industry: 'General Business',
      content: '',
      onProgress
    });

    // Use AI consensus scores combined with your CSV data
    const csvData = CSV_ANALYSES[Math.floor(Math.random() * CSV_ANALYSES.length)];
    
    // Blend AI consensus with CSV data for realistic results
    const aiEnhancedResult = generateMockAnalysis(url);
    
    // Override with AI consensus insights
    aiEnhancedResult.overallScore = Math.round((consensus.finalScore + csvData.overall_score) / 2);
    aiEnhancedResult.recommendations = aiEnhancedResult.recommendations.map((rec, index) => ({
      ...rec,
      description: consensus.providerScores[index % consensus.providerScores.length]?.insights[0] || rec.description
    }));

    // Extract GEO-specific data from AI analysis if available
    const geminiData = consensus.providerScores.find(p => p.provider.includes('Gemini'))?.rawData;
    if (geminiData) {
      aiEnhancedResult.citationWorthinessScore = geminiData.citation_worthiness_score || aiEnhancedResult.citationWorthinessScore;
      aiEnhancedResult.eeatSignalStrengthScore = geminiData.eeat_signal_strength_score || aiEnhancedResult.eeatSignalStrengthScore;
      aiEnhancedResult.structuredDataScore = geminiData.structured_data_score || aiEnhancedResult.structuredDataScore;
      aiEnhancedResult.contentDepthScore = geminiData.content_depth_score || aiEnhancedResult.contentDepthScore;
      aiEnhancedResult.topicalAuthorityScore = geminiData.topical_authority_score || aiEnhancedResult.topicalAuthorityScore;
      aiEnhancedResult.analysisSummaryText = geminiData.analysis_summary_text || aiEnhancedResult.analysisSummaryText;
      aiEnhancedResult.actionableRecommendationsText = geminiData.actionable_recommendations_text || aiEnhancedResult.actionableRecommendationsText;
      aiEnhancedResult.topicalOpportunities = geminiData.topical_opportunities || aiEnhancedResult.topicalOpportunities;
    }

    return aiEnhancedResult;
  } catch (error) {
    console.error('Multi-AI analysis failed, falling back to standard analysis:', error);
    return generateMockAnalysis(url);
  }
};

// Simple mock analysis service that always succeeds (legacy support)
export const createMockAnalysis = (url: string): AnalysisResult => {
  return generateMockAnalysis(url);
};

export const mockProjects: Project[] = [
  {
    id: '1',
    clientName: 'TechCorp Solutions',
    websiteUrl: 'https://techcorp-solutions.com',
    createdAt: new Date('2024-01-15'),
    lastAnalyzed: new Date('2024-01-20'),
    status: 'active',
    analysisResults: [],
    notes: 'Priority client - Comprehensive GEO analysis with AI optimization and citation strategy'
  },
  {
    id: '2',
    clientName: 'Local Restaurant Group',
    websiteUrl: 'https://bestrestaurants.com',
    createdAt: new Date('2024-01-10'),
    lastAnalyzed: new Date('2024-01-18'),
    status: 'completed',
    analysisResults: [],
    notes: 'Multi-location GEO analysis completed with E-E-A-T enhancement and authority building'
  },
  {
    id: '3',
    clientName: 'Healthcare Partners',
    websiteUrl: 'https://healthpartners.com',
    createdAt: new Date('2024-01-22'),
    lastAnalyzed: new Date(),
    status: 'pending',
    analysisResults: [],
    notes: 'Awaiting approval for comprehensive GEO optimization and expert validation strategy'
  }
];

// Mock AI API simulation with consensus scoring
export const simulateMultiAIAnalysis = (url: string): any => {
  return {
    gptScore: Math.floor(Math.random() * 30) + 70,
    geminiScore: Math.floor(Math.random() * 40) + 50,
    claudeScore: Math.floor(Math.random() * 25) + 75,
    consensusScore: Math.floor(Math.random() * 20) + 75,
    confidence: 0.85 + Math.random() * 0.1
  };
};