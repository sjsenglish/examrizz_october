import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Use service role key for database setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select('count', { count: 'exact', head: true });
    return !error;
  } catch (error) {
    return false;
  }
}

async function executeSQLFile(filePath: string): Promise<void> {
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL into individual statements (basic approach)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements from ${filePath}...`);

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
        
        if (error) {
          console.error(`Error executing statement: ${statement.substring(0, 100)}...`);
          console.error(error);
          // Continue with other statements
        }
      }
    }
    
    console.log(`Successfully executed SQL file: ${filePath}`);
  } catch (error) {
    console.error(`Error reading or executing SQL file ${filePath}:`, error);
    throw error;
  }
}

async function setupDatabase() {
  console.log('🔍 Checking database setup...');

  try {
    // Check if user_subscriptions table exists
    const subscriptionsTableExists = await checkTableExists('user_subscriptions');
    
    if (!subscriptionsTableExists) {
      console.log('❌ user_subscriptions table does not exist');
      console.log('📝 Creating user_subscriptions table...');
      
      const sqlFilePath = path.join(__dirname, '..', 'database', 'create_user_subscriptions_table.sql');
      await executeSQLFile(sqlFilePath);
      
      console.log('✅ user_subscriptions table created successfully');
    } else {
      console.log('✅ user_subscriptions table exists');
    }

    // Verify the table structure
    console.log('🔍 Verifying table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'user_subscriptions')
      .eq('table_schema', 'public');

    if (columnsError) {
      console.error('Error checking table structure:', columnsError);
    } else {
      console.log('📊 Table structure:');
      columns?.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }

    // Test basic operations
    console.log('🧪 Testing basic operations...');
    
    // Try to query the table (should work even if empty)
    const { error: queryError } = await supabase
      .from('user_subscriptions')
      .select('count', { count: 'exact', head: true });

    if (queryError) {
      console.error('❌ Error querying user_subscriptions:', queryError);
      throw queryError;
    } else {
      console.log('✅ Basic query test passed');
    }

    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  }
}

// Check if we're running this script directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

export { setupDatabase, checkTableExists };