"use client";

import { useEffect } from "react";
import EventGrid from "@/components/EventGrid";
import { useActiveEventContext } from "../layout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { isSuperAdminEmail } from "@/lib/admin";

export default function CompletedEventsDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const isSuperAdmin = isSuperAdminEmail(user?.email);
    
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
                <div className="w-8 h-8 border-2 border-purple-500/15 border-t-purple-400 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isSuperAdmin) {
        return null;
    }

    const completedEvents = events.filter(e => e.status === "ENDED");

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
            <div>
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Completed Events</h2>
                <p className="text-slate-400 text-[13px] mt-1">View history of finished vending machine events</p>
            </div>

            <EventGrid 
                events={completedEvents} 
                emptyMessage="No completed events found yet." 
            />
        </div>
    );
}

