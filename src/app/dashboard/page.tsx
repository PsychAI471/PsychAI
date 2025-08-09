"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatUI from "../../components/ChatUI";
import Link from "next/link";
import Analytics from "../../components/Analytics";
import AIFeatures from "../../components/AIFeatures";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
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

  const tabs = [
    { id: 'chat', name: 'AI Therapy', icon: '💬' },
    { id: 'analytics', name: 'Insights', icon: '📊' },
    { id: 'ai-features', name: 'AI Tools', icon: '🧠' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="w-full px-8 py-4 bg-white/80 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-extrabold text-blue-700">PsychAI</span>
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-blue-700 mb-2">AI Therapy Session</h1>
                <p className="text-gray-600">Your personalized mental wellness companion</p>
              </div>
              <div className="max-w-4xl mx-auto">
                <ChatUI sessionId={sessionId} />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-blue-700 mb-2">Your Wellness Insights</h1>
                <p className="text-gray-600">Track your progress and mental health patterns</p>
              </div>
              <Analytics userId={sessionId} />
            </div>
          )}

          {activeTab === 'ai-features' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-blue-700 mb-2">Advanced AI Tools</h1>
                <p className="text-gray-600">Enhanced features for deeper mental wellness support</p>
              </div>
              <AIFeatures userId={sessionId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 