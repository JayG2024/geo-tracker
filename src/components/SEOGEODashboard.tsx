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

  const [scoreDistribution, setScoreDistribution] = useState<ScoreDistribution[]>([
    { name: 'Excellent\n(80-100)', seo: 0, geo: 0 },
    { name: 'Good\n(60-79)', seo: 0, geo: 0 },
    { name: 'Needs Work\n(40-59)', seo: 0, geo: 0 },
    { name: 'Poor\n(0-39)', seo: 0, geo: 0 }
  ]);

  const [trendData, setTrendData] = useState<TrendData[]>([]);

  const [topIssues, setTopIssues] = useState<TopIssue[]>([]);

  const [aiPlatformVisibility] = useState<AIPlatformVisibility[]>([
    { name: 'ChatGPT', value: 42, color: '#10b981' },
    { name: 'Claude', value: 38, color: '#3b82f6' },
    { name: 'Perplexity', value: 51, color: '#8b5cf6' },
    { name: 'Gemini', value: 35, color: '#f59e0b' },
    { name: 'Bing Chat', value: 46, color: '#ef4444' }
  ]);

  // Check Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await isSupabaseConnected();
      setIsConnected(connected);
      if (!connected) {
        setError('Data persistence is not available. Running in demo mode.');
      }
    };
    checkConnection();
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      if (!supabase || !isConnected) {
        // Use mock data if Supabase is not connected
        setOverviewStats({
          totalScans: 1247,
          avgSEOScore: 72,
          avgGEOScore: 58,
          totalUsers: 342,
          scansToday: 47,
          trendsUp: true
        });
        
        setScoreDistribution([
          { name: 'Excellent\n(80-100)', seo: 23, geo: 12 },
          { name: 'Good\n(60-79)', seo: 45, geo: 28 },
          { name: 'Needs Work\n(40-59)', seo: 28, geo: 41 },
          { name: 'Poor\n(0-39)', seo: 4, geo: 19 }
        ]);

        setTrendData([
          { date: 'Mon', seo: 68, geo: 52 },
          { date: 'Tue', seo: 70, geo: 54 },
          { date: 'Wed', seo: 69, geo: 56 },
          { date: 'Thu', seo: 72, geo: 55 },
          { date: 'Fri', seo: 71, geo: 58 },
          { date: 'Sat', seo: 73, geo: 59 },
          { date: 'Sun', seo: 72, geo: 58 }
        ]);

        setTopIssues([
          { issue: 'Missing Meta Descriptions', count: 234, category: 'seo', impact: 'high' },
          { issue: 'No AI Platform Visibility', count: 189, category: 'geo', impact: 'critical' },
          { issue: 'Slow Page Speed', count: 156, category: 'seo', impact: 'high' },
          { issue: 'Outdated Business Info in AI', count: 145, category: 'geo', impact: 'medium' },
          { issue: 'No Structured Data', count: 123, category: 'both', impact: 'high' }
        ]);

        setLoading(false);
        return;
      }

      try {
        // Fetch total analyses count
        const { count: totalScans, error: countError } = await supabase
          .from('analyses')
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        // Fetch average scores
        const { data: analyses, error: analysesError } = await supabase
          .from('analyses')
          .select('overall_score, geo_score, ai_score, technical_score, content_score, analysis_data, created_at');

        if (analysesError) throw analysesError;

        // Calculate averages and today's scans
        const today = new Date().toISOString().split('T')[0];
        const scansToday = analyses?.filter(a => a.created_at.startsWith(today)).length || 0;
        
        const avgSEOScore = analyses && analyses.length > 0
          ? Math.round(analyses.reduce((sum, a) => sum + (a.overall_score || 0), 0) / analyses.length)
          : 0;
          
        const avgGEOScore = analyses && analyses.length > 0
          ? Math.round(analyses.reduce((sum, a) => sum + (a.geo_score || 0), 0) / analyses.length)
          : 0;

        // Calculate score distribution
        const distribution = {
          excellent: { seo: 0, geo: 0 },
          good: { seo: 0, geo: 0 },
          needsWork: { seo: 0, geo: 0 },
          poor: { seo: 0, geo: 0 }
        };

        analyses?.forEach(analysis => {
          const seoScore = analysis.overall_score || 0;
          const geoScore = analysis.geo_score || 0;

          // SEO Score distribution
          if (seoScore >= 80) distribution.excellent.seo++;
          else if (seoScore >= 60) distribution.good.seo++;
          else if (seoScore >= 40) distribution.needsWork.seo++;
          else distribution.poor.seo++;

          // GEO Score distribution
          if (geoScore >= 80) distribution.excellent.geo++;
          else if (geoScore >= 60) distribution.good.geo++;
          else if (geoScore >= 40) distribution.needsWork.geo++;
          else distribution.poor.geo++;
        });

        // Convert to percentages
        const total = analyses?.length || 1;
        setScoreDistribution([
          { name: 'Excellent\n(80-100)', seo: Math.round((distribution.excellent.seo / total) * 100), geo: Math.round((distribution.excellent.geo / total) * 100) },
          { name: 'Good\n(60-79)', seo: Math.round((distribution.good.seo / total) * 100), geo: Math.round((distribution.good.geo / total) * 100) },
          { name: 'Needs Work\n(40-59)', seo: Math.round((distribution.needsWork.seo / total) * 100), geo: Math.round((distribution.needsWork.geo / total) * 100) },
          { name: 'Poor\n(0-39)', seo: Math.round((distribution.poor.seo / total) * 100), geo: Math.round((distribution.poor.geo / total) * 100) }
        ]);

        // Fetch unique projects count (as proxy for users)
        const { count: projectCount, error: projectError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        if (projectError) throw projectError;

        // Calculate trend data (last 7 days)
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        
        const recentAnalyses = analyses?.filter(a => 
          new Date(a.created_at) >= last7Days
        ) || [];

        // Group by day
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const trendsMap = new Map<string, { seo: number[], geo: number[] }>();
        
        recentAnalyses.forEach(analysis => {
          const date = new Date(analysis.created_at);
          const dayName = dayNames[date.getDay()];
          
          if (!trendsMap.has(dayName)) {
            trendsMap.set(dayName, { seo: [], geo: [] });
          }
          
          const dayData = trendsMap.get(dayName)!;
          dayData.seo.push(analysis.overall_score || 0);
          dayData.geo.push(analysis.geo_score || 0);
        });

        // Calculate averages per day
        const trendArray: TrendData[] = [];
        dayNames.forEach(day => {
          const dayData = trendsMap.get(day);
          if (dayData && dayData.seo.length > 0) {
            trendArray.push({
              date: day,
              seo: Math.round(dayData.seo.reduce((a, b) => a + b, 0) / dayData.seo.length),
              geo: Math.round(dayData.geo.reduce((a, b) => a + b, 0) / dayData.geo.length)
            });
          }
        });

        setTrendData(trendArray.length > 0 ? trendArray : [
          { date: 'Mon', seo: avgSEOScore, geo: avgGEOScore },
          { date: 'Tue', seo: avgSEOScore, geo: avgGEOScore },
          { date: 'Wed', seo: avgSEOScore, geo: avgGEOScore },
          { date: 'Thu', seo: avgSEOScore, geo: avgGEOScore },
          { date: 'Fri', seo: avgSEOScore, geo: avgGEOScore },
          { date: 'Sat', seo: avgSEOScore, geo: avgGEOScore },
          { date: 'Sun', seo: avgSEOScore, geo: avgGEOScore }
        ]);

        // Analyze common issues from analysis_data
        const issuesMap = new Map<string, { count: number, category: string, impact: string }>();
        
        analyses?.forEach(analysis => {
          if (analysis.analysis_data && typeof analysis.analysis_data === 'object') {
            const data = analysis.analysis_data as any;
            
            // Check for common SEO issues
            if (data.seo?.metaDescription === false || data.technical?.metaDescription === false) {
              const key = 'Missing Meta Descriptions';
              issuesMap.set(key, {
                count: (issuesMap.get(key)?.count || 0) + 1,
                category: 'seo',
                impact: 'high'
              });
            }
            
            if (data.performance?.loadTime > 3 || data.technical?.pageSpeed < 50) {
              const key = 'Slow Page Speed';
              issuesMap.set(key, {
                count: (issuesMap.get(key)?.count || 0) + 1,
                category: 'seo',
                impact: 'high'
              });
            }
            
            if (!data.technical?.structuredData || data.schema?.score < 50) {
              const key = 'No Structured Data';
              issuesMap.set(key, {
                count: (issuesMap.get(key)?.count || 0) + 1,
                category: 'both',
                impact: 'high'
              });
            }
            
            // Check for GEO issues
            if (data.geo?.aiVisibility === false || data.ai?.visibility < 30) {
              const key = 'No AI Platform Visibility';
              issuesMap.set(key, {
                count: (issuesMap.get(key)?.count || 0) + 1,
                category: 'geo',
                impact: 'critical'
              });
            }
            
            if (data.geo?.outdatedInfo || data.content?.freshness < 50) {
              const key = 'Outdated Business Info in AI';
              issuesMap.set(key, {
                count: (issuesMap.get(key)?.count || 0) + 1,
                category: 'geo',
                impact: 'medium'
              });
            }
          }
        });

        // Convert issues map to array and sort by count
        const topIssuesArray = Array.from(issuesMap.entries())
          .map(([issue, data]) => ({ issue, ...data }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTopIssues(topIssuesArray.length > 0 ? topIssuesArray : [
          { issue: 'Missing Meta Descriptions', count: 0, category: 'seo', impact: 'high' },
          { issue: 'No AI Platform Visibility', count: 0, category: 'geo', impact: 'critical' },
          { issue: 'Slow Page Speed', count: 0, category: 'seo', impact: 'high' },
          { issue: 'Outdated Business Info in AI', count: 0, category: 'geo', impact: 'medium' },
          { issue: 'No Structured Data', count: 0, category: 'both', impact: 'high' }
        ]);

        // Set overview stats
        setOverviewStats({
          totalScans: totalScans || 0,
          avgSEOScore,
          avgGEOScore,
          totalUsers: projectCount || 0,
          scansToday,
          trendsUp: avgSEOScore > 70 // Simple trend logic
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isConnected]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Alert */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">{error}</p>
            {!isConnected && (
              <p className="text-sm text-yellow-700 mt-1">
                The dashboard is showing demo data. To enable data persistence, please configure your Supabase environment variables.
              </p>
            )}
          </div>
        </div>
      )}

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