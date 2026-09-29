-- Server-only data access. Run in the shared Supabase project.
-- Restrictive policies also neutralize older permissive demo/mobile policies.
DO $security$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['booking_requests', 'jobs', 'job_parts', 'mechanics']
  LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
      EXECUTE format('REVOKE ALL PRIVILEGES ON TABLE public.%I FROM PUBLIC, anon, authenticated', table_name);
      EXECUTE format('DROP POLICY IF EXISTS server_only_access ON public.%I', table_name);
      EXECUTE format('CREATE POLICY server_only_access ON public.%I AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)', table_name);
    END IF;
  END LOOP;
END
$security$;
DROP POLICY IF EXISTS "Demo: allow anon select for realtime" ON public.booking_requests;
DROP POLICY IF EXISTS "Mobile demo: anon update booking_requests" ON public.booking_requests;
-- The service_role privileges and the server's direct Postgres role are unchanged.
