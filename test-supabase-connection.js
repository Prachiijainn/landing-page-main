// Simple test to check Supabase connection
// Run this in your browser console on the login page

console.log('🧪 Testing Supabase connection...');

// Check environment variables
console.log('📋 Environment check:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');

// Test basic connection
import { supabase } from './src/lib/supabase.ts';

// Test 1: Check if we can connect to Supabase
supabase.from('profiles').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ Supabase connection failed:', error);
    } else {
      console.log('✅ Supabase connected! Profile count:', count);
    }
  });

// Test 2: Try to authenticate with demo credentials
console.log('🔐 Testing authentication...');
supabase.auth.signInWithPassword({
  email: 'admin@naedx.com',
  password: 'admin123'
}).then(({ data, error }) => {
  if (error) {
    console.error('❌ Auth test failed:', error);
  } else {
    console.log('✅ Auth test successful:', data);
  }
});

console.log('🧪 Test completed - check results above');