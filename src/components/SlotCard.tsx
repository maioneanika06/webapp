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
const ROLE_LABELS: Record<InventorySlot["assigned_role"], string> = {
    attendee: "Attendee",
    vip: "VIP",
    speaker: "Speaker",
};

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

    const roleColors: Record<string, { bg: string; text: string; border: string }> = {
        vip: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-300" },
        speaker: { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-300" },
        attendee: { bg: "bg-[#f4ecfb]", text: "text-purple-900", border: "border-purple-800/35" },
    };

    const colors = roleColors[slot.assigned_role] || roleColors.attendee;
    const statusLabel = isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock";
    const statusClass = isOutOfStock
        ? "bg-red-50 text-red-700 border-red-200"
        : isLowStock
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200";

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
        <div className="bg-white border border-purple-800/25 rounded-2xl p-5 transition-colors duration-200 hover:border-purple-800/35">
            <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                        <span className={`text-lg font-bold ${colors.text}`}>{slot.slot_number}</span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider">Slot {slot.slot_number}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md ${colors.bg} ${colors.text} ${colors.border} border mt-0.5`}>
                            {ROLE_LABELS[slot.assigned_role]}
                        </span>
                    </div>
                </div>

                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border ${statusClass}`}>
                    {statusLabel}
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-slate-500 text-xs mb-1">Role Type</label>
                    <div className="flex gap-2">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as InventorySlot["assigned_role"])}
                            disabled={isReadOnly || savingRole}
                            className="flex-1 px-3 py-2 bg-white border border-purple-800/35 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-purple-800/60 cursor-pointer [color-scheme:light] disabled:opacity-50"
                        >
                            <option value="vip">VIP</option>
                            <option value="speaker">Speaker</option>
                            <option value="attendee">Attendee</option>
                        </select>
                        <button
                            onClick={handleRoleSave}
                            disabled={isReadOnly || savingRole || role === slot.assigned_role}
                            className="px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-[#f4ecfb] border border-purple-800/35 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {savingRole ? "Saving" : "Save"}
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border border-purple-800/25 bg-white p-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">Current Stock</p>
                            <p className={`text-4xl font-bold mt-1 ${isOutOfStock ? "text-red-600" : isLowStock ? "text-amber-600" : "text-slate-900"}`}>
                                {currentStock}
                                <span className="text-base text-slate-400 font-medium">/{MAX_CAPACITY}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleRestock}
                            disabled={isReadOnly || restocking || currentStock === MAX_CAPACITY}
                            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {restocking ? "Restocking" : "Restock"}
                        </button>
                    </div>

                    <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden mt-4">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isOutOfStock ? "bg-red-500" : isLowStock ? "bg-amber-400" : "bg-green-400"}`}
                            style={{ width: `${stockPercent}%` }}
                        />
                    </div>
                </div>

                {(isLowStock || isOutOfStock) && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isOutOfStock ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                        <svg className={`w-4 h-4 flex-shrink-0 ${isOutOfStock ? "text-red-600" : "text-amber-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008zM2.697 16.126 10.102 3.3c.866-1.5 3.03-1.5 3.896 0l7.405 12.826c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.731 0-2.814-1.874-1.948-3.374z" />
                        </svg>
                        <span className={`text-xs font-medium ${isOutOfStock ? "text-red-700" : "text-amber-700"}`}>
                            {isOutOfStock ? "No stock available" : "Stock is low, consider restocking soon."}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}



