import { getServerSupabaseClient } from '@/lib/supabaseClient';
import { getServerUser } from '@/lib/auth';

/**
 * API route to list all messages (protected - requires authentication)
 * GET /api/messages/list
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const auth = await getServerUser({ req, res });
    if (!auth) {
      return res.status(401).json({
        error: 'Unauthorized',
        details: 'Authentication required',
      });
    }

    const supabase = getServerSupabaseClient(req, res);

    // Fetch all messages, ordered by created_at descending
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        error: 'Failed to fetch messages',
        details: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data?.length || 0,
      messages: data || [],
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}

