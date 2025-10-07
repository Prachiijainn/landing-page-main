-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  item_id TEXT NOT NULL, -- Can be project ID or story ID
  item_type TEXT NOT NULL CHECK (item_type IN ('project', 'story')),
  text TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_item ON comments(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_comments_user_email ON comments(user_email);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add comments" ON comments
  FOR INSERT WITH CHECK (user_email = auth.email());

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (user_email = auth.email());

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (user_email = auth.email());

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_email) -- Prevent duplicate likes
);

-- Create indexes for comment likes
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_email ON comment_likes(user_email);

-- Enable RLS for comment_likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for comment_likes
CREATE POLICY "Anyone can view comment likes" ON comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like comments" ON comment_likes
  FOR INSERT WITH CHECK (user_email = auth.email());

CREATE POLICY "Users can unlike their own likes" ON comment_likes
  FOR DELETE USING (user_email = auth.email());

-- Function to update comment likes count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment likes count
    UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement likes count
    UPDATE comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update comment likes count
DROP TRIGGER IF EXISTS trigger_update_comment_likes_count ON comment_likes;
CREATE TRIGGER trigger_update_comment_likes_count
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_likes_count();

-- Grant permissions
GRANT ALL ON comments TO authenticated;
GRANT ALL ON comments TO service_role;
GRANT ALL ON comment_likes TO authenticated;
GRANT ALL ON comment_likes TO service_role;