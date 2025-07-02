# Connect GEO Tracker to GitHub & Vercel

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `geo-tracker`
3. Description: "GEO Tracker - The first tool to analyze both traditional SEO and AI search visibility"
4. Make it **Public**
5. Don't initialize with README (we already have files)
6. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

Run these commands in your terminal:

```bash
cd ~/geo-tracker-deployment

# Add the GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/geo-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Connect to Vercel (IMPORTANT)

1. Go to https://vercel.com/dashboard
2. Click on your current project "geo-tracker-deployment"
3. Go to Settings → Git
4. Click "Connect Git Repository"
5. Select your GitHub account
6. Choose the "geo-tracker" repository
7. Click "Connect"

## Step 4: Configure Production Branch

1. In Vercel project settings
2. Go to Settings → Git
3. Make sure Production Branch is set to "main"
4. Save changes

## Step 5: Automatic Deployments

Now your app will:
- Automatically deploy when you push to GitHub
- Create preview deployments for pull requests
- Keep production URL stable

## Your URLs:
- **Production**: https://geo-tracker-deployment.vercel.app
- **GitHub**: https://github.com/YOUR_USERNAME/geo-tracker

## Environment Variables Already Set:
- VITE_SERPER_API_KEY ✅
- VITE_GOOGLE_API_KEY ✅

The app is already live and working! This just connects it to GitHub for version control.