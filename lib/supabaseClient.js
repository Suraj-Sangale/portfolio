import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

/**
 * Client-side Supabase client
 * Use this in React components and client-side code
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Server-side Supabase client for getServerSideProps
 * Use this in getServerSideProps to access user session
 * @param {Object} context - Next.js context (req, res)
 * @returns {Object} Supabase client with user session
 */
export const createServerClient = (context) => {
  const { req } = context || {};

  // Extract cookies from request
  const cookies = req?.headers?.cookie || '';

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Cookie: cookies,
      },
    },
  });
};

/**
 * Server-side Supabase client for API routes
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Supabase client
 */
export const getServerSupabaseClient = (req, res) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Cookie: req?.headers?.cookie || '',
      },
    },
  });
};

