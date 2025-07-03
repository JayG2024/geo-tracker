// Serper API Service for Google SERP Analysis
import { errorHandler } from './errorHandler';

export interface SerperResult {
  organic: Array<{
    title: string;
    link: string;
    snippet: string;
    position: number;
    date?: string;
    sitelinks?: Array<{
      title: string;
      link: string;
    }>;
  }>;
  answerBox?: {
    title: string;
    answer: string;
    snippet: string;
    snippetHighlighted: string[];
  };
  knowledgeGraph?: {
    title: string;
    type: string;
    description: string;
    descriptionSource: string;
    descriptionLink: string;
    attributes: Record<string, string>;
  };
  peopleAlsoAsk?: Array<{
    question: string;
    snippet: string;
    title: string;
    link: string;
  }>;
  relatedSearches?: Array<{
    query: string;
  }>;
  searchParameters: {
    q: string;
    type: string;
    engine: string;
  };
}

interface SerperSEOMetrics {
  position: number | null;
  featured: boolean;
  hasAnswerBox: boolean;
  hasKnowledgeGraph: boolean;
  hasPeopleAlsoAsk: boolean;
  competitorCount: number;
  topCompetitors: string[];
}

export class SerperService {
  private apiKey: string;
  private baseUrl = 'https://google.serper.dev';

  constructor() {
    this.apiKey = import.meta.env.VITE_SERPER_API_KEY || '';
  }

  async searchGoogle(query: string): Promise<SerperResult | null> {
    if (!this.apiKey) {
      console.warn('Serper API key not configured');
      return this.getMockData(query);
    }

    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          gl: 'us',
          hl: 'en',
          num: 20,
          autocorrect: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Serper API error: ${response.status}`);
      }

      const data = await response.json();
      return data as SerperResult;
    } catch (error) {
      errorHandler.logError(error, { context: 'SerperService', query });
      return this.getMockData(query);
    }
  }

  async analyzeWebsiteSEO(domain: string): Promise<SerperSEOMetrics> {
    // Search for the domain to see its ranking
    const domainSearch = await this.searchGoogle(`site:${domain}`);
    
    // Search for the brand name to see general visibility
    const brandSearch = await this.searchGoogle(domain.replace(/\.(com|org|net|io|ai|co).*$/, ''));

    if (!domainSearch || !brandSearch) {
      return {
        position: null,
        featured: false,
        hasAnswerBox: false,
        hasKnowledgeGraph: false,
        hasPeopleAlsoAsk: false,
        competitorCount: 0,
        topCompetitors: [],
      };
    }

    // Find website position in brand search
    let position: number | null = null;
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    brandSearch.organic?.forEach((result, index) => {
      const resultDomain = result.link.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      if (resultDomain === cleanDomain && position === null) {
        position = index + 1;
      }
    });

    // Identify top competitors (other domains in top 10)
    const topCompetitors = brandSearch.organic
      ?.slice(0, 10)
      .map(result => {
        const resultDomain = result.link.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        return resultDomain;
      })
      .filter(d => d !== cleanDomain && !d.includes('wikipedia') && !d.includes('youtube'))
      .slice(0, 5) || [];

    return {
      position,
      featured: position === 1,
      hasAnswerBox: !!brandSearch.answerBox,
      hasKnowledgeGraph: !!brandSearch.knowledgeGraph,
      hasPeopleAlsoAsk: !!brandSearch.peopleAlsoAsk && brandSearch.peopleAlsoAsk.length > 0,
      competitorCount: topCompetitors.length,
      topCompetitors,
    };
  }

  async getKeywordData(keywords: string[]): Promise<Map<string, SerperResult>> {
    const results = new Map<string, SerperResult>();
    
    // Process keywords in batches to avoid rate limiting
    for (const keyword of keywords.slice(0, 5)) { // Limit to 5 keywords
      const result = await this.searchGoogle(keyword);
      if (result) {
        results.set(keyword, result);
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  private getMockData(query: string): SerperResult {
    return {
      organic: [
        {
          title: `${query} - Best Practices and Guide`,
          link: `https://example.com/${query.toLowerCase().replace(/\s+/g, '-')}`,
          snippet: `Comprehensive guide to ${query}. Learn best practices, tips, and strategies for success.`,
          position: 1,
        },
        {
          title: `Understanding ${query} in 2024`,
          link: `https://blog.example.com/${query.toLowerCase().replace(/\s+/g, '-')}-guide`,
          snippet: `Everything you need to know about ${query}. Updated for 2024 with latest trends and insights.`,
          position: 2,
        },
      ],
      answerBox: {
        title: `What is ${query}?`,
        answer: `${query} refers to the practice of optimizing content and websites for better visibility.`,
        snippet: `${query} is an essential strategy for improving online presence and reaching target audiences effectively.`,
        snippetHighlighted: [query],
      },
      peopleAlsoAsk: [
        {
          question: `How do I get started with ${query}?`,
          snippet: 'Start by understanding the basics and implementing best practices.',
          title: 'Getting Started Guide',
          link: 'https://example.com/getting-started',
        },
        {
          question: `What are the benefits of ${query}?`,
          snippet: 'Benefits include increased visibility, better engagement, and improved ROI.',
          title: 'Benefits Overview',
          link: 'https://example.com/benefits',
        },
      ],
      searchParameters: {
        q: query,
        type: 'search',
        engine: 'google',
      },
    };
  }
}

export const serperService = new SerperService();