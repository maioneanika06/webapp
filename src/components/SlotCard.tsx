"use client";

import { useState } from "react";
import type { InventorySlot } from "@/types";

interface SlotCardProps {
    slot: InventorySlot;
    onUpdate: (slotId: string, updates: Partial<Pick<InventorySlot, "assigned_role" | "stock_count" | "low_stock_threshold">>) => Promise<void>;
    isReadOnly?: boolean;
}

export default function SlotCard({ slot, onUpdate, isReadOnly = false }: SlotCardProps) {
    const [editing, setEditing] = useState(false);
    const [role, setRole] = useState(slot.assigned_role);
    const [stock, setStock] = useState(slot.stock_count);
    const [threshold, setThreshold] = useState(slot.low_stock_threshold);
    const [saving, setSaving] = useState(false);

    const isLowStock = slot.stock_count <= slot.low_stock_threshold && slot.stock_count > 0;
    const isOutOfStock = slot.stock_count === 0;

    const roleColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
        VIP: { bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
        Speaker: { bg: "bg-sky-500/10", text: "text-sky-300", border: "border-sky-500/20", glow: "shadow-sky-500/10" },
        Attendee: { bg: "bg-purple-500/10", text: "text-purple-300", border: "border-purple-500/20", glow: "shadow-purple-500/10" },
    };

    const colors = roleColors[slot.assigned_role] || roleColors.Attendee;

    const handleSave = async () => {
        setSaving(true);
        try {
            await onUpdate(slot.id, {
                assigned_role: role,
                stock_count: stock,
                low_stock_threshold: threshold,
            });
            setEditing(false);
        } catch (err) {
            console.error("Failed to update slot:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setRole(slot.assigned_role);
        setStock(slot.stock_count);
        setThreshold(slot.low_stock_threshold);
        setEditing(false);
    };

    return (
        <div className={`backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 transition-all duration-300 hover:border-white/[0.1] hover:shadow-lg ${colors.glow} group relative overflow-hidden`}>
            {/* Slot number badge */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                        <span className={`text-lg font-bold ${colors.text}`}>{slot.slot_number}</span>
                    </div>
                    <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider">Slot {slot.slot_number}</p>
                        {!editing && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md ${colors.bg} ${colors.text} ${colors.border} border mt-0.5`}>
                                {slot.assigned_role}
                            </span>
                        )}
                    </div>
                </div>
                {!editing && !isReadOnly && (
                    <button
                        onClick={() => setEditing(true)}
                        className="p-2 text-white/20 hover:text-white/60 hover:bg-white/[0.05] rounded-lg transition-all cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
                )}
            </div>

            {editing ? (
                <div className="space-y-3">
                    <div>
                        <label className="block text-white/40 text-xs mb-1">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as InventorySlot["assigned_role"])}
                            className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/40 cursor-pointer [color-scheme:dark]"
                        >
                            <option value="VIP">VIP</option>
                            <option value="Speaker">Speaker</option>
                            <option value="Attendee">Attendee</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-white/40 text-xs mb-1">Stock</label>
                            <input
                                type="number"
                                min={0}
                                value={stock}
                                onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/40 [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-white/40 text-xs mb-1">Low Threshold</label>
                            <input
                                type="number"
                                min={0}
                                value={threshold}
                                onChange={(e) => setThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/40 [color-scheme:dark]"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 py-2 text-xs font-medium text-white bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 py-2 text-xs font-medium text-white/40 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:bg-white/[0.05] transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Stock display */}
                    <div className="mt-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-white/40 text-xs">Stock Count</span>
                            <span className={`text-2xl font-bold ${isOutOfStock || (slot.stock_count <= 2 && slot.stock_count > 0) ? "text-red-400" : isLowStock ? "text-amber-400" : "text-white"}`}>
                                {slot.stock_count}
                            </span>
                        </div>

                        {/* Stock progress bar */}
                        <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isOutOfStock || (slot.stock_count <= 2 && slot.stock_count > 0)
                                        ? "bg-red-500"
                                        : isLowStock
                                            ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                            : "bg-gradient-to-r from-green-500 to-emerald-400"
                                    }`}
                                style={{ width: `${Math.min(100, (slot.stock_count / Math.max(slot.low_stock_threshold * 3, 10)) * 100)}%` }}
                            />
                        </div>

                        {/* Warning indicators */}
                        {isOutOfStock && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span className="text-red-300 text-xs font-medium">Out of Stock</span>
                            </div>
                        )}
                        {slot.stock_count <= 2 && slot.stock_count > 0 && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span className="text-red-300 text-xs font-medium">Critical Stock (≤2)</span>
                            </div>
                        )}
                        {isLowStock && slot.stock_count > 2 && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span className="text-amber-300 text-xs font-medium">Low Stock (≤{slot.low_stock_threshold})</span>
                            </div>
                        )}

                        <div className="text-white/20 text-xs">
                            Low stock alert: ≤{slot.low_stock_threshold} items
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
