"use client";

import Link from "next/link";
import type { Event } from "@/types";

interface EventGridProps {
    events: Event[];
    emptyMessage: string;
}

export default function EventGrid({ events, emptyMessage }: EventGridProps) {
    if (events.length === 0) {
        return (
            <div className="bg-white/[0.015] border border-white/[0.04] rounded-xl p-16 text-center animate-fadeIn">
                <div className="w-12 h-12 mx-auto mb-5 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                </div>
                <p className="text-white/30 text-sm font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {events.map((event) => {
                const isActive = event.status === "ACTIVE";

                return (
                    <Link key={event.id} href={`/dashboard/${event.id}`} className="group block">
                        <div className="card-premium h-full bg-white/[0.015] border border-white/[0.05] rounded-xl p-5 transition-all duration-300 hover:bg-white/[0.03] hover:border-white/[0.08] hover:-translate-y-0.5">
                            {/* Top row: status + arrow */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" : "bg-zinc-600"}`} />
                                    <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${isActive ? "text-emerald-400/70" : "text-zinc-500"}`}>
                                        {isActive ? "Live" : "Ended"}
                                    </span>
                                </div>

                                <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5">
                                    <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                    </svg>
                                </div>
                            </div>

                            {/* Event name */}
                            <h3 className="text-white/90 text-base font-semibold leading-snug mb-1 line-clamp-1 group-hover:text-white transition-colors tracking-tight">
                                {event.name}
                            </h3>

                            {/* Metadata */}
                            <div className="mt-5 pt-4 border-t border-white/[0.04] space-y-2.5">
                                <div className="flex items-center gap-2.5 text-white/25 text-[12px]">
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    <span className="truncate">
                                        {new Date(event.event_date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 text-white/25 text-[12px]">
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    <span className="truncate">{event.organizer_email}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
