import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctoesohdiojqyruvebpe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0b2Vzb2hkaW9qcXlydXZlYnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDMxNTcsImV4cCI6MjA5NjU3OTE1N30.VD391WvA9hqeb9qtJfOakBPJMr2w0UMaN53BlvPQ6rs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing products...");
  const p = await supabase.from('products').select('*');
  console.log("Products:", JSON.stringify(p, null, 2));

  console.log("Testing orders...");
  const o = await supabase.from('orders').select('*');
  console.log("Orders:", JSON.stringify(o, null, 2));
}

test();
