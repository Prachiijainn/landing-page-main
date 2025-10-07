-- Update existing users with display names
-- Run this after adding the display_name column

-- 1. First, run the add-display-name.sql script to add the column

-- 2. Update existing profiles to have display names
UPDATE public.profiles 
SET display_name = CASE 
  WHEN name IS NOT NULL AND name != '' THEN name
  WHEN email IS NOT NULL THEN split_part(email, '@', 1)
  ELSE 'User'
END
WHERE display_name IS NULL OR display_name = '';

-- 3. Set specific display names for known users (customize these)
-- UPDATE public.profiles SET display_name = 'Admin' WHERE email = 'admin@naedx.com';
-- UPDATE public.profiles SET display_name = 'John Doe' WHERE email = 'john@example.com';

-- 4. View updated profiles
SELECT id, email, name, display_name, role, created_at 
FROM public.profiles 
ORDER BY created_at DESC;

-- 5. Example: Set your own display name (replace with your email and desired name)
-- UPDATE public.profiles 
-- SET display_name = 'Your Display Name'
-- WHERE email = 'your-email@example.com';

SELECT '✅ Display names updated!' as status;