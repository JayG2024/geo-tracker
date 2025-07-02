export interface ShareableReport {
  id: string;
  analysisId: string;
  clientName: string;
  websiteUrl: string;
  createdAt: Date;
  expiresAt?: Date;
  isPublic: boolean;
  password?: string;
  customBranding?: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
  };
  analytics: {
    views: number;
    uniqueVisitors: string[];
    lastViewed?: Date;
    referrers: { source: string; count: number }[];
    devices: { type: string; count: number }[];
    locations: { country: string; count: number }[];
  };
  shareSettings: {
    allowDownload: boolean;
    allowSharing: boolean;
    trackAnalytics: boolean;
    requireContact: boolean;
  };
}

export interface ReportAnalytics {
  reportId: string;
  sessionId: string;
  timestamp: Date;
  userAgent: string;
  referrer: string;
  ipAddress?: string;
  device: 'desktop' | 'mobile' | 'tablet';
  location?: {
    country: string;
    city: string;
  };
  actions: {
    viewed: boolean;
    downloaded: boolean;
    shared: boolean;
    timeSpent: number;
  };
}

export interface SocialShareData {
  url: string;
  title: string;
  description: string;
  image?: string;
  hashtags?: string[];
}