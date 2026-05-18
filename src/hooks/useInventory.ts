"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { InventorySlot } from "@/types";

export function useInventory(eventId: string | null) {
    const [slots, setSlots] = useState<InventorySlot[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSlots = useCallback(async () => {
        if (!eventId) {
            setSlots([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from("inventory")
            .select("*")
            .eq("event_id", eventId)
            .order("slot_number", { ascending: true })
            .limit(6);

        if (error) {
            console.error("Error fetching inventory slots:", error.message || JSON.stringify(error));
            setLoading(false);
            return;
        }

        setSlots(data || []);
        setLoading(false);
    }, [eventId]);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    // Real-time subscription
    useEffect(() => {
        if (!eventId) return;

        const channel = supabase
            .channel("inventory-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "inventory",
                    filter: `event_id=eq.${eventId}`,
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setSlots((prev) => {
                            const newSlots = [...prev, payload.new as InventorySlot];
                            return newSlots.sort((a, b) => a.slot_number - b.slot_number).slice(0, 6);
                        });
                    } else if (payload.eventType === "UPDATE") {
                        setSlots((prev) =>
                            prev.map((s) => (s.id === (payload.new as InventorySlot).id ? (payload.new as InventorySlot) : s))
                        );
                    } else if (payload.eventType === "DELETE") {
                        setSlots((prev) => prev.filter((s) => s.id !== (payload.old as InventorySlot).id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [eventId]);

    const updateSlot = useCallback(
        async (slotId: string, updates: Partial<Pick<InventorySlot, "assigned_role" | "stock_count" | "low_stock_threshold">>) => {
            const { error } = await supabase
                .from("inventory")
                .update(updates)
                .eq("id", slotId);

            if (error) throw error;
            // Realtime will update the UI automatically, but we can also fetch to be safe
            // await fetchSlots();
        },
        []
    );

    return { slots, loading, updateSlot, refetch: fetchSlots };
}
