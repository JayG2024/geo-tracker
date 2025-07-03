// AI Configuration Management
// Production-ready configuration for multi-AI analysis

export interface AIConfig {
  timeout: number;
  retryAttempts: number;
  enableLogging: boolean;
  providers: {
    openai: {
      enabled: boolean;
      model: string;
      maxTokens: number;
      temperature: number;
    };
    gemini: {
      enabled: boolean;
      model: string;
      maxTokens: number;
    };
    claude: {
      enabled: boolean;
      model: string;
      maxTokens: number;
    };
    perplexity: {
      enabled: boolean;
      model: string;
      maxTokens: number;
    };
  };
  consensus: {
    weightingStrategy: 'confidence' | 'provider' | 'hybrid';
    minProvidersRequired: number;
    confidenceThreshold: number;
  };
}

// Production AI Configuration
export const aiConfig: AIConfig = {
  timeout: parseInt(import.meta.env.VITE_AI_TIMEOUT || '30000'),
  retryAttempts: parseInt(import.meta.env.VITE_AI_RETRY_ATTEMPTS || '3'),
  enableLogging: import.meta.env.VITE_ENABLE_AI_LOGGING === 'true',
  
  providers: {
    openai: {
      enabled: true,
      model: 'gpt-4o',
      maxTokens: 1500,
      temperature: 0.3
    },
    gemini: {
      enabled: true,
      model: 'gemini-pro',
      maxTokens: 1000
    },
    claude: {
      enabled: true,
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 1200
    },
    perplexity: {
      enabled: true,
      model: 'llama-3.1-sonar-large-128k-online',
      maxTokens: 1000
    }
  },
  
  consensus: {
    weightingStrategy: 'hybrid',
    minProvidersRequired: 2,
    confidenceThreshold: 0.7
  }
};

// API Key Management
export const getAPIKeys = () => ({
  openai: import.meta.env.VITE_OPENAI_API_KEY,
  gemini: import.meta.env.VITE_GEMINI_API_KEY,
  claude: import.meta.env.VITE_CLAUDE_API_KEY,
  perplexity: import.meta.env.VITE_PERPLEXITY_API_KEY
});

// Validate API Key Format (for production readiness)
export const validateAPIKey = (provider: string, key: string): boolean => {
  if (!key || key.includes('placeholder')) return false;
  
  const patterns = {
    openai: /^sk-[a-zA-Z0-9]{48}$/,
    gemini: /^AIza[a-zA-Z0-9_-]{35}$/,
    claude: /^sk-ant-[a-zA-Z0-9_-]{95}$/,
    perplexity: /^pplx-[a-zA-Z0-9]{56}$/
  };
  
  return patterns[provider as keyof typeof patterns]?.test(key) || false;
};

// Check Production Readiness
export const isProductionReady = (): {
  ready: boolean;
  providers: Record<string, boolean>;
  issues: string[];
} => {
  const keys = getAPIKeys();
  const providers = {
    openai: validateAPIKey('openai', keys.openai || ''),
    gemini: validateAPIKey('gemini', keys.gemini || ''),
    claude: validateAPIKey('claude', keys.claude || ''),
    perplexity: validateAPIKey('perplexity', keys.perplexity || '')
  };
  
  const readyProviders = Object.values(providers).filter(Boolean).length;
  const issues: string[] = [];
  
  if (readyProviders === 0) {
    issues.push('No valid API keys configured');
  }
  
  Object.entries(providers).forEach(([provider, valid]) => {
    if (!valid) {
      issues.push(`${provider} API key invalid or placeholder`);
    }
  });
  
  return {
    ready: readyProviders >= aiConfig.consensus.minProvidersRequired,
    providers,
    issues
  };
};

export default aiConfig;