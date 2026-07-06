
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['products','categories','brands','inventory','inquiries','services','reviews','banners','homepage','settings','activity']) LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL', t);
  END LOOP;
END $$;
