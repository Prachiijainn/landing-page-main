-- Add delete permissions for projects table
-- Run this in your Supabase SQL Editor

-- 1. Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'projects';

-- 2. Add delete policy for admins
CREATE POLICY "Only admins can delete projects" ON public.projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 3. Verify the new policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'projects' AND cmd = 'DELETE';

-- 4. Test delete permission (this should work for admins)
-- SELECT 'Delete permission policy created successfully!' as status;

SELECT '✅ Delete permissions added for admin users!' as status;