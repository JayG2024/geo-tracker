# GeoTest.ai Supabase Configuration

## Project Details
- **Project URL**: https://zajnlrstukcudampxddz.supabase.co
- **Purpose**: GeoTest.ai dedicated database (NOT shared with app-suite)

## Migration Files
- `001_initial_schema.sql` - Complete database setup for multi-tenant SaaS

## How to Run Migrations
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy contents of migration files
4. Run in order (001, 002, etc.)

## Security Notes
- Only use ANON key in frontend (never service key)
- RLS policies ensure users only see their own data
- Each user's projects and analyses are isolated

## Database Schema
- **profiles** - User metadata and subscription info
- **projects** - Websites being tracked
- **analyses** - SEO/GEO test results  
- **reports** - Shareable report links

Created: 2025-07-10