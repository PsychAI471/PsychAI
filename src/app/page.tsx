"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ChatUI from "../components/ChatUI";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "Contact", href: "#footer" },
];

const FEATURES = [
  {
    title: "AI-powered Therapy Insights",
    desc: "Get instant, evidence-based suggestions tailored to your needs.",
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    title: "Personalized Mood Tracker",
    desc: "Track your emotions and progress with daily check-ins.",
    icon: (
      <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10h.01M15 10h.01M9 16c1.333-1 2.667-1 4 0" /></svg>
    ),
  },
  {
    title: "Confidential & Secure",
    desc: "Your privacy is our top priority. All data is encrypted.",
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="12" x="3" y="8" rx="2" /><path d="M7 8V6a5 5 0 0 1 10 0v2" /></svg>
    ),
  },
  {
    title: "Science-backed CBT Tools",
    desc: "Access proven techniques from Cognitive Behavioral Therapy.",
    icon: (
      <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>
    ),
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Answer a few questions",
    icon: (
      <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
    ),
  },
  {
    step: 2,
    title: "AI analyzes your needs",
    icon: (
      <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" /></svg>
    ),
  },
  {
    step: 3,
    title: "Get tailored support & suggestions",
    icon: (
      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    name: "Alex J.",
    quote:
      "PsychAI helped me understand my emotions and gave me practical tools to manage stress. It feels like having a therapist in my pocket!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Samantha R.",
    quote:
      "The mood tracker and daily check-ins keep me accountable and aware. I love the privacy and science-backed approach!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Chris P.",
    quote:
      "I was skeptical at first, but PsychAI’s suggestions are spot-on and genuinely helpful. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

const PRICING = [
  {
    tier: "Free",
    price: "$0",
    features: [
      "Mood Tracker",
      "Basic AI Suggestions",
      "Confidential & Secure",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    tier: "Premium",
    price: "$9/mo",
    features: [
      "All Free Features",
      "Advanced Therapy Insights",
      "Personalized CBT Tools",
      "Priority Support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
];

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => {
    let sid = window.localStorage.getItem("psychai-session-id");
    if (!sid) {
      sid = crypto.randomUUID();
      window.localStorage.setItem("psychai-session-id", sid);
    }
    setSessionId(sid);
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-100 via-purple-50 to-teal-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-5 flex items-center justify-between bg-white/80 shadow-sm fixed top-0 left-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-blue-700 tracking-tight">PsychAI</span>
        </div>
        <nav className="hidden md:flex gap-10">
          {NAV_LINKS.map((link) => (
            <a key={link.name} href={link.href} className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-lg">
              {link.name}
            </a>
          ))}
        </nav>
        <a href="/auth" className="hidden md:inline-block px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition text-lg">Get Started</a>
        <button className="md:hidden p-2 rounded-lg hover:bg-blue-100">
          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-16 pt-40 pb-28 px-8 max-w-7xl mx-auto w-full">
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-6 leading-tight drop-shadow-sm">Your AI Companion for Mental Wellness.</h1>
          <p className="text-2xl text-gray-700 mb-10 max-w-2xl">PsychAI provides 24/7 mental health support, personalized care, and therapy-aligned suggestions — anytime, anywhere.</p>
          <a href="/auth" className="inline-block px-10 py-4 rounded-full bg-teal-500 text-white font-semibold shadow-lg hover:bg-teal-600 transition text-xl">Try PsychAI Free</a>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="/globe.svg" alt="AI Illustration" width={360} height={360} className="rounded-3xl shadow-xl bg-white/70 p-8" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 max-w-7xl mx-auto w-full">
        <h2 className="text-4xl font-bold text-center text-blue-700 mb-14">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="bg-white rounded-3xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl transition">
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-blue-600 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-lg">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-8 max-w-5xl mx-auto w-full">
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-14">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-14">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="flex flex-col items-center bg-white rounded-3xl shadow-md p-10 w-full md:w-1/3 hover:shadow-xl transition">
              <div className="mb-5">{step.icon}</div>
              <span className="text-2xl font-bold text-blue-600 mb-3">Step {step.step}</span>
              <p className="text-gray-700 text-xl font-medium">{step.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-8 max-w-4xl mx-auto w-full">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-14">Pricing</h2>
        <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
          {PRICING.map((plan) => (
            <div
              key={plan.tier}
              className={`flex-1 bg-white rounded-3xl shadow-md p-10 flex flex-col items-center text-center border-2 ${plan.highlight ? "border-indigo-500 scale-105 shadow-2xl" : "border-gray-100"} transition`}
            >
              <span className="text-2xl font-bold text-indigo-600 mb-3">{plan.tier}</span>
              <span className="text-5xl font-extrabold text-gray-900 mb-6">{plan.price}</span>
              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="text-gray-700 flex items-center gap-2 justify-center text-lg">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/auth" className={`px-8 py-3 rounded-full font-semibold shadow-md text-lg ${plan.highlight ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-blue-100 text-blue-700 hover:bg-blue-200"} transition`}>{plan.cta}</a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-white/90 py-10 px-6 mt-10 border-t border-blue-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl font-extrabold text-blue-600">PsychAI</span>
            <div className="flex gap-4 text-gray-500 mt-2">
              <Link href="#">About</Link>
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
            </div>
          </div>
          <form className="flex gap-2 items-center mt-4 md:mt-0">
            <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <button type="submit" className="px-5 py-2 rounded-r-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Subscribe</button>
          </form>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" aria-label="Twitter" className="text-blue-400 hover:text-blue-600"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 8.99 4.07 7.13 1.64 4.16c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22.46 6z" /></svg></a>
            <a href="#" aria-label="LinkedIn" className="text-blue-700 hover:text-blue-900"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" /></svg></a>
            <a href="#" aria-label="Instagram" className="text-pink-400 hover:text-pink-600"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.784 2.2 15.4 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07 5.77.128 4.87.312 4.13.54c-.77.24-1.42.56-2.07 1.21-.65.65-.97 1.3-1.21 2.07-.23.74-.412 1.64-.47 2.92C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.24 2.18.47 2.92.24.77.56 1.42 1.21 2.07.65.65 1.3.97 2.07 1.21.74.23 1.64.412 2.92.47C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.28-.058 2.18-.24 2.92-.47.77-.24 1.42-.56 2.07-1.21.65-.65.97-1.3 1.21-2.07.23-.74.412-1.64.47-2.92.058-1.28.07-1.684.07-4.948s-.012-3.668-.07-4.948c-.058-1.28-.24-2.18-.47-2.92-.24-.77-.56-1.42-1.21-2.07-.65-.65-1.3-.97-2.07-1.21-.74-.23-1.64-.412-2.92-.47C15.668.012 15.264 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm7.844-10.406a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /></svg></a>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm mt-8">&copy; {new Date().getFullYear()} PsychAI. All rights reserved.</div>
      </footer>
    </div>
  );
}
