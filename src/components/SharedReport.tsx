import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Download, Share2, Eye, Calendar, MapPin, Brain, Globe, FileText, 
  Award, TrendingUp, Users, Target, ArrowRight, Lock, CheckCircle,
  Twitter, Linkedin, Mail, Link, Printer, Lightbulb, Shield, BarChart3
} from 'lucide-react';
import { reportService } from '../services/reportService';
import { analysisService } from '../services/database';
import { ShareableReport, SocialShareData } from '../types/reports';
import { AnalysisResult } from '../types';
import { generatePDFReport } from './PDFGenerator';
import { format } from 'date-fns';

const SharedReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<ShareableReport | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [socialShare, setSocialShare] = useState<SocialShareData | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (reportId) {
      loadReport(reportId);
    }
  }, [reportId]);

  const loadReport = async (id: string) => {
    try {
      setLoading(true);
      const reportData = await reportService.getReport(id);
      
      if (!reportData) {
        setError('Report not found or has expired');
        return;
      }

      if (reportData.password && !password) {
        setNeedsPassword(true);
        setLoading(false);
        return;
      }

      if (reportData.password && reportData.password !== password) {
        setError('Invalid password');
        return;
      }

      setReport(reportData);
      
      // Load real analysis data from database
      try {
        const realAnalysis = await analysisService.getById(reportData.analysisId);
        if (realAnalysis) {
          setAnalysis(realAnalysis);
        } else {
          setError('Analysis data not found');
          return;
        }
      } catch (dbError) {
        console.error('Failed to load analysis from database:', dbError);
        setError('Failed to load analysis data');
        return;
      }

      // Track the view
      await reportService.trackReportView(id, {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        device: detectDevice()
      });

      // Generate social share data
      const shareData = reportService.generateSocialShareData(reportData);
      setSocialShare(shareData);

      setLoading(false);
    } catch (err) {
      console.error('Error loading report:', err);
      setError('Failed to load report');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportId) {
      loadReport(reportId);
    }
  };

  const handleDownload = () => {
    if (analysis && report?.shareSettings.allowDownload) {
      generatePDFReport(analysis);
      // Track download
      reportService.trackReportView(reportId!, {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        device: detectDevice()
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform: string) => {
    if (!socialShare) return;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(socialShare.url)}&text=${encodeURIComponent(socialShare.title)}&hashtags=${socialShare.hashtags?.join(',')}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(socialShare.url)}`,
      email: `mailto:?subject=${encodeURIComponent(socialShare.title)}&body=${encodeURIComponent(`${socialShare.description}\n\n${socialShare.url}`)}`,
      copy: socialShare.url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(urls.copy);
      alert('Link copied to clipboard!');
    } else {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  const detectDevice = (): 'desktop' | 'mobile' | 'tablet' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GEO report...</p>
        </div>
      </div>
    );
  }

  if (needsPassword && !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Protected GEO Report</h2>
            <p className="text-gray-600 mt-2">This report is password protected</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter report password"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Access Report
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error || !report || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested report could not be found or has expired.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const scoreData = [
    { category: 'GEO Visibility', score: analysis.geoVisibilityScore, color: '#3b82f6' },
    { category: 'AI Search', score: analysis.aiSearchScore, color: '#10b981' },
    { category: 'Technical SEO', score: analysis.technicalSeoScore, color: '#8b5cf6' },
    { category: 'Content', score: analysis.contentScore, color: '#ef4444' },
    { category: 'Citations', score: analysis.citationScore, color: '#f59e0b' },
    { category: 'Schema', score: analysis.schemaScore, color: '#06b6d4' }
  ];

  // Enhanced GEO-specific score data
  const geoScoreData = [
    { category: 'Citation Worthiness', score: analysis.citationWorthinessScore, color: '#22c55e' },
    { category: 'E-E-A-T Signals', score: analysis.eeatSignalStrengthScore, color: '#3b82f6' },
    { category: 'Structured Data', score: analysis.structuredDataScore, color: '#8b5cf6' },
    { category: 'Content Depth', score: analysis.contentDepthScore, color: '#f59e0b' },
    { category: 'Topical Authority', score: analysis.topicalAuthorityScore, color: '#ef4444' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { background: white !important; }
          .bg-gray-50 { background: white !important; }
          .shadow-lg { box-shadow: none !important; }
          .border { border: 1px solid #e5e7eb !important; }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: report.customBranding?.primaryColor }}
              >
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {report.customBranding?.companyName}
                </h1>
                <p className="text-gray-600 text-sm">Professional GEO Analysis Report</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-gray-600 text-sm">
                <Eye className="w-4 h-4 mr-1" />
                {report.analytics.views} views
              </div>
              
              {report.shareSettings.allowDownload && (
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              )}
              
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              
              {report.shareSettings.allowSharing && (
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Executive Summary with GEO Focus */}
        <div 
          className="rounded-2xl p-8 text-white mb-8"
          style={{ background: `linear-gradient(135deg, ${report.customBranding?.primaryColor} 0%, ${report.customBranding?.secondaryColor} 100%)` }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{report.clientName}</h1>
              <p className="text-xl opacity-90 mb-6">{analysis.url}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="opacity-75 text-sm">Analysis Date</p>
                  <p className="font-semibold">{format(analysis.timestamp, 'MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="opacity-75 text-sm">GEO Optimization Level</p>
                  <p className="font-semibold">{analysis.overallScore >= 80 ? 'Excellent' : analysis.overallScore >= 60 ? 'Good' : 'Needs Improvement'}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">{analysis.overallScore}</div>
                <div className="opacity-90 text-lg">GEO Score</div>
                <div className="mt-4 text-sm opacity-75">
                  Generative AI Ready
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced GEO Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <Lightbulb className="w-6 h-6 text-green-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(analysis.citationWorthinessScore)}`}>
                {analysis.citationWorthinessScore}/100
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Citation Worthiness</h3>
            <p className="text-gray-600 text-sm mt-1">AI citation potential</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(analysis.eeatSignalStrengthScore)}`}>
                {analysis.eeatSignalStrengthScore}/100
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">E-E-A-T Signals</h3>
            <p className="text-gray-600 text-sm mt-1">Authority & expertise</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(analysis.structuredDataScore)}`}>
                {analysis.structuredDataScore}/100
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Structured Data</h3>
            <p className="text-gray-600 text-sm mt-1">AI comprehension</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(analysis.contentDepthScore)}`}>
                {analysis.contentDepthScore}/100
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Content Depth</h3>
            <p className="text-gray-600 text-sm mt-1">Comprehensive coverage</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(analysis.topicalAuthorityScore)}`}>
                {analysis.topicalAuthorityScore}/100
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Topical Authority</h3>
            <p className="text-gray-600 text-sm mt-1">Subject expertise</p>
          </div>
        </div>

        {/* GEO Analysis Summary */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">GEO Analysis Summary</h3>
          <div className="prose max-w-none">
            <p className="text-gray-800 leading-relaxed mb-6">{analysis.analysisSummaryText}</p>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Actionable Recommendations</h4>
            <p className="text-gray-800 leading-relaxed">{analysis.actionableRecommendationsText}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* GEO Performance Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 print-break">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">GEO Performance Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geoScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Traditional SEO Performance */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Traditional SEO Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topical Opportunities */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Strategic Topical Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analysis.topicalOpportunities.map((opportunity, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Opportunity #{index + 1}</h4>
                </div>
                <p className="text-gray-700 text-sm">{opportunity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8 print-break">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Priority GEO Recommendations</h3>
          <div className="space-y-6">
            {analysis.recommendations.slice(0, 3).map((rec, index) => (
              <div key={rec.id} className={`border-l-4 p-6 rounded-lg ${
                rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 text-lg">{rec.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.priority} priority
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{rec.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Impact:</span>
                    <p className="text-gray-600 mt-1">{rec.impact}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Effort Required:</span>
                    <p className="text-gray-600 mt-1">{rec.effort}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Timeline:</span>
                    <p className="text-gray-600 mt-1">{rec.timeline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Projection */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">GEO Investment ROI Projection</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                ${analysis.estimatedROI.toLocaleString()}
              </div>
              <p className="text-gray-700">Estimated Annual ROI</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">6-12</div>
              <p className="text-gray-700">Months to Full Impact</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">285%</div>
              <p className="text-gray-700">Expected ROI Increase</p>
            </div>
          </div>
        </div>

        {/* Report Footer */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="flex items-center justify-center mb-4">
            <div 
              className="p-2 rounded-lg mr-3"
              style={{ backgroundColor: report.customBranding?.primaryColor }}
            >
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">
              {report.customBranding?.companyName}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            This GEO analysis report was generated on {format(analysis.timestamp, 'MMMM dd, yyyy')} using advanced AI optimization techniques.
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>Report ID: {report.id}</span>
            <span>•</span>
            <span>Confidential & Proprietary</span>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && socialShare && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share GEO Report</h3>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-blue-600" />
                <span>Share on LinkedIn</span>
              </button>
              
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span>Share on Twitter</span>
              </button>
              
              <button
                onClick={() => handleShare('email')}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-600" />
                <span>Share via Email</span>
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Link className="w-5 h-5 text-gray-600" />
                <span>Copy Link</span>
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Share URL</label>
              <div className="flex">
                <input
                  type="text"
                  value={socialShare.url}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={() => handleShare('copy')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedReport;