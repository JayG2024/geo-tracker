// Configuration to ensure GeoTest.ai scores 100% on its own analysis

export const perfectScoreOptimizations = {
  // Technical SEO Requirements
  technical: {
    // Page speed targets
    pageSpeed: {
      mobile: 90, // Target 90+ on mobile
      desktop: 95, // Target 95+ on desktop
      firstContentfulPaint: 1.8, // Under 1.8s
      largestContentfulPaint: 2.5, // Under 2.5s
      cumulativeLayoutShift: 0.1, // Under 0.1
      totalBlockingTime: 200, // Under 200ms
    },
    
    // Core Web Vitals
    coreWebVitals: {
      LCP: 2500, // ms
      FID: 100, // ms
      CLS: 0.1,
      INP: 200, // ms
    },
    
    // Mobile optimization
    mobile: {
      viewport: 'width=device-width, initial-scale=1.0',
      touchTargets: '48x48', // Minimum touch target size
      fontSizes: 16, // Minimum font size to prevent zoom
    }
  },
  
  // Content Requirements for AI Visibility
  content: {
    // Minimum content requirements
    minimumWordCount: 500,
    headingStructure: ['h1', 'h2', 'h3'], // Proper hierarchy
    
    // Required sections for AI understanding
    requiredSections: [
      'What is GeoTest.ai',
      'How it works',
      'Features',
      'Benefits',
      'Use cases',
      'FAQ',
      'Contact'
    ],
    
    // Keywords for AI recognition
    primaryKeywords: [
      'AI SEO analyzer',
      'GEO optimization tool',
      'AI search visibility',
      'ChatGPT SEO',
      'Claude SEO',
      'Perplexity optimization'
    ],
    
    // Semantic HTML elements
    semanticElements: {
      header: true,
      nav: true,
      main: true,
      article: true,
      section: true,
      aside: true,
      footer: true
    }
  },
  
  // Structured Data Requirements
  structuredData: {
    // Required schema types
    schemas: [
      'WebApplication',
      'Organization',
      'FAQPage',
      'HowTo',
      'SoftwareApplication'
    ],
    
    // Rich snippets
    richSnippets: {
      rating: true,
      price: true,
      availability: true,
      reviews: true
    }
  },
  
  // AI-Specific Optimizations
  aiOptimizations: {
    // Meta tags for AI crawlers
    aiMetaTags: {
      'ai-crawler': 'index, follow',
      'chatgpt-bot': 'index, follow',
      'claude-bot': 'index, follow',
      'perplexity-bot': 'index, follow',
      'ai-description': 'Free AI visibility testing tool for websites'
    },
    
    // Content markers for AI
    aiContentMarkers: {
      authoritative: true,
      factual: true,
      updated: true,
      verified: true
    },
    
    // Citation-worthy content
    citableContent: {
      statistics: true,
      methodology: true,
      uniqueInsights: true,
      expertQuotes: true
    }
  },
  
  // Security & Trust Signals
  trust: {
    https: true,
    ssl: true,
    privacyPolicy: true,
    termsOfService: true,
    gdprCompliant: true,
    accessibility: true,
    
    // Trust badges
    badges: [
      'SSL Secured',
      'GDPR Compliant',
      'SOC 2 Type II',
      'Privacy Shield'
    ]
  },
  
  // Link Profile
  links: {
    // Internal linking
    internal: {
      minimumLinks: 5,
      maxLinks: 50,
      descriptiveAnchors: true
    },
    
    // External linking
    external: {
      authoritative: true,
      relevant: true,
      nofollow: false, // For trusted sources
      maxLinks: 10
    }
  },
  
  // User Experience Signals
  ux: {
    // Engagement metrics
    bounceRate: 40, // Target under 40%
    avgSessionDuration: 120, // Target over 2 minutes
    pagesPerSession: 2.5, // Target over 2.5
    
    // Interactive elements
    interactive: {
      forms: true,
      calculators: true,
      tools: true,
      comments: false // Not needed for this type of site
    }
  },
  
  // Performance Optimizations
  performance: {
    // Resource optimization
    images: {
      format: ['webp', 'avif'],
      lazyLoading: true,
      responsive: true,
      maxSize: 200, // KB
    },
    
    // Code optimization
    javascript: {
      minified: true,
      bundled: true,
      treeshaking: true,
      codeSpitting: true
    },
    
    // Caching
    caching: {
      browserCache: true,
      cdnCache: true,
      serviceWorker: true,
      cacheTime: 31536000 // 1 year for static assets
    }
  }
};

// Checklist for manual verification
export const manualChecklist = [
  'Verify all images have alt text',
  'Check all links are working (no 404s)',
  'Ensure mobile responsiveness',
  'Test site on slow 3G connection',
  'Verify WCAG 2.1 AA compliance',
  'Check for console errors',
  'Validate HTML markup',
  'Test all interactive features',
  'Verify analytics tracking',
  'Check social media meta tags',
  'Test site in different browsers',
  'Verify sitemap is updated',
  'Check robots.txt is correct',
  'Test HTTPS redirect',
  'Verify canonical URLs'
];

// Features to highlight for 100% score
export const highlightFeatures = {
  free: [
    'Basic SEO analysis',
    'AI visibility check',
    'GEO score calculation',
    'Performance metrics',
    'Mobile optimization check',
    'Basic recommendations'
  ],
  
  premium: [
    'Advanced AI analysis',
    'Competitor comparison',
    'Custom PDF reports',
    'API access',
    'Bulk URL analysis',
    'White-label reports',
    'Priority support',
    'Historical tracking'
  ]
};