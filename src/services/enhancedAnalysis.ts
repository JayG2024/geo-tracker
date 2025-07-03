import { CombinedAnalysis, SEOMetrics, GEOMetrics, Recommendation } from '../types/analysis';

// Enhanced analysis functions to provide more detailed insights

export function generateDetailedInsights(analysis: CombinedAnalysis): {
  summary: string;
  keyFindings: string[];
  criticalIssues: string[];
  opportunities: string[];
  competitiveAdvantages: string[];
} {
  const { seo, geo } = analysis;
  const keyFindings: string[] = [];
  const criticalIssues: string[] = [];
  const opportunities: string[] = [];
  const competitiveAdvantages: string[] = [];

  // SEO Analysis
  if (seo.technical.score < 60) {
    criticalIssues.push(`Technical SEO needs immediate attention (score: ${seo.technical.score}). Focus on page speed and mobile optimization.`);
  }
  
  if (!seo.technical.httpsEnabled) {
    criticalIssues.push('Website is not using HTTPS, which is critical for security and SEO rankings.');
  }

  if (seo.technical.pageSpeed < 50) {
    criticalIssues.push(`Page speed is critically slow (${seo.technical.pageSpeed}/100). This severely impacts user experience and rankings.`);
  }

  if (seo.content.score > 80) {
    competitiveAdvantages.push(`Strong content optimization (score: ${seo.content.score}) provides a solid foundation for search visibility.`);
  }

  if (seo.authority.serpPosition && seo.authority.serpPosition <= 10) {
    competitiveAdvantages.push(`Currently ranking in top 10 search results (position ${seo.authority.serpPosition}) for target keywords.`);
  }

  // GEO Analysis
  if (geo.aiVisibility.score < 50) {
    criticalIssues.push(`Low AI visibility score (${geo.aiVisibility.score}/100). Your content is not being effectively recognized by AI search engines.`);
  }

  if (!geo.aiVisibility.inChatGPT && !geo.aiVisibility.inClaude) {
    criticalIssues.push('Website has no presence in major AI chatbots (ChatGPT, Claude). This is a missed opportunity for AI-driven traffic.');
  }

  if (geo.contentStructure.score > 70) {
    competitiveAdvantages.push(`Well-structured content (score: ${geo.contentStructure.score}) helps AI systems understand and reference your information.`);
  }

  // Opportunities
  if (seo.authority.backlinks < 100) {
    opportunities.push(`Build more high-quality backlinks (current: ${seo.authority.backlinks}). Aim for 100+ from authoritative domains.`);
  }

  if (!seo.technical.structuredData) {
    opportunities.push('Implement structured data (Schema.org) to help search engines and AI better understand your content.');
  }

  if (geo.competitivePosition.score < 60) {
    opportunities.push('Analyze top competitors and identify content gaps to improve competitive positioning in AI search results.');
  }

  // Generate summary
  const overallHealth = analysis.overallScore >= 70 ? 'strong' : analysis.overallScore >= 50 ? 'moderate' : 'weak';
  const aiReadiness = geo.score >= 60 ? 'well-positioned' : 'needs improvement';
  
  const summary = `Your website has ${overallHealth} digital visibility with a combined score of ${analysis.overallScore}/100. ` +
    `Traditional SEO performance is ${seo.score >= 70 ? 'good' : 'needs work'} (${seo.score}/100), ` +
    `while AI search optimization ${aiReadiness} (${geo.score}/100). ` +
    `${criticalIssues.length > 0 ? `There are ${criticalIssues.length} critical issues requiring immediate attention. ` : ''}` +
    `${opportunities.length > 0 ? `We've identified ${opportunities.length} key opportunities for improvement.` : ''}`;

  return {
    summary,
    keyFindings,
    criticalIssues,
    opportunities,
    competitiveAdvantages
  };
}

export function generateActionableRecommendations(analysis: CombinedAnalysis): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const { seo, geo } = analysis;

  // Critical Technical SEO Issues
  if (!seo.technical.httpsEnabled) {
    recommendations.push({
      category: 'seo',
      priority: 'critical',
      title: 'Enable HTTPS Security',
      description: 'Your website is not using HTTPS. This is a critical security issue and negatively impacts SEO rankings.',
      impact: 'Improves security, user trust, and search rankings by 5-10%',
      effort: 'easy',
      estimatedTime: '1-2 hours'
    });
  }

  if (seo.technical.pageSpeed < 50) {
    recommendations.push({
      category: 'seo',
      priority: 'critical',
      title: 'Improve Page Load Speed',
      description: `Your page speed score is ${seo.technical.pageSpeed}/100. Optimize images, enable caching, and minimize JavaScript to improve performance.`,
      impact: 'Can reduce bounce rate by 20% and improve rankings',
      effort: 'medium',
      estimatedTime: '4-8 hours'
    });
  }

  // AI Visibility Issues
  if (geo.aiVisibility.score < 50) {
    recommendations.push({
      category: 'geo',
      priority: 'high',
      title: 'Optimize Content for AI Discovery',
      description: 'Your content is not optimized for AI search engines. Structure content with clear headings, summaries, and factual information.',
      impact: 'Increase AI-driven traffic by 30-50%',
      effort: 'medium',
      estimatedTime: '8-12 hours'
    });
  }

  if (!geo.aiVisibility.inChatGPT) {
    recommendations.push({
      category: 'geo',
      priority: 'high',
      title: 'Improve ChatGPT Visibility',
      description: 'Your website is not appearing in ChatGPT responses. Create comprehensive, authoritative content on your key topics.',
      impact: 'Tap into millions of ChatGPT users searching for information',
      effort: 'hard',
      estimatedTime: '2-3 weeks'
    });
  }

  // Content Optimization
  if (seo.content.contentLength < 1000) {
    recommendations.push({
      category: 'both',
      priority: 'medium',
      title: 'Expand Content Depth',
      description: `Your average content length is ${seo.content.contentLength} words. Aim for 1,500-2,500 words for better rankings and AI comprehension.`,
      impact: 'Improve rankings and AI understanding by 15-25%',
      effort: 'medium',
      estimatedTime: '1-2 weeks'
    });
  }

  if (!seo.content.metaDescription) {
    recommendations.push({
      category: 'seo',
      priority: 'high',
      title: 'Add Meta Descriptions',
      description: 'Missing meta descriptions on key pages. Write compelling 150-160 character descriptions for better click-through rates.',
      impact: 'Increase organic CTR by 5-10%',
      effort: 'easy',
      estimatedTime: '2-4 hours'
    });
  }

  // Technical Infrastructure
  if (!seo.technical.xmlSitemap) {
    recommendations.push({
      category: 'both',
      priority: 'medium',
      title: 'Create XML Sitemap',
      description: 'Generate and submit an XML sitemap to help search engines and AI crawlers discover all your content.',
      impact: 'Ensure 100% content discoverability',
      effort: 'easy',
      estimatedTime: '1 hour'
    });
  }

  if (!seo.technical.structuredData) {
    recommendations.push({
      category: 'both',
      priority: 'high',
      title: 'Implement Structured Data',
      description: 'Add Schema.org markup to help search engines and AI understand your content context and relationships.',
      impact: 'Improve rich snippets and AI comprehension by 20-30%',
      effort: 'medium',
      estimatedTime: '4-6 hours'
    });
  }

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

export function generateCompetitorInsights(analysis: CombinedAnalysis): {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
} {
  const { seo, geo } = analysis;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];

  // Analyze strengths
  if (seo.score > 70) {
    strengths.push('Strong traditional SEO foundation provides competitive advantage');
  }
  if (geo.score > 60) {
    strengths.push('Early adopter advantage in AI search optimization');
  }
  if (seo.authority.domainAuthority > 50) {
    strengths.push(`High domain authority (${seo.authority.domainAuthority}) establishes trust and credibility`);
  }

  // Identify weaknesses
  if (seo.technical.score < 60) {
    weaknesses.push('Technical SEO issues may limit growth potential');
  }
  if (geo.informationAccuracy.score < 70) {
    weaknesses.push('Information accuracy issues could damage AI search credibility');
  }
  if (seo.authority.backlinks < 100) {
    weaknesses.push('Limited backlink profile compared to established competitors');
  }

  // Find opportunities
  if (geo.competitivePosition.competitorGaps?.length > 0) {
    opportunities.push('Content gaps identified in competitor analysis can be leveraged');
  }
  if (!geo.aiVisibility.inPerplexity) {
    opportunities.push('Opportunity to become a primary source for Perplexity AI');
  }
  if (seo.userExperience.bounceRate > 50) {
    opportunities.push('Improving user experience could significantly boost engagement metrics');
  }

  // Assess threats
  if (seo.authority.serpPosition && seo.authority.serpPosition > 20) {
    threats.push('Low search rankings allow competitors to capture majority of traffic');
  }
  if (geo.score < 40) {
    threats.push('Competitors with better AI optimization will dominate future search landscape');
  }

  return { strengths, weaknesses, opportunities, threats };
}