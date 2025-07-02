export interface AnalysisResult {
  id: string;
  url: string;
  timestamp: Date;
  overallScore: number;
  geoVisibilityScore: number;
  aiSearchScore: number;
  citationScore: number;
  technicalSeoScore: number;
  contentScore: number;
  schemaScore: number;
  competitorRank: number;
  totalCompetitors: number;
  estimatedROI: number;
  recommendations: Recommendation[];
  geographicData: GeographicData[];
  keywordRankings: KeywordRanking[];
  citations: Citation[];
  competitors: Competitor[];
  technicalIssues: TechnicalIssue[];
  
  // Enhanced GEO-specific fields
  geoStrategyAdvantages: string[];
  localMarketOpportunities: LocalMarketOpportunity[];
  customerBehaviorPatterns: CustomerBehaviorPattern[];
  geoRoiProjection: GeoROIProjection;
  geoSuccessMetrics: GeoSuccessMetric[];
  geoImplementationTimeline: GeoImplementationPhase[];
  geoChallengesAndSolutions: GeoChallengesSolution[];
  localCompetitorAnalysis: LocalCompetitorAnalysis;
  geoPerformanceMetrics: GeoPerformanceMetrics;

  // NEW: Generative Engine Optimization (GEO) focused fields
  citationWorthinessScore: number;
  eeatSignalStrengthScore: number;
  structuredDataScore: number;
  contentDepthScore: number;
  topicalAuthorityScore: number;
  analysisSummaryText: string;
  actionableRecommendationsText: string;
  topicalOpportunities: string[];
}

export interface LocalMarketOpportunity {
  area: string;
  population: number;
  marketSize: string;
  competitionLevel: 'low' | 'medium' | 'high';
  opportunityScore: number;
  keyInsights: string[];
  actionItems: string[];
  timeToCapture: string;
  estimatedRevenue: number;
}

export interface CustomerBehaviorPattern {
  location: string;
  searchPatterns: string[];
  peakActivityHours: string[];
  preferredDevices: string[];
  seasonalTrends: string[];
  localPreferences: string[];
  conversionTriggers: string[];
  averageJourneyLength: string;
}

export interface GeoROIProjection {
  initialInvestment: number;
  monthlyROI: number[];
  yearOneROI: number;
  yearTwoROI: number;
  yearThreeROI: number;
  breakEvenPoint: string;
  riskFactors: string[];
  conservativeEstimate: number;
  optimisticEstimate: number;
  keyDrivers: string[];
}

export interface GeoSuccessMetric {
  metric: string;
  currentValue: number;
  targetValue: number;
  timeframe: string;
  measurementMethod: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  industryBenchmark: number;
}

export interface GeoImplementationPhase {
  phase: number;
  title: string;
  duration: string;
  tasks: GeoTask[];
  expectedOutcomes: string[];
  dependencies: string[];
  resources: string[];
  milestones: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface GeoTask {
  taskName: string;
  description: string;
  estimatedHours: number;
  skillRequired: string;
  priority: 'high' | 'medium' | 'low';
  deliverable: string;
}

export interface GeoChallengesSolution {
  challenge: string;
  impact: 'high' | 'medium' | 'low';
  probability: 'high' | 'medium' | 'low';
  solution: string;
  preventiveMeasures: string[];
  contingencyPlan: string;
  estimatedCost: number;
  timeToResolve: string;
}

export interface LocalCompetitorAnalysis {
  mainCompetitors: LocalCompetitor[];
  marketDynamics: string[];
  competitiveAdvantages: string[];
  threats: string[];
  opportunities: string[];
  marketGaps: string[];
  strategicRecommendations: string[];
}

export interface LocalCompetitor {
  name: string;
  website: string;
  marketShare: number;
  geoStrength: number;
  weaknesses: string[];
  strengths: string[];
  geoStrategy: string[];
  locations: string[];
  customerBase: string;
  pricingStrategy: string;
  marketingApproach: string[];
}

export interface GeoPerformanceMetrics {
  localSearchVisibility: number;
  googleMyBusinessScore: number;
  localCitationConsistency: number;
  reviewScore: number;
  localKeywordRankings: number;
  nearMeSearchPerformance: number;
  localTrafficShare: number;
  conversionRateByLocation: { location: string; rate: number }[];
  localBrandAwareness: number;
  competitivePositioning: number;
}

export interface Recommendation {
  id: string;
  category: 'technical' | 'content' | 'schema' | 'geo' | 'ai';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: string;
  timeline: string;
}

export interface GeographicData {
  location: string;
  visibility: number;
  searchVolume: number;
  competition: number;
  opportunities: number;
}

export interface KeywordRanking {
  keyword: string;
  currentRank: number;
  searchVolume: number;
  difficulty: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Citation {
  source: string;
  status: 'verified' | 'unverified' | 'inconsistent';
  accuracy: number;
  authority: number;
}

export interface Competitor {
  name: string;
  url: string;
  overallScore: number;
  geoScore: number;
  aiScore: number;
  marketShare: number;
}

export interface TechnicalIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  solution: string;
}

export interface Project {
  id: string;
  clientName: string;
  websiteUrl: string;
  createdAt: Date;
  lastAnalyzed: Date;
  status: 'active' | 'completed' | 'pending';
  analysisResults: AnalysisResult[];
  notes: string;
}