# GEO Test AI Platform Prompts Documentation

This document contains all the prompts and system messages sent to each AI platform during GEO (Generative Engine Optimization) testing.

## 1. AI Visibility Testing Prompts

These prompts are used to test if AI platforms know about a website:

### Test Prompt Templates
For a URL like `example.com`, the system generates these prompts:

```javascript
{
  direct: "What can you tell me about https://example.com?",
  brand: "What do you know about example?", // If brand name can be extracted
  topic: "Tell me about example.com and what services or content it provides.",
  recommendation: "Would you recommend example.com for its services?",
  comparison: "How does example.com compare to its competitors?"
}
```

### 1.1 ChatGPT (OpenAI GPT-4o)

**System Message:**
```
You are analyzing web presence. Be specific about what you know.
```

**User Prompt:**
```
What can you tell me about [URL]?
```

**Settings:**
- Model: `gpt-4o`
- Temperature: `0.3`
- Max Tokens: `500`

### 1.2 Claude 3.5 Sonnet

**System Message:**
```
You are analyzing web presence and brand visibility. Provide specific information about what you know.
```

**User Prompt:**
```
Tell me about [domain] and what services or content it provides.
```

**Settings:**
- Model: `claude-3-5-sonnet-20241022`
- Max Tokens: `500`
- Temperature: `0.3`

### 1.3 Perplexity AI

**System Message:**
```
You are a web research assistant. Provide accurate information about websites and online services.
```

**User Prompt:**
```
What can you tell me about [URL]?
```

**Settings:**
- Model: `llama-3.1-sonar-large-128k-online`
- Temperature: `0.1` (for accuracy)
- Max Tokens: `500`

### 1.4 Google Gemini

**User Prompt:**
```
Tell me about [domain] and what services or content it provides.
```

**Settings:**
- Model: `gemini-1.5-flash`
- Temperature: `0.3`
- Max Output Tokens: `500`

## 2. GEO Analysis Prompts

These prompts are used for detailed GEO analysis:

### 2.1 Gemini Pro - Comprehensive GEO Analysis

**Full Prompt:**
```
You are a world-class expert in Generative Engine Optimization (GEO) and a strategic digital marketing analyst. Your task is to analyze the provided website content and generate a comprehensive GEO report. You MUST provide your response strictly in the following JSON format. Do not add any text or markdown formatting before or after the JSON object.

JSON Format to use:
{
  "citation_worthiness_score": <number 0-100>,
  "eeat_signal_strength_score": <number 0-100>,
  "structured_data_score": <number 0-100>,
  "content_depth_score": <number 0-100>,
  "topical_authority_score": <number 0-100>,
  "analysis_summary_text": "<comprehensive analysis summary>",
  "actionable_recommendations_text": "<detailed actionable recommendations>",
  "topical_opportunities": ["<opportunity 1>", "<opportunity 2>", "<opportunity 3>"]
}

WEBSITE URL: [URL]
LOCATION: [Location]

ANALYZE THIS WEBSITE:
Please visit and analyze [URL] ([domain]) for Generative Engine Optimization potential, focusing on:
1. Citation worthiness - How likely is this content to be cited by AI systems
2. E-E-A-T signals - Expertise, Experience, Authoritativeness, Trustworthiness
3. Structured data implementation and opportunities
4. Content depth and comprehensiveness
5. Topical authority establishment

Provide specific, actionable insights and recommendations.
```

### 2.2 OpenAI GPT-4 - GEO Content Analysis

**System Message:**
```
You are an expert in Generative Engine Optimization (GEO) and content strategy. Analyze website content for AI discoverability and return a JSON response with numerical scores (0-100) and strategic insights for GEO optimization. Response format:
{
  "content_quality": number,
  "ai_readability": number,
  "keyword_optimization": number,
  "user_engagement": number,
  "semantic_clarity": number,
  "geo_insights": ["insight1", "insight2"],
  "geo_recommendations": ["rec1", "rec2"]
}
```

**User Prompt:**
```
Analyze this website for comprehensive GEO (Generative Engine Optimization): [URL] ([domain])

Focus on AI discoverability, citation potential, and generative search optimization.
```

**Settings:**
- Model: `gpt-4o`
- Temperature: `0.3`
- Max Tokens: `1500`

### 2.3 Claude - Competitive Intelligence

**System Message:**
```
You are an expert in E-E-A-T assessment and competitive analysis for AI-driven search. Analyze the website and return a JSON response focusing on trustworthiness and competitive positioning. Response format:
{
  "expertise_score": number,
  "authoritativeness_score": number,
  "trustworthiness_score": number,
  "competitive_advantage": number,
  "market_position": number,
  "competitive_insights": ["insight1", "insight2"],
  "competitive_recommendations": ["rec1", "rec2"]
}
```

**User Prompt:**
```
Analyze [URL] for E-E-A-T signals and competitive positioning in AI search results. Focus on trust factors and differentiation.
```

**Settings:**
- Model: `claude-3-5-sonnet-20241022`
- Max Tokens: `1200`

## 3. How Results Are Interpreted

### Visibility Detection Logic
The system checks for these indicators in AI responses:

1. **Knows Indicator**: Response mentions the domain or brand name
2. **Specific Indicator**: Response mentions "website", "service", "platform", or "company"
3. **Negative Indicator**: Response contains phrases like "I don't have", "I'm not aware", "no information", "cannot find"

**Visibility Score Calculation:**
- Visible = Knows + Specific + !Negative
- Confidence = Based on strength of indicators (0.6 - 0.9)

### GEO Score Components

1. **Citation Worthiness** (0-100): How likely content is to be referenced by AI
2. **E-E-A-T Strength** (0-100): Expertise, Experience, Authoritativeness, Trustworthiness signals
3. **Structured Data** (0-100): Implementation of schema.org and other structured formats
4. **Content Depth** (0-100): Comprehensiveness and detail level
5. **Topical Authority** (0-100): Domain expertise in specific topics

## 4. Key Optimization Strategies

Based on these prompts, websites should optimize for:

1. **Clear Brand Identity**: Make sure your domain/brand name is memorable
2. **Service Description**: Clearly describe what your website offers
3. **Structured Data**: Implement schema.org markup
4. **E-E-A-T Signals**: Show expertise through author bios, credentials, etc.
5. **Content Depth**: Create comprehensive, detailed content
6. **Citations**: Make content citation-worthy with stats, unique insights

## 5. Privacy & Security Notes

- All API calls are made server-side (API keys are not exposed to users)
- No personal data is collected or stored
- Website URLs are the only data sent to AI platforms
- Results are not cached or stored permanently

---

*Last Updated: July 2025*