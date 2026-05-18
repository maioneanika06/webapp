"use client";

import { useAuth } from "@/hooks/useAuth";
import type { Event } from "@/types";

interface HeaderProps {
    activeEvent: Event | null;
}

export default function Header({ activeEvent }: HeaderProps) {
    const { user, signOut } = useAuth();

    return (
        <header className="h-16 bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-8">
            {/* Active Event Indicator */}
            <div className="flex items-center gap-3">
                {activeEvent && (
                    <>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                        <div>
                            <p className="text-white/80 text-sm font-medium">{activeEvent.name}</p>
                            <p className="text-white/30 text-xs">
                                {new Date(activeEvent.event_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* User */}
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-white/60 text-sm">{user?.email}</p>
                </div>
                <button
                    onClick={signOut}
                    className="px-4 py-2 text-xs font-medium text-white/40 hover:text-red-400 bg-white/[0.03] hover:bg-red-500/10 border border-white/[0.06] hover:border-red-500/20 rounded-lg transition-all duration-200 cursor-pointer"
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
}
