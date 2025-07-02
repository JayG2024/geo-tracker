-- GEO Tracker Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business', 'enterprise')),
  scans_remaining INTEGER DEFAULT 999,
  scans_reset_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Websites table
CREATE TABLE public.websites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  title TEXT,
  is_active BOOLEAN DEFAULT true,
  last_scan_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, url)
);

-- Analyses table
CREATE TABLE public.analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  geo_score INTEGER CHECK (geo_score >= 0 AND geo_score <= 100),
  
  -- SEO Metrics
  seo_metrics JSONB DEFAULT '{}',
  
  -- GEO Metrics
  geo_metrics JSONB DEFAULT '{}',
  
  -- Recommendations
  recommendations JSONB DEFAULT '[]',
  
  -- Competitor data
  competitor_comparison JSONB DEFAULT '[]',
  
  -- API usage tracking
  apis_used JSONB DEFAULT '{}',
  api_credits_used INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table (shareable reports)
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  share_id TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 12),
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  password_protected BOOLEAN DEFAULT false,
  password_hash TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Usage table (track API calls)
CREATE TABLE public.api_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  api_name TEXT NOT NULL,
  endpoint TEXT,
  credits_used INTEGER DEFAULT 1,
  response_time_ms INTEGER,
  status_code INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'business', 'enterprise')),
  price_monthly DECIMAL(10, 2),
  price_yearly DECIMAL(10, 2),
  scans_per_month INTEGER,
  websites_limit INTEGER,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, tier, price_monthly, price_yearly, scans_per_month, websites_limit, features) VALUES
('Free', 'free', 0, 0, 4, 1, '{"pdf_reports": false, "api_access": false, "white_label": false, "priority_support": false}'),
('Pro', 'pro', 49, 490, 100, 10, '{"pdf_reports": true, "api_access": false, "white_label": false, "priority_support": false}'),
('Business', 'business', 99, 990, -1, -1, '{"pdf_reports": true, "api_access": true, "white_label": true, "priority_support": true}'),
('Enterprise', 'enterprise', 299, 2990, -1, -1, '{"pdf_reports": true, "api_access": true, "white_label": true, "priority_support": true, "custom_domain": true}');

-- Create indexes for performance
CREATE INDEX idx_websites_user_id ON public.websites(user_id);
CREATE INDEX idx_analyses_website_id ON public.analyses(website_id);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX idx_reports_share_id ON public.reports(share_id);
CREATE INDEX idx_api_usage_user_id_created_at ON public.api_usage(user_id, created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Websites policies
CREATE POLICY "Users can view own websites" ON public.websites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own websites" ON public.websites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own websites" ON public.websites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own websites" ON public.websites
  FOR DELETE USING (auth.uid() = user_id);

-- Analyses policies
CREATE POLICY "Users can view own analyses" ON public.analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analyses" ON public.analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view public reports" ON public.reports
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create own reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" ON public.reports
  FOR UPDATE USING (auth.uid() = user_id);

-- API usage policies
CREATE POLICY "Users can view own API usage" ON public.api_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own API usage" ON public.api_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_websites_updated_at BEFORE UPDATE ON public.websites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to reset free tier scans weekly
CREATE OR REPLACE FUNCTION public.reset_free_tier_scans()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET scans_remaining = 4,
      scans_reset_date = NOW() + INTERVAL '7 days'
  WHERE subscription_tier = 'free'
  AND scans_reset_date <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to reset scans weekly (requires pg_cron extension)
-- SELECT cron.schedule('reset-free-scans', '0 0 * * 1', 'SELECT public.reset_free_tier_scans();');