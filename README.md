# GEO Tracker - SEO + AI Search Visibility Tool

The first and only tool that analyzes both traditional SEO and AI search visibility (GEO - Generative Engine Optimization).

🚀 **Live Demo**: https://www.geotest.ai

## What is GEO Tracker?

GEO Tracker helps businesses understand and improve their visibility in both:
- **Traditional Search** (Google, Bing)
- **AI Search** (ChatGPT, Claude, Perplexity, Gemini)

## Features

### 📊 Dual Analysis System
- **SEO Score**: Traditional search engine optimization metrics
- **GEO Score**: AI search engine visibility metrics
- **Combined Score**: Overall search presence

### 🔍 SEO Analysis
- Page speed and Core Web Vitals
- Mobile responsiveness
- HTTPS security check
- Robots.txt and sitemap validation
- Meta tags optimization
- Content quality assessment

### 🤖 GEO Analysis (AI Search)
- Google AI Overview presence
- Search result visibility
- Brand mention rate
- Information accuracy
- Competitive positioning
- AI-friendly content structure

### 📈 Professional Reports
- Detailed recommendations
- PDF export
- Shareable links
- Competitor comparison
- Progress tracking

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build**: Vite
- **APIs**: 
  - Serper API (Google SERP analysis)
  - Google PageSpeed Insights API
- **Deployment**: Vercel
- **Charts**: Recharts
- **PDF**: jsPDF

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/geo-tracker.git
cd geo-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env
```

### Required API Keys

1. **Serper API** (Required)
   - Sign up at https://serper.dev
   - Get your API key
   - Add to `.env`: `VITE_SERPER_API_KEY=your_key`

2. **Google API** (Optional but recommended)
   - Get key from Google Cloud Console
   - Enable PageSpeed Insights API
   - Add to `.env`: `VITE_GOOGLE_API_KEY=your_key`

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fgeo-tracker)

1. Click the button above
2. Add environment variables in Vercel:
   - `VITE_SERPER_API_KEY`
   - `VITE_GOOGLE_API_KEY`
3. Deploy!

## How It Works

1. **Enter URL**: User inputs any website URL
2. **Real-time Analysis**: 
   - Technical SEO checks via direct crawling
   - PageSpeed analysis via Google API
   - SERP visibility via Serper API
3. **Scoring Algorithm**:
   - SEO Score: Based on 15+ technical factors
   - GEO Score: Based on AI search presence
4. **Recommendations**: AI-powered suggestions for improvement

## Roadmap

- [ ] Bing Search API integration
- [ ] Direct AI platform testing
- [ ] User authentication
- [ ] Historical data tracking
- [ ] Team collaboration
- [ ] API access for developers
- [ ] Chrome extension

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- Create an issue for bugs
- Start a discussion for features
- Email: support@geotracker.ai

---

**Built with ❤️ for the future of search**