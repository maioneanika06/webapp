"use client";

import UsersTable from "@/components/UsersTable";
import UnassignedAttendeesAlert from "@/components/UnassignedAttendeesAlert";
import { useAttendees } from "@/hooks/useAttendees";
import { useActiveEventContext } from "../../layout";

export default function UsersPage() {
    const { activeEvent } = useActiveEventContext();
    const {
        attendees,
        totalCount,
        loading,
        searchQuery,
        setSearchQuery,
        filterRole,
        setFilterRole,
        filterClaimedStatus,
        setFilterClaimedStatus,
        refetch,
        updateAttendeeLocal,
    } = useAttendees(activeEvent?.id ?? null);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Users Management</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {activeEvent
                            ? `Attendees for ${activeEvent.name}`
                            : "Select an active event to view attendees"}
                    </p>
                </div>
                {activeEvent && (
                    <div className="flex items-center gap-2">
                        {activeEvent.status === "ACTIVE" ? (
                            <>
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-emerald-600 text-xs font-medium">Live Updates</span>
                            </>
                        ) : (
                            <>
                                <div className="w-2 h-2 rounded-full bg-zinc-500" />
                                <span className="text-slate-500 text-xs font-medium">Read Only</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {!activeEvent ? (
                <div className="backdrop-blur-xl bg-white border border-amber-500/20 rounded-2xl p-12 text-center">
                    <svg className="w-12 h-12 text-amber-400/40 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <p className="text-amber-700 font-medium">No Active Event</p>
                    <p className="text-slate-400 text-sm mt-1">Go to the Overview page to create or activate an event</p>
                </div>
            ) : (
                <>
                    <UnassignedAttendeesAlert
                        activeEvent={activeEvent}
                        onFixed={() => {
                            if (refetch) refetch();
                        }}
                    />
                    <UsersTable
                        attendees={attendees}
                        totalCount={totalCount}
                        loading={loading}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        filterRole={filterRole}
                        onFilterRoleChange={setFilterRole}
                        filterClaimedStatus={filterClaimedStatus}
                        onFilterClaimedChange={setFilterClaimedStatus}
                        onRoleUpdated={updateAttendeeLocal}
                        isReadOnly={activeEvent?.status !== "ACTIVE"}
                    />
                </>
            )}
        </div>
    );
}

