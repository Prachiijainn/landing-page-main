-- Add display name support to profiles table
-- Run this in your Supabase SQL Editor

-- 1. Check current table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Add display_name column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- 3. Update existing profiles to have display names based on their names
UPDATE public.profiles 
SET display_name = name 
WHERE display_name IS NULL;

-- 4. Update the trigger function to handle display names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, display_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email::text), 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email::text, '@', 1)),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name),
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Check the updated table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. View current profiles with display names
SELECT id, email, name, display_name, role, created_at 
FROM public.profiles 
ORDER BY created_at DESC;

-- 7. Example: Update a specific user's display name (replace with your email)
-- UPDATE public.profiles 
-- SET display_name = 'Your Display Name'
-- WHERE email = 'your-email@example.com';

SELECT '✅ Display name support added!' as status;