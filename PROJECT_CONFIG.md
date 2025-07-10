# PROJECT CONFIGURATION

## Project Identity
- **Project Name**: GeoTest.ai (geo-tracker)
- **Domain**: https://geotest.ai
- **Purpose**: SEO + AI Search Visibility Testing Tool
- **NOT**: This is NOT app-suite or any other project

## Database Requirements
- **Database**: Requires its own Supabase project
- **Project Name Suggestion**: `geotest-production` or `geo-tracker-prod`
- **NEVER**: Share database with app-suite or other projects

## Environment Setup Checklist
- [ ] Create NEW Supabase project specifically for GeoTest
- [ ] Use unique project name (not app-suite-production)
- [ ] Generate fresh API keys
- [ ] Update .env with GeoTest-specific credentials
- [ ] Update Vercel with GeoTest-specific credentials

## How to Prevent Database Mixing
1. Always check .env before starting work
2. Use descriptive Supabase project names
3. Keep .env.example updated with clear warnings
4. Never copy .env files between projects
5. Use project-specific prefixes in Supabase

## Current Status
- App Suite is using: imeigitblspjedqwsigf.supabase.co
- GeoTest needs: Its own separate Supabase project

---
Last Updated: 2025-07-10