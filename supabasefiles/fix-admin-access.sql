-- Fix Admin Access Issues
-- Run this in your Supabase SQL Editor

-- 1. Check current users and their roles
SELECT 
  id,
  email,
  name,
  display_name,
  role,
  created_at
FROM public.profiles 
ORDER BY created_at DESC;

-- 2. Find your user ID from auth.users (replace with your email)
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'your-email@example.com';

-- 3. Make sure your profile exists and is admin (replace with your email)
INSERT INTO public.profiles (id, email, name, display_name, role)
SELECT 
  id,
  email,
  split_part(email, '@', 1),
  split_part(email, '@', 1),
  'admin'
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- 4. Verify the admin role is set
SELECT 
  email,
  role,
  CASE 
    WHEN role = 'admin' THEN '✅ ADMIN ACCESS GRANTED'
    ELSE '❌ NOT ADMIN'
  END as status
FROM public.profiles 
WHERE email = 'your-email@example.com';

-- 5. Check table permissions
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'profiles';

-- 6. Test basic query (should work)
SELECT 'Database connection working!' as test_result;

SELECT '✅ Admin access fix completed!' as status;