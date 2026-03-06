import { createServerClient } from './supabaseClient';

/**
 * Get authenticated user from server-side context
 * Use this in getServerSideProps to check authentication
 * @param {Object} context - Next.js context (req, res)
 * @returns {Object} { user, supabase } or null if not authenticated
 */
export const getServerUser = async (context) => {
  try {
    const supabase = createServerClient(context);
    
    // Try to get user from session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      // Fallback: try getUser
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return null;
      }

      return { user, supabase };
    }

    return { user: session.user, supabase };
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
};

/**
 * Require authentication for a page
 * Use this in getServerSideProps to protect routes
 * @param {Object} context - Next.js context
 * @returns {Object} Redirect object if not authenticated, or { user, supabase }
 */
export const requireAuth = async (context) => {
  const auth = await getServerUser(context);

  if (!auth) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return { props: { user: auth.user } };
};

