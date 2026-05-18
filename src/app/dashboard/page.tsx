"use client";

import { useEffect } from "react";
import EventGrid from "@/components/EventGrid";
import { useActiveEventContext } from "./layout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function GlobalDashboard() {
    const { user, loading: authLoading } = useAuth();
    const isSuperAdmin = user?.email === "vendy.system@gmail.com";
    
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
                <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (isSuperAdmin) {
        const activeEvents = events.filter(e => e.status === "ACTIVE");

        return (
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Active Events</h2>
                    <p className="text-white/40 text-sm mt-1">Manage ongoing vending machine events</p>
                </div>

                <EventGrid 
                    events={activeEvents} 
                    emptyMessage="No active events found. Create a new event to get started." 
                />
            </div>
        );
    }

    // For Staff, show all their assigned events
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">My Events</h2>
                <p className="text-white/40 text-sm mt-1">Select an event to view its dashboard</p>
            </div>

            <EventGrid 
                events={events} 
                emptyMessage="You have no events assigned to your email." 
            />
        </div>
    );
}
