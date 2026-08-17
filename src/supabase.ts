import { createClient } from '@supabase/supabase-js';

// Βάλε τα δικά σου κλειδιά εδώ μέσα στα αυτάκια
const supabaseUrl = 'https://jfcdannwntmejfiueolg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmY2Rhbm53bnRtZWpmaXVlb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NjYwMTQsImV4cCI6MjEwMjU0MjAxNH0.8twZxpHewl0XXvOQArfW5jjcmPZy8as50MeCwJbxL4g';

export const supabase = createClient(supabaseUrl, supabaseKey);
