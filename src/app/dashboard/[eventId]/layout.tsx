"use client";

import { useEffect } from "react";
import { useActiveEventContext } from "../layout";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function EventLayout({ children }: { children: React.ReactNode }) {
    const { events, setActiveEvent, loading: eventsLoading } = useActiveEventContext();
    const { loading: authLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    
    useEffect(() => {
        if (!eventsLoading && !authLoading) {
            if (params.eventId) {
                const ev = events.find(e => e.id === params.eventId);
                if (ev) {
                    setActiveEvent(ev);
                } else {
                    // Redirect to dashboard if event not found
                    router.push("/dashboard");
                }
            }
        }
    }, [events, params.eventId, setActiveEvent, eventsLoading, authLoading, router]);

    if (eventsLoading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-purple-800/35 border-t-purple-400 rounded-full animate-spin" />
                    <p className="text-slate-500 text-[13px]">Loading event data...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

