import { supabase, isSupabaseConnected } from '../lib/supabase';
import { Project, AnalysisResult } from '../types';

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class UniqueConstraintError extends DatabaseError {
  constructor(message: string, public originalError?: any) {
    super(message, originalError);
    this.name = 'UniqueConstraintError';
  }
}

// Check if database is available
const checkDatabaseConnection = async () => {
  const isConnected = await isSupabaseConnected();
  if (!isConnected) {
    throw new DatabaseError('Database is disconnected or API key is invalid. Using mock data instead.');
  }
};

// Project Operations
export const projectService = {
  async getAll(): Promise<Project[]> {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      console.warn('Database unavailable, returning empty projects list:', error);
      return [];
    }
    
    try {
      const { data, error } = await supabase!
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new DatabaseError('Failed to fetch projects', error);

      return data.map(row => ({
        id: row.id,
        clientName: row.client_name,
        websiteUrl: row.website_url,
        notes: row.notes || '',
        status: row.status as Project['status'],
        createdAt: new Date(row.created_at),
        lastAnalyzed: row.last_analyzed ? new Date(row.last_analyzed) : new Date(),
        analysisResults: [] // Will be loaded separately if needed
      }));
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching projects', error);
    }
  },

  async getByWebsiteUrl(websiteUrl: string): Promise<Project | null> {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      console.warn('Database unavailable for URL lookup:', error);
      return null;
    }
    
    try {
      const { data, error } = await supabase!
        .from('projects')
        .select('*')
        .eq('website_url', websiteUrl)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw new DatabaseError('Failed to fetch project by URL', error);
      }

      return {
        id: data.id,
        clientName: data.client_name,
        websiteUrl: data.website_url,
        notes: data.notes || '',
        status: data.status as Project['status'],
        createdAt: new Date(data.created_at),
        lastAnalyzed: data.last_analyzed ? new Date(data.last_analyzed) : new Date(),
        analysisResults: []
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching project by URL', error);
    }
  },

  async create(project: Omit<Project, 'id' | 'createdAt' | 'lastAnalyzed' | 'analysisResults'>): Promise<Project> {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      console.warn('Database unavailable for project creation, creating mock project:', error);
      // Return a mock project when database is unavailable
      return {
        id: `mock-${Date.now()}`,
        clientName: project.clientName,
        websiteUrl: project.websiteUrl,
        notes: project.notes,
        status: project.status,
        createdAt: new Date(),
        lastAnalyzed: new Date(),
        analysisResults: []
      };
    }
    
    try {
      const { data, error } = await supabase!
        .from('projects')
        .insert({
          client_name: project.clientName,
          website_url: project.websiteUrl,
          notes: project.notes,
          status: project.status
        })
        .select()
        .single();

      if (error) {
        // Check for unique constraint violation (duplicate URL)
        if (error.code === '23505' && error.message.includes('website_url')) {
          throw new UniqueConstraintError('A project with this website URL already exists', error);
        }
        throw new DatabaseError('Failed to create project', error);
      }

      return {
        id: data.id,
        clientName: data.client_name,
        websiteUrl: data.website_url,
        notes: data.notes || '',
        status: data.status as Project['status'],
        createdAt: new Date(data.created_at),
        lastAnalyzed: data.last_analyzed ? new Date(data.last_analyzed) : new Date(),
        analysisResults: []
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error creating project', error);
    }
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      throw new DatabaseError('Database unavailable for project update', error);
    }
    
    try {
      const updateData: any = {};
      if (updates.clientName) updateData.client_name = updates.clientName;
      if (updates.websiteUrl) updateData.website_url = updates.websiteUrl;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.status) updateData.status = updates.status;
      if (updates.lastAnalyzed) updateData.last_analyzed = updates.lastAnalyzed.toISOString();

      const { data, error } = await supabase!
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new DatabaseError('Failed to update project', error);

      return {
        id: data.id,
        clientName: data.client_name,
        websiteUrl: data.website_url,
        notes: data.notes || '',
        status: data.status as Project['status'],
        createdAt: new Date(data.created_at),
        lastAnalyzed: data.last_analyzed ? new Date(data.last_analyzed) : new Date(),
        analysisResults: []
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error updating project', error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      throw new DatabaseError('Database unavailable for project deletion', error);
    }
    
    try {
      const { error } = await supabase!
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw new DatabaseError('Failed to delete project', error);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error deleting project', error);
    }
  }
};

// Analysis Operations
export const analysisService = {
  async create(projectId: string, url: string, analysisData: any): Promise<AnalysisResult> {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      console.warn('Database unavailable for analysis creation:', error);
      throw new DatabaseError('Cannot save analysis - database unavailable', error);
    }
    
    try {
      // Use the actual analysis data passed in
      
      // Store actual analysis data in database
      const { data, error } = await supabase!
        .from('analyses')
        .insert({
          project_id: projectId,
          overall_score: analysisData.overallScore || 0,
          geo_score: analysisData.geo?.score || 0,
          ai_score: analysisData.geo?.aiVisibility?.score || 0,
          technical_score: analysisData.seo?.technical?.score || 0,
          content_score: analysisData.seo?.content?.score || 0,
          citation_score: analysisData.geo?.citations?.score || 0,
          schema_score: analysisData.seo?.structuredData?.score || 0,
          market_position: analysisData.competitorComparison?.position || 0,
          total_competitors: analysisData.competitorComparison?.totalCompetitors || 0,
          estimated_roi: 0, // Remove hard-coded ROI projections
          analysis_data: {
            // Store the full analysis data
            seo: analysisData.seo,
            geo: analysisData.geo,
            recommendations: analysisData.recommendations || [],
            competitorComparison: analysisData.competitorComparison || {},
            url: analysisData.url,
            title: analysisData.title,
            timestamp: analysisData.timestamp
          }
        })
        .select()
        .single();

      if (error) throw new DatabaseError('Failed to save analysis', error);

      // Update project's last_analyzed timestamp
      await supabase!
        .from('projects')
        .update({ last_analyzed: new Date().toISOString() })
        .eq('id', projectId);

      // Return the actual analysis result
      return {
        ...analysisData,
        id: data.id,
        timestamp: new Date(data.created_at),
        // Map the saved data to expected format
        overallScore: data.overall_score,
        geoVisibilityScore: data.geo_score,
        aiSearchScore: data.ai_score,
        technicalSeoScore: data.technical_score,
        contentScore: data.content_score,
        citationScore: data.citation_score,
        schemaScore: data.schema_score,
        competitorRank: data.market_position,
        totalCompetitors: data.total_competitors,
        estimatedROI: data.estimated_roi
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error creating analysis', error);
    }
  },

  async getById(id: string): Promise<AnalysisResult | null> {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      console.warn('Database unavailable for analysis lookup:', error);
      return null;
    }
    
    try {
      const { data, error } = await supabase!
        .from('analyses')
        .select(`
          *,
          projects!inner(website_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw new DatabaseError('Failed to fetch analysis by ID', error);
      if (!data) return null;

      const analysisData = data.analysis_data as any || {};
      return {
        id: data.id,
        url: (data.projects as any).website_url,
        timestamp: new Date(data.created_at),
        overallScore: data.overall_score,
        geoVisibilityScore: data.geo_score,
        aiSearchScore: data.ai_score,
        technicalSeoScore: data.technical_score,
        contentScore: data.content_score,
        citationScore: data.citation_score,
        schemaScore: data.schema_score,
        competitorRank: data.market_position,
        totalCompetitors: data.total_competitors,
        estimatedROI: data.estimated_roi,
        recommendations: analysisData.recommendations || [],
        geographicData: analysisData.geographicData || [],
        keywordRankings: analysisData.keywordRankings || [],
        citations: analysisData.citations || [],
        competitors: analysisData.competitors || [],
        technicalIssues: analysisData.technicalIssues || [],
        geoStrategyAdvantages: analysisData.geoStrategyAdvantages || [],
        localMarketOpportunities: analysisData.localMarketOpportunities || [],
        customerBehaviorPatterns: analysisData.customerBehaviorPatterns || [],
        geoRoiProjection: analysisData.geoRoiProjection || {},
        geoSuccessMetrics: analysisData.geoSuccessMetrics || [],
        geoImplementationTimeline: analysisData.geoImplementationTimeline || [],
        geoChallengesAndSolutions: analysisData.geoChallengesAndSolutions || [],
        localCompetitorAnalysis: analysisData.localCompetitorAnalysis || {},
        geoPerformanceMetrics: analysisData.geoPerformanceMetrics || {},
        
        // NEW: GEO-specific fields
        citationWorthinessScore: analysisData.citationWorthinessScore || 0,
        eeatSignalStrengthScore: analysisData.eeatSignalStrengthScore || 0,
        structuredDataScore: analysisData.structuredDataScore || 0,
        contentDepthScore: analysisData.contentDepthScore || 0,
        topicalAuthorityScore: analysisData.topicalAuthorityScore || 0,
        analysisSummaryText: analysisData.analysisSummaryText || '',
        actionableRecommendationsText: analysisData.actionableRecommendationsText || '',
        topicalOpportunities: analysisData.topicalOpportunities || []
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching analysis by ID', error);
    }
  },

  async getByProjectId(projectId: string): Promise<AnalysisResult[]> {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      console.warn('Database unavailable for project analyses:', error);
      return [];
    }
    
    try {
      const { data, error } = await supabase!
        .from('analyses')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw new DatabaseError('Failed to fetch analyses', error);

      return data.map(row => {
        const analysisData = row.analysis_data as any || {};
        return {
          id: row.id,
          url: '', // We'll need to join with projects to get this
          timestamp: new Date(row.created_at),
          overallScore: row.overall_score,
          geoVisibilityScore: row.geo_score,
          aiSearchScore: row.ai_score,
          technicalSeoScore: row.technical_score,
          contentScore: row.content_score,
          citationScore: row.citation_score,
          schemaScore: row.schema_score,
          competitorRank: row.market_position,
          totalCompetitors: row.total_competitors,
          estimatedROI: row.estimated_roi,
          recommendations: analysisData.recommendations || [],
          geographicData: analysisData.geographicData || [],
          keywordRankings: analysisData.keywordRankings || [],
          citations: analysisData.citations || [],
          competitors: analysisData.competitors || [],
          technicalIssues: analysisData.technicalIssues || [],
          geoStrategyAdvantages: analysisData.geoStrategyAdvantages || [],
          localMarketOpportunities: analysisData.localMarketOpportunities || [],
          customerBehaviorPatterns: analysisData.customerBehaviorPatterns || [],
          geoRoiProjection: analysisData.geoRoiProjection || {},
          geoSuccessMetrics: analysisData.geoSuccessMetrics || [],
          geoImplementationTimeline: analysisData.geoImplementationTimeline || [],
          geoChallengesAndSolutions: analysisData.geoChallengesAndSolutions || [],
          localCompetitorAnalysis: analysisData.localCompetitorAnalysis || {},
          geoPerformanceMetrics: analysisData.geoPerformanceMetrics || {},
          
          // NEW: GEO-specific fields
          citationWorthinessScore: analysisData.citationWorthinessScore || 0,
          eeatSignalStrengthScore: analysisData.eeatSignalStrengthScore || 0,
          structuredDataScore: analysisData.structuredDataScore || 0,
          contentDepthScore: analysisData.contentDepthScore || 0,
          topicalAuthorityScore: analysisData.topicalAuthorityScore || 0,
          analysisSummaryText: analysisData.analysisSummaryText || '',
          actionableRecommendationsText: analysisData.actionableRecommendationsText || '',
          topicalOpportunities: analysisData.topicalOpportunities || []
        };
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching analyses', error);
    }
  },

  async getLatest(): Promise<AnalysisResult[]> {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      console.warn('Database unavailable for latest analyses:', error);
      return [];
    }
    
    try {
      const { data, error } = await supabase!
        .from('analyses')
        .select(`
          *,
          projects!inner(website_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw new DatabaseError('Failed to fetch latest analyses', error);

      return data.map(row => {
        const analysisData = row.analysis_data as any || {};
        return {
          id: row.id,
          url: (row.projects as any).website_url,
          timestamp: new Date(row.created_at),
          overallScore: row.overall_score,
          geoVisibilityScore: row.geo_score,
          aiSearchScore: row.ai_score,
          technicalSeoScore: row.technical_score,
          contentScore: row.content_score,
          citationScore: row.citation_score,
          schemaScore: row.schema_score,
          competitorRank: row.market_position,
          totalCompetitors: row.total_competitors,
          estimatedROI: row.estimated_roi,
          recommendations: analysisData.recommendations || [],
          geographicData: analysisData.geographicData || [],
          keywordRankings: analysisData.keywordRankings || [],
          citations: analysisData.citations || [],
          competitors: analysisData.competitors || [],
          technicalIssues: analysisData.technicalIssues || [],
          geoStrategyAdvantages: analysisData.geoStrategyAdvantages || [],
          localMarketOpportunities: analysisData.localMarketOpportunities || [],
          customerBehaviorPatterns: analysisData.customerBehaviorPatterns || [],
          geoRoiProjection: analysisData.geoRoiProjection || {},
          geoSuccessMetrics: analysisData.geoSuccessMetrics || [],
          geoImplementationTimeline: analysisData.geoImplementationTimeline || [],
          geoChallengesAndSolutions: analysisData.geoChallengesAndSolutions || [],
          localCompetitorAnalysis: analysisData.localCompetitorAnalysis || {},
          geoPerformanceMetrics: analysisData.geoPerformanceMetrics || {},
          
          // NEW: GEO-specific fields
          citationWorthinessScore: analysisData.citationWorthinessScore || 0,
          eeatSignalStrengthScore: analysisData.eeatSignalStrengthScore || 0,
          structuredDataScore: analysisData.structuredDataScore || 0,
          contentDepthScore: analysisData.contentDepthScore || 0,
          topicalAuthorityScore: analysisData.topicalAuthorityScore || 0,
          analysisSummaryText: analysisData.analysisSummaryText || '',
          actionableRecommendationsText: analysisData.actionableRecommendationsText || '',
          topicalOpportunities: analysisData.topicalOpportunities || []
        };
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching latest analyses', error);
    }
  }
};

// Dashboard Statistics
export const dashboardService = {
  async getStats() {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      console.warn('Database unavailable for dashboard stats, using mock data:', error);
      // Return mock stats when database is unavailable
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        pendingProjects: 0,
        totalAnalyses: 0,
        thisMonthAnalyses: 0,
        analysisTrend: 0,
        averageScore: 0,
        averageGeoScore: 0,
        averageAiScore: 0,
        averageTechnicalScore: 0,
        averageContentScore: 0,
        averageCitationScore: 0,
        averageSchemaScore: 0,
        totalEstimatedROI: 0,
        scoreTrend: 0
      };
    }
    
    try {
      const [projectsResult, analysesResult] = await Promise.all([
        supabase!.from('projects').select('id, status, created_at'),
        supabase!.from('analyses').select('overall_score, geo_score, ai_score, technical_score, content_score, citation_score, schema_score, estimated_roi, created_at')
      ]);

      if (projectsResult.error) throw new DatabaseError('Failed to fetch project stats', projectsResult.error);
      if (analysesResult.error) throw new DatabaseError('Failed to fetch analysis stats', analysesResult.error);

      const projects = projectsResult.data || [];
      const analyses = analysesResult.data || [];

      // Calculate current month analyses
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const thisMonthAnalyses = analyses.filter(a => {
        const analysisDate = new Date(a.created_at);
        return analysisDate.getMonth() === currentMonth && 
               analysisDate.getFullYear() === currentYear;
      }).length;

      // Calculate previous month for trend comparison
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastMonthAnalyses = analyses.filter(a => {
        const analysisDate = new Date(a.created_at);
        return analysisDate.getMonth() === lastMonth && 
               analysisDate.getFullYear() === lastMonthYear;
      }).length;

      const analysisTrend = lastMonthAnalyses > 0 
        ? Math.round(((thisMonthAnalyses - lastMonthAnalyses) / lastMonthAnalyses) * 100)
        : 0;

      // Calculate score averages
      const calculateAverage = (scores: number[]) => 
        scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;

      const overallScores = analyses.map(a => a.overall_score);
      const geoScores = analyses.map(a => a.geo_score);
      const aiScores = analyses.map(a => a.ai_score);
      const technicalScores = analyses.map(a => a.technical_score);
      const contentScores = analyses.map(a => a.content_score);
      const citationScores = analyses.map(a => a.citation_score);
      const schemaScores = analyses.map(a => a.schema_score);

      return {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        pendingProjects: projects.filter(p => p.status === 'pending').length,
        totalAnalyses: analyses.length,
        thisMonthAnalyses,
        analysisTrend,
        averageScore: calculateAverage(overallScores),
        averageGeoScore: calculateAverage(geoScores),
        averageAiScore: calculateAverage(aiScores),
        averageTechnicalScore: calculateAverage(technicalScores),
        averageContentScore: calculateAverage(contentScores),
        averageCitationScore: calculateAverage(citationScores),
        averageSchemaScore: calculateAverage(schemaScores),
        totalEstimatedROI: analyses.reduce((sum, a) => sum + (a.estimated_roi || 0), 0),
        scoreTrend: 0 // Could be calculated by comparing recent vs older scores
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching dashboard stats', error);
    }
  },

  async getAnalytics(timeRange: string) {
    try {
      await checkDatabaseConnection();
    } catch (error) {
      console.warn('Database unavailable for analytics, using mock data:', error);
      // Return mock analytics when database is unavailable
      return {
        trends: [],
        scoreRanges: { excellent: 0, good: 0, needsWork: 0, poor: 0 },
        topPerformers: []
      };
    }
    
    try {
      // Calculate date range
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '12m':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const [analysesResult, projectsResult] = await Promise.all([
        supabase!
          .from('analyses')
          .select('*, projects!inner(client_name, website_url)')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: true }),
        supabase!
          .from('projects')
          .select('*')
      ]);

      if (analysesResult.error) throw new DatabaseError('Failed to fetch analytics data', analysesResult.error);
      if (projectsResult.error) throw new DatabaseError('Failed to fetch projects data', projectsResult.error);

      const analyses = analysesResult.data || [];
      const projects = projectsResult.data || [];

      // Process trends data
      const trendsMap = new Map<string, any>();
      analyses.forEach(analysis => {
        const date = analysis.created_at.split('T')[0]; // Get date part only
        if (!trendsMap.has(date)) {
          trendsMap.set(date, {
            date,
            scores: [],
            geoScores: [],
            aiScores: []
          });
        }
        const dayData = trendsMap.get(date);
        dayData.scores.push(analysis.overall_score);
        dayData.geoScores.push(analysis.geo_score);
        dayData.aiScores.push(analysis.ai_score);
      });

      const trends = Array.from(trendsMap.values()).map(day => ({
        date: day.date,
        averageScore: Math.round(day.scores.reduce((sum: number, score: number) => sum + score, 0) / day.scores.length) || 0,
        geoScore: Math.round(day.geoScores.reduce((sum: number, score: number) => sum + score, 0) / day.geoScores.length) || 0,
        aiScore: Math.round(day.aiScores.reduce((sum: number, score: number) => sum + score, 0) / day.aiScores.length) || 0
      }));

      // Calculate score distribution
      const scoreRanges = {
        excellent: analyses.filter(a => a.overall_score >= 80).length,
        good: analyses.filter(a => a.overall_score >= 60 && a.overall_score < 80).length,
        needsWork: analyses.filter(a => a.overall_score >= 40 && a.overall_score < 60).length,
        poor: analyses.filter(a => a.overall_score < 40).length
      };

      const total = analyses.length || 1;
      const scoreRangesPercentage = {
        excellent: Math.round((scoreRanges.excellent / total) * 100),
        good: Math.round((scoreRanges.good / total) * 100),
        needsWork: Math.round((scoreRanges.needsWork / total) * 100),
        poor: Math.round((scoreRanges.poor / total) * 100)
      };

      // Get top performers
      const projectAnalysisMap = new Map();
      analyses.forEach(analysis => {
        const projectData = analysis.projects as any;
        if (!projectAnalysisMap.has(analysis.project_id)) {
          projectAnalysisMap.set(analysis.project_id, {
            id: analysis.project_id,
            clientName: projectData.client_name,
            websiteUrl: projectData.website_url,
            scores: [],
            estimatedROI: analysis.estimated_roi || 0,
            lastAnalyzed: analysis.created_at
          });
        }
        projectAnalysisMap.get(analysis.project_id).scores.push(analysis.overall_score);
      });

      const topPerformers = Array.from(projectAnalysisMap.values())
        .map(project => ({
          ...project,
          score: Math.round(project.scores.reduce((sum: number, score: number) => sum + score, 0) / project.scores.length)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      return {
        trends,
        scoreRanges: scoreRangesPercentage,
        topPerformers
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError('Unexpected error fetching analytics data', error);
    }
  }
};