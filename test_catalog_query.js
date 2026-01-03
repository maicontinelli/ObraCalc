
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkCatalog() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials in .env.local');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Checking for SICRO items in services table...');

    // Try to find items starting with 'sic_'
    const { data, error } = await supabase
        .from('services')
        .select('id, name, category')
        .ilike('id', 'sic_%')
        .limit(5);

    if (error) {
        console.error('Error fetching services:', error);
    } else {
        console.log(`Found ${data.length} items starting with 'sic_':`);
        data.forEach(item => {
            console.log(`- [${item.id}] ${item.name} (${item.category})`);
        });
    }
}

checkCatalog();
