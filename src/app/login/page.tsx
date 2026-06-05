"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");

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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f6f3fa] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-800/40 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f3fa] flex items-center justify-center p-4">
            <div className="w-full max-w-sm relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden border border-purple-800/35 bg-white mb-4">
                        <Image src="/VENDY.png" alt="Vendy Logo" width={64} height={64} className="w-full h-full object-cover" priority />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-950 tracking-tight">VENDY</h1>
                    <p className="text-purple-600 text-sm mt-1">Admin Login</p>
                </div>

                {/* Login Card */}
                <div className="bg-white border border-purple-800/25 rounded-2xl p-8">
                    {error && (
                        <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5-2.178 3.374-3.948 3.374H6.645c-1.77 0-3.082-1.874-3.948-3.374L12 3.378l9.303 12.748zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Google Sign-In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                    Secured admin access, Event Dashboard
                </p>
            </div>
        </div>
    );
}


