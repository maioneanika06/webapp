"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Event } from "@/types";

export function useActiveEvent() {
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching events:", error);
            setLoading(false);
            return;
        }

        setEvents(data || []);
        const active = data?.find((e: Event) => e.is_active) || null;
        setActiveEvent(active);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const createEvent = useCallback(
        async (name: string, eventDate: string) => {
            const { data, error } = await supabase
                .from("events")
                .insert({ name, event_date: eventDate, is_active: true })
                .select()
                .single();

            if (error) throw error;
            await fetchEvents();
            return data;
        },
        [fetchEvents]
    );

    const endEvent = useCallback(
        async (eventId: string) => {
            const { error } = await supabase
                .from("events")
                .update({ is_active: false })
                .eq("id", eventId);

            if (error) throw error;
            await fetchEvents();
        },
        [fetchEvents]
    );

    return { activeEvent, events, loading, createEvent, endEvent, refetch: fetchEvents };
}
