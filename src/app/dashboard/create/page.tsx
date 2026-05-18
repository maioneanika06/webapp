"use client";

import { useState, useEffect } from "react";
import { useActiveEventContext } from "../layout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CreateEventDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const isSuperAdmin = user?.email === "vendy.system@gmail.com";
    
    const { activeEvent, setActiveEvent, createEvent } = useActiveEventContext();

    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [organizerEmail, setOrganizerEmail] = useState("");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    // If staff, they shouldn't be here. Redirect them to dashboard.
    useEffect(() => {
        if (!authLoading && !isSuperAdmin) {
            router.push("/dashboard");
        }
    }, [authLoading, isSuperAdmin, router]);

    // For Super Admin, we clear the activeEvent when they visit a global dashboard page
    useEffect(() => {
        if (isSuperAdmin && activeEvent) {
            setActiveEvent(null);
        }
    }, [isSuperAdmin, activeEvent, setActiveEvent]);

    const handleCreate = async () => {
        if (!eventName.trim() || !eventDate || !organizerEmail.trim()) return;
        setCreating(true);
        setError("");
        try {
            await createEvent(eventName.trim(), eventDate, organizerEmail.trim());
            // Redirect to Active Events grid on success
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create event");
            setCreating(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isSuperAdmin) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                <p className="text-white/40 text-sm mt-1">Set up a new vending machine event portal</p>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Event Name</label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="e.g., Tech Conference 2026"
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Event Date</label>
                        <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all [color-scheme:dark]"
                        />
                    </div>
                    <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Organizer Email</label>
                        <input
                            type="email"
                            value={organizerEmail}
                            onChange={(e) => setOrganizerEmail(e.target.value)}
                            placeholder="organizer@example.com"
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                        />
                        <p className="text-white/30 text-xs mt-2">
                            The organizer will receive an email to access their event dashboard.
                        </p>
                    </div>

                    {error && (
                        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                    
                    <div className="pt-4">
                        <button
                            onClick={handleCreate}
                            disabled={creating || !eventName.trim() || !eventDate || !organizerEmail.trim()}
                            className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-purple-500/20 cursor-pointer flex items-center justify-center gap-2"
                        >
                            {creating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Event...
                                </>
                            ) : "Create Event"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
