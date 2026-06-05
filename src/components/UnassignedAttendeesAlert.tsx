"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Event } from "@/types";

interface UnassignedAttendeesAlertProps {
    activeEvent: Event;
    onFixed?: () => void;
}

export default function UnassignedAttendeesAlert({ activeEvent, onFixed }: UnassignedAttendeesAlertProps) {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fixing, setFixing] = useState(false);

    const checkUnassigned = async () => {
        try {
            const { count, error } = await supabase
                .from("attendees")
                .select("*", { count: "exact", head: true })
                .is("event_id", null);

            if (!error && count !== null) {
                setCount(count);
            }
        } catch (err) {
            console.error("Failed to check unassigned attendees", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUnassigned();

        // Subscribe to changes to auto-update count
        const channel = supabase
            .channel("unassigned-check")
            .on("postgres_changes", { event: "*", schema: "public", table: "attendees" }, () => {
                checkUnassigned();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleFix = async () => {
        setFixing(true);
        try {
            const { error } = await supabase
                .from("attendees")
                .update({ event_id: activeEvent.id })
                .is("event_id", null);

            if (error) throw error;

            // Refresh count
            await checkUnassigned();

            // Notify parent to refresh list
            if (onFixed) onFixed();

        } catch (err) {
            console.error("Failed to fix attendees", err);
            alert("Failed to sync attendees. Please try again.");
        } finally {
            setFixing(false);
        }
    };

    if (loading || count === 0) return null;

    return (
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100 text-amber-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-amber-800 font-semibold text-sm">Sync Issue Detected</h4>
                    <p className="text-amber-700 text-xs mt-0.5">
                        Found {count} attendee{count !== 1 ? "s" : ""} registered without an assigned event.
                    </p>
                </div>
            </div>

            <button
                onClick={handleFix}
                disabled={fixing}
                className="px-4 py-2 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 cursor-pointer"
            >
                {fixing ? "Syncing..." : "Sync Attendees Now"}
            </button>
        </div>
    );
}

