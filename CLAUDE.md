# GEO Tracker - Project Configuration for Claude Code

## 🚨 PROJECT IDENTIFICATION
- **Project Name**: GEO Tracker - SEO + AI Search Visibility Tool
- **Local Path**: `/Users/jasongordon/Desktop/geo-tracker/` (BLACK FOLDER)
- **GitHub Repo**: https://github.com/JayG2024/geo-tracker
- **Live URL**: https://geo-tracker-deployment.vercel.app
- **Project ID**: geo-tracker-2024-07

## 🔗 SYNCHRONIZATION SETTINGS
- **Main Branch**: main
- **Auto Deploy**: Enabled on Vercel (pushes to main auto-deploy)
- **Deployment Platform**: Vercel
- **Project Name on Vercel**: geo-tracker-deployment

## 🔑 ENVIRONMENT VARIABLES
Required in both local .env and Vercel:
- `VITE_SERPER_API_KEY` - Serper API for SERP analysis
- `VITE_GOOGLE_API_KEY` - Google PageSpeed Insights API
- `VITE_SUPABASE_URL` - Supabase database URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## 📁 PROJECT STRUCTURE
```
/Users/jasongordon/Desktop/geo-tracker/
├── src/               # React source code
├── public/            # Static assets
├── .env              # Local environment variables (DO NOT COMMIT)
├── .env.example      # Environment template
├── package.json      # Dependencies
├── vite.config.ts    # Vite configuration
└── vercel.json       # Vercel deployment config
```

## 🛠️ COMMANDS
```bash
# Development
npm run dev           # Start dev server on http://localhost:5173

# Build & Deploy
npm run build        # Build for production
npm run preview      # Preview production build

# Testing & Linting
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Deployment
git push origin main # Auto-deploys to Vercel
```

## 🚀 DEPLOYMENT WORKFLOW
1. Make changes locally
2. Test with `npm run dev`
3. Build with `npm run build`
4. Commit changes: `git add . && git commit -m "message"`
5. Push to GitHub: `git push origin main`
6. Vercel auto-deploys within 1-2 minutes

## ⚠️ IMPORTANT NOTES
- This is the ONLY GEO Tracker project - marked with BLACK folder color
- Do NOT confuse with geo-tracking-app-jaydus (deleted)
- Always check you're in the BLACK folder before making changes
- All pushes to main branch auto-deploy to Vercel

## 🔍 UNIQUE IDENTIFIERS
- Package name: "geo-tracker"
- Uses Recharts (not Chart.js)
- Uses jsPDF for PDF generation
- Analyzes both SEO and GEO (AI search visibility)
- Has dual scoring system (SEO Score + GEO Score)

## 📊 TECH STACK
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (charts)
- jsPDF (PDF generation)
- Serper API (SERP data)
- Google PageSpeed API
- Supabase (database)

Last Updated: 2025-07-03