"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfileViewPage() {
  const [profile, setProfile] = useState({ full_name: '', avatar_url: '', bio: '', email: '' });
  const [loading, setLoading] = useState(true);
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
        .select('full_name, avatar_url, bio, email')
        .eq('id', session.user.id)
        .single();
      if (error) {
        setError('Failed to load profile');
      } else {
        setProfile({
          full_name: data.full_name || '',
          avatar_url: data.avatar_url || '',
          bio: data.bio || '',
          email: data.email || '',
        });
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-purple-50 to-teal-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-6">
          {profile.avatar_url ? (
            <Image 
              src={profile.avatar_url} 
              alt="Profile Avatar" 
              width={120} 
              height={120} 
              className="rounded-full mx-auto mb-4"
            />
          ) : (
            <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-blue-600">👤</span>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-blue-700 mb-1">{profile.full_name || 'No Name'}</h2>
        <div className="text-gray-500 mb-4">{profile.email}</div>
        <div className="text-gray-700 text-center mb-6 whitespace-pre-line">{profile.bio || 'No bio yet.'}</div>
        <Link
          href="/dashboard/profile"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
} 