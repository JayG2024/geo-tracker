import React from 'react';
import { AnalysisResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, MapPin, Brain, Globe, FileText, AlertCircle, CheckCircle, XCircle, Share2, Award, Target, Users, DollarSign, Calendar, Clock, Zap, Star, Eye, Download, Lightbulb, Shield, BarChart3 } from 'lucide-react';

interface ResultsViewProps {
  results: AnalysisResult;
  onGeneratePDF: () => void;
  onCreateShareableReport?: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, onGeneratePDF, onCreateShareableReport }) => {
  const scoreData = [
    { category: 'GEO Visibility', score: results.geoVisibilityScore, color: '#3b82f6' },
    { category: 'AI Search', score: results.aiSearchScore, color: '#10b981' },
    { category: 'Citations', score: results.citationScore, color: '#f59e0b' },
    { category: 'Technical SEO', score: results.technicalSeoScore, color: '#8b5cf6' },
    { category: 'Content', score: results.contentScore, color: '#ef4444' },
    { category: 'Schema', score: results.schemaScore, color: '#06b6d4' }
  ];

  // Enhanced GEO-specific score data
  const geoScoreData = [
    { category: 'Citation Worthiness', score: results.citationWorthinessScore, color: '#22c55e' },
    { category: 'E-E-A-T Signals', score: results.eeatSignalStrengthScore, color: '#3b82f6' },
    { category: 'Structured Data', score: results.structuredDataScore, color: '#8b5cf6' },
    { category: 'Content Depth', score: results.contentDepthScore, color: '#f59e0b' },
    { category: 'Topical Authority', score: results.topicalAuthorityScore, color: '#ef4444' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCitationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inconsistent': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Hero Section with GEO Focus */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="relative px-6 py-16 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-blue-200">
                    <Star className="w-5 h-5" />
                    <span className="text-sm font-medium">Advanced GEO Analysis Report</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Generative Engine Optimization Results
                  </h1>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-6 h-6 text-blue-300" />
                      <span className="text-xl text-blue-100 font-medium">{results.url}</span>
                    </div>
                    <div className="flex items-center space-x-6 text-blue-200">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {results.timestamp.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{results.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Key Metrics Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-blue-100 text-sm">AI Visibility</div>
                    <div className="text-white text-2xl font-bold">{results.citationWorthinessScore}/100</div>
                    <div className="text-blue-200 text-xs">Citation Ready</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-blue-100 text-sm">E-E-A-T Score</div>
                    <div className="text-white text-2xl font-bold">{results.eeatSignalStrengthScore}/100</div>
                    <div className="text-blue-200 text-xs">Authority</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-blue-100 text-sm">Content Depth</div>
                    <div className="text-white text-2xl font-bold">{results.contentDepthScore}/100</div>
                    <div className="text-blue-200 text-xs">Comprehensive</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-blue-100 text-sm">Topical Authority</div>
                    <div className="text-white text-2xl font-bold">{results.topicalAuthorityScore}/100</div>
                    <div className="text-blue-200 text-xs">Expertise</div>
                  </div>
                </div>
              </div>
              
              {/* Overall Score Circle with GEO Focus */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Outer Ring */}
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    {/* Inner Score Circle */}
                    <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${getScoreGradient(results.overallScore)} flex items-center justify-center shadow-2xl`}>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white">{results.overallScore}</div>
                        <div className="text-white/90 text-sm font-medium">GEO Score</div>
                      </div>
                    </div>
                  </div>
                  {/* Floating Labels */}
                  <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 border border-white/50">
                    <span className="text-xs font-bold text-gray-800">AI Optimized</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 border border-white/50">
                    <span className="text-xs font-bold text-gray-800">3-AI Consensus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Enhanced with GEO Focus */}
      <div className="relative -mt-8 z-10 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/50">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={onGeneratePDF}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span>Download Comprehensive GEO Report</span>
                <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
              </button>
              
              {onCreateShareableReport && (
                <button
                  onClick={onCreateShareableReport}
                  className="group bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3"
                >
                  <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Create Shareable Client Report</span>
                  <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                </button>
              )}
              
              <button className="group bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3">
                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>View Detailed GEO Analysis</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 py-12 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* GEO Analysis Summary Section */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200/50 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                GEO Analysis Summary
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Comprehensive Generative Engine Optimization analysis with AI-powered insights and strategic recommendations
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h3>
              <p className="text-gray-800 leading-relaxed">{results.analysisSummaryText}</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Actionable Recommendations</h3>
              <p className="text-gray-800 leading-relaxed">{results.actionableRecommendationsText}</p>
            </div>
          </div>

          {/* Enhanced GEO Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: 'Citation Worthiness',
                value: results.citationWorthinessScore,
                icon: Lightbulb,
                description: 'AI system citation potential',
                gradient: 'from-green-500 to-emerald-600',
                bgGradient: 'from-green-50 to-emerald-50'
              },
              {
                title: 'E-E-A-T Signals',
                value: results.eeatSignalStrengthScore,
                icon: Shield,
                description: 'Expertise, Experience, Authority, Trust',
                gradient: 'from-blue-500 to-cyan-600',
                bgGradient: 'from-blue-50 to-cyan-50'
              },
              {
                title: 'Structured Data',
                value: results.structuredDataScore,
                icon: BarChart3,
                description: 'AI comprehension markup',
                gradient: 'from-purple-500 to-indigo-600',
                bgGradient: 'from-purple-50 to-indigo-50'
              },
              {
                title: 'Content Depth',
                value: results.contentDepthScore,
                icon: FileText,
                description: 'Comprehensive coverage score',
                gradient: 'from-orange-500 to-red-600',
                bgGradient: 'from-orange-50 to-red-50'
              },
              {
                title: 'Topical Authority',
                value: results.topicalAuthorityScore,
                icon: Award,
                description: 'Subject matter expertise',
                gradient: 'from-yellow-500 to-orange-600',
                bgGradient: 'from-yellow-50 to-orange-50'
              }
            ].map((metric, index) => (
              <div key={index} className={`bg-gradient-to-br ${metric.bgGradient} rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.gradient} shadow-lg`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreBadge(metric.value)}`}>
                    {metric.value}/100
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{metric.title}</h3>
                <p className="text-gray-600 text-sm">{metric.description}</p>
              </div>
            ))}
          </div>

          {/* Topical Opportunities Section */}
          <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-3xl p-8 border border-orange-200/50 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Strategic Topical Opportunities
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                AI-identified opportunities for enhanced topic authority and content optimization
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.topicalOpportunities.map((opportunity, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Opportunity #{index + 1}</h4>
                      <p className="text-gray-800 leading-relaxed">{opportunity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section with Enhanced GEO Focus */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* GEO Performance Breakdown Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">GEO Performance Breakdown</h3>
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-purple-800">AI Analysis</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geoScoreData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                    <YAxis dataKey="category" type="category" width={120} stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      fill="url(#geoGradient)" 
                      radius={[0, 8, 8, 0]}
                    />
                    <defs>
                      <linearGradient id="geoGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="5%" stopColor="#22c55e" />
                        <stop offset="95%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Traditional Performance Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Traditional SEO Metrics</h3>
                <div className="bg-gradient-to-r from-blue-100 to-green-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-blue-800">Baseline</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                    <YAxis dataKey="category" type="category" width={120} stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      fill="url(#colorGradient)" 
                      radius={[0, 8, 8, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="5%" stopColor="#3b82f6" />
                        <stop offset="95%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* GEO Strategy Advantages */}
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-8 border border-emerald-200/50 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Why GEO Optimization is Critical for AI Success
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Strategic advantages of Generative Engine Optimization for enhanced AI discoverability and citation potential
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.geoStrategyAdvantages?.slice(0, 8).map((advantage, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-lg transition-all duration-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-800 leading-relaxed font-medium">{advantage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority GEO Recommendations */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Priority GEO Recommendations</h3>
              <p className="text-lg text-gray-600">Strategic actions ranked by AI optimization impact and implementation feasibility</p>
            </div>
            
            <div className="grid gap-6">
              {results.recommendations.slice(0, 4).map((rec, index) => (
                <div key={index} className={`group relative p-6 rounded-xl border-l-4 transition-all duration-200 hover:shadow-lg ${
                  rec.priority === 'high' ? 'border-red-500 bg-gradient-to-r from-red-50 to-pink-50' :
                  rec.priority === 'medium' ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50' :
                  'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 shadow-md">
                        {index + 1}
                      </div>
                      <h4 className="font-bold text-gray-900 text-xl">{rec.title}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{rec.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-white/50">
                      <span className="font-semibold text-gray-900 block mb-1">Impact:</span>
                      <p className="text-gray-700 text-sm">{rec.impact}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-white/50">
                      <span className="font-semibold text-gray-900 block mb-1">Effort Required:</span>
                      <p className="text-gray-700 text-sm">{rec.effort}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-white/50">
                      <span className="font-semibold text-gray-900 block mb-1">Timeline:</span>
                      <p className="text-gray-700 text-sm">{rec.timeline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROI Projection Section */}
          {results.geoRoiProjection && (
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-200/50 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">GEO Investment ROI Projection</h3>
                <p className="text-lg text-gray-600">Financial impact analysis and growth projections for AI optimization</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Year 1 ROI', value: results.geoRoiProjection.yearOneROI, color: 'from-green-500 to-emerald-600' },
                  { label: 'Break-even Point', value: results.geoRoiProjection.breakEvenPoint, color: 'from-blue-500 to-cyan-600', isText: true },
                  { label: 'Year 3 ROI', value: results.geoRoiProjection.yearThreeROI, color: 'from-purple-500 to-indigo-600' },
                  { label: 'Initial Investment', value: results.geoRoiProjection.initialInvestment, color: 'from-orange-500 to-red-600' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {item.isText ? item.value : `$${(item.value / 1000).toLocaleString()}K`}
                    </div>
                    <p className="text-gray-700 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">ROI Scenarios</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-100/50 rounded-lg">
                      <span className="text-gray-700 font-medium">Conservative:</span>
                      <span className="font-bold text-green-600 text-lg">
                        ${(results.geoRoiProjection.conservativeEstimate / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-100/50 rounded-lg">
                      <span className="text-gray-700 font-medium">Optimistic:</span>
                      <span className="font-bold text-blue-600 text-lg">
                        ${(results.geoRoiProjection.optimisticEstimate / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Key ROI Drivers</h4>
                  <div className="space-y-3">
                    {results.geoRoiProjection.keyDrivers.slice(0, 3).map((driver, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsView;