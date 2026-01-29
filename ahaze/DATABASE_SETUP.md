# ahazeKulu Database Setup Guide

## Issues Fixed
1. ✅ **Product Posting Error**: Missing 'category' and 'seller_id' columns in products table
2. ✅ **Signup Not Working**: Missing columns in profiles table and trigger

## How to Apply the Fix

### Step 1: Open Supabase SQL Editor
Navigate to: https://supabase.com/dashboard/project/uphdtxmreujnpatbyaoa/sql

### Step 2: Run the Fix Script
1. Click on "New Query" or the SQL editor
2. Copy the entire content from `supabase/fix_existing_database.sql`
3. Paste it into the SQL editor
4. Click "Run" or press Ctrl+Enter

**Note**: This script is designed to work with existing tables and will only add missing columns without breaking existing data.

### Step 3: Verify Tables Created
After running the script, check the Table Editor to confirm these tables exist:
- ✅ profiles
- ✅ places
- ✅ connect_posts
- ✅ products (with category column)
- ✅ organizations
- ✅ knowledge_articles
- ✅ events
- ✅ agents

## What the Script Does

### 1. Creates All Required Tables
- **profiles**: User profile information (extends auth.users)
- **products**: Market items with category field
- **connect_posts**: Social feed posts
- **organizations**: Business/organization listings
- **knowledge_articles**: Educational content
- **places**: Location information
- **events**: Community events
- **agents**: Service providers

### 2. Sets Up Row Level Security (RLS)
- Public read access for all tables
- Authenticated users can create content
- Users can only edit/delete their own content

### 3. Creates Auto-Profile Trigger
- Automatically creates a profile when a user signs up
- Fixes the signup issue

### 4. Refreshes Schema Cache
- Ensures Supabase recognizes all new tables immediately

## Testing After Setup

### Test Signup
1. Go to http://localhost:5174/signup
2. Fill in the registration form
3. Submit - should work without errors

### Test Product Posting
1. Login to your account
2. Navigate to Market → Sell/List tab
3. Fill in product details including category
4. Submit - should work without the category error

## Alternative: Use Supabase CLI

If you prefer using the CLI:

```bash
# Make sure you're in the project directory
cd d:\myFiles\001ahazeKulu\00 Codes\React\ahaze

# Run the SQL file directly
supabase db execute -f supabase/setup_database.sql
```

## Troubleshooting

### If signup still fails:
- Check browser console for specific error messages
- Verify the trigger was created in Supabase Dashboard → Database → Triggers

### If product posting still fails:
- Verify the products table has the 'category' column
- Check RLS policies are enabled
- Ensure you're logged in when posting

## Next Steps
After applying the database setup, your application should be fully functional with:
- ✅ User signup and authentication
- ✅ Product listing and browsing
- ✅ Social posts
- ✅ Organization registration
- ✅ Knowledge articles
- ✅ Events and agents
