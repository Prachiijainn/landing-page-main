-- Create likes table for projects and stories
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  item_id TEXT NOT NULL, -- Can be project ID or story ID
  item_type TEXT NOT NULL CHECK (item_type IN ('project', 'story')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, item_id, item_type) -- Prevent duplicate likes
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_likes_user_email ON likes(user_email);
CREATE INDEX IF NOT EXISTS idx_likes_item_id ON likes(item_id);
CREATE INDEX IF NOT EXISTS idx_likes_item_type ON likes(item_type);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes(created_at DESC);

-- Add likes_count column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment likes count
    IF NEW.item_type = 'project' THEN
      UPDATE projects SET likes_count = likes_count + 1 WHERE id = NEW.item_id::UUID;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement likes count
    IF OLD.item_type = 'project' THEN
      UPDATE projects SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.item_id::UUID;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update likes count
DROP TRIGGER IF EXISTS trigger_update_likes_count ON likes;
CREATE TRIGGER trigger_update_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION update_likes_count();

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
CREATE POLICY "Users can view all likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like items" ON likes
  FOR INSERT WITH CHECK (user_email = auth.email());

CREATE POLICY "Users can unlike their own likes" ON likes
  FOR DELETE USING (user_email = auth.email());

-- Grant permissions
GRANT ALL ON likes TO authenticated;
GRANT ALL ON likes TO service_role;