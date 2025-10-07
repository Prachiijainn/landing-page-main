# Supabase Setup Guide

This guide will help you set up Supabase for the NaedeX Projects System.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `naedex-projects` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (this takes a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. In your project root, create a `.env` file:
```bash
cp .env.example .env
```

2. Edit the `.env` file and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` and paste it into the editor
4. Click "Run" to execute the schema

This will create:
- `profiles` table for user profiles
- `projects` table for project submissions
- Row Level Security (RLS) policies
- Triggers for automatic profile creation
- Sample data for testing

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your local development URL:
   - `http://localhost:5173` (or your dev server URL)
3. Under **Redirect URLs**, add:
   - `http://localhost:5173/**`
   - Your production URL when ready

## Step 6: Create an Admin User

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Create a user with:
   - **Email**: `admin@naedex.com` (or your preferred admin email)
   - **Password**: Create a strong password
   - **Email Confirm**: Toggle ON (so you don't need to verify)
4. After creating the user, go to **SQL Editor**
5. Run this query to make them an admin:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@naedx.com';
```

## Step 7: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Visit `http://localhost:5173/projects` to see the projects page
3. Try signing up for a new account
4. Login with your admin account and visit `/admin`
5. Test project submission and approval workflow

## Step 8: Configure Email (Optional)

For production, you'll want to set up email templates:

1. Go to **Authentication** → **Email Templates**
2. Customize the templates for:
   - Confirm signup
   - Reset password
   - Email change confirmation

## Database Schema Overview

### Tables Created

#### `profiles`
- Extends Supabase auth.users
- Stores user role (user/admin)
- Automatically created when user signs up

#### `projects`
- Stores all project submissions
- Has approval workflow (pending/approved/rejected)
- Includes all project metadata

### Security Policies

- **Public Access**: Anyone can view approved projects
- **User Access**: Authenticated users can submit projects
- **Admin Access**: Only admins can approve/reject projects

## Environment Variables Reference

```env
# Required
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for production)
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure your `.env` file is in the project root
   - Restart your dev server after adding environment variables

2. **"Row Level Security policy violation"**
   - Check that RLS policies are set up correctly
   - Verify user roles in the profiles table

3. **Authentication not working**
   - Check Site URL and Redirect URLs in Supabase settings
   - Ensure your domain is added to allowed origins

4. **Projects not loading**
   - Check browser console for errors
   - Verify database schema was created correctly
   - Check RLS policies allow reading approved projects

### Useful SQL Queries

```sql
-- Check all users and their roles
SELECT * FROM public.profiles;

-- Check all projects and their status
SELECT title, author, status, created_at FROM public.projects ORDER BY created_at DESC;

-- Make a user admin
UPDATE public.profiles SET role = 'admin' WHERE email = 'user@example.com';

-- Approve a project
UPDATE public.projects SET status = 'approved' WHERE id = 'project-uuid';
```

## Production Deployment

When deploying to production:

1. Update environment variables with production Supabase URL
2. Add production domain to Supabase Auth settings
3. Consider setting up custom SMTP for emails
4. Review and adjust RLS policies if needed
5. Set up database backups
6. Monitor usage and performance

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the browser console for errors
3. Check the Supabase dashboard logs
4. Refer to the project's GitHub issues