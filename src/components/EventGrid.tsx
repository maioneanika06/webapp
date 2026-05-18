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
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/[0.05] border border-white/[0.1] rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                    </svg>
                </div>
                <p className="text-white/60 font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <Link key={event.id} href={`/dashboard/${event.id}`} className="group block">
                    <div className={`h-full backdrop-blur-xl bg-white/[0.02] border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.04] ${event.status === 'ACTIVE' ? 'border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10' : 'border-gray-500/20 hover:border-gray-500/40'}`}>
                        <div className="flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${event.status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/20' : 'bg-gray-500/10 border-gray-500/20'}`}>
                                    <div className={`w-3 h-3 rounded-full ${event.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg border text-[10px] uppercase tracking-wider font-semibold ${event.status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-400'}`}>
                                    {event.status}
                                </div>
                            </div>
                            
                            <h3 className="text-white text-lg font-bold mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">{event.name}</h3>
                            
                            <div className="mt-auto space-y-2 pt-4">
                                <div className="flex items-center gap-2 text-white/40 text-sm">
                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                                <div className="flex items-center gap-2 text-white/40 text-sm">
                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    <span className="truncate">{event.organizer_email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
