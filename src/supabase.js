import { createClient } from '@supabase/supabase-js';

// Βάλε τα δικά σου κλειδιά εδώ μέσα στα αυτάκια
const supabaseUrl = 'ΤΟ_ΔΙΚΟ_ΣΟΥ_SUPABASE_URL';
const supabaseKey = 'ΤΟ_ΔΙΚΟ_ΣΟΥ_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
