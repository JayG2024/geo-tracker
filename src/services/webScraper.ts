// Real web scraping service with error handling
export const scrapeWebsiteContent = async (url: string): Promise<string> => {
  try {
    console.log(`[Web Scraper] Starting content extraction for: ${url}`);
    
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.match(/^https?:\/\//)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // Use a CORS proxy for client-side scraping
    // In production, this should be done server-side
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(normalizedUrl)}`;
    
    try {
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const html = data.contents || '';

      // Extract text content from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Remove script and style elements
      const scripts = doc.querySelectorAll('script, style, noscript');
      scripts.forEach(el => el.remove());
      
      // Extract meaningful content
      const title = doc.querySelector('title')?.textContent || '';
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const h1 = Array.from(doc.querySelectorAll('h1')).map(h => h.textContent).join(' ');
      const h2 = Array.from(doc.querySelectorAll('h2')).map(h => h.textContent).join(' ');
      const paragraphs = Array.from(doc.querySelectorAll('p')).map(p => p.textContent).filter(t => t && t.length > 50).slice(0, 10).join(' ');
      
      // Extract structured data if available
      const jsonLd = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'))
        .map(script => {
          try {
            return JSON.stringify(JSON.parse(script.textContent || '{}'));
          } catch {
            return '';
          }
        })
        .join(' ');

      // Combine all content
      const content = [
        `Title: ${title}`,
        `Meta Description: ${metaDescription}`,
        `Main Headings: ${h1}`,
        `Subheadings: ${h2}`,
        `Content: ${paragraphs}`,
        jsonLd ? `Structured Data: ${jsonLd}` : ''
      ].filter(Boolean).join('\n\n');

      console.log(`[Web Scraper] Successfully extracted ${content.length} characters`);
      
      // Limit content length for API calls
      return content.slice(0, 5000);
      
    } catch (fetchError) {
      console.warn('[Web Scraper] CORS proxy failed, using fallback method');
      
      // Fallback: Try to fetch basic info using a different approach
      return await scrapeWithFallback(normalizedUrl);
    }
    
  } catch (error) {
    console.error('[Web Scraper] Error:', error);
    
    // Return a basic description based on the URL
    return generateFallbackContent(url);
  }
};

// Fallback scraping method
const scrapeWithFallback = async (url: string): Promise<string> => {
  try {
    // Try using a different CORS proxy
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Basic text extraction
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    return `Website Content: ${textContent}`;
    
  } catch (error) {
    console.error('[Web Scraper] Fallback failed:', error);
    return generateFallbackContent(url);
  }
};

// Generate fallback content based on URL
const generateFallbackContent = (url: string): string => {
  try {
    const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
    const domain = urlObj.hostname.replace('www.', '');
    const brandName = domain.split('.')[0];
    
    return `
Website: ${domain}
Brand: ${brandName}
URL: ${url}

Note: Unable to fetch actual website content due to CORS restrictions. 
Analysis will be based on the domain name and general web presence.

For accurate analysis, consider:
1. The website should have proper SEO meta tags
2. Structured data (JSON-LD) helps AI understand content
3. Clear headings and content structure improve analysis
4. Fast loading times and mobile responsiveness are important
    `.trim();
  } catch {
    return `Website: ${url}\n\nUnable to fetch website content for detailed analysis.`;
  }
};

export default scrapeWebsiteContent;