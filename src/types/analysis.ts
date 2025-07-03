// SEO and GEO Analysis Types

export interface SEOMetrics {
  score: number;
  technical: {
    score: number;
    pageSpeed: number;
    mobileResponsive: boolean;
    httpsEnabled: boolean;
    xmlSitemap: boolean;
    robotsTxt: boolean;
    canonicalTags: boolean;
    structuredData: boolean;
  };
  content: {
    score: number;
    titleTag: boolean;
    metaDescription: boolean;
    headingStructure: number;
    contentLength: number;
    keywordOptimization: number;
    readabilityScore: number;
  };
  authority: {
    score: number;
    domainAge: string;
    backlinks: number;
    domainAuthority: number;
    trustFlow: number;
    serpPosition?: number | null;
    competitors?: string[];
  };
  userExperience: {
    score: number;
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
    bounceRate: number;
    avgTimeOnPage: number;
    pageSpeedInsights?: {
      opportunities: Array<{
        title: string;
        description: string;
        savings: string;
        impact: 'high' | 'medium' | 'low';
      }>;
      diagnostics: Array<{
        title: string;
        description: string;
        details: string;
      }>;
    };
  };
}

export interface GEOMetrics {
  score: number;
  aiVisibility: {
    score: number;
    chatGPT: boolean;
    claude: boolean;
    perplexity: boolean;
    gemini: boolean;
    bingChat: boolean;
  };
  informationAccuracy: {
    score: number;
    businessNameCorrect: boolean;
    servicesAccurate: boolean;
    contactInfoCorrect: boolean;
    locationAccurate: boolean;
    lastUpdated: string;
  };
  contentStructure: {
    score: number;
    semanticHTML: boolean;
    clearHeaders: boolean;
    faqSchema: boolean;
    definitiveSentences: boolean;
    citableContent: boolean;
  };
  competitivePosition: {
    score: number;
    mentionRate: number;
    rankingPosition: number;
    authoritySignals: number;
    uniqueValueProps: number;
  };
  optimization: {
    score: number;
    entityRecognition: boolean;
    knowledgeGraphPresence: boolean;
    wikipediaPresence: boolean;
    industryDirectories: boolean;
    consistentNAP: boolean; // Name, Address, Phone
  };
}

export interface CombinedAnalysis {
  overallScore: number;
  seo: SEOMetrics;
  geo: GEOMetrics;
  recommendations: Recommendation[];
  competitorComparison: CompetitorData[];
  lastAnalyzed: Date;
  url: string;
  title: string;
  timestamp: string;
}

export interface Recommendation {
  category: 'seo' | 'geo' | 'both';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

export interface CompetitorData {
  name: string;
  url: string;
  seoScore: number;
  geoScore: number;
  strengths: string[];
  weaknesses: string[];
}

export interface FreeTierLimits {
  scansPerWeek: number;
  scansRemaining: number;
  nextResetDate: Date;
  lastScanDate?: Date;
}

export interface UserTier {
  type: 'free' | 'pro' | 'enterprise';
  features: {
    savedWebsites: number | 'unlimited';
    scansPerMonth: number | 'unlimited';
    competitorTracking: boolean;
    whitelabelReports: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
}