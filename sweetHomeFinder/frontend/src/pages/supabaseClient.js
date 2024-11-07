// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xmlfkyvobluwqigsyebf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtbGZreXZvYmx1d3FpZ3N5ZWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3OTI3NzQsImV4cCI6MjA0NTM2ODc3NH0.4571cAUvnLzpPPzswFbxoEAFLVf4TVUMtxRldF0kJUM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);