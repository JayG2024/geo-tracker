import { CombinedAnalysis, SEOMetrics, GEOMetrics, Recommendation } from '../types/analysis';

// Generate realistic SEO metrics based on URL
export const generateSEOMetrics = (url: string): SEOMetrics => {
  // Use URL characteristics to generate consistent scores
  const urlLength = url.length;
  const hasHttps = url.includes('https');
  const hasDashes = url.includes('-');
  
  // Generate somewhat random but consistent scores based on URL
  const seed = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const rand = Math.sin(seed) * 10000;
    return Math.floor((rand - Math.floor(rand)) * (max - min + 1)) + min;
  };

  const technicalScore = random(65, 95);
  const contentScore = random(60, 90);
  const authorityScore = random(40, 85);
  const uxScore = random(70, 95);

  return {
    score: Math.round((technicalScore + contentScore + authorityScore + uxScore) / 4),
    technical: {
      score: technicalScore,
      pageSpeed: random(60, 95),
      mobileResponsive: random(0, 100) > 20,
      httpsEnabled: hasHttps || random(0, 100) > 30,
      xmlSitemap: random(0, 100) > 40,
      robotsTxt: random(0, 100) > 50,
      canonicalTags: random(0, 100) > 60,
      structuredData: random(0, 100) > 70
    },
    content: {
      score: contentScore,
      titleTag: random(0, 100) > 20,
      metaDescription: random(0, 100) > 30,
      headingStructure: random(75, 95),
      contentLength: random(800, 2500),
      keywordOptimization: random(60, 90),
      readabilityScore: random(65, 85)
    },
    authority: {
      score: authorityScore,
      domainAge: `${random(1, 15)} years`,
      backlinks: random(50, 5000),
      domainAuthority: random(20, 70),
      trustFlow: random(15, 60)
    },
    userExperience: {
      score: uxScore,
      coreWebVitals: {
        lcp: random(1.5, 3.5),
        fid: random(50, 200),
        cls: random(0.05, 0.25)
      },
      bounceRate: random(30, 70),
      avgTimeOnPage: random(60, 300)
    }
  };
};

// Generate realistic GEO metrics
export const generateGEOMetrics = (url: string): GEOMetrics => {
  const domain = new URL(url).hostname;
  const seed = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const rand = Math.sin(seed * (min + max)) * 10000;
    return Math.floor((rand - Math.floor(rand)) * (max - min + 1)) + min;
  };

  const aiVisibilityScore = random(40, 85);
  const accuracyScore = random(50, 95);
  const structureScore = random(60, 90);
  const competitiveScore = random(30, 80);
  const optimizationScore = random(45, 85);

  return {
    score: Math.round((aiVisibilityScore + accuracyScore + structureScore + competitiveScore + optimizationScore) / 5),
    aiVisibility: {
      score: aiVisibilityScore,
      chatGPT: random(0, 100) > 60,
      claude: random(0, 100) > 70,
      perplexity: random(0, 100) > 50,
      gemini: random(0, 100) > 65,
      bingChat: random(0, 100) > 55
    },
    informationAccuracy: {
      score: accuracyScore,
      businessNameCorrect: random(0, 100) > 20,
      servicesAccurate: random(0, 100) > 40,
      contactInfoCorrect: random(0, 100) > 30,
      locationAccurate: random(0, 100) > 25,
      lastUpdated: new Date(Date.now() - random(1, 180) * 24 * 60 * 60 * 1000).toISOString()
    },
    contentStructure: {
      score: structureScore,
      semanticHTML: random(0, 100) > 40,
      clearHeaders: random(0, 100) > 35,
      faqSchema: random(0, 100) > 70,
      definitiveSentences: random(0, 100) > 50,
      citableContent: random(0, 100) > 60
    },
    competitivePosition: {
      score: competitiveScore,
      mentionRate: random(15, 75),
      rankingPosition: random(1, 10),
      authoritySignals: random(40, 85),
      uniqueValueProps: random(50, 90)
    },
    optimization: {
      score: optimizationScore,
      entityRecognition: random(0, 100) > 65,
      knowledgeGraphPresence: random(0, 100) > 80,
      wikipediaPresence: random(0, 100) > 90,
      industryDirectories: random(0, 100) > 60,
      consistentNAP: random(0, 100) > 40
    }
  };
};

// Generate recommendations based on scores
export const generateRecommendations = (seo: SEOMetrics, geo: GEOMetrics): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // SEO Recommendations
  if (!seo.technical.httpsEnabled) {
    recommendations.push({
      category: 'seo',
      priority: 'critical',
      title: 'Enable HTTPS',
      description: 'Your site is not using HTTPS. This is a critical security and SEO issue.',
      impact: 'Major ranking boost and security improvement',
      effort: 'medium',
      estimatedTime: '2-4 hours'
    });
  }

  if (seo.technical.pageSpeed < 70) {
    recommendations.push({
      category: 'seo',
      priority: 'high',
      title: 'Improve Page Speed',
      description: 'Your page loads slowly. Optimize images, minify code, and enable caching.',
      impact: '10-20% improvement in rankings and conversions',
      effort: 'medium',
      estimatedTime: '4-8 hours'
    });
  }

  if (!seo.content.titleTag || !seo.content.metaDescription) {
    recommendations.push({
      category: 'seo',
      priority: 'high',
      title: 'Optimize Meta Tags',
      description: 'Missing or unoptimized title tags and meta descriptions.',
      impact: 'Better click-through rates from search results',
      effort: 'easy',
      estimatedTime: '1-2 hours'
    });
  }

  // GEO Recommendations
  if (geo.aiVisibility.score < 60) {
    recommendations.push({
      category: 'geo',
      priority: 'critical',
      title: 'Improve AI Visibility',
      description: 'Your website has low visibility in AI search results. Focus on clear, definitive content.',
      impact: 'Dramatically increase mentions in AI responses',
      effort: 'medium',
      estimatedTime: '6-10 hours'
    });
  }

  if (!geo.contentStructure.faqSchema) {
    recommendations.push({
      category: 'geo',
      priority: 'high',
      title: 'Add FAQ Schema Markup',
      description: 'Implement FAQ schema to help AI understand your content better.',
      impact: 'Higher chance of being cited by AI',
      effort: 'easy',
      estimatedTime: '2-3 hours'
    });
  }

  if (!geo.optimization.consistentNAP) {
    recommendations.push({
      category: 'geo',
      priority: 'high',
      title: 'Fix NAP Consistency',
      description: 'Your business name, address, and phone are inconsistent across the web.',
      impact: 'Better local AI recognition and trust',
      effort: 'easy',
      estimatedTime: '1-2 hours'
    });
  }

  // Combined Recommendations
  if (seo.content.contentLength < 1000) {
    recommendations.push({
      category: 'both',
      priority: 'high',
      title: 'Expand Content Depth',
      description: 'Your content is too thin. Both search engines and AI prefer comprehensive content.',
      impact: 'Better rankings and AI understanding',
      effort: 'medium',
      estimatedTime: '4-6 hours'
    });
  }

  if (!seo.technical.structuredData || !geo.contentStructure.semanticHTML) {
    recommendations.push({
      category: 'both',
      priority: 'high',
      title: 'Implement Structured Data',
      description: 'Add schema markup and semantic HTML to help both Google and AI understand your content.',
      impact: 'Improved visibility in both traditional and AI search',
      effort: 'medium',
      estimatedTime: '3-5 hours'
    });
  }

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
};

// Generate competitor data
export const generateCompetitorData = (url: string) => {
  const competitors = [
    { name: 'Competitor A', domain: 'competitor-a.com' },
    { name: 'Competitor B', domain: 'competitor-b.com' },
    { name: 'Competitor C', domain: 'competitor-c.com' }
  ];

  return competitors.map(comp => {
    const seoScore = Math.floor(Math.random() * 30) + 60;
    const geoScore = Math.floor(Math.random() * 35) + 55;

    return {
      name: comp.name,
      url: `https://${comp.domain}`,
      seoScore,
      geoScore,
      strengths: [
        seoScore > 80 ? 'Strong technical SEO' : 'Good content optimization',
        geoScore > 75 ? 'High AI visibility' : 'Growing AI presence'
      ],
      weaknesses: [
        seoScore < 70 ? 'Poor page speed' : 'Limited backlinks',
        geoScore < 65 ? 'Low AI citations' : 'Outdated information'
      ]
    };
  });
};

// Main analysis function
export const performSEOGEOAnalysis = async (url: string): Promise<CombinedAnalysis> => {
  // Validate and normalize URL
  let normalizedUrl = url.trim();
  let domain = normalizedUrl;
  
  try {
    // Add protocol if missing
    if (!normalizedUrl.match(/^https?:\/\//)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    const urlObj = new URL(normalizedUrl);
    domain = urlObj.hostname.replace('www.', '');
  } catch (error) {
    // If URL parsing fails, use the input as domain
    domain = normalizedUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const seoMetrics = generateSEOMetrics(normalizedUrl);
  const geoMetrics = generateGEOMetrics(normalizedUrl);
  const overallScore = Math.round((seoMetrics.score + geoMetrics.score) / 2);
  const recommendations = generateRecommendations(seoMetrics, geoMetrics);
  const competitors = generateCompetitorData(normalizedUrl);

  return {
    overallScore,
    seo: seoMetrics,
    geo: geoMetrics,
    recommendations,
    competitorComparison: competitors,
    lastAnalyzed: new Date(),
    url: normalizedUrl,
    title: domain.charAt(0).toUpperCase() + domain.slice(1),
    timestamp: new Date().toISOString()
  };
};