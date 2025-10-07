# Quick Fix for Supabase 401 Error

You're getting a 401 error because the database schema isn't set up properly. Here's how to fix it:

## Option 1: Quick Fix (Recommended)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `xagxqymneuvdxpdbredr`
3. Go to **SQL Editor** in the left sidebar
4. Click **"New query"**
5. Copy and paste the entire contents of `fix-supabase-permissions.sql`
6. Click **"Run"** to execute the script

This will:
- Create the profiles table
- Set up proper permissions
- Create the trigger for automatic profile creation
- Fix the 401 error

## Option 2: Full Schema Setup

If you want the complete setup with sample data:

1. Go to **SQL Editor** in Supabase
2. Copy and paste the entire contents of `supabase-schema.sql`
3. Click **"Run"**

## Test the Fix

After running either script:

1. Try signing up with a new account
2. The 401 error should be gone
3. You should be able to create accounts and login successfully

## Create Admin User

To create an admin user:

1. Sign up normally with your desired admin email
2. Go to **SQL Editor** in Supabase
3. Run this query (replace with your email):

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

## Current Status

Your app is now connected to Supabase but needs the database schema. Once you run the fix script, everything should work perfectly!

## If You Still Get Errors

1. Check the browser console for detailed error messages
2. Make sure you're using the correct Supabase URL and key
3. Verify the SQL script ran without errors
4. Try refreshing the page and signing up again