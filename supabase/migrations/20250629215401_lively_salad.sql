/*
  # Create analyses table

  1. New Tables
    - `analyses`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `overall_score` (integer, 0-100)
      - `geo_score` (integer, 0-100)
      - `ai_score` (integer, 0-100)
      - `technical_score` (integer, 0-100)
      - `content_score` (integer, 0-100)
      - `citation_score` (integer, 0-100)
      - `schema_score` (integer, 0-100)
      - `market_position` (integer, competitor rank)
      - `total_competitors` (integer, default 0)
      - `estimated_roi` (integer, default 0)
      - `analysis_data` (jsonb, stores detailed analysis results)
      - `created_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `analyses` table
    - Add policy for authenticated users to access analyses for their projects
*/

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

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX IF NOT EXISTS analyses_project_id_idx ON analyses(project_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_overall_score_idx ON analyses(overall_score DESC);