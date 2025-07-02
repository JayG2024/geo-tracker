#!/bin/bash

# Script to add Supabase credentials to Vercel
# Replace these with your actual Supabase values

echo "Adding Supabase URL to Vercel..."
echo "YOUR_SUPABASE_URL_HERE" | vercel env add VITE_SUPABASE_URL production

echo "Adding Supabase Anon Key to Vercel..."
echo "YOUR_SUPABASE_ANON_KEY_HERE" | vercel env add VITE_SUPABASE_ANON_KEY production

echo "Done! Redeploy with: vercel --prod"