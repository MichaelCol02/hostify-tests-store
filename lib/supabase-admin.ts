import { createClient } from '@supabase/supabase-js'

// Server-only: kept out of lib/supabase.ts so client bundles never construct it (the key is empty in the browser).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)
