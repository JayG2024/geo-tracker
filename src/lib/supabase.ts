// Supabase client - NOW ENABLED for production use
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.log('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Cache connection status to avoid repeated failed requests
let connectionStatus: { isConnected: boolean; lastChecked: number } = {
  isConnected: false,
  lastChecked: 0
};

// Helper function to check if Supabase is connected and working
export const isSupabaseConnected = async (): Promise<boolean> => {
  // Return cached result if checked recently (within 30 seconds)
  const now = Date.now();
  if (now - connectionStatus.lastChecked < 30000) {
    return connectionStatus.isConnected;
  }

  if (!supabase || !supabaseUrl || !supabaseAnonKey) {
    connectionStatus = { isConnected: false, lastChecked: now };
    return false;
  }

  try {
    // Test connection with a simple query
    const { error } = await supabase
      .from('projects')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      connectionStatus = { isConnected: false, lastChecked: now };
      return false;
    }
    
    connectionStatus = { isConnected: true, lastChecked: now };
    return true;
  } catch (err) {
    console.error('Supabase connection test error:', err);
    connectionStatus = { isConnected: false, lastChecked: now };
    return false;
  }
};

// Synchronous version for backwards compatibility (checks cached status)
export const isSupabaseConnectedSync = (): boolean => {
  return connectionStatus.isConnected && 
         supabase !== null && 
         import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_ANON_KEY;
};

// Test connection function
export const testSupabaseConnection = async () => {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, message: 'Connected successfully' };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};