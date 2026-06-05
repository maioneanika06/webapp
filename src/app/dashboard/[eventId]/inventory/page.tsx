"use client";

import InventoryPanel from "@/components/InventoryPanel";
import { useInventory } from "@/hooks/useInventory";
import { useActiveEventContext } from "../../layout";

export default function InventoryPage() {
    const { activeEvent } = useActiveEventContext();
    const { slots, loading, updateSlot, restockSlot } = useInventory(activeEvent?.id ?? null);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Inventory Management</h2>
                <p className="text-slate-500 text-sm mt-1">
                    {activeEvent
                        ? `Vending machine slots for ${activeEvent.name}`
                        : "Select an active event to manage inventory"}
                </p>
            </div>

            {!activeEvent ? (
                <div className="bg-white border border-amber-500/20 rounded-2xl p-12 text-center">
                    <svg className="w-12 h-12 text-amber-400/40 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <p className="text-amber-700 font-medium">No Active Event</p>
                    <p className="text-slate-400 text-sm mt-1">Go to the Overview page to create or activate an event</p>
                </div>
            ) : (
                <InventoryPanel
                    slots={slots}
                    loading={loading}
                    onUpdateSlot={updateSlot}
                    onRestockSlot={restockSlot}
                    isReadOnly={activeEvent.status !== "ACTIVE"}
                />
            )}
        </div>
    );
}


