// User-friendly error messages for common API and network failures

export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
  TIMEOUT_ERROR: 'The request took too long to complete. Please try again.',
  
  // API errors
  SERPER_API_ERROR: 'Unable to fetch search results. Please try again later or contact support if the issue persists.',
  SERPER_API_KEY_MISSING: 'Search API key is not configured. Please contact support.',
  SERPER_RATE_LIMIT: 'Search rate limit exceeded. Please wait a few minutes before trying again.',
  
  GOOGLE_API_ERROR: 'Unable to analyze page performance. Please try again later.',
  GOOGLE_API_KEY_MISSING: 'PageSpeed API key is not configured. Please contact support.',
  GOOGLE_RATE_LIMIT: 'PageSpeed analysis rate limit exceeded. Please wait before trying again.',
  
  // AI Provider errors
  AI_API_ERROR: 'AI analysis failed. Please try again or use a different AI provider.',
  AI_API_KEY_MISSING: 'AI provider API key is not configured. Please check your settings.',
  AI_RATE_LIMIT: 'AI request limit exceeded. Please wait before trying again.',
  
  // Database errors
  SUPABASE_ERROR: 'Database connection failed. Your analysis will not be saved.',
  SUPABASE_AUTH_ERROR: 'Authentication failed. Please log in again.',
  
  // Validation errors
  INVALID_URL: 'Please enter a valid URL (e.g., https://example.com)',
  INVALID_KEYWORD: 'Please enter a valid keyword to analyze',
  
  // Generic errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  SERVER_ERROR: 'Server error occurred. Our team has been notified.',
  
  // Success messages with context
  ANALYSIS_COMPLETE: 'Analysis completed successfully!',
  REPORT_SAVED: 'Report saved successfully!',
  SETTINGS_UPDATED: 'Settings updated successfully!'
};

// Map technical error messages to user-friendly ones
export function getUserFriendlyError(error: any): string {
  const message = error?.message || error?.toString() || '';
  
  // Network errors
  if (message.includes('Network') || message.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  // Timeout errors
  if (message.includes('timeout') || message.includes('Timeout')) {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }
  
  // API key errors
  if (message.includes('API key') || message.includes('401') || message.includes('Unauthorized')) {
    if (message.includes('Serper')) return ERROR_MESSAGES.SERPER_API_KEY_MISSING;
    if (message.includes('Google')) return ERROR_MESSAGES.GOOGLE_API_KEY_MISSING;
    if (message.includes('AI') || message.includes('OpenAI') || message.includes('Claude')) {
      return ERROR_MESSAGES.AI_API_KEY_MISSING;
    }
  }
  
  // Rate limit errors
  if (message.includes('429') || message.includes('rate limit') || message.includes('Rate limit')) {
    if (message.includes('Serper')) return ERROR_MESSAGES.SERPER_RATE_LIMIT;
    if (message.includes('Google')) return ERROR_MESSAGES.GOOGLE_RATE_LIMIT;
    if (message.includes('AI') || message.includes('OpenAI') || message.includes('Claude')) {
      return ERROR_MESSAGES.AI_RATE_LIMIT;
    }
  }
  
  // Server errors
  if (message.includes('500') || message.includes('502') || message.includes('503')) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }
  
  // Database errors
  if (message.includes('Supabase') || message.includes('database')) {
    return ERROR_MESSAGES.SUPABASE_ERROR;
  }
  
  // Validation errors
  if (message.includes('Invalid URL') || message.includes('valid URL')) {
    return ERROR_MESSAGES.INVALID_URL;
  }
  
  if (message.includes('keyword') || message.includes('Keyword')) {
    return ERROR_MESSAGES.INVALID_KEYWORD;
  }
  
  // Default
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

// Helper to create error action buttons
export function getErrorActions(error: any): Array<{label: string; onClick: () => void; variant?: 'primary' | 'secondary'}> {
  const actions = [];
  const message = error?.message || error?.toString() || '';
  
  // Always add retry action
  actions.push({
    label: 'Retry',
    onClick: () => window.location.reload(),
    variant: 'primary' as const
  });
  
  // Add specific actions based on error type
  if (message.includes('API key')) {
    actions.push({
      label: 'Check Documentation',
      onClick: () => window.open('https://github.com/JayG2024/geo-tracker#environment-variables', '_blank'),
      variant: 'secondary' as const
    });
  }
  
  if (message.includes('rate limit')) {
    actions.push({
      label: 'View Pricing',
      onClick: () => window.open('https://www.geotest.ai/pricing', '_blank'),
      variant: 'secondary' as const
    });
  }
  
  return actions;
}