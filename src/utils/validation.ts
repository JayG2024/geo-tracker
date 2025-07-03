// Input validation and sanitization utilities

// URL validation and sanitization
export function validateURL(url: string): { isValid: boolean; error?: string; sanitized?: string } {
  if (!url || url.trim().length === 0) {
    return { isValid: false, error: 'URL is required' };
  }

  // Remove whitespace
  const trimmed = url.trim();
  
  // Add protocol if missing
  let normalized = trimmed;
  if (!normalized.match(/^https?:\/\//i)) {
    normalized = `https://${normalized}`;
  }

  try {
    const urlObj = new URL(normalized);
    
    // Check for valid protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }
    
    // Check for localhost or private IPs
    if (urlObj.hostname === 'localhost' || urlObj.hostname.match(/^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/)) {
      return { isValid: false, error: 'Cannot analyze local or private network URLs' };
    }
    
    // Sanitize by reconstructing URL
    const sanitized = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
    
    return { isValid: true, sanitized };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

// Keyword validation and sanitization
export function validateKeyword(keyword: string): { isValid: boolean; error?: string; sanitized?: string } {
  if (!keyword || keyword.trim().length === 0) {
    return { isValid: false, error: 'Keyword is required' };
  }

  const trimmed = keyword.trim();
  
  // Check length
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Keyword must be at least 2 characters long' };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, error: 'Keyword must be less than 100 characters' };
  }
  
  // Remove potentially harmful characters but keep spaces and basic punctuation
  const sanitized = trimmed
    .replace(/[<>'"]/g, '') // Remove HTML-like characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  return { isValid: true, sanitized };
}

// Email validation
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
}

// Sanitize HTML content (for user-generated content)
export function sanitizeHTML(html: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate and sanitize report title
export function validateReportTitle(title: string): { isValid: boolean; error?: string; sanitized?: string } {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Report title is required' };
  }

  const trimmed = title.trim();
  
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Title must be at least 3 characters long' };
  }
  
  if (trimmed.length > 200) {
    return { isValid: false, error: 'Title must be less than 200 characters' };
  }
  
  const sanitized = sanitizeHTML(trimmed);
  
  return { isValid: true, sanitized };
}

// Validate numeric input
export function validateNumber(value: string, min?: number, max?: number): { isValid: boolean; error?: string; value?: number } {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Must be a valid number' };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, error: `Must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, error: `Must be at most ${max}` };
  }
  
  return { isValid: true, value: num };
}