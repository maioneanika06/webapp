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
            <div className="flex h-dvh overflow-hidden bg-[#f8f7fb] text-slate-800">
                <Sidebar />
                <div className="min-w-0 flex-1 flex flex-col h-dvh overflow-hidden">
                    <Header activeEvent={eventState.activeEvent} />
                    <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 bg-[#f8f7fb]">
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
