/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `client_name` (text, required)
      - `website_url` (text, required, unique)
      - `notes` (text, optional)
      - `status` (text, required, default 'pending')
      - `created_at` (timestamp with timezone, default now)
      - `last_analyzed` (timestamp with timezone, nullable)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `projects` table
    - Add policy for authenticated users to manage their own projects
*/

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

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);