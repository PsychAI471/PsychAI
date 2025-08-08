import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, duration, messageCount, timestamp } = body;

    // Store session analytics in Supabase
    const { error } = await supabase
      .from('session_analytics')
      .insert([
        {
          user_id: userId,
          duration: duration,
          message_count: messageCount,
          session_date: timestamp,
        },
      ]);

    if (error) {
      console.error('Error storing session analytics:', error);
      return new Response(JSON.stringify({ error: 'Failed to store analytics' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in session analytics API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 