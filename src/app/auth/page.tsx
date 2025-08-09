"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let result;
    if (tab === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
      if (!result.error && result.data?.user) {
        // Insert into your users table
        await supabase.from('users').insert([
          {
            id: result.data.user.id,
            email: result.data.user.email,
            full_name: fullName,
            avatar_url: avatarUrl,
            bio: bio,
          },
        ]);
      }
    }
    if (result.error) {
      setError(result.error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-purple-50 to-teal-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 font-semibold rounded-l-2xl ${tab === 'login' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold rounded-r-2xl ${tab === 'signup' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`}
            onClick={() => setTab('signup')}
          >
            Signup
          </button>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {tab === 'signup' && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Avatar URL (optional)"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
              />
              <textarea
                placeholder="Bio (optional)"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={2}
              />
            </>
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading…' : tab === 'login' ? 'Login' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
} 