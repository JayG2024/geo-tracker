/*
  # Complete Database Setup Script
  
  This script will:
  1. Drop existing tables if they exist (with CASCADE to handle dependencies)
  2. Recreate projects table with all required columns and security
  3. Recreate analyses table with all required columns and security
  4. Set up proper indexes and policies
  
  IMPORTANT: This will delete all existing data in projects and analyses tables!
*/

-- Step 1: Drop existing tables (if they exist)
DROP TABLE IF EXISTS public.analyses CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;

-- Step 2: Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  website_url text NOT NULL UNIQUE,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'completed', 'pending')),
  created_at timestamptz DEFAULT now(),
  last_analyzed timestamptz,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid()
);

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for projects
CREATE POLICY "Users can manage their own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for projects
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);

-- Step 3: Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  geo_score integer NOT NULL DEFAULT 0 CHECK (geo_score >= 0 AND geo_score <= 100),
  ai_score integer NOT NULL DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
  technical_score integer NOT NULL DEFAULT 0 CHECK (technical_score >= 0 AND technical_score <= 100),
  content_score integer NOT NULL DEFAULT 0 CHECK (content_score >= 0 AND content_score <= 100),
  citation_score integer NOT NULL DEFAULT 0 CHECK (citation_score >= 0 AND citation_score <= 100),
  schema_score integer NOT NULL DEFAULT 0 CHECK (schema_score >= 0 AND schema_score <= 100),
  market_position integer NOT NULL DEFAULT 1,
  total_competitors integer NOT NULL DEFAULT 0,
  estimated_roi integer NOT NULL DEFAULT 0,
  analysis_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on analyses table
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for analyses
CREATE POLICY "Users can access analyses for their own projects"
  ON analyses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analyses.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analyses.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create indexes for analyses
CREATE INDEX IF NOT EXISTS analyses_project_id_idx ON analyses(project_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_overall_score_idx ON analyses(overall_score DESC);

-- Step 4: Verify tables were created correctly
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('projects', 'analyses');