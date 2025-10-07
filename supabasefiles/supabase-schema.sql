-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create projects table
CREATE TABLE public.projects (
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

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow service role to insert profiles (for the trigger)
CREATE POLICY "Service role can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

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
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample admin user (you'll need to create this user in Supabase Auth first)
-- Then update their profile to be admin
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@naedex.com';

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
);