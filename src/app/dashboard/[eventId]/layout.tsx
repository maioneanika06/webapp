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
                    <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-white/40 text-sm">Loading event data...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
