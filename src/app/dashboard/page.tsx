"use client";

import { useEffect } from "react";
import EventGrid from "@/components/EventGrid";
import { useActiveEventContext } from "./layout";
import { useAuth } from "@/hooks/useAuth";
import { isSuperAdminEmail } from "@/lib/admin";

export default function GlobalDashboard() {
    const { user, loading: authLoading } = useAuth();
    const isSuperAdmin = isSuperAdminEmail(user?.email);
    
    const { activeEvent, events, loading: eventsLoading, setActiveEvent } = useActiveEventContext();

    // Clear the activeEvent when visiting the global dashboard 
    useEffect(() => {
        if (activeEvent) {
            setActiveEvent(null);
        }
    }, [activeEvent, setActiveEvent]);

    if (authLoading || eventsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-purple-500/15 border-t-purple-400 rounded-full animate-spin" />
            </div>
        );
    }

    if (isSuperAdmin) {
        const activeEvents = events.filter(e => e.status === "ACTIVE");

        return (
            <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Active Events</h2>
                    <p className="text-slate-400 text-[13px] mt-1">Manage ongoing vending machine events</p>
                </div>

                <EventGrid 
                    events={activeEvents} 
                    emptyMessage="No active events found. Create a new event to get started." 
                />
            </div>
        );
    }

    //for event staff, show all their assigned events
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
            <div>
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">My Events</h2>
                <p className="text-slate-400 text-[13px] mt-1">Select an event to view its dashboard</p>
            </div>

            <EventGrid 
                events={events} 
                emptyMessage="You have no events assigned to your email." 
            />
        </div>
    );
}

