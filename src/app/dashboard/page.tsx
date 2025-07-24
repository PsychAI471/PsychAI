"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ChatUI from "../../components/ChatUI";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/auth");
      } else {
        setSessionId(session.user.id);
      }
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!sessionId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-50 to-teal-50 flex flex-col items-center py-12">
      <div className="w-full max-w-2xl flex justify-end mb-4 gap-2">
        <Link
          href="/dashboard/profile"
          className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
        >
          Logout
        </button>
      </div>
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Welcome to your Dashboard</h1>
      <div className="w-full max-w-2xl">
        <ChatUI sessionId={sessionId} />
      </div>
    </div>
  );
} 