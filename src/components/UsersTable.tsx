"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { logLatency } from "@/lib/latency";
import type { Attendee } from "@/types";

interface UsersTableProps {
    attendees: Attendee[];
    totalCount: number;
    loading: boolean;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    filterRole: "all" | "attendee" | "vip" | "speaker";
    onFilterRoleChange: (v: "all" | "attendee" | "vip" | "speaker") => void;
    filterClaimedStatus: "all" | "claimed" | "unclaimed";
    onFilterClaimedChange: (v: "all" | "claimed" | "unclaimed") => void;
    onRoleUpdated?: (id: string, role: Attendee["role"]) => void;
    isReadOnly?: boolean;
}

export default function UsersTable({
    attendees,
    totalCount,
    loading,
    searchQuery,
    onSearchChange,
    filterRole,
    onFilterRoleChange,
    filterClaimedStatus,
    onFilterClaimedChange,
    onRoleUpdated,
    isReadOnly = false,
}: UsersTableProps) {
    const [roleStatus, setRoleStatus] = useState<Record<string, "loading" | "success" | null>>({});
    const roleTabs: Array<{ id: UsersTableProps["filterRole"]; label: string }> = [
        { id: "all", label: "All Users" },
        { id: "vip", label: "VIP" },
        { id: "speaker", label: "Speakers" },
        { id: "attendee", label: "Attendees" },
    ];
    const claimedCount = attendees.filter((attendee) => attendee.claimed_status === "Claimed").length;
    const unclaimedCount = attendees.length - claimedCount;

    useEffect(() => {
        const renderStart = performance.now();
        logLatency("Attendee Claim Summary Display Update", renderStart, "success", {
            visibleAttendees: attendees.length,
            totalCount,
            claimedCount,
            unclaimedCount,
            displayedAt: new Date().toISOString(),
        });
    }, [attendees, totalCount, claimedCount, unclaimedCount]);

    const getClaimBadge = (status: Attendee["claimed_status"]) => {
        if (status === "Claimed") {
            return {
                label: "Claimed",
                dot: "bg-green-400",
                className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            };
        }

        if (status === "Ready to Dispense") {
            return {
                label: "Ready",
                dot: "bg-sky-400",
                className: "bg-sky-50 text-sky-700 border-sky-200",
            };
        }

        if (status === "QR Verified" || status === "Face Verified") {
            return {
                label: status,
                dot: "bg-amber-400",
                className: "bg-amber-50 text-amber-700 border-amber-200",
            };
        }

        return {
            label: "Unclaimed",
            dot: "bg-white/30",
            className: "bg-purple-50 text-slate-500 border-purple-100",
        };
    };

    const handleRoleChange = async (attendeeId: string, newRole: "attendee" | "vip" | "speaker") => {
        setRoleStatus((prev) => ({ ...prev, [attendeeId]: "loading" }));
        const roleUpdateStart = window.performance.now();
        const { error } = await supabase.from("attendees").update({ role: newRole }).eq("id", attendeeId);

        if (!error) {
            logLatency("Attendee Role Database Update", roleUpdateStart, "success", {
                attendeeId,
                newRole,
                updatedAt: new Date().toISOString(),
            });
            setRoleStatus((prev) => ({ ...prev, [attendeeId]: "success" }));
            if (onRoleUpdated) onRoleUpdated(attendeeId, newRole);
            setTimeout(() => {
                setRoleStatus((prev) => ({ ...prev, [attendeeId]: null }));
            }, 2500);
        } else {
            logLatency("Attendee Role Database Update", roleUpdateStart, "failed", {
                attendeeId,
                newRole,
                reason: error.message,
            });
            console.error("Failed to update role:", error);
            setRoleStatus((prev) => ({ ...prev, [attendeeId]: null }));
        }
    };

    const exportToCSV = () => {
        if (attendees.length === 0) return;
        
        const headers = ["Full Name", "Email", "Company", "Role", "Claimed Status"];
        const rows = attendees.map(a => [
            `"${(a.full_name || '').replace(/"/g, '""')}"`,
            `"${(a.email || '').replace(/"/g, '""')}"`,
            `"${(a.company || '').replace(/"/g, '""')}"`,
            `"${(a.role || 'Attendee').replace(/"/g, '""')}"`,
            a.claimed_status === 'Claimed' ? "Claimed" : "Unclaimed"
        ]);
        
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `attendees_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="backdrop-blur-xl bg-white border border-purple-100 rounded-2xl p-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm">Loading attendees...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Role Tabs */}
            <div className="flex bg-white border border-purple-100 rounded-2xl p-1.5 w-max">
                {roleTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onFilterRoleChange(tab.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                            filterRole === tab.id
                                ? "bg-purple-100 text-purple-800"
                                : "text-slate-500 hover:text-slate-700 hover:bg-purple-50"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="backdrop-blur-xl bg-white border border-purple-100 rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[240px]">
                        <svg
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, email, company, or QR code..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                        />
                    </div>

                    {/* Filters */}
                    <select
                        value={filterClaimedStatus}
                        onChange={(e) => onFilterClaimedChange(e.target.value as "all" | "claimed" | "unclaimed")}
                        className="px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-slate-600 text-sm focus:outline-none focus:border-purple-500/40 cursor-pointer [color-scheme:light]"
                    >
                        <option value="all">All Claim Status</option>
                        <option value="claimed">Claimed</option>
                        <option value="unclaimed">Unclaimed</option>
                    </select>

                    {/* Export */}
                    <button
                        onClick={exportToCSV}
                        disabled={attendees.length === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 rounded-xl text-slate-700 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Export CSV
                    </button>

                    {/* Count */}
                    <span className="text-slate-400 text-xs pl-2">
                        {attendees.length} of {totalCount} attendees
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="backdrop-blur-xl bg-white border border-purple-100 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-purple-100">
                                <th className="text-left text-slate-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Full Name</th>
                                <th className="text-left text-slate-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Email</th>
                                <th className="text-left text-slate-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Company</th>
                                <th className="text-left text-slate-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Role</th>
                                <th className="text-center text-slate-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Claimed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-slate-400 py-16">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-10 h-10 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                            </svg>
                                            <p className="text-sm">No attendees found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                attendees.map((attendee) => (
                                    <tr
                                        key={attendee.id}
                                        className="border-b border-purple-50 hover:bg-white transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="text-slate-800 text-sm font-medium">{attendee.full_name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-600 text-sm">{attendee.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-600 text-sm">{attendee.company}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={(attendee.role || "attendee").toLowerCase()}
                                                    onChange={(e) => handleRoleChange(attendee.id, e.target.value as Attendee["role"])}
                                                    disabled={isReadOnly || attendee.claimed_status === "Claimed" || roleStatus[attendee.id] === "loading"}
                                                    title={attendee.claimed_status === "Claimed" ? "Claimed attendees cannot change roles." : undefined}
                                                    className="pl-3 pr-8 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-slate-700 text-xs font-medium focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 cursor-pointer appearance-none [color-scheme:light] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(71, 85, 105, 0.65)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
                                                >
                                                    <option value="attendee">Attendee</option>
                                                    <option value="vip">VIP</option>
                                                    <option value="speaker">Speaker</option>
                                                </select>
                                                {roleStatus[attendee.id] === "loading" && (
                                                    <div className="w-3.5 h-3.5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                                                )}
                                                {roleStatus[attendee.id] === "success" && (
                                                    <svg className="w-4 h-4 text-emerald-500 animate-[bounce_0.5s_ease-in-out]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {(() => {
                                                const badge = getClaimBadge(attendee.claimed_status);
                                                return (
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${badge.className}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                                        {badge.label}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

