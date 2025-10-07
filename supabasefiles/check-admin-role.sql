-- Quick check to verify admin role is set correctly
-- Run this in your Supabase SQL Editor

-- 1. Check all users and their roles
SELECT 
  email,
  name,
  role,
  created_at
FROM public.profiles 
ORDER BY created_at DESC;

-- 2. Check if your specific user is admin (replace with your email)
SELECT 
  email,
  role,
  CASE 
    WHEN role = 'admin' THEN '✅ IS ADMIN - Dashboard should show'
    ELSE '❌ NOT ADMIN - Need to update role'
  END as status
FROM public.profiles 
WHERE email = 'your-email@example.com';

-- 3. If you need to make yourself admin, run this (replace email):
-- UPDATE public.profiles 
-- SET role = 'admin', updated_at = NOW()
-- WHERE email = 'your-email@example.com';

-- 4. Verify the update worked:
-- SELECT email, role FROM public.profiles WHERE email = 'your-email@example.com';