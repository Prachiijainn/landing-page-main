-- Complete Supabase Setup for NaedeX Projects System
-- Run this entire script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  author_email TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

DROP POLICY IF EXISTS "Approved projects are viewable by everyone" ON public.projects;
DROP POLICY IF EXISTS "Anyone can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Only admins can update projects" ON public.projects;

-- Profiles policies
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Approved projects are viewable by everyone" ON public.projects
  FOR SELECT USING (status = 'approved' OR auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can insert projects" ON public.projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can update projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS handle_updated_at_projects ON public.projects;

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.projects TO anon, authenticated;

-- Insert some sample projects for testing
INSERT INTO public.projects (title, description, author, author_email, technologies, github_url, live_url, image_url, status) VALUES
(
  'Task Management App',
  'A modern task management application built with React and TypeScript. Features include drag-and-drop functionality, real-time updates, and team collaboration.',
  'John Doe',
  'john@example.com',
  ARRAY['React', 'TypeScript', 'Node.js', 'MongoDB'],
  'https://github.com/johndoe/task-app',
  'https://task-app-demo.com',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop',
  'approved'
),
(
  'Weather Dashboard',
  'A responsive weather dashboard that provides real-time weather information with beautiful visualizations and forecasts.',
  'Jane Smith',
  'jane@example.com',
  ARRAY['Vue.js', 'JavaScript', 'Chart.js', 'OpenWeather API'],
  'https://github.com/janesmith/weather-dashboard',
  'https://weather-dash.com',
  'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop',
  'approved'
),
(
  'E-commerce Platform',
  'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
  'Mike Johnson',
  'mike@example.com',
  ARRAY['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
  'https://github.com/mikejohnson/ecommerce',
  NULL,
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
  'approved'
),
(
  'AI Chat Application',
  'A real-time chat application powered by AI with natural language processing capabilities. Features include smart replies, sentiment analysis, and multi-language support.',
  'Alice Johnson',
  'alice@example.com',
  ARRAY['React', 'Node.js', 'OpenAI API', 'Socket.io', 'MongoDB'],
  'https://github.com/alice/ai-chat',
  'https://ai-chat-demo.com',
  'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=250&fit=crop',
  'pending'
)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Database setup completed successfully!' as status;

-- ============================================================================
-- ADMIN USER SETUP
-- ============================================================================

-- To make a user admin, first they need to sign up in your app, then run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- Example: Make admin@naedx.com an admin (replace with your actual email)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@naedx.com';

-- To check all users and their roles:
-- SELECT id, email, name, role, created_at FROM public.profiles ORDER BY created_at DESC;

-- To see all projects:
-- SELECT title, author, status, created_at FROM public.projects ORDER BY created_at DESC;