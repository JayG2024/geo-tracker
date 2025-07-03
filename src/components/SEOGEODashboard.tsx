import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Brain, 
  Globe, 
  BarChart3, 
  ArrowUp, 
  ArrowDown,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Target,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { supabase, isSupabaseConnected } from '../lib/supabase';

interface OverviewStats {
  totalScans: number;
  avgSEOScore: number;
  avgGEOScore: number;
  totalUsers: number;
  scansToday: number;
  trendsUp: boolean;
}

interface ScoreDistribution {
  name: string;
  seo: number;
  geo: number;
}

interface TrendData {
  date: string;
  seo: number;
  geo: number;
}

interface TopIssue {
  issue: string;
  count: number;
  category: string;
  impact: string;
}

interface AIPlatformVisibility {
  name: string;
  value: number;
  color: string;
}

const SEOGEODashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    totalScans: 0,
    avgSEOScore: 0,
    avgGEOScore: 0,
    totalUsers: 0,
    scansToday: 0,
    trendsUp: false
  });

  const scoreDistribution = [
    { name: 'Excellent\n(80-100)', seo: 23, geo: 12 },
    { name: 'Good\n(60-79)', seo: 45, geo: 28 },
    { name: 'Needs Work\n(40-59)', seo: 28, geo: 41 },
    { name: 'Poor\n(0-39)', seo: 4, geo: 19 }
  ];

  const trendData = [
    { date: 'Mon', seo: 68, geo: 52 },
    { date: 'Tue', seo: 70, geo: 54 },
    { date: 'Wed', seo: 69, geo: 56 },
    { date: 'Thu', seo: 72, geo: 55 },
    { date: 'Fri', seo: 71, geo: 58 },
    { date: 'Sat', seo: 73, geo: 59 },
    { date: 'Sun', seo: 72, geo: 58 }
  ];

  const topIssues = [
    { issue: 'Missing Meta Descriptions', count: 234, category: 'seo', impact: 'high' },
    { issue: 'No AI Platform Visibility', count: 189, category: 'geo', impact: 'critical' },
    { issue: 'Slow Page Speed', count: 156, category: 'seo', impact: 'high' },
    { issue: 'Outdated Business Info in AI', count: 145, category: 'geo', impact: 'medium' },
    { issue: 'No Structured Data', count: 123, category: 'both', impact: 'high' }
  ];

  const aiPlatformVisibility = [
    { name: 'ChatGPT', value: 42, color: '#10b981' },
    { name: 'Claude', value: 38, color: '#3b82f6' },
    { name: 'Perplexity', value: 51, color: '#8b5cf6' },
    { name: 'Gemini', value: 35, color: '#f59e0b' },
    { name: 'Bing Chat', value: 46, color: '#ef4444' }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg SEO Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{overviewStats.avgSEOScore}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+3% this week</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg GEO Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{overviewStats.avgGEOScore}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+5% this week</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Scans</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{overviewStats.totalScans.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">{overviewStats.scansToday} today</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{overviewStats.totalUsers}</p>
              <div className="flex items-center gap-1 mt-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500">12 premium</span>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Score Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="seo" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="SEO Score"
              />
              <Line 
                type="monotone" 
                dataKey="geo" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="GEO Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="seo" fill="#3b82f6" name="SEO" />
              <Bar dataKey="geo" fill="#8b5cf6" name="GEO" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Platform Visibility and Top Issues */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Platform Visibility */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AI Platform Visibility Rate
          </h3>
          <div className="space-y-3">
            {aiPlatformVisibility.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-gray-700 w-20">
                    {platform.name}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${platform.value}%`,
                        backgroundColor: platform.color 
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {platform.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Percentage of analyzed sites visible on each AI platform
          </p>
        </div>

        {/* Top Issues */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Most Common Issues
          </h3>
          <div className="space-y-3">
            {topIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(issue.impact)}`}>
                    {issue.impact.toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{issue.issue}</p>
                    <p className="text-xs text-gray-500">
                      {issue.category === 'both' ? 'SEO + GEO' : issue.category.toUpperCase()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {issue.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-bold mb-3">
            Ready to Improve Your Search Visibility?
          </h3>
          <p className="text-blue-100 mb-6">
            Join hundreds of businesses optimizing for both traditional SEO and AI search engines. 
            Get your free analysis and see where you stand.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Start Free Analysis
            </button>
            <button className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
              View Sample Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOGEODashboard;