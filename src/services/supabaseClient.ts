import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://arjiijxmqrfptleedgbd.supabase.co';  // Reemplaza con tu URL de Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyamlpanhtcXJmcHRsZWVkZ2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MjQzMjQsImV4cCI6MjA2MDUwMDMyNH0.NQIAyCq3uAmlBEbgZRRmDmQ8wmrJ3co_cQd_4CkT6DU';  // Reemplaza con tu clave pública

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
