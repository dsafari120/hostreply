import { createClient } from '@supabase/supabase-js'

// ─── Replace these two values with your own Supabase project ───────────────
// See SETUP.md for step-by-step instructions
const SUPABASE_URL = 'https://txtlzfobauudfvipsrcm.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_5TQb4pQ1YODSBbbaO3eMVQ_z6Hwk4TJ'
// ───────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
