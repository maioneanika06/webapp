"use client";

import { useEffect, useRef } from "react";
import type { Event } from "@/types";
import { useInventory } from "@/hooks/useInventory";
import { logLatency } from "@/lib/latency";

interface HeaderProps {
    activeEvent: Event | null;
}

export default function Header({ activeEvent }: HeaderProps) {
    const alertStart = useRef<number | null>(null);
    const { slots, loading } = useInventory(activeEvent?.id ?? null);
    const outOfStockSlots = slots.filter((slot) => Number(slot.stock_count) === 0);
    const lowStockSlots = slots.filter((slot) => {
        const stock = Number(slot.stock_count);
        const threshold = Number(slot.low_stock_threshold ?? 2);
        return stock > 0 && stock <= threshold;
    });
    const hasStockAlert = !loading && activeEvent?.status === "ACTIVE" && (outOfStockSlots.length > 0 || lowStockSlots.length > 0);
    const stockAlertText = outOfStockSlots.length > 0
        ? `${outOfStockSlots.length} out of stock${lowStockSlots.length > 0 ? `, ${lowStockSlots.length} low` : ""}`
        : `${lowStockSlots.length} low stock`;
    const stockAlertTitle = [
        outOfStockSlots.length > 0
            ? `Out of stock: ${outOfStockSlots.map((slot) => `Slot ${slot.slot_number}`).join(", ")}`
            : "",
        lowStockSlots.length > 0
            ? `Low stock: ${lowStockSlots.map((slot) => `Slot ${slot.slot_number}`).join(", ")}`
            : "",
    ].filter(Boolean).join(" | ");

    useEffect(() => {
        if (!hasStockAlert) {
            alertStart.current = null;
            return;
        }

        const startedAt = alertStart.current ?? performance.now();
        logLatency("Low-Stock Alert Display", startedAt, "success", {
            outOfStock: outOfStockSlots.length,
            lowStock: lowStockSlots.length,
        });
        alertStart.current = performance.now();
    }, [hasStockAlert, outOfStockSlots.length, lowStockSlots.length]);

    return (
        <header className="relative z-10 h-14 shrink-0 flex items-center justify-between px-8 bg-white/90 backdrop-blur-xl border-b border-purple-100 shadow-sm shadow-purple-950/[0.03]">
            {/* Soft bottom edge — gradient instead of border */}
            <div className="hidden" />

            {/* Active Event Indicator */}
            <div className="flex items-center gap-3">
                {activeEvent ? (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${activeEvent.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]' : 'bg-slate-400'}`} />
                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${activeEvent.status === 'ACTIVE' ? 'text-emerald-700' : 'text-slate-500'}`}>
                                {activeEvent.status === 'ACTIVE' ? 'Live' : activeEvent.status}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-purple-100" />
                        <p className="text-slate-700 text-[13px] font-semibold tracking-tight">{activeEvent.name}</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500/60" />
                        <span className="text-slate-500 text-[12px] font-semibold tracking-wide">Dashboard</span>
                    </div>
                )}
            </div>

            {/* Right side - date */}
            <div className="flex items-center gap-4">
                {hasStockAlert && (
                    <div
                        title={stockAlertTitle}
                        className={`hidden sm:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] font-semibold ${
                            outOfStockSlots.length > 0
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                    >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                        </svg>
                        <span>Inventory alert: {stockAlertText}</span>
                    </div>
                )}
                {activeEvent && (
                    <p className="text-slate-400 text-[12px] font-medium">
                        {new Date(activeEvent.event_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                )}
            </div>
        </header>
    );
}

