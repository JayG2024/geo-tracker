import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, MapPin, Search, Target, Award, Users, Loader, AlertCircle, Calendar, Filter, Eye, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';
import { dashboardService, analysisService } from '../services/database';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Load data on component mount
  React.useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, analysesData, analyticsResult] = await Promise.all([
          dashboardService.getStats(),
          analysisService.getLatest(),
          dashboardService.getAnalytics(selectedTimeRange)
        ]);
        
        setStats(statsData);
        setRecentAnalyses(analysesData);
        setAnalyticsData(analyticsResult);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedTimeRange]);

  // Process data for charts
  const processedAnalytics = React.useMemo(() => {
    if (!analyticsData) return { trends: [], scoreDistribution: [], topPerformers: [] };

    const trends = analyticsData.trends || [];
    const scoreDistribution = [
      { name: 'Excellent (80-100)', value: analyticsData.scoreRanges?.excellent || 0, color: '#10b981' },
      { name: 'Good (60-79)', value: analyticsData.scoreRanges?.good || 0, color: '#3b82f6' },
      { name: 'Needs Work (40-59)', value: analyticsData.scoreRanges?.needsWork || 0, color: '#f59e0b' },
      { name: 'Poor (0-39)', value: analyticsData.scoreRanges?.poor || 0, color: '#ef4444' }
    ];

    return {
      trends,
      scoreDistribution,
      topPerformers: analyticsData.topPerformers || []
    };
  }, [analyticsData]);

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

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <div className="w-4 h-4"></div>;
  };

  // Loading component
  const LoadingCard = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">GEO TRACKING DASHBOARD</h1>
            <p className="text-blue-100 text-lg">Real-time Analysis Performance Metrics</p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-blue-200 text-sm">Connected to Supabase Database</span>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="12m">Last 12 Months</option>
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="overall">Overall Scores</option>
              <option value="geo">GEO Scores Only</option>
              <option value="ai">AI Scores Only</option>
              <option value="technical">Technical Scores</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : stats ? (
          <>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Analyses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalAnalyses}</p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(stats.analysisTrend || 0)}
                    <span className={`text-sm ml-1 ${stats.analysisTrend > 0 ? 'text-green-600' : stats.analysisTrend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {stats.thisMonthAnalyses} this month
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Average Score</p>
                  <p className={`text-3xl font-bold mt-1 ${getScoreColor(stats.averageScore)}`}>
                    {stats.averageScore}/100
                  </p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(stats.scoreTrend || 0)}
                    <span className={`text-sm ml-1 ${stats.scoreTrend > 0 ? 'text-green-600' : stats.scoreTrend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      +{stats.scoreTrend || 0}% vs last period
                    </span>
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeProjects}</p>
                  <div className="flex items-center mt-2">
                    <Users className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 text-sm">
                      {stats.totalProjects} total projects
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Est. Total ROI</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    ${stats.totalEstimatedROI ? (stats.totalEstimatedROI / 1000).toFixed(0) : '0'}K
                  </p>
                  <div className="flex items-center mt-2">
                    <Award className="w-4 h-4 text-orange-600 mr-1" />
                    <span className="text-orange-600 text-sm">
                      Across all projects
                    </span>
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        )}
      </div>

      {/* Score Categories Breakdown */}
      {!loading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">GEO Score</span>
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(stats.averageGeoScore || 0)}`}>
              {stats.averageGeoScore || 0}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">AI Score</span>
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(stats.averageAiScore || 0)}`}>
              {stats.averageAiScore || 0}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Technical</span>
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(stats.averageTechnicalScore || 0)}`}>
              {stats.averageTechnicalScore || 0}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Content</span>
              <Search className="w-4 h-4 text-orange-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(stats.averageContentScore || 0)}`}>
              {stats.averageContentScore || 0}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Citation</span>
              <Award className="w-4 h-4 text-yellow-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(stats.averageCitationScore || 0)}`}>
              {stats.averageCitationScore || 0}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Schema</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(stats.averageSchemaScore || 0)}`}>
              {stats.averageSchemaScore || 0}
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Score Trends Over Time</h3>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={processedAnalytics.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="averageScore" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                {selectedMetric === 'overall' && (
                  <>
                    <Area type="monotone" dataKey="geoScore" stroke="#10b981" fill="transparent" strokeWidth={1} />
                    <Area type="monotone" dataKey="aiScore" stroke="#f59e0b" fill="transparent" strokeWidth={1} />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Score Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processedAnalytics.scoreDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {processedAnalytics.scoreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {processedAnalytics.scoreDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Projects */}
      {processedAnalytics.topPerformers.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedAnalytics.topPerformers.map((project, index) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <h4 className="font-medium text-gray-900 truncate">{project.clientName}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadge(project.score)}`}>
                    {project.score}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mb-2">{project.websiteUrl}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Last analyzed: {format(new Date(project.lastAnalyzed), 'MMM dd')}</span>
                  <span className="text-green-600">ROI: ${(project.estimatedROI / 1000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Analysis Results */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Recent Analysis Results</h3>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Live Database Data</span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading recent analyses...</span>
          </div>
        ) : recentAnalyses && recentAnalyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Website</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Overall</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">GEO</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">AI</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Technical</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Est. ROI</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 truncate max-w-xs">
                        {analysis.url}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-12 h-2 bg-gray-200 rounded-full mr-3">
                          <div 
                            className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            style={{ width: `${analysis.overallScore}%` }}
                          ></div>
                        </div>
                        <span className={`font-semibold ${getScoreColor(analysis.overallScore)}`}>
                          {analysis.overallScore}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${getScoreColor(analysis.geoVisibilityScore)}`}>
                        {analysis.geoVisibilityScore}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${getScoreColor(analysis.aiSearchScore)}`}>
                        {analysis.aiSearchScore}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${getScoreColor(analysis.technicalSeoScore)}`}>
                        {analysis.technicalSeoScore}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-green-600 font-medium">
                      ${(analysis.estimatedROI / 1000).toFixed(0)}K
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {format(analysis.timestamp, 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h4>
            <p className="text-gray-500">Start by analyzing your first website to see results here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;