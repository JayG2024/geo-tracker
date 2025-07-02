export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          client_name: string
          website_url: string
          notes: string | null
          status: 'active' | 'completed' | 'pending'
          created_at: string
          last_analyzed: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          client_name: string
          website_url: string
          notes?: string | null
          status?: 'active' | 'completed' | 'pending'
          created_at?: string
          last_analyzed?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          client_name?: string
          website_url?: string
          notes?: string | null
          status?: 'active' | 'completed' | 'pending'
          created_at?: string
          last_analyzed?: string | null
          user_id?: string | null
        }
      }
      analyses: {
        Row: {
          id: string
          project_id: string
          overall_score: number
          geo_score: number
          ai_score: number
          technical_score: number
          content_score: number
          citation_score: number
          schema_score: number
          market_position: number
          total_competitors: number
          estimated_roi: number
          analysis_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          overall_score: number
          geo_score?: number
          ai_score?: number
          technical_score?: number
          content_score?: number
          citation_score?: number
          schema_score?: number
          market_position?: number
          total_competitors?: number
          estimated_roi?: number
          analysis_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          overall_score?: number
          geo_score?: number
          ai_score?: number
          technical_score?: number
          content_score?: number
          citation_score?: number
          schema_score?: number
          market_position?: number
          total_competitors?: number
          estimated_roi?: number
          analysis_data?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}