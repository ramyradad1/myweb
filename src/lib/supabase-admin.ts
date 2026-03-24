import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client bypasses RLS policies and should ONLY be used in server environments
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
