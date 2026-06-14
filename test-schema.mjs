import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctoesohdiojqyruvebpe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0b2Vzb2hkaW9qcXlydXZlYnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDMxNTcsImV4cCI6MjA5NjU3OTE1N30.VD391WvA9hqeb9qtJfOakBPJMr2w0UMaN53BlvPQ6rs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Fetching 1 product to check schema...");
  const { data, error } = await supabase.from('Products').select('*').limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Product columns:", Object.keys(data[0]));
    console.log("Product data:", data[0]);
  }
}

test();
