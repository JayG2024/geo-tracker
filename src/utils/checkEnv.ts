// Environment variable checker for production
export const checkRequiredEnvVars = () => {
  const required = [
    'VITE_SERPER_API_KEY',
    'VITE_GOOGLE_API_KEY',
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
    console.error('❌ Missing environment variables:', missing);
    console.error('Please add these to Vercel environment variables!');
    
    // Return false but don't throw - let app work with fallbacks
    return false;
  }

  console.log('✅ All required environment variables are set');
  return true;
};

// Check on app startup
if (import.meta.env.PROD) {
  checkRequiredEnvVars();
}