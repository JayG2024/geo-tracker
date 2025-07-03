# Mock Data Analysis Report - GEO Tracker

## Overview
This report documents all instances of mock data usage in the geo-tracker codebase and provides solutions for the "Failed to fetch" error in the PageSpeed API.

## 1. Mock Data Usage Locations

### 1.1 PageSpeed Service (`src/services/pageSpeedService.ts`)
- **Lines 101-104**: Falls back to mock data when API key is missing
- **Lines 134-137**: Falls back to mock data on any API error  
- **Lines 249-292**: `getMockData()` method generates consistent mock scores

**Mock Data Includes:**
- Performance score: 60-95
- SEO score: 70-98
- Accessibility score: 75-95
- Best practices score: 80-100
- Core Web Vitals (LCP, FID, CLS, FCP, TTFB, TBT)
- Mock opportunities and diagnostics

### 1.2 Serper Service (`src/services/serperService.ts`)
- **Lines 65-68**: Falls back to mock data when API key is missing
- **Lines 93-95**: Falls back to mock data on any API error
- **Lines 165-207**: `getMockData()` method returns mock SERP results

**Mock Data Includes:**
- Organic search results with placeholder titles/snippets
- Answer box with generic content
- People Also Ask questions
- Search parameters

### 1.3 GEO Analysis Real (`src/services/geoAnalysisReal.ts`)
- **Lines 11-40**: Catches errors in AI visibility tests and returns fallback data
- **Lines 152-195**: Contains `generateFallbackGEOMetrics()` function (currently unused)

**Fallback Data Includes:**
- Default visibility score of 0
- Empty results array
- Generic recommendations
- Default AI analysis scores

### 1.4 SEO GEO Analysis (`src/services/seoGeoAnalysis.ts`)
- **Lines 99-161**: `generateGEOMetrics()` generates completely random/mock GEO data
- **Note**: Line 323 correctly calls `performRealGEOAnalysis()` but the standalone `generateGEOMetrics()` function is problematic

**Mock Data Includes:**
- Random AI visibility scores (40-85)
- Random accuracy scores (50-95)
- Random structure scores (60-90)
- Random competitive scores (30-80)
- Random optimization scores (45-85)

## 2. Root Cause of "Failed to fetch" Error

The PageSpeed API error is caused by **CORS (Cross-Origin Resource Sharing) restrictions**. 

### Why This Happens:
1. The Google PageSpeed Insights API is being called directly from the browser
2. Google's API servers don't include CORS headers that allow browser-based requests
3. This results in a CORS error that manifests as "Failed to fetch"

### Evidence:
- The API key is valid (present in .env file)
- The API URL is correct
- The error occurs at the fetch level, not at the API response level

## 3. Recommended Solutions

### 3.1 Immediate Fix - Add Better Error Messaging
Add console warnings to help users understand why mock data is being used:

```typescript
// In pageSpeedService.ts
catch (error) {
  errorHandler.logError(error, { context: 'PageSpeedService', url });
  console.error('PageSpeed API Error:', error);
  console.info('💡 Common causes: CORS issues (use server-side proxy), invalid API key, or rate limits');
  console.info('📌 To fix: Deploy API proxy endpoint or use server-side rendering');
  return this.getMockData(url);
}
```

### 3.2 Long-term Solution - Implement API Proxy

Create a Vercel serverless function to proxy API requests:

```typescript
// api/pagespeed.ts
export default async function handler(req, res) {
  const { url, strategy } = req.query;
  
  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${process.env.GOOGLE_API_KEY}&strategy=${strategy}`
  );
  
  const data = await response.json();
  res.status(200).json(data);
}
```

Then update the service to use the proxy:
```typescript
// In pageSpeedService.ts
const response = await fetch(`/api/pagespeed?url=${fullUrl}&strategy=${strategy}`);
```

### 3.3 Environment Variable Documentation

Update the `.env.example` file to clarify API requirements:

```bash
# Google PageSpeed Insights API
# Note: Requires server-side proxy due to CORS restrictions
# Get your key at: https://developers.google.com/speed/docs/insights/v5/get-started
VITE_GOOGLE_API_KEY=your_api_key_here

# Serper API - Works from browser
VITE_SERPER_API_KEY=your_api_key_here
```

## 4. Mock Data Impact Analysis

### Current Impact:
1. **PageSpeed Data**: Always returns mock data in production due to CORS
2. **Serper Data**: Works correctly when API key is provided
3. **GEO Analysis**: Attempts real API calls first, falls back gracefully
4. **SEO Analysis**: Uses mix of real (Serper) and mock (PageSpeed) data

### User Experience Impact:
- Users see consistent but inaccurate performance metrics
- SEO recommendations based on mock data may not be relevant
- GEO scores attempt real analysis but fall back silently

## 5. Action Items

1. **Immediate**: Deploy this report to document the issue
2. **High Priority**: Implement server-side proxy for PageSpeed API
3. **Medium Priority**: Add user notifications when mock data is used
4. **Low Priority**: Consider caching real API responses to reduce API calls

## 6. Testing Recommendations

To verify if APIs are working:
1. Check browser console for specific error messages
2. Monitor Network tab for failed requests
3. Look for console warnings about missing API keys
4. Verify API keys are set in Vercel environment variables

## Conclusion

The application gracefully falls back to mock data when APIs fail, ensuring functionality continues. However, for production use, implementing a server-side proxy for the PageSpeed API is essential to provide real performance data to users.