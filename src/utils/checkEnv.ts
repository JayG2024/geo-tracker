// Environment variable checker for production
export const checkRequiredEnvVars = () => {
  const required = [
    'VITE_SERPER_API_KEY',
    // 'VITE_GOOGLE_API_KEY', // TODO: Implement PageSpeed API integration
    'VITE_OPENAI_API_KEY',
    'VITE_CLAUDE_API_KEY',
    'VITE_PERPLEXITY_API_KEY',
    'VITE_GEMINI_API_KEY'
  ];

  const missing: string[] = [];
  
  required.forEach(key => {
    const value = import.meta.env[key];
    if (!value || value === '' || value.includes('placeholder')) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing);
    console.warn('Add these to Vercel for full functionality:');
    console.warn('Go to: Vercel Dashboard → Settings → Environment Variables');
    
    // Show helpful message about which features are affected
    if (missing.includes('VITE_OPENAI_API_KEY')) {
      console.warn('- ChatGPT visibility testing will use mock data');
    }
    if (missing.includes('VITE_CLAUDE_API_KEY')) {
      console.warn('- Claude visibility testing will use mock data');
    }
    if (missing.includes('VITE_PERPLEXITY_API_KEY')) {
      console.warn('- Perplexity visibility testing will use mock data');
    }
    if (missing.includes('VITE_GEMINI_API_KEY')) {
      console.warn('- Gemini visibility testing will use mock data');
    }
    
    // Return false but don't throw - let app work with fallbacks
    return false;
  }

  console.log('✅ All required environment variables are set');
  return true;
};

// Check on app startup
if (import.meta.env.PROD) {
  try {
    checkRequiredEnvVars();
  } catch (error) {
    // Silently continue even if env check fails
    console.warn('Environment check completed');
  }
}