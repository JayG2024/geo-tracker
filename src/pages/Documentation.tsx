import React from 'react';
import { Book, FileText, Code, Zap, Shield, HelpCircle, ExternalLink, CheckCircle } from 'lucide-react';

export default function Documentation() {
  const sections = [
    {
      title: 'Getting Started',
      icon: <Zap className="w-5 h-5" />,
      items: [
        { title: 'What is GeoTest.ai?', href: '#what-is-geotest' },
        { title: 'Understanding Your Scores', href: '#understanding-scores' },
        { title: 'Running Your First Test', href: '#first-test' },
        { title: 'Interpreting Results', href: '#interpreting-results' }
      ]
    },
    {
      title: 'Core Concepts',
      icon: <Book className="w-5 h-5" />,
      items: [
        { title: 'SEO vs GEO Explained', href: '#seo-vs-geo' },
        { title: 'AI Search Visibility', href: '#ai-visibility' },
        { title: 'Scoring Methodology', href: '#scoring' },
        { title: 'Best Practices', href: '#best-practices' }
      ]
    },
    {
      title: 'API Reference',
      icon: <Code className="w-5 h-5" />,
      items: [
        { title: 'Authentication', href: '#api-auth' },
        { title: 'Endpoints', href: '#api-endpoints' },
        { title: 'Rate Limits', href: '#rate-limits' },
        { title: 'Code Examples', href: '#code-examples' }
      ]
    },
    {
      title: 'Resources',
      icon: <FileText className="w-5 h-5" />,
      items: [
        { title: 'Case Studies', href: '#case-studies' },
        { title: 'Video Tutorials', href: '#tutorials' },
        { title: 'FAQ', href: '#faq' },
        { title: 'Troubleshooting', href: '#troubleshooting' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about testing and improving your website's AI search visibility
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {section.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <a 
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* What is GeoTest.ai */}
          <section id="what-is-geotest" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GeoTest.ai?</h2>
            <p className="text-gray-600 mb-4">
              GeoTest.ai is the first comprehensive tool designed to measure and improve your website's visibility 
              in AI-powered search engines like ChatGPT, Claude, Perplexity, and Google's Gemini.
            </p>
            <p className="text-gray-600 mb-4">
              As search evolves from traditional keyword matching to AI-driven conversational responses, 
              your website needs to be optimized for both traditional SEO and the new world of GEO 
              (Generative Engine Optimization).
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900">
                <strong>Key Insight:</strong> Over 50% of searches will be AI-powered by 2025. 
                Is your website ready?
              </p>
            </div>
          </section>

          {/* Understanding Your Scores */}
          <section id="understanding-scores" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Your Scores</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">SEO Score (0-100)</h3>
                <p className="text-gray-600 mb-3">
                  Measures traditional search engine optimization factors:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-600">Technical performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-600">Content optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-600">Mobile responsiveness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-600">Page speed</span>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">GEO Score (0-100)</h3>
                <p className="text-gray-600 mb-3">
                  Measures AI search engine optimization factors:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-sm text-gray-600">AI platform visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-sm text-gray-600">Content structure for AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-sm text-gray-600">Authority signals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span className="text-sm text-gray-600">Citation worthiness</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Score Ranges:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-green-600 font-semibold">90-100:</span>
                  <span className="text-gray-600 ml-2">Excellent</span>
                </div>
                <div>
                  <span className="text-blue-600 font-semibold">70-89:</span>
                  <span className="text-gray-600 ml-2">Good</span>
                </div>
                <div>
                  <span className="text-yellow-600 font-semibold">50-69:</span>
                  <span className="text-gray-600 ml-2">Fair</span>
                </div>
                <div>
                  <span className="text-red-600 font-semibold">0-49:</span>
                  <span className="text-gray-600 ml-2">Needs Work</span>
                </div>
              </div>
            </div>
          </section>

          {/* SEO vs GEO */}
          <section id="seo-vs-geo" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">SEO vs GEO: What's the Difference?</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Aspect</th>
                    <th className="text-left py-3 px-4">Traditional SEO</th>
                    <th className="text-left py-3 px-4">GEO (AI Optimization)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3 px-4 font-medium">Primary Goal</td>
                    <td className="py-3 px-4 text-gray-600">Rank in search results</td>
                    <td className="py-3 px-4 text-gray-600">Be cited by AI systems</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Content Focus</td>
                    <td className="py-3 px-4 text-gray-600">Keywords & backlinks</td>
                    <td className="py-3 px-4 text-gray-600">Authority & comprehensiveness</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Success Metrics</td>
                    <td className="py-3 px-4 text-gray-600">Rankings & traffic</td>
                    <td className="py-3 px-4 text-gray-600">AI mentions & accuracy</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Optimization</td>
                    <td className="py-3 px-4 text-gray-600">Meta tags, keywords</td>
                    <td className="py-3 px-4 text-gray-600">Structured data, E-E-A-T</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* API Section */}
          <section id="api-auth" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Access</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Premium Feature</h4>
                  <p className="text-yellow-800">
                    API access is available with Professional and Enterprise plans. 
                    <a href="/pricing" className="underline ml-1">View pricing →</a>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 text-gray-100">
              <p className="text-sm mb-2 text-gray-400"># Example API Request</p>
              <pre className="text-sm">
{`curl -X POST https://api.geotest.ai/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
              </pre>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <details className="border rounded-lg p-4">
                <summary className="font-semibold cursor-pointer">
                  Why is my AI visibility score low even though my site is well-optimized?
                </summary>
                <p className="mt-3 text-gray-600">
                  AI platforms like ChatGPT and Claude have knowledge cutoff dates. If your website is newer 
                  than their training data, they won't know about it yet. Focus on optimization now so you're 
                  ready when they update their models.
                </p>
              </details>
              
              <details className="border rounded-lg p-4">
                <summary className="font-semibold cursor-pointer">
                  How often should I test my website?
                </summary>
                <p className="mt-3 text-gray-600">
                  We recommend testing monthly to track improvements and catch issues early. Major changes 
                  to your site should trigger immediate retesting.
                </p>
              </details>
              
              <details className="border rounded-lg p-4">
                <summary className="font-semibold cursor-pointer">
                  What's the difference between free and paid features?
                </summary>
                <p className="mt-3 text-gray-600">
                  Free users get 3 analyses per day with basic recommendations. Paid plans include 
                  unlimited analyses, detailed reports, API access, competitor tracking, and priority support.
                </p>
              </details>
            </div>
          </section>

          {/* Help */}
          <section className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Need More Help?</h3>
                <p className="text-gray-600 mb-3">
                  Our support team is here to help you succeed with AI search optimization.
                </p>
                <div className="flex gap-4">
                  <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                    Contact Support →
                  </a>
                  <a href="https://community.geotest.ai" className="text-blue-600 hover:text-blue-700 font-medium">
                    Join Community →
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}