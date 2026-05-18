"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { user, loading, signIn, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [user, loading, router]);

    const handleGoogleSignIn = async () => {
        setError("");
        try {
            await signInWithGoogle();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Google sign-in failed");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await signIn(email, password);
            router.replace("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-pink-600/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-sm relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Login</h1>
                    <p className="text-white/30 text-sm mt-1">Vending Machine Event System</p>
                </div>

                {/* Login Card */}
                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/20">
                    {error && (
                        <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5-2.178 3.374-3.948 3.374H6.645c-1.77 0-3.082-1.874-3.948-3.374L12 3.378l9.303 12.748zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Google Sign-In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/[0.08]" />
                        <span className="text-white/20 text-xs uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-white/[0.08]" />
                    </div>

                    {/* Email/Password toggle */}
                    {!showEmailForm ? (
                        <button
                            onClick={() => setShowEmailForm(true)}
                            className="w-full py-3 text-sm font-medium text-white/40 hover:text-white/60 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.1] rounded-xl transition-all duration-200 cursor-pointer"
                        >
                            Sign in with Email & Password
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
                            <div>
                                <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@example.com"
                                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-purple-500/20 cursor-pointer"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-white/15 text-xs mt-6">
                    Secured admin access · Event Dashboard
                </p>
            </div>
        </div>
    );
}
