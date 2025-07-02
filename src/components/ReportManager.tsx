import React, { useState, useEffect } from 'react';
import { Share2, Download, Eye, Trash2, Settings, Calendar, Lock, Unlock, Copy, ExternalLink } from 'lucide-react';
import { reportService } from '../services/reportService';
import { ShareableReport } from '../types/reports';
import { format, differenceInDays } from 'date-fns';

interface ReportManagerProps {
  onCreateReport?: () => void;
}

const ReportManager: React.FC<ReportManagerProps> = ({ onCreateReport }) => {
  const [reports, setReports] = useState<ShareableReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ShareableReport | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      console.log('Loading reports...');
      
      const allReports = reportService.getAllReports();
      console.log('Raw reports:', allReports);
      
      const reportsList = Object.values(allReports).map(report => ({
        ...report,
        // Ensure dates are properly parsed
        createdAt: typeof report.createdAt === 'string' ? new Date(report.createdAt) : report.createdAt,
        expiresAt: report.expiresAt ? (typeof report.expiresAt === 'string' ? new Date(report.expiresAt) : report.expiresAt) : undefined,
        analytics: {
          ...report.analytics,
          lastViewed: report.analytics.lastViewed ? 
            (typeof report.analytics.lastViewed === 'string' ? new Date(report.analytics.lastViewed) : report.analytics.lastViewed) : 
            undefined
        }
      })).sort((a, b) => {
        // Safe date comparison
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Most recent first
      });
      
      console.log('Processed reports:', reportsList);
      setReports(reportsList);
    } catch (error) {
      console.error('Error loading reports:', error);
      // Set empty array on error to prevent infinite loading
      setReports([]);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        await reportService.deleteReport(reportId);
        await loadReports(); // Reload the list
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report. Please try again.');
      }
    }
  };

  const handleCopyLink = async (reportId: string) => {
    try {
      setCopyingId(reportId);
      const url = reportService.generateShareableURL(reportId);
      await navigator.clipboard.writeText(url);
      
      // Show success feedback
      setTimeout(() => {
        setCopyingId(null);
      }, 1000);
      
      // Optional: Show toast or success message instead of alert
      // You could use a toast library here
      console.log('Link copied successfully');
    } catch (error) {
      console.error('Failed to copy link:', error);
      setCopyingId(null);
      
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = reportService.generateShareableURL(reportId);
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Link copied using fallback method');
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        alert('Failed to copy link. Please manually copy the URL from the report settings.');
      }
    }
  };

  const handleOpenReport = (reportId: string) => {
    const url = reportService.generateShareableURL(reportId);
    window.open(url, '_blank');
  };

  const getStatusBadge = (report: ShareableReport) => {
    const now = new Date();
    const isExpired = report.expiresAt && new Date(report.expiresAt) < now;
    
    if (isExpired) {
      return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">Expired</span>;
    }
    
    if (report.password) {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Protected</span>;
    }
    
    return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Active</span>;
  };

  const getExpiryInfo = (report: ShareableReport) => {
    if (!report.expiresAt) return 'Never expires';
    
    const daysUntilExpiry = differenceInDays(new Date(report.expiresAt), new Date());
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return 'Expires tomorrow';
    return `Expires in ${daysUntilExpiry} days`;
  };

  // Enhanced loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-r-4 border-purple-600 animate-pulse mx-auto"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Reports</h3>
          <p className="text-gray-600">Retrieving your shared reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="px-6 py-8 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Enhanced Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl mb-6 shadow-xl">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Report Manager</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create, manage and share your professional analysis reports with clients
            </p>
            
            {onCreateReport && (
              <button
                onClick={onCreateReport}
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Create New Report
              </button>
            )}
          </div>

          {/* Reports List */}
          {reports.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
                <Share2 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No shared reports yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first professional report to share with clients and track engagement
              </p>
              {onCreateReport && (
                <button
                  onClick={onCreateReport}
                  className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Create Your First Report
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Reports</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{reports.length}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <Share2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Views</p>
                      <p className="text-3xl font-bold text-green-600 mt-1">
                        {reports.reduce((sum, r) => sum + r.analytics.views, 0)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl">
                      <Eye className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Unique Visitors</p>
                      <p className="text-3xl font-bold text-purple-600 mt-1">
                        {new Set(reports.flatMap(r => r.analytics.uniqueVisitors)).size}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-xl">
                      👥
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Active Reports</p>
                      <p className="text-3xl font-bold text-orange-600 mt-1">
                        {reports.filter(r => !r.expiresAt || new Date(r.expiresAt) > new Date()).length}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-xl">
                      📊
                    </div>
                  </div>
                </div>
              </div>

              {/* Reports Table */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Report</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Analytics</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Created</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Expires</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report, index) => (
                        <tr key={report.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/50'}`}>
                          <td className="py-4 px-6">
                            <div>
                              <div className="font-semibold text-gray-900">{report.clientName}</div>
                              <div className="text-sm text-gray-600 break-all">{report.websiteUrl}</div>
                              <div className="text-xs text-gray-500 mt-1 font-mono">ID: {report.id}</div>
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(report)}
                              {report.password && <Lock className="w-4 h-4 text-gray-400" />}
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <div className="flex items-center text-gray-900 font-medium">
                                <Eye className="w-4 h-4 mr-1" />
                                {report.analytics.views} views
                              </div>
                              <div className="text-gray-600">
                                {report.analytics.uniqueVisitors.length} unique visitors
                              </div>
                              {report.analytics.lastViewed && (
                                <div className="text-gray-500 text-xs">
                                  Last viewed: {format(new Date(report.analytics.lastViewed), 'MMM dd, yyyy')}
                                </div>
                              )}
                            </div>
                          </td>
                          
                          <td className="py-4 px-6 text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                            </div>
                          </td>
                          
                          <td className="py-4 px-6 text-gray-600">
                            <div className="text-sm">
                              {getExpiryInfo(report)}
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleOpenReport(report.id)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Open Report"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleCopyLink(report.id)}
                                disabled={copyingId === report.id}
                                className={`p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors ${
                                  copyingId === report.id ? 'animate-pulse bg-green-50 text-green-600' : ''
                                }`}
                                title="Copy Link"
                              >
                                {copyingId === report.id ? (
                                  <div className="w-4 h-4 animate-spin border-2 border-green-600 border-t-transparent rounded-full"></div>
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => {
                                  setSelectedReport(report);
                                  setShowSettings(true);
                                }}
                                className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Settings"
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteReport(report.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Settings Modal */}
          {showSettings && selectedReport && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Report Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-8">
                  {/* Basic Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Report Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 font-medium">Report ID:</span>
                        <p className="font-mono text-gray-900 mt-1 bg-white px-2 py-1 rounded">{selectedReport.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Created:</span>
                        <p className="text-gray-900 mt-1">{format(new Date(selectedReport.createdAt), 'PPpp')}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Client:</span>
                        <p className="text-gray-900 mt-1 font-semibold">{selectedReport.clientName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Website:</span>
                        <p className="text-gray-900 mt-1 break-all">{selectedReport.websiteUrl}</p>
                      </div>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Analytics Overview</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900">{selectedReport.analytics.views}</div>
                        <div className="text-sm text-gray-600">Total Views</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900">{selectedReport.analytics.uniqueVisitors.length}</div>
                        <div className="text-sm text-gray-600">Unique Visitors</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900">{selectedReport.analytics.referrers.length}</div>
                        <div className="text-sm text-gray-600">Referrer Sources</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900">{selectedReport.analytics.devices.length}</div>
                        <div className="text-sm text-gray-600">Device Types</div>
                      </div>
                    </div>
                    {selectedReport.analytics.lastViewed && (
                      <div className="mt-4 text-center">
                        <span className="text-gray-600 font-medium">Last Viewed:</span>
                        <span className="text-gray-900 ml-2">{format(new Date(selectedReport.analytics.lastViewed), 'PPpp')}</span>
                      </div>
                    )}
                  </div>

                  {/* Share URL */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Share URL</h4>
                    <div className="flex">
                      <input
                        type="text"
                        value={reportService.generateShareableURL(selectedReport.id)}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl bg-white text-sm font-mono"
                      />
                      <button
                        onClick={() => handleCopyLink(selectedReport.id)}
                        disabled={copyingId === selectedReport.id}
                        className="px-6 py-3 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors font-medium"
                      >
                        {copyingId === selectedReport.id ? 'Copying...' : 'Copy'}
                      </button>
                    </div>
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

export default ReportManager;