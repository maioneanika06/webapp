"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Attendee } from "@/types";

export function useAttendees(eventId: string | null) {
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState<"all" | "attendee" | "vip" | "speaker">("all");
    const [filterClaimedStatus, setFilterClaimedStatus] = useState<"all" | "claimed" | "unclaimed">("all");

    const fetchAttendees = useCallback(async () => {
        if (!eventId) {
            setAttendees([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from("attendees")
            .select("*")
            .eq("event_id", eventId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching attendees:", error.message || JSON.stringify(error));
            setLoading(false);
            return;
        }

        setAttendees(data || []);
        setLoading(false);
    }, [eventId]);

    useEffect(() => {
        fetchAttendees();
    }, [fetchAttendees]);

    // Real-time subscription
    useEffect(() => {
        if (!eventId) return;

        const channel = supabase
            .channel("attendees-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "attendees",
                    filter: `event_id=eq.${eventId}`,
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setAttendees((prev) => [payload.new as Attendee, ...prev]);
                    } else if (payload.eventType === "UPDATE") {
                        setAttendees((prev) =>
                            prev.map((a) => (a.id === (payload.new as Attendee).id ? (payload.new as Attendee) : a))
                        );
                    } else if (payload.eventType === "DELETE") {
                        setAttendees((prev) => prev.filter((a) => a.id !== (payload.old as Attendee).id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [eventId]);

    // Filtered attendees
    const filteredAttendees = attendees.filter((a) => {
        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                (a.full_name && a.full_name.toLowerCase().includes(q)) ||
                (a.email && a.email.toLowerCase().includes(q)) ||
                (a.company && a.company.toLowerCase().includes(q)) ||
                (a.id && a.id.toLowerCase().includes(q));
            if (!matchesSearch) return false;
        }

        // Claimed status filter
        // If claimed_status is null/undefined, it defaults to unclaimed
        const isClaimed = a.claimed_status === 'Claimed';
        if (filterClaimedStatus === "claimed" && !isClaimed) return false;
        if (filterClaimedStatus === "unclaimed" && isClaimed) return false;

        // Role filter - case insensitive to match 'Attendee', 'Speaker', 'VIP' to lowercase states
        if (filterRole !== "all") {
            const role = (a.role || "attendee").toLowerCase();
            if (role !== filterRole) return false;
        }

        return true;
    });

    const updateAttendeeLocal = useCallback((id: string, newRole: Attendee["role"]) => {
        setAttendees(prev => prev.map(a => a.id === id ? { ...a, role: newRole } : a));
    }, []);

    return {
        attendees: filteredAttendees,
        totalCount: attendees.length,
        loading,
        searchQuery,
        setSearchQuery,
        filterRole,
        setFilterRole,
        filterClaimedStatus,
        setFilterClaimedStatus,
        refetch: fetchAttendees,
        updateAttendeeLocal,
    };
}
