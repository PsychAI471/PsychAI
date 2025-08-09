"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ full_name: '', avatar_url: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/auth");
        return;
      }
      const { data, error } = await supabase
        .from('users')
        .select('full_name, avatar_url, bio')
        .eq('id', session.user.id)
        .single();
      if (error) {
        setError('Failed to load profile');
      } else {
        setProfile({
          full_name: data.full_name || '',
          avatar_url: data.avatar_url || '',
          bio: data.bio || '',
        });
      }
      setLoading(false);
    });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) {
      setError('Not logged in');
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from('users')
      .update({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
      })
      .eq('id', user.id);
    if (error) {
      setError('Failed to save profile');
    } else {
      setSuccess('Profile updated!');
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-purple-50 to-teal-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={profile.full_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="avatar_url"
            placeholder="Avatar URL (optional)"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={profile.avatar_url}
            onChange={handleChange}
          />
          <textarea
            name="bio"
            placeholder="Bio (optional)"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={profile.bio}
            onChange={handleChange}
            rows={2}
          />
          {success && <div className="text-green-600 text-sm">{success}</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
} 