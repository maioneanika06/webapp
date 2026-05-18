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
            .from("inventory_slots")
            .select("*")
            .eq("event_id", eventId)
            .order("slot_number", { ascending: true })
            .limit(6);

        if (error) {
            console.error("Error fetching inventory slots:", error);
            setLoading(false);
            return;
        }

        setSlots(data || []);
        setLoading(false);
    }, [eventId]);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    const updateSlot = useCallback(
        async (slotId: string, updates: Partial<Pick<InventorySlot, "assigned_role" | "stock_count" | "low_stock_threshold">>) => {
            const { error } = await supabase
                .from("inventory_slots")
                .update(updates)
                .eq("id", slotId);

            if (error) throw error;
            await fetchSlots();
        },
        [fetchSlots]
    );

    return { slots, loading, updateSlot, refetch: fetchSlots };
}
