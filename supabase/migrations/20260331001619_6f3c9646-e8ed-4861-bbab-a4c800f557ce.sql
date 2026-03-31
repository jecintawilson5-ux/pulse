
-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;

-- Allow public read access to media bucket
CREATE POLICY "Public read access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'media');

-- Allow anyone to upload to media bucket
CREATE POLICY "Anyone can upload media" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'media');
