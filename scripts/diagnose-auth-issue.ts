/**
 * DIAGNOSTIC SCRIPT: Check Supabase Client Configuration
 * Run this with: npx ts-node scripts/diagnose-auth-issue.ts
 *
 * This will check for inconsistencies in Supabase client setup that cause logout issues
 */

import * as fs from 'fs';
import * as path from 'path';

console.log('============================================');
console.log('AUTHENTICATION DIAGNOSTIC');
console.log('============================================\n');

// Check 1: Compare supabase-client.ts and supabase.ts
console.log('CHECK 1: Comparing Supabase Client Configurations\n');

const supabaseClientPath = path.join(__dirname, '../lib/supabase-client.ts');
const supabasePath = path.join(__dirname, '../lib/supabase.ts');

const supabaseClientContent = fs.readFileSync(supabaseClientPath, 'utf-8');
const supabaseContent = fs.readFileSync(supabasePath, 'utf-8');

// Check for PKCE flow
const clientHasPKCE = supabaseClientContent.includes("flowType: 'pkce'");
const supabaseHasPKCE = supabaseContent.includes("flowType: 'pkce'");

console.log('PKCE Flow Configuration:');
console.log(`  supabase-client.ts: ${clientHasPKCE ? '✓ HAS' : '✗ MISSING'} flowType: 'pkce'`);
console.log(`  supabase.ts:        ${supabaseHasPKCE ? '✓ HAS' : '✗ MISSING'} flowType: 'pkce'\n`);

// Check for storage configuration
const clientHasStorage = supabaseClientContent.includes('storage:') && supabaseClientContent.includes('localStorage');
const supabaseHasStorage = supabaseContent.includes('storage:') && supabaseContent.includes('localStorage');

console.log('Storage Configuration:');
console.log(`  supabase-client.ts: ${clientHasStorage ? '✓ HAS' : '✗ MISSING'} localStorage`);
console.log(`  supabase.ts:        ${supabaseHasStorage ? '✓ HAS' : '✗ MISSING'} localStorage\n`);

// Check for storageKey
const clientHasStorageKey = supabaseClientContent.includes('storageKey:');
const supabaseHasStorageKey = supabaseContent.includes('storageKey:');

console.log('Storage Key Configuration:');
console.log(`  supabase-client.ts: ${clientHasStorageKey ? '✓ HAS' : '✗ MISSING'} storageKey`);
console.log(`  supabase.ts:        ${supabaseHasStorageKey ? '✗ HAS' : '✓ MISSING'} storageKey\n`);

if (!clientHasPKCE || !clientHasStorage || !clientHasStorageKey) {
  console.log('⚠️  WARNING: supabase-client.ts is missing critical auth configuration!');
}

if (!supabaseHasPKCE || !supabaseHasStorage) {
  console.log('⚠️  WARNING: supabase.ts is missing critical auth configuration!');
  console.log('   This will cause logout issues when switching between pages.\n');
}

// Check 2: Find files using the wrong import
console.log('\n============================================');
console.log('CHECK 2: Finding Files Using Wrong Import\n');

const appDir = path.join(__dirname, '../app');
const componentsDir = path.join(__dirname, '../components');

function findImports(dir: string, searchString: string): string[] {
  const results: string[] = [];

  function walk(directory: string) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.includes('node_modules')) {
        walk(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes(searchString)) {
          results.push(filePath.replace(__dirname + '/../', ''));
        }
      }
    }
  }

  walk(dir);
  return results;
}

const filesUsingOldImport = findImports(appDir, "from '@/lib/supabase'")
  .concat(findImports(componentsDir, "from '@/lib/supabase'"))
  .filter(f => !f.includes("from '@/lib/supabase-client'"));

const filesUsingCorrectImport = findImports(appDir, "from '@/lib/supabase-client'")
  .concat(findImports(componentsDir, "from '@/lib/supabase-client'"));

console.log(`Files using OLD supabase import (problematic): ${filesUsingOldImport.length}`);
if (filesUsingOldImport.length > 0) {
  filesUsingOldImport.forEach(f => console.log(`  ✗ ${f}`));
}

console.log(`\nFiles using CORRECT supabase-client import: ${filesUsingCorrectImport.length}`);
if (filesUsingCorrectImport.length > 0 && filesUsingCorrectImport.length <= 10) {
  filesUsingCorrectImport.forEach(f => console.log(`  ✓ ${f}`));
}

// Check 3: Look for multiple client instantiations
console.log('\n============================================');
console.log('CHECK 3: Checking for Multiple Client Instances\n');

const clientInstantiations = supabaseClientContent.match(/createClient\(/g)?.length || 0;
const supabaseInstantiations = supabaseContent.match(/createClient\(/g)?.length || 0;

console.log('Client instantiations:');
console.log(`  supabase-client.ts: ${clientInstantiations} call(s) to createClient()`);
console.log(`  supabase.ts:        ${supabaseInstantiations} call(s) to createClient()\n`);

if (clientInstantiations > 1 || supabaseInstantiations > 1) {
  console.log('⚠️  WARNING: Multiple createClient() calls detected in a single file!');
  console.log('   This can cause multiple auth clients and session conflicts.\n');
}

// Summary
console.log('\n============================================');
console.log('DIAGNOSIS SUMMARY');
console.log('============================================\n');

let issuesFound = 0;

if (!supabaseHasPKCE || !supabaseHasStorage) {
  issuesFound++;
  console.log(`${issuesFound}. ❌ supabase.ts is missing critical auth config (PKCE/storage)`);
  console.log('   → This causes users to be logged out when navigating to pages that use this file\n');
}

if (filesUsingOldImport.length > 0) {
  issuesFound++;
  console.log(`${issuesFound}. ❌ ${filesUsingOldImport.length} file(s) using the OLD supabase import`);
  console.log('   → These pages will use a different auth client, causing logout issues\n');
}

if (issuesFound === 0) {
  console.log('✅ No authentication configuration issues detected!\n');
  console.log('The logout issue may be caused by:');
  console.log('  - OAuth redirect timing/race conditions');
  console.log('  - Browser cache issues');
  console.log('  - Session cookies being cleared');
} else {
  console.log(`Total Issues Found: ${issuesFound}\n`);
  console.log('RECOMMENDED FIX:');
  if (!supabaseHasPKCE || !supabaseHasStorage) {
    console.log('  1. Update /lib/supabase.ts to include the same auth config as /lib/supabase-client.ts');
  }
  if (filesUsingOldImport.length > 0) {
    console.log('  2. Update all files to import from @/lib/supabase-client instead of @/lib/supabase');
  }
}

console.log('\n============================================\n');
