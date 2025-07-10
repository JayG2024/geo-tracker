import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Search, FolderOpen, Settings, Home, Menu, X, AlertTriangle, Brain, Share2 } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import SEOGEODashboard from './components/SEOGEODashboard';
import SEOGEOAnalysisForm from './components/SEOGEOAnalysisForm';
import SEOGEOResultsSinglePage from './components/SEOGEOResultsSinglePage';
import ClientProjectManager from './components/ClientProjectManager';
import AIAnalysisProgressV2 from './components/AIAnalysisProgressV2';
import AIProviderStatus from './components/AIProviderStatus';
import SharedReport from './components/SharedReport';
import ReportManager from './components/ReportManager';
import CreateShareableReport from './components/CreateShareableReport';
import LogoShowcase from './components/LogoShowcase';
import { GeoTestLogoTech } from './components/GeoTestLogo';
import { generatePDFReport } from './components/PDFGenerator';
import { CombinedAnalysis } from './types/analysis';
import { ShareableReport } from './types/reports';
import { performSEOGEOAnalysis } from './services/seoGeoAnalysis';
import { getUserFriendlyError, getErrorActions } from './utils/errorMessages';
import ErrorDisplay from './components/ErrorDisplay';

interface AIProvider {
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
  specialty: string;
  color: string;
  icon: string;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<CombinedAnalysis | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAIProgress, setShowAIProgress] = useState(false);
  const [aiProviders, setAiProviders] = useState<AIProvider[]>([]);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [freeTierScans, setFreeTierScans] = useState(999); // Unlimited free scans

  const initializeAIProviders = (): AIProvider[] => [
    {
      name: 'OpenAI GPT-4',
      progress: 0,
      status: 'pending',
      specialty: 'Content Analysis & Readability',
      color: 'bg-green-100',
      icon: '🤖'
    },
    {
      name: 'Google Gemini Pro',
      progress: 0,
      status: 'pending',
      specialty: 'Technical SEO & Performance',
      color: 'bg-blue-100',
      icon: '⚡'
    },
    {
      name: 'Claude 3.5 Sonnet',
      progress: 0,
      status: 'pending',
      specialty: 'Competitor Analysis & Positioning',
      color: 'bg-purple-100',
      icon: '🎯'
    },
    {
      name: 'Perplexity AI',
      progress: 0,
      status: 'pending',
      specialty: 'Market Research & Trends',
      color: 'bg-orange-100',
      icon: '📊'
    }
  ];

  const updateAIProgress = (providerName: string, progress: number) => {
    setAiProviders(prev => prev.map(provider => 
      provider.name === providerName 
        ? { 
            ...provider, 
            progress: Math.min(100, progress),
            status: progress >= 100 ? 'complete' : 'processing'
          }
        : provider
    ));
  };

  const handleAnalyze = async (url: string) => {
    // No limits - everything is free!

    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize AI providers for visual progress
      const providers = initializeAIProviders();
      setAiProviders(providers);
      setShowAIProgress(true);
      
      // Start all providers as processing
      providers.forEach(provider => {
        setTimeout(() => {
          setAiProviders(prev => prev.map(p => 
            p.name === provider.name ? { ...p, status: 'processing' } : p
          ));
        }, Math.random() * 1000);
      });

      // Simulate progressive AI analysis
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        providers.forEach((provider, index) => {
          const providerProgress = Math.min(100, progress + (index * 5));
          updateAIProgress(provider.name, providerProgress);
        });
        
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 500);

      // Perform SEO + GEO analysis
      const results = await performSEOGEOAnalysis(url);
      
      // No need to update count - unlimited scans!
      
      setAnalysisResults(results);
      navigate('/results');
      setShowAIProgress(false);
      setIsLoading(false);
    } catch (err) {
      // Use user-friendly error messages
      const errorMessage = getUserFriendlyError(err);
      setError(errorMessage);
      setShowAIProgress(false);
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = () => {
    if (analysisResults) {
      generatePDFReport(analysisResults);
    }
  };

  const handleCreateShareableReport = () => {
    if (analysisResults) {
      setShowCreateReport(true);
    }
  };

  const handleReportCreated = (report: ShareableReport) => {
    setShowCreateReport(false);
    navigate('/reports');
    // Could show success message here
  };

  const handleCancelAnalysis = () => {
    setIsLoading(false);
    setShowAIProgress(false);
    setAiProviders([]);
    setError('Analysis cancelled by user');
  };

  const navigation = [
    { id: 'analyze', name: 'AI Visibility Test', icon: Brain, path: '/' },
    { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'projects', name: 'My Websites', icon: FolderOpen, path: '/projects' },
    { id: 'reports', name: 'Reports', icon: Share2, path: '/reports' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* AI Analysis Progress Modal */}
      {showAIProgress && (
        <AIAnalysisProgressV2
          providers={aiProviders}
          isAnalyzing={isLoading}
          onCancel={handleCancelAnalysis}
        />
      )}

      {/* Create Shareable Report Modal */}
      {showCreateReport && analysisResults && (
        <CreateShareableReport
          analysis={analysisResults}
          onReportCreated={handleReportCreated}
          onCancel={() => setShowCreateReport(false)}
        />
      )}

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <GeoTestLogoTech color="#3B82F6" className="h-10" showTagline={false} />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                  setError(null); // Clear any errors when switching views
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-lg p-4 border bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
              <p className="text-sm font-medium text-gray-900">
                Full Access Unlocked
              </p>
            </div>
            <p className="text-xs text-gray-600">
              Unlimited SEO + GEO analysis available
            </p>
            <div className="mt-2 text-xs text-green-700">
              ✓ All features enabled
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-600">
                  {location.pathname === '/' && 'Test how ChatGPT, Claude, Perplexity and Gemini see your website'}
                  {location.pathname === '/dashboard' && 'AI search visibility tracking across all major AI platforms'}
                  {location.pathname === '/results' && 'AI optimization recommendations to improve visibility'}
                  {location.pathname === '/projects' && 'Monitor your AI search rankings over time'}
                  {location.pathname === '/reports' && 'Professional AI visibility reports for stakeholders'}
                  {location.pathname === '/settings' && 'Configure your AI testing preferences'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                <span className="text-sm font-medium text-blue-800">🚀</span>
                <span className="text-sm font-medium text-gray-700 ml-1">
                  AI Search Testing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Routes>
            <Route path="/" element={
              <div>
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800">{error}</p>
                    <button 
                      onClick={() => setError(null)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
                <SEOGEOAnalysisForm 
                  onAnalyze={handleAnalyze} 
                  isLoading={isLoading}
                  isFreeTier={false}
                  scansRemaining={999}
                />
              </div>
            } />
            <Route path="/dashboard" element={<SEOGEODashboard />} />
            <Route path="/analyze" element={
              <div>
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800">{error}</p>
                    <button 
                      onClick={() => setError(null)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
                <SEOGEOAnalysisForm 
                  onAnalyze={handleAnalyze} 
                  isLoading={isLoading}
                  isFreeTier={false}
                  scansRemaining={999}
                />
              </div>
            } />
            <Route path="/results" element={
              analysisResults ? (
                <SEOGEOResultsSinglePage 
                  analysis={analysisResults} 
                  onGeneratePDF={handleGeneratePDF}
                  onShare={handleCreateShareableReport}
                  isFreeTier={false}
                />
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No analysis results available</p>
                </div>
              )
            } />
            <Route path="/projects" element={<ClientProjectManager />} />
            <Route path="/reports" element={<ReportManager onCreateReport={() => navigate('/analyze')} />} />
            <Route path="/report/:reportId" element={<SharedReport />} />
            <Route path="/settings" element={
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Account Type</p>
                        <p className="text-sm text-gray-600">Full Access - Unlimited scans</p>
                      </div>
                      <span className="text-2xl">🚀</span>
                    </div>
                  </div>
                </div>

                <AIProviderStatus />

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
                  <p className="text-blue-100 mb-6">
                    Check out our documentation or contact support for assistance.
                  </p>
                  <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
                    View Documentation
                  </button>
                </div>
              </div>
            } />
            <Route path="/logo" element={<LogoShowcase />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/report/:reportId" element={<SharedReport />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;