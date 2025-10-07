-- Admin Role Management Queries
-- Use these in your Supabase SQL Editor to manage admin roles

-- 1. Check all users and their current roles
SELECT 
  id,
  email,
  name,
  role,
  created_at,
  updated_at
FROM public.profiles 
ORDER BY created_at DESC;

-- 2. Make a specific user admin (replace email)
UPDATE public.profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'your-email@example.com';

-- 3. Remove admin role from a user (make them regular user)
UPDATE public.profiles 
SET role = 'user', updated_at = NOW()
WHERE email = 'user-email@example.com';

-- 4. Check if a specific user is admin
SELECT email, role, 
  CASE 
    WHEN role = 'admin' THEN '✅ IS ADMIN'
    ELSE '❌ NOT ADMIN'
  END as admin_status
FROM public.profiles 
WHERE email = 'your-email@example.com';

-- 5. List all admin users
SELECT email, name, role, created_at
FROM public.profiles 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- 6. Count users by role
SELECT 
  role,
  COUNT(*) as user_count
FROM public.profiles 
GROUP BY role;

-- 7. Fix any users who might have lost their admin role
-- (Run this if you suspect admin roles were reset)
-- UNCOMMENT AND MODIFY THE EMAIL BELOW:
-- UPDATE public.profiles 
-- SET role = 'admin', updated_at = NOW()
-- WHERE email IN (
--   'admin1@example.com',
--   'admin2@example.com'
-- );

-- 8. Create a test admin user (if needed)
-- First create the user in Supabase Auth, then run:
-- INSERT INTO public.profiles (id, email, name, role)
-- VALUES (
--   'user-uuid-from-auth',
--   'test-admin@example.com',
--   'Test Admin',
--   'admin'
-- )
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 9. Debug: Check if profiles table exists and has correct structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Debug: Check RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- Success message
SELECT '✅ Admin role management queries ready!' as status;