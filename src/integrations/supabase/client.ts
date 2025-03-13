
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://efwqoucbachmbqwwhjyu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmd3FvdWNiYWNobWJxd3doanl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjU0NDgsImV4cCI6MjA1NzQwMTQ0OH0.RMTvgZPhyCguMPcVPInu00kmb33yTR-rc3fx6Mh3VwQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
