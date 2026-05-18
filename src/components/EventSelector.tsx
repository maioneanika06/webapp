"use client";

import { useState } from "react";
import type { Event } from "@/types";

interface EventSelectorProps {
    activeEvent: Event | null;
    events: Event[];
    loading: boolean;
    onCreateEvent: (name: string, date: string) => Promise<unknown>;
    onEndEvent: (eventId: string) => Promise<void>;
}

export default function EventSelector({
    activeEvent,
    events,
    loading,
    onCreateEvent,
    onEndEvent,
}: EventSelectorProps) {
    const [showCreate, setShowCreate] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [creating, setCreating] = useState(false);
    const [ending, setEnding] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async () => {
        if (!eventName.trim() || !eventDate) return;
        setCreating(true);
        setError("");
        try {
            await onCreateEvent(eventName.trim(), eventDate);
            setEventName("");
            setEventDate("");
            setShowCreate(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create event");
        } finally {
            setCreating(false);
        }
    };

    const handleEnd = async () => {
        if (!activeEvent) return;
        setEnding(true);
        try {
            await onEndEvent(activeEvent.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to end event");
        } finally {
            setEnding(false);
        }
    };

    if (loading) {
        return (
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-white/40 text-sm">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Active Event Card */}
            {activeEvent ? (
                <div className="backdrop-blur-xl bg-white/[0.02] border border-green-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                            </div>
                            <div>
                                <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Active Event</p>
                                <h3 className="text-white text-xl font-bold mt-0.5">{activeEvent.name}</h3>
                                <p className="text-white/40 text-sm">
                                    {new Date(activeEvent.event_date).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleEnd}
                            disabled={ending}
                            className="px-5 py-2.5 text-sm font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer"
                        >
                            {ending ? "Ending..." : "End Event"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="backdrop-blur-xl bg-white/[0.02] border border-amber-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-amber-300 font-medium">No Active Event</p>
                            <p className="text-white/40 text-sm">Create a new event to get started</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Event */}
            {!activeEvent && (
                <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                    {!showCreate ? (
                        <button
                            onClick={() => setShowCreate(true)}
                            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-purple-300 bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 hover:border-purple-500/30 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Create New Event
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <h4 className="text-white font-semibold">Create New Event</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            </div>
                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCreate}
                                    disabled={creating || !eventName.trim() || !eventDate}
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-purple-500/20 cursor-pointer"
                                >
                                    {creating ? "Creating..." : "Create Event"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCreate(false);
                                        setError("");
                                    }}
                                    className="px-6 py-2.5 text-sm font-medium text-white/40 hover:text-white/60 bg-white/[0.03] border border-white/[0.06] rounded-xl transition-all duration-200 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
