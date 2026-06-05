"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isSuperAdminEmail } from "@/lib/admin";
import { useState, createContext, useContext } from "react";
import Image from "next/image";

// Sidebar context so layout can read collapsed state
interface SidebarContextType {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}
const SidebarContext = createContext<SidebarContextType>({
    collapsed: false,
    setCollapsed: () => {},
});
export const useSidebarContext = () => useContext(SidebarContext);
export { SidebarContext };

export default function Sidebar() {
    const pathname = usePathname();
    const params = useParams();
    const { user, signOut } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const isSuperAdmin = isSuperAdminEmail(user?.email);
    const isEventView = !!params.eventId;
    const eventId = params.eventId as string;

    //admin side
    const globalNavItems = [ 
        {
            href: "/dashboard",
            label: "Active Events",
            icon: (
                <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            ),
        },
        {
            href: "/dashboard/completed",
            label: "Completed",
            icon: (
                <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            href: "/dashboard/create",
            label: "Create Event",
            icon: (
                <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        }
    ];

    //event admin only side

    const eventNavItems = [
        {
            href: `/dashboard/${eventId}`,
            label: "Overview",
            icon: (
                <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
            ),
        },
        {
            href: `/dashboard/${eventId}/users`,
            label: "Users",
            icon: (
                <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            ),
        },
        {
            href: `/dashboard/${eventId}/inventory`,
            label: "Inventory",
            icon: (
                <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
            ),
        },
    ];

    const staffGlobalNavItems = [
        {
            href: "/dashboard",
            label: "My Events",
            icon: (
                <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            ),
        }
    ];

    // show which nav items to show based on role and view
    let activeNavItems;
    if (isEventView) {
        activeNavItems = eventNavItems;
    } else {
        activeNavItems = isSuperAdmin ? globalNavItems : staffGlobalNavItems;
    }

    
    const sectionLabel = isEventView
        ? "Event"
        : isSuperAdmin
            ? "Management"
            : "Dashboard";

    return (
        <aside
            className={`${collapsed ? "w-[72px]" : "w-[260px]"} sticky top-0 h-dvh shrink-0 flex flex-col overflow-hidden sidebar-transition relative border-r border-purple-100 bg-white`}
        >
            {/* Soft right edge — gradient fade instead of border */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-purple-100" />

            {/* ── Brand ─────────────────────────────── */}
            <div className={`${collapsed ? "px-4 py-5" : "px-5 py-5"} shrink-0 flex items-center gap-3 transition-all duration-300`}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-purple-200">
                    <Image src="/VENDY.png" alt="Vendy Logo" width={40} height={40} className="w-full h-full object-cover" />
                </div>
                {!collapsed && (
                    <div className="sidebar-content-fade min-w-0">
                        <h1 className="text-slate-900 font-bold text-[15px] leading-tight tracking-tight">VENDY</h1>
                        <p className="text-purple-600/70 text-[10px] tracking-wider uppercase mt-0.5">
                            {isSuperAdmin ? "Super Admin" : "Staff"}
                        </p>
                    </div>
                )}
            </div>

            {/* ── Collapse toggle — inside sidebar, not floating on the edge ── */}
            <div className={`${collapsed ? "px-3" : "px-4"} shrink-0 mb-1 transition-all duration-300`}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`w-full flex items-center ${collapsed ? "justify-center" : "justify-between"} gap-2 px-2.5 py-2 rounded-lg text-[11px] font-medium text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 cursor-pointer group`}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {!collapsed && (
                        <span className="sidebar-content-fade uppercase tracking-widest text-slate-400">Menu</span>
                    )}
                    <svg
                        className={`w-3.5 h-3.5 transition-transform duration-300 text-slate-400 group-hover:text-purple-600 ${collapsed ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
            </div>

            {/* ── Divider ─────────────────────────────── */}
            <div className={`${collapsed ? "mx-3" : "mx-4"} h-px bg-purple-100 mb-2`} />

            {/* ── Navigation ─────────────────────────── */}
            <nav className={`min-h-0 flex-1 overflow-y-auto ${collapsed ? "px-3 py-2" : "px-4 py-2"} transition-all duration-300`}>
                {/* Back button for event view */}
                {isEventView && (
                    <div className="mb-3 pb-3">
                        <Link
                            href="/dashboard"
                            className={`flex items-center ${collapsed ? "justify-center" : ""} gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200`}
                            title={collapsed ? `Back to ${isSuperAdmin ? "Global View" : "My Events"}` : ""}
                        >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            {!collapsed && (
                                <span className="sidebar-content-fade">
                                    Back to {isSuperAdmin ? "Global" : "Events"}
                                </span>
                            )}
                        </Link>
                        <div className="mt-3 h-px bg-purple-100" />
                    </div>
                )}

                {/* Section label */}
                {!collapsed && (
                    <p className="px-3 mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sidebar-content-fade">
                        {sectionLabel}
                    </p>
                )}

                {/* Nav items */}
                <div className="space-y-0.5">
                    {activeNavItems.map((item) => {
                        let isActive = false;
                        if (!isEventView) {
                            isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard/active");
                        } else {
                            isActive = pathname === item.href || (item.href !== `/dashboard/${eventId}` && pathname.startsWith(item.href));
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center ${collapsed ? "justify-center" : ""} gap-3 ${collapsed ? "px-0 py-3" : "px-3 py-2.5"} rounded-lg text-[13px] font-medium transition-all duration-200 group relative ${isActive
                                    ? "text-purple-800 bg-purple-100"
                                    : "text-slate-500 hover:text-purple-700 hover:bg-purple-50"
                                    }`}
                                title={collapsed ? item.label : ""}
                            >
                                {/* Active indicator bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-purple-600" />
                                )}

                                <span className={`transition-colors duration-200 ${isActive ? "text-purple-700" : "text-slate-400 group-hover:text-purple-600"}`}>
                                    {item.icon}
                                </span>
                                {!collapsed && (
                                    <span className="sidebar-content-fade">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* ── Footer / Sign Out ──────────────────── */}
            <div className={`${collapsed ? "px-3" : "px-4"} shrink-0 pb-5 space-y-2 bg-white transition-all duration-300`}>
                {/* Divider */}
                <div className="h-px bg-purple-100 mb-1" />

                {/* User info */}
                {!collapsed && user && (
                    <div className="px-3 py-2.5 rounded-lg bg-purple-50 border border-purple-100 sidebar-content-fade">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <span className="text-purple-700/70 text-[10px] font-bold uppercase">
                                    {user.email?.[0] || "U"}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-slate-600 text-[11px] truncate">{user.email}</p>
                                <p className="text-slate-400 text-[9px] uppercase tracking-wider">
                                    {isSuperAdmin ? "Admin" : "Staff"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sign out button */}
                <button
                    onClick={signOut}
                    className={`w-full flex items-center ${collapsed ? "justify-center" : ""} gap-2.5 ${collapsed ? "px-0 py-2.5" : "px-3 py-2"} rounded-lg text-[12px] font-medium text-slate-400 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer group`}
                    title={collapsed ? "Sign Out" : ""}
                >
                    <svg className="w-[15px] h-[15px] shrink-0 text-slate-400 group-hover:text-red-400/50 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    {!collapsed && (
                        <span className="sidebar-content-fade">Sign Out</span>
                    )}
                </button>
            </div>
        </aside>
    );
}


