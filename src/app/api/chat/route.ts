import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, messages } = body;

  // Store user message in Supabase
  const lastMsg = messages[messages.length - 1];
  if (lastMsg && lastMsg.role === 'user') {
    await supabase.from('chat_messages').insert([
      {
        session_id: sessionId,
        role: 'user',
        content: lastMsg.content,
      },
    ]);
  }

  // Prepare payload for Groq API
  const payload = {
    model: 'llama3-70b-8192',
    messages,
    stream: true,
  };

  // Fetch from Groq API with streaming
  const groqRes = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!groqRes.body) {
    return new Response('No response body from Groq', { status: 500 });
  }

  // Stream the response to the client and collect the full assistant message
  const encoder = new TextEncoder();
  let aiContent = '';
  const stream = new ReadableStream({
    async start(controller) {
      const reader = groqRes.body!.getReader();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        buffer += chunk;
        // Groq streams OpenAI-compatible data: lines starting with 'data: '
        const lines = buffer.split('\n');
        buffer = lines.pop()!; // last line may be incomplete
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '').trim();
            if (data === '[DONE]') {
              controller.close();
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                aiContent += delta;
                controller.enqueue(encoder.encode(delta));
              }
            } catch (e) {
              // ignore malformed lines
            }
          }
        }
      }
      // Store assistant message in Supabase after streaming
      if (aiContent) {
        await supabase.from('chat_messages').insert([
          {
            session_id: sessionId,
            role: 'assistant',
            content: aiContent,
          },
        ]);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
} 