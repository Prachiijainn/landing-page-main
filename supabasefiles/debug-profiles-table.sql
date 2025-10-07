-- Debug Profiles Table Issues
-- Run these queries one by one in Supabase SQL Editor

-- 1. Check if profiles table exists
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- 2. Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if there are any profiles
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- 4. List all profiles (if any exist)
SELECT id, email, name, role, created_at 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- 6. Test if we can insert a profile (replace with real user ID from auth.users)
-- First, let's see what users exist in auth.users:
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 7. If you see a user above, try to create their profile (replace the ID and email):
-- INSERT INTO public.profiles (id, email, name, role)
-- VALUES ('user-id-from-above', 'user-email-from-above', 'User Name', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 8. Test basic select permission
SELECT 'Can read profiles table' as test_result;

-- 9. Check if the trigger function exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user' AND routine_schema = 'public';

-- 10. Check if the trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';