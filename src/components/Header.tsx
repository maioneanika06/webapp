"use client";

import type { Event } from "@/types";

interface HeaderProps {
    activeEvent: Event | null;
}

export default function Header({ activeEvent }: HeaderProps) {
    return (
        <header className="h-12 flex items-center justify-between px-8 relative">
            {/* Soft bottom edge — gradient instead of border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

            {/* Active Event Indicator */}
            <div className="flex items-center gap-3">
                {activeEvent ? (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${activeEvent.status === 'ACTIVE' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.35)]' : 'bg-zinc-500'}`} />
                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${activeEvent.status === 'ACTIVE' ? 'text-emerald-400/60' : 'text-zinc-500'}`}>
                                {activeEvent.status === 'ACTIVE' ? 'Live' : activeEvent.status}
                            </span>
                        </div>
                        <div className="w-px h-3.5 bg-white/[0.06]" />
                        <p className="text-white/60 text-[13px] font-medium tracking-tight">{activeEvent.name}</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400/40" />
                        <span className="text-white/20 text-[12px] font-medium tracking-wide">Dashboard</span>
                    </div>
                )}
            </div>

            {/* Right side - date */}
            <div className="flex items-center gap-4">
                {activeEvent && (
                    <p className="text-white/15 text-[12px] font-medium">
                        {new Date(activeEvent.event_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                )}
            </div>
        </header>
    );
}
