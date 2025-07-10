// Security middleware and configurations for production

export const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS filter
  'X-XSS-Protection': '1; mode=block',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com https://api.openai.com https://api.anthropic.com https://api.perplexity.ai https://api.groq.com https://www.googleapis.com https://api.serper.dev https://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()'
  ].join(', '),
  
  // Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// Rate limiting configuration
export const rateLimitConfig = {
  // Global rate limit
  global: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // API rate limit (stricter)
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 API requests per windowMs
    message: 'Too many API requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Analysis endpoint rate limit (very strict)
  analysis: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 analyses per hour
    message: 'Analysis limit reached. Please try again in an hour.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
  },
  
  // Report generation rate limit
  report: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 report views/downloads per hour
    message: 'Report access limit reached. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  }
};

// IP whitelist for trusted sources
export const trustedIPs = [
  // Add your office/development IPs here
  // '192.168.1.1',
];

// Blocked user agents (malicious bots)
export const blockedUserAgents = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  // Exclude legitimate bots
  /^((?!googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|applebot|gptbot|anthropic|claude|perplexity).)*$/i
];

// CORS configuration
export const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://www.geotest.ai', 'https://geotest.ai']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400 // 24 hours
};

// Input validation rules
export const validationRules = {
  url: {
    maxLength: 2048,
    pattern: /^https?:\/\/.+/,
    blockedDomains: ['localhost', '127.0.0.1', '0.0.0.0', '192.168.', '10.', '172.'],
  },
  keywords: {
    maxLength: 500,
    maxCount: 10,
    pattern: /^[a-zA-Z0-9\s,.-]+$/,
  },
  email: {
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  reportTitle: {
    maxLength: 200,
    pattern: /^[a-zA-Z0-9\s,.-]+$/,
  }
};

// CAPTCHA configuration
export const captchaConfig = {
  // Google reCAPTCHA v3 settings
  siteKey: process.env.VITE_RECAPTCHA_SITE_KEY || 'YOUR_RECAPTCHA_SITE_KEY',
  secretKey: process.env.RECAPTCHA_SECRET_KEY || 'YOUR_RECAPTCHA_SECRET_KEY',
  
  // Score threshold (0.0 - 1.0, higher is more human-like)
  scoreThreshold: 0.5,
  
  // Actions that require CAPTCHA
  protectedActions: [
    'analyze_url',
    'generate_report',
    'download_pdf',
    'api_request'
  ],
  
  // Bypass CAPTCHA for these conditions
  bypassConditions: {
    // Trusted IPs don't need CAPTCHA
    trustedIPs: trustedIPs,
    // Authenticated users with good standing
    authenticatedUsers: true,
    // Development environment
    development: process.env.NODE_ENV === 'development'
  }
};

// Security monitoring
export const securityMonitoring = {
  // Log suspicious activities
  logSuspiciousActivity: (activity: string, ip: string, userAgent?: string) => {
    console.warn(`[SECURITY] ${activity} from IP: ${ip}, UA: ${userAgent || 'unknown'}`);
    // In production, send to monitoring service
  },
  
  // Track failed attempts
  trackFailedAttempts: new Map<string, number>(),
  
  // Block after X failed attempts
  maxFailedAttempts: 5,
  blockDuration: 60 * 60 * 1000, // 1 hour
};