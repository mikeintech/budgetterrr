import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eitbkweosxielkklzcfx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdGJrd2Vvc3hpZWxra2x6Y2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjM2MTUsImV4cCI6MjA0ODY5OTYxNX0.sy4bolLfw-HWUUOEYC7sxB-xtCBTlLNVR2qew0Ei3DM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);