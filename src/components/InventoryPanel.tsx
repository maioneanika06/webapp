"use client";

import type { InventorySlot } from "@/types";
import SlotCard from "./SlotCard";

interface InventoryPanelProps {
    slots: InventorySlot[];
    loading: boolean;
    onUpdateSlot: (slotId: string, updates: Partial<Pick<InventorySlot, "assigned_role" | "stock_count" | "low_stock_threshold">>) => Promise<void>;
}

export default function InventoryPanel({ slots, loading, onUpdateSlot }: InventoryPanelProps) {
    if (loading) {
        return (
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-white/40 text-sm">Loading inventory...</p>
                </div>
            </div>
        );
    }

    const totalStock = slots.reduce((acc, s) => acc + s.stock_count, 0);
    const lowStockCount = slots.filter((s) => s.stock_count > 0 && s.stock_count <= s.low_stock_threshold).length;
    const outOfStockCount = slots.filter((s) => s.stock_count === 0).length;

    return (
        <div className="space-y-6">
            {/* Stats bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                    <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Total Stock</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalStock}</p>
                </div>
                <div className="backdrop-blur-xl bg-white/[0.02] border border-amber-500/10 rounded-2xl p-5">
                    <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Low Stock Slots</p>
                    <p className="text-3xl font-bold text-amber-400 mt-1">{lowStockCount}</p>
                </div>
                <div className="backdrop-blur-xl bg-white/[0.02] border border-red-500/10 rounded-2xl p-5">
                    <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Out of Stock</p>
                    <p className="text-3xl font-bold text-red-400 mt-1">{outOfStockCount}</p>
                </div>
            </div>

            {/* Slot Grid - Control Panel layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {slots.map((slot) => (
                    <SlotCard key={slot.id} slot={slot} onUpdate={onUpdateSlot} />
                ))}
            </div>

            {slots.length === 0 && (
                <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center">
                    <p className="text-white/30 text-sm">No inventory slots configured. Create an event to initialize 6 vending machine slots.</p>
                </div>
            )}
        </div>
    );
}
