import { ShareableReport, ReportAnalytics, SocialShareData } from '../types/reports';
import { AnalysisResult } from '../types';

class ReportService {
  private readonly STORAGE_KEY = 'shareable_reports';
  private readonly ANALYTICS_KEY = 'report_analytics';

  // Generate unique report ID
  generateReportId(): string {
    return `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create shareable report
  async createShareableReport(
    analysis: AnalysisResult,
    options: {
      clientName?: string;
      expiresInDays?: number;
      password?: string;
      customBranding?: ShareableReport['customBranding'];
      shareSettings?: Partial<ShareableReport['shareSettings']>;
    } = {}
  ): Promise<ShareableReport> {
    const reportId = this.generateReportId();
    const now = new Date();
    const expiresAt = options.expiresInDays 
      ? new Date(now.getTime() + options.expiresInDays * 24 * 60 * 60 * 1000)
      : undefined;

    const report: ShareableReport = {
      id: reportId,
      analysisId: analysis.id,
      clientName: options.clientName || `Analysis for ${analysis.url}`,
      websiteUrl: analysis.url,
      createdAt: now,
      expiresAt,
      isPublic: !options.password,
      password: options.password,
      customBranding: options.customBranding || {
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        companyName: 'GEO Tracking Analysis'
      },
      analytics: {
        views: 0,
        uniqueVisitors: [],
        referrers: [],
        devices: [],
        locations: []
      },
      shareSettings: {
        allowDownload: true,
        allowSharing: true,
        trackAnalytics: true,
        requireContact: false,
        ...options.shareSettings
      }
    };

    // Store report
    const reports = this.getAllReports();
    reports[reportId] = report;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));

    return report;
  }

  // Get report by ID
  async getReport(reportId: string): Promise<ShareableReport | null> {
    const reports = this.getAllReports();
    const report = reports[reportId];

    if (!report) return null;

    // Check if expired
    if (report.expiresAt && new Date() > new Date(report.expiresAt)) {
      return null;
    }

    return report;
  }

  // Track report view
  async trackReportView(reportId: string, analytics: Partial<ReportAnalytics>): Promise<void> {
    const report = await this.getReport(reportId);
    if (!report || !report.shareSettings.trackAnalytics) return;

    // Update report analytics
    const sessionId = this.getSessionId();
    const isNewVisitor = !report.analytics.uniqueVisitors.includes(sessionId);

    report.analytics.views += 1;
    if (isNewVisitor) {
      report.analytics.uniqueVisitors.push(sessionId);
    }
    report.analytics.lastViewed = new Date();

    // Track referrer
    if (analytics.referrer) {
      const existingReferrer = report.analytics.referrers.find(r => r.source === analytics.referrer);
      if (existingReferrer) {
        existingReferrer.count += 1;
      } else {
        report.analytics.referrers.push({ source: analytics.referrer || 'direct', count: 1 });
      }
    }

    // Track device
    if (analytics.device) {
      const existingDevice = report.analytics.devices.find(d => d.type === analytics.device);
      if (existingDevice) {
        existingDevice.count += 1;
      } else {
        report.analytics.devices.push({ type: analytics.device, count: 1 });
      }
    }

    // Update stored report
    const reports = this.getAllReports();
    reports[reportId] = report;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));

    // Store detailed analytics
    const detailedAnalytics: ReportAnalytics = {
      reportId,
      sessionId,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      device: this.detectDevice(),
      actions: {
        viewed: true,
        downloaded: false,
        shared: false,
        timeSpent: 0
      },
      ...analytics
    };

    this.storeAnalytics(detailedAnalytics);
  }

  // Get all reports (for dashboard)
  getAllReports(): Record<string, ShareableReport> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  // Get report analytics
  getReportAnalytics(reportId: string): ReportAnalytics[] {
    try {
      const stored = localStorage.getItem(this.ANALYTICS_KEY);
      const allAnalytics: ReportAnalytics[] = stored ? JSON.parse(stored) : [];
      return allAnalytics.filter(a => a.reportId === reportId);
    } catch {
      return [];
    }
  }

  // Generate shareable URL
  generateShareableURL(reportId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/report/${reportId}`;
  }

  // Generate social share data
  generateSocialShareData(report: ShareableReport): SocialShareData {
    const url = this.generateShareableURL(report.id);
    
    return {
      url,
      title: `${report.clientName} - GEO Analysis Report`,
      description: `Comprehensive GEO and AI analysis report for ${report.websiteUrl}. Professional insights and actionable recommendations.`,
      image: `${window.location.origin}/api/og-image/${report.id}`, // Would generate OG image
      hashtags: ['SEO', 'GEOAnalysis', 'DigitalMarketing', 'WebAnalysis']
    };
  }

  // Delete report
  async deleteReport(reportId: string): Promise<boolean> {
    const reports = this.getAllReports();
    if (!reports[reportId]) return false;

    delete reports[reportId];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));

    // Clean up analytics
    const analytics = this.getReportAnalytics(reportId);
    const allAnalytics = this.getAllAnalytics();
    const filteredAnalytics = allAnalytics.filter(a => a.reportId !== reportId);
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(filteredAnalytics));

    return true;
  }

  // Private helper methods
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('report_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('report_session_id', sessionId);
    }
    return sessionId;
  }

  private detectDevice(): 'desktop' | 'mobile' | 'tablet' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private storeAnalytics(analytics: ReportAnalytics): void {
    try {
      const allAnalytics = this.getAllAnalytics();
      allAnalytics.push(analytics);
      
      // Keep only last 1000 analytics records
      const trimmed = allAnalytics.slice(-1000);
      localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to store analytics:', error);
    }
  }

  private getAllAnalytics(): ReportAnalytics[] {
    try {
      const stored = localStorage.getItem(this.ANALYTICS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Utility methods for external use
  async validateReportAccess(reportId: string, password?: string): Promise<boolean> {
    const report = await this.getReport(reportId);
    if (!report) return false;

    if (report.password && report.password !== password) {
      return false;
    }

    return true;
  }

  async updateReportSettings(reportId: string, updates: Partial<ShareableReport>): Promise<ShareableReport | null> {
    const reports = this.getAllReports();
    const report = reports[reportId];
    
    if (!report) return null;

    Object.assign(report, updates);
    reports[reportId] = report;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));

    return report;
  }
}

export const reportService = new ReportService();