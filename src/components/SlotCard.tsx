"use client";

import { useEffect, useState } from "react";
import type { InventorySlot } from "@/types";

interface SlotCardProps {
    slot: InventorySlot;
    onUpdate: (slotId: string, updates: Partial<Pick<InventorySlot, "assigned_role">>) => Promise<void>;
    onRestock: (slotId: string) => Promise<void>;
    isReadOnly?: boolean;
}

const MAX_CAPACITY = 5;

export default function SlotCard({ slot, onUpdate, onRestock, isReadOnly = false }: SlotCardProps) {
    const [role, setRole] = useState(slot.assigned_role);
    const [savingRole, setSavingRole] = useState(false);
    const [restocking, setRestocking] = useState(false);

    useEffect(() => {
        setRole(slot.assigned_role);
    }, [slot.assigned_role]);

    const currentStock = Math.min(MAX_CAPACITY, Math.max(0, slot.stock_count));
    const isOutOfStock = currentStock === 0;
    const isLowStock = currentStock > 0 && currentStock <= 2;
    const stockPercent = (currentStock / MAX_CAPACITY) * 100;

    const roleColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
        VIP: { bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
        Speaker: { bg: "bg-sky-500/10", text: "text-sky-300", border: "border-sky-500/20", glow: "shadow-sky-500/10" },
        Attendee: { bg: "bg-purple-500/10", text: "text-purple-300", border: "border-purple-500/20", glow: "shadow-purple-500/10" },
    };

    const colors = roleColors[slot.assigned_role] || roleColors.Attendee;
    const statusLabel = isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock";
    const statusClass = isOutOfStock
        ? "bg-red-500/10 text-red-300 border-red-500/20"
        : isLowStock
            ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
            : "bg-green-500/10 text-green-300 border-green-500/20";

    const handleRoleSave = async () => {
        if (role === slot.assigned_role) return;

        setSavingRole(true);
        try {
            await onUpdate(slot.id, { assigned_role: role });
        } catch (err) {
            console.error("Failed to update slot role:", err);
            setRole(slot.assigned_role);
        } finally {
            setSavingRole(false);
        }
    };

    const handleRestock = async () => {
        setRestocking(true);
        try {
            await onRestock(slot.id);
        } catch (err) {
            console.error("Failed to restock slot:", err);
        } finally {
            setRestocking(false);
        }
    };

    return (
        <div className={`backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 transition-all duration-300 hover:border-white/[0.1] hover:shadow-lg ${colors.glow}`}>
            <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                        <span className={`text-lg font-bold ${colors.text}`}>{slot.slot_number}</span>
                    </div>
                    <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider">Slot {slot.slot_number}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md ${colors.bg} ${colors.text} ${colors.border} border mt-0.5`}>
                            {slot.assigned_role}
                        </span>
                    </div>
                </div>

                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border ${statusClass}`}>
                    {statusLabel}
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-white/40 text-xs mb-1">Role Type</label>
                    <div className="flex gap-2">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as InventorySlot["assigned_role"])}
                            disabled={isReadOnly || savingRole}
                            className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/40 cursor-pointer [color-scheme:dark] disabled:opacity-50"
                        >
                            <option value="VIP">VIP</option>
                            <option value="Speaker">Speaker</option>
                            <option value="Attendee">Attendee</option>
                        </select>
                        <button
                            onClick={handleRoleSave}
                            disabled={isReadOnly || savingRole || role === slot.assigned_role}
                            className="px-3 py-2 text-xs font-medium text-white/80 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {savingRole ? "Saving" : "Save"}
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Current Stock</p>
                            <p className={`text-4xl font-bold mt-1 ${isOutOfStock ? "text-red-400" : isLowStock ? "text-amber-400" : "text-white"}`}>
                                {currentStock}
                                <span className="text-base text-white/30 font-medium">/{MAX_CAPACITY}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleRestock}
                            disabled={isReadOnly || restocking || currentStock === MAX_CAPACITY}
                            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-green-200 bg-green-500/15 hover:bg-green-500/25 border border-green-500/25 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {restocking ? "Restocking" : "Restock"}
                        </button>
                    </div>

                    <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden mt-4">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isOutOfStock ? "bg-red-500" : isLowStock ? "bg-amber-400" : "bg-green-400"}`}
                            style={{ width: `${stockPercent}%` }}
                        />
                    </div>
                </div>

                {(isLowStock || isOutOfStock) && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isOutOfStock ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/20"}`}>
                        <svg className={`w-4 h-4 flex-shrink-0 ${isOutOfStock ? "text-red-400" : "text-amber-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008zM2.697 16.126 10.102 3.3c.866-1.5 3.03-1.5 3.896 0l7.405 12.826c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.731 0-2.814-1.874-1.948-3.374z" />
                        </svg>
                        <span className={`text-xs font-medium ${isOutOfStock ? "text-red-300" : "text-amber-300"}`}>
                            {isOutOfStock ? "Slot has no remaining items." : "Slot is low after 3 confirmed dispenses."}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
