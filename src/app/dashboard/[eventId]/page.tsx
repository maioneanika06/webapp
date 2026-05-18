"use client";

import { useState } from "react";
import { useActiveEventContext } from "../layout";
import { useAttendees } from "@/hooks/useAttendees";

export default function EventOverview() {
    const { activeEvent, endEvent } = useActiveEventContext();
    const { totalCount, attendees, loading: attendeesLoading } = useAttendees(activeEvent?.id ?? null);
    const [ending, setEnding] = useState(false);

    const claimedCount = attendees.filter((a) => a.claimed_status === 'Claimed').length;

    if (!activeEvent) return null;

    const handleEndEvent = async () => {
        if (activeEvent.status !== 'ACTIVE') return;
        
        const confirm = window.confirm('Are you sure you want to end this event? This action cannot be undone.');
        if (!confirm) return;

        setEnding(true);
        try {
            await endEvent(activeEvent.id);
        } catch (error) {
            console.error("Failed to end event:", error);
            alert("Failed to end event.");
        } finally {
            setEnding(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-white">Event Overview</h2>
                <p className="text-white/40 text-sm mt-1">Key metrics for {activeEvent.name}</p>
            </div>

            {/* Event Details Card */}
            <div className={`backdrop-blur-xl bg-white/[0.02] border rounded-2xl p-6 ${activeEvent.status === 'ACTIVE' ? 'border-green-500/20' : 'border-gray-500/20'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${activeEvent.status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/20' : 'bg-gray-500/10 border-gray-500/20'}`}>
                            <div className={`w-3 h-3 rounded-full ${activeEvent.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                        </div>
                        <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider font-medium">
                                {activeEvent.status === 'ACTIVE' ? 'Active Event' : 'Ended Event'}
                            </p>
                            <h3 className="text-white text-xl font-bold mt-0.5">{activeEvent.name}</h3>
                            <p className="text-white/40 text-sm">
                                {new Date(activeEvent.event_date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                    {activeEvent.status === 'ACTIVE' && (
                        <button
                            onClick={handleEndEvent}
                            disabled={ending}
                            className="px-5 py-2.5 text-sm font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer"
                        >
                            {ending ? "Ending..." : "End Event"}
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            {!attendeesLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                        <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Total Attendees</p>
                        <p className="text-3xl font-bold text-white mt-1">{totalCount}</p>
                    </div>
                    <div className="backdrop-blur-xl bg-white/[0.02] border border-green-500/10 rounded-2xl p-5">
                        <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Kits Claimed</p>
                        <p className="text-3xl font-bold text-green-400 mt-1">{claimedCount}</p>
                        <p className="text-white/20 text-xs mt-1">{totalCount > 0 ? Math.round((claimedCount / totalCount) * 100) : 0}% claimed</p>
                    </div>
                    <div className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/10 rounded-2xl p-5">
                        <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Unclaimed</p>
                        <p className="text-3xl font-bold text-purple-300 mt-1">{totalCount - claimedCount}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
