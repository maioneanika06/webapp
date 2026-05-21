"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Event } from "@/types";
import { useAuth } from "./useAuth";

export function useActiveEvent() {
    const { user } = useAuth();
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        let query = supabase.from("events").select("*").order("created_at", { ascending: false });

        // Super Admin gets all events, Event Staff gets all their events
        if (user.email !== "vendy.system@gmail.com") {
            query = query.eq("organizer_email", user.email);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching events:", error);
            setLoading(false);
            return;
        }

        setEvents(data || []);
        
        // For Super Admin, we might just default to the first active event or null
        // For Event Staff, they should only have one active event anyway
        const active = data?.find((e: Event) => e.status === "ACTIVE") || null;
        setActiveEvent(active);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEvents();
    }, [fetchEvents]);

    const createEvent = useCallback(
        async (name: string, eventDate: string, organizerEmail: string) => {
            const { data, error } = await supabase
                .from("events")
                .insert({ 
                    name, 
                    event_date: eventDate, 
                    organizer_email: organizerEmail,
                    status: "ACTIVE" 
                })
                .select()
                .single();

            if (error) throw error;
            
            if (data) {
                // Auto-generate 6 inventory slots for the new event
                const slots = Array.from({ length: 6 }, (_, i) => ({
                    event_id: data.id,
                    slot_number: i + 1,
                    assigned_role: "Attendee",
                    stock_count: 5,
                    low_stock_threshold: 2
                }));

                const { error: inventoryError } = await supabase
                    .from("inventory")
                    .insert(slots);

                if (inventoryError) {
                    console.error("Failed to generate inventory slots:", inventoryError.message || JSON.stringify(inventoryError));
                }

                // Notify staff
                try {
                    await fetch("/api/notify-staff", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            organizerEmail,
                            eventId: data.id,
                        }),
                    });
                } catch (err) {
                    console.error("Failed to notify staff:", err);
                    // We still want the creation to succeed even if notification fails
                }
            }

            await fetchEvents();
            return data;
        },
        [fetchEvents]
    );

    const endEvent = useCallback(
        async (eventId: string) => {
            const { error } = await supabase
                .from("events")
                .update({ status: "ENDED" })
                .eq("id", eventId);

            if (error) throw error;
            await fetchEvents();
        },
        [fetchEvents]
    );

    return { activeEvent, setActiveEvent, events, loading, createEvent, endEvent, refetch: fetchEvents };
}
