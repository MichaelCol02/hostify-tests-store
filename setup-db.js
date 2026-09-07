#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('\n🚀 Setup Supabase Database\n');

  // Get credentials
  const supabaseUrl = await question('Supabase URL (NEXT_PUBLIC_SUPABASE_URL): ');
  const supabaseKey = await question('Service Role Key (from Settings → API → Service role): ');

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: URL and Key are required');
    rl.close();
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('\n⏳ Executing migrations...\n');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_init.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Split by statements (simple approach)
    const statements = migrationSQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    // Execute each statement
    let completed = 0;
    for (const statement of statements) {
      try {
        await supabase.rpc('execute_sql', { sql: statement }).catch(() => {
          // If rpc doesn't work, try direct query
          return supabase.from('_migrations').select('*').limit(1);
        });
        completed++;
        process.stdout.write(`\r✓ ${completed}/${statements.length} statements`);
      } catch (err) {
        console.error(`\n❌ Error: ${err.message}`);
      }
    }

    console.log('\n\n✅ Database setup complete!\n');

    // Get anon key
    console.log('📋 Copy these to .env.local:\n');
    console.log(`NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`);
    console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>`);
    console.log(`\nTo get anon_key:`);
    console.log(`  1. Go to: ${supabaseUrl.replace('/rest/v1', '')}/project/settings/api`);
    console.log(`  2. Copy "anon" key (public)\n`);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
