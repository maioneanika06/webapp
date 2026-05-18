"use client";

import { useEffect } from "react";
import EventGrid from "@/components/EventGrid";
import { useActiveEventContext } from "../layout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CompletedEventsDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const isSuperAdmin = user?.email === "vendy.system@gmail.com";
    
    const { activeEvent, events, loading: eventsLoading, setActiveEvent } = useActiveEventContext();

    // If staff, they shouldn't be here. Redirect them to dashboard.
    useEffect(() => {
        if (!authLoading && !isSuperAdmin) {
            router.push("/dashboard");
        }
    }, [authLoading, isSuperAdmin, router]);

    // For Super Admin, we clear the activeEvent when they visit the global dashboard
    useEffect(() => {
        if (isSuperAdmin && activeEvent) {
            setActiveEvent(null);
        }
    }, [isSuperAdmin, activeEvent, setActiveEvent]);

    if (authLoading || eventsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isSuperAdmin) {
        return null;
    }

    const completedEvents = events.filter(e => e.status === "ENDED");

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Completed Events</h2>
                <p className="text-white/40 text-sm mt-1">View history of finished vending machine events</p>
            </div>

            <EventGrid 
                events={completedEvents} 
                emptyMessage="No completed events found yet." 
            />
        </div>
    );
}
