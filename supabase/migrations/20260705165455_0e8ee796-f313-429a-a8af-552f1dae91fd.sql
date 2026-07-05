
CREATE POLICY "media read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "media insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "media update" ON storage.objects FOR UPDATE USING (bucket_id = 'media');
CREATE POLICY "media delete" ON storage.objects FOR DELETE USING (bucket_id = 'media');
