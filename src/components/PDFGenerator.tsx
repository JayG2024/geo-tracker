import { jsPDF } from 'jspdf';
import { CombinedAnalysis } from '../types/analysis';

export const generatePDFReport = (results: CombinedAnalysis): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  // Enhanced professional color scheme
  const colors = {
    primary: [37, 99, 235], // Blue
    secondary: [139, 92, 246], // Purple
    accent: [16, 185, 129], // Green
    warning: [245, 158, 11], // Orange
    danger: [239, 68, 68], // Red
    dark: [17, 24, 39], // Dark gray
    medium: [75, 85, 99], // Medium gray
    light: [156, 163, 175], // Light gray
    background: [248, 250, 252], // Very light blue-gray
    white: [255, 255, 255],
    gold: [251, 191, 36] // Gold
  };

  // Optimized spacing for content density
  const spacing = {
    section: 20,
    subsection: 12,
    paragraph: 8,
    line: 5,
    tight: 3
  };

  // Professional typography
  const fonts = {
    title: { size: 24, weight: 'bold' },
    subtitle: { size: 18, weight: 'bold' },
    heading: { size: 16, weight: 'bold' },
    subheading: { size: 14, weight: 'bold' },
    body: { size: 11, weight: 'normal' },
    small: { size: 9, weight: 'normal' },
    caption: { size: 8, weight: 'normal' }
  };

  // Helper functions
  const checkPageBreak = (height: number) => {
    if (yPosition + height > pageHeight - margin - 25) {
      addPageFooter();
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  const addPageFooter = () => {
    const pageNum = doc.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fonts.caption.size);
    doc.setTextColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
    doc.text(`GEO Strategic Analysis • ${new Date().toLocaleDateString()}`, margin, pageHeight - 15);
  };

  const addGradientBackground = (x: number, y: number, width: number, height: number, startColor: number[], endColor: number[]) => {
    const steps = 20;
    const stepHeight = height / steps;
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * ratio);
      const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * ratio);
      const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * ratio);
      
      doc.setFillColor(r, g, b);
      doc.rect(x, y + (i * stepHeight), width, stepHeight, 'F');
    }
  };

  const addText = (text: string, font: any, color: number[] = colors.dark, align: 'left' | 'center' | 'right' = 'left', gapAfter: number = spacing.line) => {
    checkPageBreak(font.size + gapAfter);
    doc.setFont('helvetica', font.weight);
    doc.setFontSize(font.size);
    doc.setTextColor(color[0], color[1], color[2]);
    
    if (align === 'center') {
      doc.text(text, pageWidth / 2, yPosition, { align: 'center' });
    } else if (align === 'right') {
      doc.text(text, pageWidth - margin, yPosition, { align: 'right' });
    } else {
      doc.text(text, margin, yPosition);
    }
    yPosition += font.size + gapAfter;
  };

  const addMultilineText = (text: string, font: any, maxWidth: number = pageWidth - 2 * margin, color: number[] = colors.dark, gapAfter: number = spacing.paragraph) => {
    doc.setFont('helvetica', font.weight);
    doc.setFontSize(font.size);
    doc.setTextColor(color[0], color[1], color[2]);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      checkPageBreak(font.size + spacing.tight);
      doc.text(line, margin, yPosition);
      yPosition += font.size + (index === lines.length - 1 ? gapAfter : spacing.tight);
    });
  };

  const addSection = (title: string, bgColor: number[] = colors.primary, height: number = 25) => {
    checkPageBreak(height);
    
    // Gradient section header
    addGradientBackground(0, yPosition - 5, pageWidth, height, bgColor, [...bgColor.map(c => Math.max(0, c - 30))]);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fonts.heading.size);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text(title, margin, yPosition + 15);
    
    yPosition += height + spacing.tight;
  };

  const addKPIBlock = (icon: string, title: string, value: string, description: string, bgColor: number[]) => {
    checkPageBreak(60);
    
    // KPI container with gradient
    addGradientBackground(margin, yPosition, pageWidth - 2 * margin, 50, bgColor, [...bgColor.map(c => Math.max(0, c - 20))]);
    
    // Icon and title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fonts.body.size);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text(`${icon} ${title}`, margin + 10, yPosition + 15);
    
    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fonts.heading.size);
    doc.text(value, margin + 10, yPosition + 30);
    
    yPosition += 55;
    
    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fonts.small.size);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    addMultilineText(description, fonts.small, pageWidth - 2 * margin, colors.dark, spacing.subsection);
  };

  const addPillarAnalysis = (icon: string, title: string, score: number, description: string) => {
    checkPageBreak(70);
    
    const scoreColor = score < 30 ? colors.danger : score < 60 ? colors.warning : colors.accent;
    
    // Pillar container
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 55, 'F');
    
    // Score indicator
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.rect(margin, yPosition, 8, 55, 'F');
    
    // Icon and title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fonts.subheading.size);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.text(`${icon} ${title}`, margin + 15, yPosition + 15);
    
    // Score
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fonts.heading.size);
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${score}/100`, pageWidth - margin - 50, yPosition + 15);
    
    if (score < 30) {
      doc.setTextColor(colors.danger[0], colors.danger[1], colors.danger[2]);
      doc.setFontSize(fonts.small.size);
      doc.text('🔴 CRITICAL', pageWidth - margin - 50, yPosition + 28);
    }
    
    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fonts.small.size);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    const descLines = doc.splitTextToSize(description, pageWidth - 2 * margin - 80);
    let descY = yPosition + 35;
    descLines.slice(0, 2).forEach((line: string) => {
      doc.text(line, margin + 15, descY);
      descY += fonts.small.size + spacing.tight;
    });
    
    yPosition += 65;
  };

  const addPhaseBlock = (phaseNumber: number, title: string, goal: string, actions: string[], bgColor: number[]) => {
    checkPageBreak(100);
    
    // Phase header
    addGradientBackground(margin, yPosition, pageWidth - 2 * margin, 20, bgColor, [...bgColor.map(c => Math.max(0, c - 25))]);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fonts.subheading.size);
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text(`Phase ${phaseNumber}: ${title}`, margin + 10, yPosition + 15);
    
    yPosition += 25;
    
    // Goal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fonts.body.size);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    addMultilineText(`🎯 Goal: ${goal}`, fonts.body, pageWidth - 2 * margin, colors.dark, spacing.line);
    
    // Actions
    addText('✅ Key Actions:', fonts.body, colors.dark, 'left', spacing.tight);
    actions.forEach(action => {
      addMultilineText(`• ${action}`, fonts.small, pageWidth - 2 * margin - 20, colors.medium, spacing.tight);
    });
    
    yPosition += spacing.subsection;
  };

  // Extract client name
  const clientName = results.url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const formattedClientName = clientName.charAt(0).toUpperCase() + clientName.slice(1);

  // Use the actual GEO score from the analysis
  const geoScore = Math.round(results.geo.score);
  const seoScore = Math.round(results.seo.score);
  const overallScore = Math.round(results.overallScore);

  // ======================
  // PART 1: COVER PAGE 📄
  // ======================
  
  // Professional gradient background
  addGradientBackground(0, 0, pageWidth, pageHeight, colors.background, colors.white);
  
  yPosition = 60;
  
  // Agency logo placeholder
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(pageWidth/2 - 30, yPosition - 15, 60, 25, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fonts.body.size);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text('YOUR AGENCY', pageWidth/2 - 20, yPosition - 2);
  
  yPosition += 40;
  
  // Main title with enhanced styling
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(15, yPosition - 20, pageWidth - 30, 80, 'F');
  
  yPosition += 5;
  addText('✨ Strategic GEO Analysis ✨', fonts.title, colors.white, 'center', spacing.line);
  addText('Generative Engine Optimization', fonts.subtitle, colors.white, 'center', spacing.line);
  addText('& Authority Roadmap', fonts.subtitle, colors.white, 'center', spacing.subsection);
  
  yPosition += 40;
  
  // Client information
  addText(`CLIENT: ${formattedClientName}`, fonts.heading, colors.dark, 'center', spacing.line);
  addText(`WEBSITE: ${results.url}`, fonts.body, colors.medium, 'center', spacing.line);
  addText(`ANALYSIS DATE: ${new Date(results.timestamp).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, fonts.small, colors.medium, 'center', spacing.subsection);
  
  // Bottom tagline
  yPosition = pageHeight - 60;
  addText('Analysis of AI Search Visibility, Content Authority, and Digital Trust Signals', fonts.small, colors.light, 'center');

  addPageFooter();

  // ======================
  // PART 2: EXECUTIVE SUMMARY 🚀
  // ======================
  
  doc.addPage();
  yPosition = margin;
  
  addSection('📊 Executive Summary: The Authority Imperative', colors.primary);
  
  addMultilineText(`The way your customers find solutions has fundamentally changed. They no longer just search; they ask AI for answers. This report analyzes ${formattedClientName}'s readiness for this new reality.`, fonts.body);
  
  addMultilineText(`Currently, ${formattedClientName} is building its digital presence for an old paradigm. Our analysis reveals a critical gap in AI-readiness, but also a once-in-a-generation opportunity to become the dominant, AI-cited authority in your field before your competitors even realize the game has changed.`, fonts.body, pageWidth - 2 * margin, colors.dark, spacing.subsection);
  
  // Key Performance Indicators
  addText('Key Performance Indicators (KPIs):', fonts.heading, colors.primary, 'left', spacing.subsection);
  
  addKPIBlock(
    '🧠',
    'GEO Visibility Score',
    `${geoScore}/100`,
    `Measures your content's likelihood of being cited by AI. ${geoScore < 40 ? 'This score indicates a critical lack of deep, educational content.' : geoScore < 70 ? 'This score shows moderate AI readiness with room for improvement.' : 'This score indicates strong AI citation potential.'}`,
    geoScore < 40 ? colors.danger : geoScore < 70 ? colors.warning : colors.accent
  );
  
  addKPIBlock(
    '🏆',
    'Market Authority Position',
    '#1 (Opportunity)',
    'The position of "most trusted AI-cited expert" in your niche is currently vacant. This is a land grab.',
    colors.gold
  );
  
  addKPIBlock(
    '🔍',
    'SEO Performance Score',
    `${seoScore}/100`,
    `Traditional search engine optimization metrics. ${seoScore < 40 ? 'Critical SEO issues need immediate attention.' : seoScore < 70 ? 'Good foundation with room for improvement.' : 'Strong SEO performance across key metrics.'}`,
    seoScore < 40 ? colors.danger : seoScore < 70 ? colors.warning : colors.accent
  );
  
  addKPIBlock(
    '📊',
    'Overall Digital Authority',
    `${overallScore}/100`,
    'Combined measure of traditional SEO and AI search visibility, representing your total digital authority.',
    overallScore < 40 ? colors.danger : overallScore < 70 ? colors.warning : colors.accent
  );
  
  // Strategic Opportunity
  addText('Your Strategic Opportunity in 3 Points:', fonts.heading, colors.primary, 'left', spacing.subsection);
  
  const opportunities = [
    '🏰 Build a Moat: Create a competitive advantage based on authority that is incredibly difficult for others to replicate.',
    '💡 Become the Source of Truth: Transform your website from a "brochure" into a "knowledge base" that AI trusts and references.',
    '⏳ Future-Proof Your Business: Align your strategy with the future of search, ensuring long-term relevance and growth.'
  ];
  
  opportunities.forEach(opportunity => {
    addMultilineText(opportunity, fonts.body, pageWidth - 2 * margin, colors.dark, spacing.line);
  });
  
  // Risk statement
  checkPageBreak(40);
  doc.setFillColor(colors.danger[0], colors.danger[1], colors.danger[2]);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');
  yPosition += 10;
  addText('The risk of inaction is not just missed traffic;', fonts.body, colors.white, 'center', spacing.tight);
  addText('it\'s strategic irrelevance.', fonts.body, colors.white, 'center', spacing.subsection);

  addPageFooter();

  // ======================
  // PART 3: DEEP-DIVE ANALYSIS 🔬
  // ======================
  
  doc.addPage();
  yPosition = margin;
  
  addSection('🔬 Why AI Currently Overlooks You: A Performance Breakdown', colors.secondary);
  
  addMultilineText('Our GEO score is calculated from four critical pillars. Here\'s how you currently perform in each:', fonts.body, pageWidth - 2 * margin, colors.dark, spacing.subsection);
  
  // Pillar analysis based on actual data
  addPillarAnalysis(
    '🤖',
    'AI Visibility',
    results.geo.aiVisibility.score,
    `Your presence across major AI platforms. ${results.geo.aiVisibility.score < 50 ? 'Limited visibility in AI search results - AI platforms are not finding or citing your content.' : 'AI platforms are recognizing your content as a valuable source.'}`
  );
  
  addPillarAnalysis(
    '📝',
    'Content Structure',
    results.geo.contentStructure.score,
    `How well your content is structured for AI comprehension. ${results.geo.contentStructure.score < 50 ? 'Content structure needs improvement for better AI understanding.' : 'Well-structured content that AI can easily parse and cite.'}`
  );
  
  addPillarAnalysis(
    '🎯',
    'Information Accuracy',
    results.geo.informationAccuracy.score,
    `Accuracy and freshness of your business information. ${results.geo.informationAccuracy.score < 50 ? 'Information inconsistencies may confuse AI systems.' : 'Accurate, up-to-date information that builds AI trust.'}`
  );
  
  addPillarAnalysis(
    '🏆',
    'Competitive Position',
    results.geo.competitivePosition.score,
    `Your authority relative to competitors. ${results.geo.competitivePosition.score < 50 ? 'Competitors are dominating the AI citation landscape.' : 'Strong competitive position with growing authority.'}`
  );

  addPageFooter();

  // ======================
  // PART 4: STRATEGIC ROADMAP 🗺️
  // ======================
  
  doc.addPage();
  yPosition = margin;
  
  addSection('🗺️ Your 3-Phase Roadmap to Authority Leadership', colors.accent);
  
  addMultilineText('This isn\'t a list of fixes; it\'s a strategic transformation.', fonts.body, pageWidth - 2 * margin, colors.dark, spacing.subsection);
  
  // Phase definitions
  addPhaseBlock(
    1,
    'Foundation of Trust (Months 1-3) 🏗️',
    'Fix the critical trust and technical deficits to make your site "readable" to AI.',
    [
      '👤 Build Expert Profiles: Create detailed "About Us" and individual author pages for your key team members.',
      '🏷️ Deploy Advanced Schema: Implement a full suite of structured data across the site.',
      '🔎 Content Audit & Upgrade: Enhance or merge existing content to meet new depth standards.'
    ],
    colors.primary
  );
  
  addPhaseBlock(
    2,
    'Building Authority Pillars (Months 4-9) 🏛️',
    'Create the definitive, "citation-worthy" assets that will establish your dominance.',
    [
      '📘 Publish "The Ultimate Guide to [Your Core Topic]": A massive, 4,000-word educational resource.',
      '📊 Release an Original Research Report: Create a unique, data-driven "State of the Industry" report. Data is a citation magnet.',
      '❓ Launch a "Problem/Solution" Content Series: Address your customers\' most painful problems with deep-dive articles.'
    ],
    colors.accent
  );
  
  addPhaseBlock(
    3,
    'Scaling & Dominance (Months 10+) 👑',
    'Solidify your leadership position and create an unbeatable competitive advantage.',
    [
      '🛠️ Develop a Free, Interactive Tool: Create a unique calculator or assessment tool on your site.',
      '🔗 Amplify through Strategic Outreach: Promote your pillar content to earn high-authority mentions and links.',
      '📈 Monitor & Iterate: Continuously track AI trends and create content to answer emerging questions.'
    ],
    colors.gold
  );

  addPageFooter();

  // ======================
  // PART 5: VISUALIZATION 📈
  // ======================
  
  doc.addPage();
  yPosition = margin;
  
  addSection('📈 The Journey from Brochure to Authority', colors.gold);
  
  yPosition += 20;
  
  addText('Current Path vs. Proposed Path:', fonts.heading, colors.dark, 'left', spacing.subsection);
  
  // Key Metrics Summary
  addText('Current Performance Metrics:', fonts.heading, colors.dark, 'left', spacing.subsection);
  
  // SEO Metrics
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 80, 'F');
  yPosition += 10;
  addText('SEO Performance Breakdown', fonts.subheading, colors.white, 'left', spacing.line);
  addText(`Technical SEO: ${Math.round(results.seo.technical.score)}/100`, fonts.body, colors.white, 'left', spacing.tight);
  addText(`Content Quality: ${Math.round(results.seo.content.score)}/100`, fonts.body, colors.white, 'left', spacing.tight);
  addText(`Domain Authority: ${Math.round(results.seo.authority.score)}/100`, fonts.body, colors.white, 'left', spacing.tight);
  addText(`User Experience: ${Math.round(results.seo.userExperience.score)}/100`, fonts.body, colors.white, 'left', spacing.subsection);
  
  // GEO Metrics
  doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 80, 'F');
  yPosition += 10;
  addText('GEO Performance Breakdown', fonts.subheading, colors.white, 'left', spacing.line);
  addText(`AI Visibility: ${Math.round(results.geo.aiVisibility.score)}/100`, fonts.body, colors.white, 'left', spacing.tight);
  addText(`Content Structure: ${Math.round(results.geo.contentStructure.score)}/100`, fonts.body, colors.white, 'left', spacing.tight);
  addText(`Information Accuracy: ${Math.round(results.geo.informationAccuracy.score)}/100`, fonts.body, colors.white, 'left', spacing.tight);
  addText(`Competitive Position: ${Math.round(results.geo.competitivePosition.score)}/100`, fonts.body, colors.white, 'left', spacing.subsection);

  addPageFooter();

  // ======================
  // PART 6: FINAL PITCH 🤝
  // ======================
  
  doc.addPage();
  yPosition = margin;
  
  addSection('🤝 Your Choice: Compete or Dominate?', colors.accent);
  
  yPosition += 20;
  
  // Add top recommendations if available
  if (results.recommendations && results.recommendations.length > 0) {
    addText('Priority Recommendations:', fonts.heading, colors.dark, 'left', spacing.subsection);
    
    const criticalRecs = results.recommendations.filter(r => r.priority === 'critical').slice(0, 3);
    const highRecs = results.recommendations.filter(r => r.priority === 'high').slice(0, 3);
    const topRecs = [...criticalRecs, ...highRecs].slice(0, 5);
    
    topRecs.forEach((rec, index) => {
      const icon = rec.priority === 'critical' ? '🚨' : '⚠️';
      addMultilineText(`${icon} ${rec.title}: ${rec.description}`, fonts.body, pageWidth - 2 * margin, colors.dark, spacing.line);
    });
    
    yPosition += spacing.subsection;
  }
  
  addMultilineText('You can continue competing on the same crowded playing field as everyone else.', fonts.body);
  
  addMultilineText('Or, you can choose to play a different game entirely—a game where you set the rules. By investing in this GEO strategy, you are not just optimizing a website; you are building your legacy as the definitive leader in your industry.', fonts.body, pageWidth - 2 * margin, colors.dark, spacing.subsection);
  
  // Call to action
  checkPageBreak(60);
  doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, 'F');
  
  yPosition += 15;
  addText('Ready to build your authority engine?', fonts.subtitle, colors.white, 'center', spacing.line);
  
  yPosition += 10;
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(margin + 30, yPosition, pageWidth - 2 * margin - 60, 25, 'F');
  
  yPosition += 10;
  addText('Schedule a Strategy Call with Us', fonts.heading, colors.white, 'center');
  
  // Enhanced footer
  yPosition = pageHeight - 60;
  doc.setDrawColor(colors.light[0], colors.light[1], colors.light[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;
  addText(`GEO Analysis Report - Generated ${new Date(results.timestamp).toLocaleDateString()}`, fonts.caption, colors.light, 'center', spacing.tight);
  addText('Transforming businesses through AI-first authority building', fonts.caption, colors.light, 'center');

  addPageFooter();

  // Add final page numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fonts.caption.size);
    doc.setTextColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.text(`${i} of ${totalPages}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
  }

  // Save the enhanced GEO PDF
  doc.save(`GEO-Strategic-Analysis-${clientName}-${new Date().toISOString().split('T')[0]}.pdf`);
};