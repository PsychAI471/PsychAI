import React, { useRef, useState, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatUIProps {
  sessionId: string;
}

export default function ChatUI({ sessionId }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare payload for API
    const payload = {
      sessionId,
      messages: [...messages, userMsg],
    };

    // Stream response from /api/chat
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.body) {
      setLoading(false);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let aiMsg: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, aiMsg]);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value);
      aiMsg.content += chunk;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...aiMsg };
        return updated;
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] w-full bg-white rounded-2xl shadow-lg border border-blue-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">Start the conversation…</div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-base whitespace-pre-line break-words ${
                msg.role === 'user'
                  ? 'bg-blue-100 text-blue-900 rounded-br-none'
                  : 'bg-teal-50 text-teal-900 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-4 border-t border-blue-100 bg-white"
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? '…' : 'Send'}
        </button>
      </form>
    </div>
  );
} 