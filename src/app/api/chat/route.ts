import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Throttling logic
const userMessageTimestamps = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, messages, userId } = body;

  // Check for rapid messaging (throttling)
  const now = Date.now();
  const userTimestamps = userMessageTimestamps.get(userId) || [];
  const recentMessages = userTimestamps.filter(timestamp => now - timestamp < 120000); // 2 minutes
  userMessageTimestamps.set(userId, [...recentMessages, now]);

  if (recentMessages.length >= 5) {
    // Throttle response
    return new Response(
      JSON.stringify({
        type: 'throttle',
        message: "Take a few moments to breathe and think. I'll be right here when you're ready."
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

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

  // Count user messages to adjust approach
  const userMessageCount = messages.filter((m: { role: string }) => m.role === 'user').length;
  
  // Adjust system prompt based on conversation depth with advanced reasoning
  let systemPrompt = '';
  if (userMessageCount <= 3) {
    // Early in conversation - identify core problem with minimal questions
    systemPrompt = `You are a professional, empathetic therapist with advanced reasoning capabilities. Use Chain of Thought reasoning to identify the core problem from the user's initial responses. Ask only 1-2 targeted questions maximum to clarify the specific issue, then focus on therapeutic observations and insights. Consider multiple perspectives (Tree of Thoughts) before responding. Validate your understanding through Self-Consistency checks. Use professional therapeutic language - avoid direct validation questions like "am I correct" or "is that right". Instead, make thoughtful observations and offer therapeutic insights. When appropriate, offer 1-2 practical, actionable steps they could try.

REASONING PROCESS:
1. Chain of Thought: Identify the core problem from user's initial sharing
2. Tree of Thoughts: Consider multiple possible interpretations and therapeutic approaches
3. Self-Consistency: Validate that your understanding aligns with the conversation context
4. Response: Provide professional therapeutic observations and insights, with minimal targeted questions`;
  } else if (userMessageCount <= 8) {
    // Mid conversation - focus on insights, not questions
    systemPrompt = `You are a professional, empathetic therapist with advanced reasoning capabilities. Use Chain of Thought reasoning to analyze the conversation flow and understand the identified problem deeply. Incorporate previous conversation context naturally into your responses. Focus on providing therapeutic insights, observations, and supportive statements. Ask questions only when absolutely necessary to clarify a specific aspect of the already-identified problem. Use professional therapeutic language - avoid direct validation questions. Consider multiple perspectives (Tree of Thoughts) to understand the user's evolving situation. Apply Self-Consistency checks to ensure your responses align with the conversation history. Help the user think clearly about their situation through therapeutic insights and observations. When they share challenges, offer specific, practical suggestions like breathing exercises, journaling prompts, or small behavioral changes.

REASONING PROCESS:
1. Chain of Thought: Deeply analyze the identified problem and user's current state, incorporating previous context
2. Tree of Thoughts: Consider different therapeutic approaches to provide insights and support
3. Self-Consistency: Ensure your response fits naturally with the conversation history and therapeutic relationship
4. Response: Provide therapeutic insights and observations, with questions only when essential`;
  } else {
    // Deep conversation - primarily supportive insights
    systemPrompt = `You are a professional, empathetic therapist with advanced reasoning capabilities. Use Chain of Thought reasoning to deeply understand the user's journey and the core problem they're working through. Incorporate the full conversation history and therapeutic relationship context into your responses. Focus almost entirely on providing supportive therapeutic insights, observations, and gentle reflections. Ask questions only in rare cases where a specific clarification is absolutely necessary. Use professional therapeutic language throughout - avoid direct validation questions. Apply Tree of Thoughts to consider multiple therapeutic approaches. Use Self-Consistency to ensure your presence feels authentic and aligned with the established therapeutic relationship. Be present and supportive without being formulaic. Help the user feel heard and validated through therapeutic insights and observations. When appropriate, suggest concrete next steps like setting small goals, trying specific techniques, or reaching out to someone.

REASONING PROCESS:
1. Chain of Thought: Reflect on the user's journey and the core problem they're addressing, incorporating full conversation history
2. Tree of Thoughts: Consider various therapeutic approaches to provide meaningful insights and support
3. Self-Consistency: Ensure your response maintains the authentic therapeutic relationship built
4. Response: Provide supportive therapeutic insights and observations, rarely asking questions`;
  }

  // Prepare messages for Groq API with adaptive system prompt
  const systemMessage = {
    role: 'system',
    content: systemPrompt
  };

  // Get recent message history (last 8 messages for context)
  const recentMessagesForContext = messages.slice(-8);
  const aiMessages = [systemMessage, ...recentMessagesForContext];

  // Prepare payload for Groq API
  const payload = {
    model: 'llama3-70b-8192',
    messages: aiMessages,
    stream: true,
  };

  // Fetch from Groq API with streaming
  try {
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
              } catch {
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
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return Response.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
} 