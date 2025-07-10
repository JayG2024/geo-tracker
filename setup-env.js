#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envTemplate = `# API Keys for Local Development
# Replace the values below with your actual API keys

VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_CLAUDE_API_KEY=your_claude_api_key_here
VITE_PERPLEXITY_API_KEY=your_perplexity_api_key_here
VITE_SERPER_API_KEY=your_serper_api_key_here
VITE_GOOGLE_API_KEY=your_google_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Sentry Configuration
VITE_SENTRY_DSN=your_sentry_dsn_here

# Application Configuration
VITE_APP_ENV=development
`;

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
} else {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please edit .env and replace the placeholder values with your actual API keys.');
  console.log('🔑 You can get your API keys from:');
  console.log('   - OpenAI: https://platform.openai.com/api-keys');
  console.log('   - Google Gemini: https://makersuite.google.com/app/apikey');
  console.log('   - Claude: https://console.anthropic.com/');
  console.log('   - Perplexity: https://www.perplexity.ai/settings/api');
  console.log('   - Serper: https://serper.dev/api-keys');
  console.log('   - Google Search: https://console.cloud.google.com/');
  console.log('   - Supabase: https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api');
  console.log('   - Sentry: https://sentry.io/settings/[YOUR_ORG]/projects/[YOUR_PROJECT]/keys/');
}

console.log('\n🚀 After updating .env, restart your development server with: npm run dev'); 