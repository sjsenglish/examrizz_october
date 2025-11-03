// Run this in browser console during OAuth flow to debug
console.log('=== AUTH DEBUG ===');

// Check current user
supabase.auth.getUser().then(result => {
  console.log('Current user:', result);
});

// Check session
supabase.auth.getSession().then(result => {
  console.log('Current session:', result);
});

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state change:', event, session);
});

// Check environment variables
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');