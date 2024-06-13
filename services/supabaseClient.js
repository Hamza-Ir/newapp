import {createClient} from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kwzptlmenbajtlzaijvg.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3enB0bG1lbmJhanRsemFpanZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxOTcyNjksImV4cCI6MjAzMzc3MzI2OX0.IcvznYI2dIiGO6FfSeSuqP23xqtY0AVng2mf5n7IJm0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
