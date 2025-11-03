import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://mewoipfkuoggiwqdefiy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld29pcGZrdW9nZ2l3cWRlZml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDg1NTUsImV4cCI6MjA3NzQyNDU1NX0.KpKaAI4Xivrzy--iyQUQSmKPwsontYHX9OapVxpigrE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);