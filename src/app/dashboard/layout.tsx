"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import React, { createContext, useContext } from "react";
import type { Event } from "@/types";

interface ActiveEventContextType {
    activeEvent: Event | null;
    setActiveEvent: (event: Event | null) => void;
    events: Event[];
    loading: boolean;
    createEvent: (name: string, date: string, organizerEmail: string) => Promise<unknown>;
    endEvent: (eventId: string) => Promise<void>;
    refetch: () => Promise<void>;
}

const ActiveEventContext = createContext<ActiveEventContextType>({
    activeEvent: null,
    setActiveEvent: () => { },
    events: [],
    loading: true,
    createEvent: async () => { },
    endEvent: async () => { },
    refetch: async () => { },
});

export const useActiveEventContext = () => useContext(ActiveEventContext);

function DashboardContent({ children }: { children: React.ReactNode }) {
    const eventState = useActiveEvent();

    return (
        <ActiveEventContext.Provider value={eventState}>
            <div className="flex min-h-screen bg-gray-950">
                <Sidebar />
                <div className="flex-1 flex flex-col min-h-screen">
                    <Header activeEvent={eventState.activeEvent} />
                    <main className="flex-1 p-8 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ActiveEventContext.Provider>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <DashboardContent>{children}</DashboardContent>
        </ProtectedRoute>
    );
}
