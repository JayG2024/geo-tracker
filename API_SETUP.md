# API Setup Guide for GEO Tracker

## Current API Status

### ✅ Already Configured in Vercel:
- **Serper API**: `eac6ca0900186a216186e76dd05bacbf5d00e978`
- **Google API**: `AIzaSyBHo0uyZVKZ09aitPeM-VaEChGKLVVeSqk`

## Required APIs (For Full Functionality)

### 1. Supabase (Database & Authentication)
**Purpose**: User accounts, saved websites, scan history

**Setup Steps**:
1. Go to https://app.supabase.com
2. Click "New project"
3. Name: `geo-tracker`
4. Database Password: Generate a strong one
5. Region: Choose closest to you
6. Click "Create new project"

**Get Your Keys**:
- Go to Settings → API
- Copy:
  - `Project URL` → `VITE_SUPABASE_URL`
  - `anon public` → `VITE_SUPABASE_ANON_KEY`
  - `service_role` → `VITE_SUPABASE_SERVICE_ROLE_KEY`

**Run Database Migrations**:
```bash
cd ~/geo-tracker-deployment
npx supabase db push
```

### 2. Bing Web Search API (Recommended)
**Purpose**: Check Bing Chat/Copilot visibility

**Setup Steps**:
1. Go to https://azure.microsoft.com/en-us/try/cognitive-services/
2. Click "Try Bing Search APIs"
3. Sign up for free trial (7 days, 1000 searches)
4. Or create Azure account for permanent free tier
5. Get your API key → `VITE_BING_API_KEY`

### 3. Additional Search APIs (Optional)

#### ValueSERP
- URL: https://www.valueserp.com
- Price: $29/month
- Better than Serper for some use cases

#### SerpAPI
- URL: https://serpapi.com
- Price: $50/month
- Most comprehensive SERP data

## Adding APIs to Vercel

### Method 1: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Click on your `geo-tracker-deployment` project
3. Go to Settings → Environment Variables
4. Add each variable:
   - Key: `VITE_SUPABASE_URL`
   - Value: Your Supabase URL
   - Environment: Production
5. Click "Save"

### Method 2: Vercel CLI
```bash
cd ~/geo-tracker-deployment

# Add Supabase
echo "your-supabase-url" | vercel env add VITE_SUPABASE_URL production
echo "your-anon-key" | vercel env add VITE_SUPABASE_ANON_KEY production

# Add Bing
echo "your-bing-key" | vercel env add VITE_BING_API_KEY production
```

### Method 3: Import from .env
```bash
# Create .env.production with your keys
vercel env pull .env.production
# Edit the file with your keys
vercel env push production
```

## Priority Order

### Phase 1 (Now) - Core Functionality ✅
- [x] Serper API (Google SERP)
- [x] Google PageSpeed API

### Phase 2 (Next) - Enhanced Analysis
- [ ] Supabase (User accounts)
- [ ] Bing API (Microsoft search)

### Phase 3 (Later) - Advanced Features
- [ ] AI APIs (Direct testing)
- [ ] Stripe (Payments)
- [ ] Analytics

## Testing Your APIs

### 1. Local Testing
```bash
# Copy example to .env
cp .env.example .env

# Add your keys to .env
# Run locally
npm run dev
```

### 2. Production Testing
After adding to Vercel:
```bash
# Redeploy
vercel --prod

# Check logs
vercel logs
```

## API Costs Summary

### Free/Cheap Options:
- Google PageSpeed: Free
- Bing Search: Free tier (1K/month)
- Supabase: Free tier sufficient
- Google Gemini: Free tier

### Paid Options:
- Serper: $50/month (2.5K searches)
- ValueSERP: $29/month (5K searches)
- OpenAI: Pay per use (~$0.03/analysis)

## Troubleshooting

### API Key Not Working?
1. Check format (no extra spaces)
2. Verify in provider dashboard
3. Check rate limits
4. Enable required APIs in provider

### CORS Issues?
- Use backend proxy
- Or configure CORS in Supabase

### Rate Limits?
- Implement caching
- Use Redis for results
- Batch requests

## Support

Need help with APIs?
- Serper: support@serper.dev
- Google: https://console.cloud.google.com/support
- Supabase: https://supabase.com/support
- Bing: Azure support portal