import React, { useState } from "react";
import { Compass, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthProps {
  onSignIn: (user: { name: string; email: string }) => void;
}

export default function Auth({ onSignIn }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay for premium feel
    setTimeout(() => {
      onSignIn({
        name: isSignUp ? (name || "New User") : "Paul Richard",
        email: email || "paul@example.com"
      });
    }, 800);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#F8FAFC] font-sans">
      {/* Left side - Auth Form */}
      <div className="flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-24 h-full relative">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="flex items-center justify-center gap-0.5 text-[#16A34A]">
              <div className="w-1.5 h-4 bg-[#16A34A] rounded-full" />
              <div className="w-1.5 h-6 bg-[#16A34A] rounded-full" />
              <div className="w-1.5 h-8 bg-[#16A34A] rounded-full" />
              <div className="w-1.5 h-5 bg-[#16A34A] rounded-full" />
            </div>
            <span className="font-extrabold text-[#0F172A] text-2xl tracking-tight">
              LeadFinder
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-2">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-[#64748B] font-medium text-sm">
              {isSignUp 
                ? "Start generating high-quality B2B leads in seconds." 
                : "Enter your credentials to access your dashboard."}
            </p>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              setIsLoading(true);
              setTimeout(() => {
                onSignIn({ name: "Google User", email: "google.user@example.com" });
              }, 800);
            }}
            className="w-full mb-6 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-[#0F172A] shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-wait"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#F8FAFC] px-2 text-slate-500 font-semibold">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <UserIcon className="h-4.5 w-4.5 text-[#64748B]" />
                    </div>
                    <input
                      type="text"
                      required={isSignUp}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:border-[#16A34A] focus:outline-none focus:ring-1 focus:ring-[#16A34A] transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-[#64748B]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:border-[#16A34A] focus:outline-none focus:ring-1 focus:ring-[#16A34A] transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-[#64748B]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-[#0F172A] placeholder:text-slate-400 focus:border-[#16A34A] focus:outline-none focus:ring-1 focus:ring-[#16A34A] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#16A34A] py-3 text-sm font-bold text-white shadow-md shadow-[#16A34A]/25 transition-all duration-300 hover:bg-[#15803d] hover:shadow-lg hover:shadow-[#16A34A]/35 focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2 disabled:bg-[#16A34A]/70 disabled:cursor-wait"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-semibold">
            <span className="text-[#64748B]">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#16A34A] hover:underline hover:text-[#15803d]"
            >
              {isSignUp ? "Log in here" : "Sign up"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right side - Visual/Feature showcase */}
      <div className="hidden md:flex bg-[#0F172A] flex-col justify-center p-12 relative overflow-hidden">
        {/* Decorative background grid and gradients */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#16A34A] rounded-full blur-[120px]" />
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <pattern id="gridAuth" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#gridAuth)" />
          </svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 max-w-lg mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1e293b] border border-slate-700 px-3 py-1.5 text-xs font-bold text-white">
            <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
            Enterprise-grade reliability
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Discover decision makers <span className="text-[#16A34A]">in milliseconds.</span>
          </h2>
          
          <p className="text-lg text-slate-400 font-medium">
            Join thousands of modern sales teams accelerating their pipeline with AI-driven contact intelligence and CRM synchronization.
          </p>

          <div className="flex gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img 
                  key={i}
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=avatar${i}&backgroundColor=e2e8f0`} 
                  alt={`User ${i}`} 
                  className="w-12 h-12 rounded-full border-2 border-[#0F172A] bg-slate-200"
                />
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex text-amber-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <span className="text-sm font-semibold text-slate-300">Trusted by over 4,000+ teams</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
