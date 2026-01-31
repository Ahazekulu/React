// Test script to verify Supabase connection and posting functionality
import { supabase } from './src/supabase.js';

async function testSupabaseConnection() {
    console.log('Testing Supabase connection...');
    
    // Test 1: Basic connection
    try {
        const { data, error } = await supabase.from('profiles').select('count').single();
        if (error) {
            console.error('❌ Connection test failed:', error);
        } else {
            console.log('✅ Basic connection successful');
        }
    } catch (err) {
        console.error('❌ Connection error:', err);
    }
    
    // Test 2: Check if connect_posts table exists and is accessible
    try {
        const { data, error } = await supabase.from('connect_posts').select('count').single();
        if (error) {
            console.error('❌ connect_posts access failed:', error);
        } else {
            console.log('✅ connect_posts table accessible');
        }
    } catch (err) {
        console.error('❌ connect_posts error:', err);
    }
    
    // Test 3: Check RLS policies
    try {
        const { data, error } = await supabase.from('connect_posts').select('*').limit(1);
        if (error) {
            console.error('❌ RLS policy test failed:', error);
        } else {
            console.log('✅ RLS policies working');
        }
    } catch (err) {
        console.error('❌ RLS policy error:', err);
    }
    
    console.log('Test completed!');
}

testSupabaseConnection();
