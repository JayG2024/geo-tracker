# Vercel Environment Variables Checklist

## Required Environment Variables

These environment variables MUST be set in Vercel for the app to function:

### Core APIs (REQUIRED)
- [ ] `VITE_SERPER_API_KEY` - Serper API for SERP analysis
- [ ] `VITE_GOOGLE_API_KEY` - Google PageSpeed Insights API

### Database (REQUIRED if using dashboard/saving)
- [ ] `VITE_SUPABASE_URL` - Supabase database URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Error Monitoring (RECOMMENDED)
- [ ] `VITE_SENTRY_DSN` - Sentry error tracking

### AI Provider APIs (OPTIONAL - for AI analysis features)
- [ ] `VITE_OPENAI_API_KEY` - OpenAI GPT-4
- [ ] `VITE_GEMINI_API_KEY` - Google Gemini Pro
- [ ] `VITE_CLAUDE_API_KEY` - Anthropic Claude
- [ ] `VITE_PERPLEXITY_API_KEY` - Perplexity AI

### Configuration (OPTIONAL - have defaults)
- [ ] `VITE_AI_TIMEOUT` - AI request timeout (default: 30000)
- [ ] `VITE_AI_RETRY_ATTEMPTS` - AI retry attempts (default: 3)
- [ ] `VITE_ENABLE_AI_LOGGING` - Enable AI logging (default: false)

## How to Set in Vercel

1. Go to https://vercel.com/dashboard
2. Select your `geo-tracker-deployment` project
3. Go to Settings → Environment Variables
4. Add each variable with its value
5. Make sure to add for all environments (Production, Preview, Development)

## Verification

After setting, redeploy your app and check:
1. Visit https://www.geotest.ai
2. Try running an analysis
3. Check browser console for any missing API key errors