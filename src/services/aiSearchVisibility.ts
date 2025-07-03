// AI Search Visibility Testing Service
// Tests actual visibility on ChatGPT, Claude, Perplexity, and Gemini

import { getAPIKeys, validateAPIKey } from '../config/aiConfig';

export interface AISearchResult {
  platform: string;
  isVisible: boolean;
  ranking?: number;
  snippet?: string;
  confidence: number;
  testedAt: string;
  error?: string;
}

export interface AIVisibilityReport {
  url: string;
  overallVisibility: number; // Percentage of AI platforms where visible
  results: AISearchResult[];
  recommendations: string[];
  timestamp: string;
}

// Test prompts designed to check if AI knows about the website
const generateTestPrompts = (url: string, domain: string, brandName?: string) => {
  const cleanDomain = domain.replace(/^www\./, '');
  
  return {
    direct: `What can you tell me about ${url}?`,
    brand: brandName ? `What do you know about ${brandName}?` : null,
    topic: `Tell me about ${cleanDomain} and what services or content it provides.`,
    recommendation: `Would you recommend ${cleanDomain} for its services?`,
    comparison: `How does ${cleanDomain} compare to its competitors?`
  };
};

// Parse domain and potential brand name from URL
const parseUrlInfo = (url: string) => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const brandName = domain.replace(/\.(com|org|net|io|co|ai|dev|app).*$/, '').replace(/-/g, ' ');
    return { domain, brandName };
  } catch {
    return { domain: url, brandName: url };
  }
};

// OpenAI/ChatGPT Visibility Test
export const testChatGPTVisibility = async (url: string): Promise<AISearchResult> => {
  const keys = getAPIKeys();
  const { domain, brandName } = parseUrlInfo(url);
  const prompts = generateTestPrompts(url, domain, brandName);
  
  if (!keys.openai || !validateAPIKey('openai', keys.openai)) {
    return {
      platform: 'ChatGPT',
      isVisible: false,
      confidence: 0,
      testedAt: new Date().toISOString(),
      error: 'No valid OpenAI API key'
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keys.openai}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are analyzing web presence. Be specific about what you know.'
          },
          {
            role: 'user',
            content: prompts.direct
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.toLowerCase();
    
    // Check if ChatGPT knows about the website
    const indicators = {
      knows: content.includes(domain.toLowerCase()) || 
             (brandName && content.includes(brandName.toLowerCase())),
      specific: content.includes('website') || content.includes('service') || 
                content.includes('platform') || content.includes('company'),
      negative: content.includes("i don't have") || content.includes("i'm not aware") || 
                content.includes("no information") || content.includes("cannot find")
    };

    const isVisible = indicators.knows && indicators.specific && !indicators.negative;
    const confidence = isVisible ? 
      (indicators.knows && indicators.specific ? 0.9 : 0.7) : 
      (indicators.negative ? 0.9 : 0.6);

    return {
      platform: 'ChatGPT',
      isVisible,
      snippet: content.substring(0, 200) + '...',
      confidence,
      testedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      platform: 'ChatGPT',
      isVisible: false,
      confidence: 0,
      testedAt: new Date().toISOString(),
      error: error.message
    };
  }
};

// Claude Visibility Test
export const testClaudeVisibility = async (url: string): Promise<AISearchResult> => {
  const keys = getAPIKeys();
  const { domain, brandName } = parseUrlInfo(url);
  const prompts = generateTestPrompts(url, domain, brandName);
  
  if (!keys.claude || !validateAPIKey('claude', keys.claude)) {
    return {
      platform: 'Claude',
      isVisible: false,
      confidence: 0,
      testedAt: new Date().toISOString(),
      error: 'No valid Claude API key'
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': keys.claude,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'user',
            content: prompts.direct
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text.toLowerCase();
    
    // Similar visibility checking logic
    const indicators = {
      knows: content.includes(domain.toLowerCase()) || 
             (brandName && content.includes(brandName.toLowerCase())),
      specific: content.includes('website') || content.includes('service') || 
                content.includes('platform') || content.includes('company'),
      negative: content.includes("i don't have") || content.includes("not familiar") || 
                content.includes("no information") || content.includes("cannot provide")
    };

    const isVisible = indicators.knows && indicators.specific && !indicators.negative;
    const confidence = isVisible ? 0.85 : 0.8;

    return {
      platform: 'Claude',
      isVisible,
      snippet: content.substring(0, 200) + '...',
      confidence,
      testedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      platform: 'Claude',
      isVisible: false,
      confidence: 0,
      testedAt: new Date().toISOString(),
      error: error.message
    };
  }
};

// Perplexity Visibility Test
export const testPerplexityVisibility = async (url: string): Promise<AISearchResult> => {
  const keys = getAPIKeys();
  const { domain, brandName } = parseUrlInfo(url);
  const prompts = generateTestPrompts(url, domain, brandName);
  
  if (!keys.perplexity || !validateAPIKey('perplexity', keys.perplexity)) {
    return {
      platform: 'Perplexity',
      isVisible: false,
      confidence: 0,
      testedAt: new Date().toISOString(),
      error: 'No valid Perplexity API key'
    };
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keys.perplexity}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'user',
            content: prompts.direct
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.toLowerCase();
    
    // Perplexity often includes sources, so check for those too
    const indicators = {
      knows: content.includes(domain.toLowerCase()) || 
             (brandName && content.includes(brandName.toLowerCase())),
      specific: content.includes('website') || content.includes('service') || 
                content.includes('according to') || content.includes('source'),
      negative: content.includes("couldn't find") || content.includes("no results") || 
                content.includes("no information available")
    };

    const isVisible = indicators.knows && indicators.specific && !indicators.negative;
    const confidence = isVisible ? 0.9 : 0.85; // Higher confidence due to real-time search

    return {
      platform: 'Perplexity',
      isVisible,
      snippet: content.substring(0, 200) + '...',
      confidence,
      testedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      platform: 'Perplexity',
      isVisible: false,
      confidence: 0,
      testedAt: new Date().toISOString(),
      error: error.message
    };
  }
};

// Gemini Visibility Test (already have implementation)
export const testGeminiVisibility = async (url: string): Promise<AISearchResult> => {
  const keys = getAPIKeys();
  const { domain, brandName } = parseUrlInfo(url);
  const prompts = generateTestPrompts(url, domain, brandName);
  
  if (!keys.gemini || !validateAPIKey('gemini', keys.gemini)) {
    return {
      platform: 'Gemini',
      isVisible: false,
      confidence: 0,
      testedAt: new Date().toISOString(),
      error: 'No valid Gemini API key'
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${keys.gemini}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompts.direct
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text.toLowerCase();
    
    const indicators = {
      knows: content.includes(domain.toLowerCase()) || 
             (brandName && content.includes(brandName.toLowerCase())),
      specific: content.includes('website') || content.includes('online') || 
                content.includes('platform') || content.includes('service'),
      negative: content.includes("i cannot find") || content.includes("no information") || 
                content.includes("not aware")
    };

    const isVisible = indicators.knows && indicators.specific && !indicators.negative;
    const confidence = isVisible ? 0.85 : 0.8;

    return {
      platform: 'Gemini',
      isVisible,
      snippet: content.substring(0, 200) + '...',
      confidence,
      testedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      platform: 'Gemini',
      isVisible: false,
      confidence: 0,
      testedAt: new Date().toISOString(),
      error: error.message
    };
  }
};

// Test all AI platforms
export const testAllAIPlatforms = async (url: string): Promise<AIVisibilityReport> => {
  // Run all tests in parallel for speed
  const results = await Promise.all([
    testChatGPTVisibility(url),
    testClaudeVisibility(url),
    testPerplexityVisibility(url),
    testGeminiVisibility(url)
  ]);

  // Calculate overall visibility
  const visibleCount = results.filter(r => r.isVisible).length;
  const overallVisibility = (visibleCount / results.length) * 100;

  // Generate recommendations based on results
  const recommendations: string[] = [];
  
  if (overallVisibility < 25) {
    recommendations.push('Critical: Your website has very low AI search visibility. Immediate action needed.');
    recommendations.push('Create comprehensive, authoritative content that AI systems can reference.');
    recommendations.push('Implement structured data markup to help AI understand your content.');
  } else if (overallVisibility < 50) {
    recommendations.push('Your AI visibility is below average. Focus on building authority.');
    recommendations.push('Develop in-depth content on your core topics to establish expertise.');
    recommendations.push('Ensure your brand name and services are clearly defined on your website.');
  } else if (overallVisibility < 75) {
    recommendations.push('Good AI visibility, but room for improvement.');
    recommendations.push('Create more citation-worthy content like guides, statistics, and research.');
    recommendations.push('Build topical authority through comprehensive content clusters.');
  } else {
    recommendations.push('Excellent AI visibility! Maintain your current strategy.');
    recommendations.push('Continue creating high-quality, authoritative content.');
    recommendations.push('Monitor competitor strategies to maintain your advantage.');
  }

  // Platform-specific recommendations
  results.forEach(result => {
    if (!result.isVisible && !result.error) {
      recommendations.push(`Improve visibility on ${result.platform} by creating content that addresses common queries in your industry.`);
    }
  });

  return {
    url,
    overallVisibility,
    results,
    recommendations,
    timestamp: new Date().toISOString()
  };
};

// Export for use in other services
export default {
  testAllAIPlatforms,
  testChatGPTVisibility,
  testClaudeVisibility,
  testPerplexityVisibility,
  testGeminiVisibility
};