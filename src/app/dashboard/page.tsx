"use client";

import EventSelector from "@/components/EventSelector";
import { useActiveEventContext } from "./layout";
import { useAttendees } from "@/hooks/useAttendees";

export default function DashboardOverview() {
    const { activeEvent, events, loading, createEvent, endEvent } = useActiveEventContext();
    const { totalCount, attendees, loading: attendeesLoading } = useAttendees(activeEvent?.id ?? null);

    const claimedCount = attendees.filter((a) => a.claimed_status).length;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-white">Event Overview</h2>
                <p className="text-white/40 text-sm mt-1">Manage events and view key metrics</p>
            </div>

            {/* Event Selector / Manager */}
            <EventSelector
                activeEvent={activeEvent}
                events={events}
                loading={loading}
                onCreateEvent={createEvent}
                onEndEvent={endEvent}
            />

            {/* Stats Grid - only show when active event exists */}
            {activeEvent && !attendeesLoading && (
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
