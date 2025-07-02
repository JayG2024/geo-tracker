# GEO Tracker Deployment Guide

## Overview
GEO Tracker is the first tool to analyze both traditional SEO and AI search visibility (GEO - Generative Engine Optimization).

## Features
- **SEO Analysis**: Technical SEO, content optimization, Core Web Vitals
- **GEO Analysis**: AI platform visibility (ChatGPT, Claude, Perplexity, Gemini)
- **Dual Scoring**: Combined SEO + GEO scores
- **Unlimited Free Scans**: No restrictions, all features unlocked
- **Professional Reports**: PDF export and shareable links

## Deployment to Vercel

### Method 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts:
   - Link to existing project? No
   - What's your project's name? geo-tracker
   - In which directory is your code located? ./
   - Want to override settings? No

### Method 2: Deploy via GitHub

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - GEO Tracker"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Import to Vercel:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Deploy

## Environment Variables

Add these in Vercel dashboard under Settings > Environment Variables:

```
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_CLAUDE_API_KEY=your-claude-api-key
VITE_PERPLEXITY_API_KEY=your-perplexity-api-key
```

### Getting API Keys:
- **OpenAI**: https://platform.openai.com/api-keys
- **Google Gemini**: https://aistudio.google.com/app/apikey
- **Claude**: https://console.anthropic.com/account/keys
- **Perplexity**: https://www.perplexity.ai/settings/api

## Post-Deployment

1. Visit your deployment URL
2. Test with any website URL
3. All features are unlocked and free to use

## Local Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Custom Domain

In Vercel dashboard:
1. Go to Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Support

For issues or questions, open an issue on GitHub.