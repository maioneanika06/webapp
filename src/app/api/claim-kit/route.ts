import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { Attendee } from "@/types";
import { measureLatency, writeLatencyLog } from "@/lib/server-latency";

type ClaimSignal = "qr" | "face" | "ir";

type ClaimKitBody = {
    attendeeId?: string;
    id?: string;
    qrCode?: string;
    eventId?: string;
    signal?: ClaimSignal;
    qrVerified?: boolean;
    faceVerified?: boolean;
    irBreakbeamTriggered?: boolean;
};

const claimedStatuses = new Set(["Claimed"]);
const qrStatuses = new Set(["QR Verified", "Ready to Dispense", "Claimed"]);
const faceStatuses = new Set(["Face Verified", "Ready to Dispense", "Claimed"]);

function hasSignal(body: ClaimKitBody, signal: "qr" | "face" | "ir") {
    return body.signal === signal;
}

function getProgress(status: string | null | undefined) {
    return {
        qr: qrStatuses.has(status || ""),
        face: faceStatuses.has(status || ""),
        ir: claimedStatuses.has(status || ""),
    };
}

function nextStatus(progress: { qr: boolean; face: boolean; ir: boolean }) {
    if (progress.qr && progress.face && progress.ir) return "Claimed";
    if (progress.qr && progress.face) return "Ready to Dispense";
    if (progress.face) return "Face Verified";
    if (progress.qr) return "QR Verified";
    return null;
}

export async function POST(request: NextRequest) {
    const apiStart = performance.now();
    async function jsonResponse(body: Record<string, unknown>, init?: ResponseInit) {
        await writeLatencyLog({
            process: "Claim Kit API",
            latencySec: (performance.now() - apiStart) / 1000,
            status: init?.status && init.status >= 400 ? "failed" : "success",
            metadata: {
                statusCode: init?.status || 200,
                error: body.error,
            },
        });
        return NextResponse.json(body, init);
    }

    if (!supabaseAdmin) {
        return jsonResponse(
            { error: "SUPABASE_SERVICE_ROLE_KEY is required for claim updates." },
            { status: 500 }
        );
    }
    const adminClient = supabaseAdmin;
//holds the data sent sa api and icheck niya if valid json 
    let body/*main data sent galing sa client*/: ClaimKitBody;
    try {
        body = await request.json();
    } catch {
        return jsonResponse({ error: "Invalid JSON body." }, { status: 400 });
    }

    const attendeeId = body.attendeeId || body.id || body.qrCode;
    if (!attendeeId) {
        return jsonResponse(
            { error: "attendeeId, id, or qrCode is required." },
            { status: 400 }
        );
    }

    let attendeeQuery = adminClient
        .from("attendees")
        .select("id,event_id,role,claimed_status")
        .eq("id", attendeeId)
        .limit(1);

    if (body.eventId) {
        attendeeQuery = attendeeQuery.eq("event_id", body.eventId);
    }

    const { data: attendees, error: attendeeError } = await attendeeQuery;
    if (attendeeError) {
        return jsonResponse({ error: attendeeError.message }, { status: 500 });
    }

    const attendee = attendees?.[0] as Pick<Attendee, "id" | "event_id" | "role" | "claimed_status"> | undefined;
    if (!attendee) {
        return jsonResponse({ error: "Attendee not found." }, { status: 404 });
    }

    if (!attendee.event_id) {
        return jsonResponse(
            { error: "This attendee is not assigned to an event." },
            { status: 409 }
        );
    }

    const { data: event, error: eventError } = await adminClient
        .from("events")
        .select("id,status")
        .eq("id", attendee.event_id)
        .maybeSingle();

    if (eventError) {
        return jsonResponse({ error: eventError.message }, { status: 500 });
    }

    if (!event || event.status !== "ACTIVE") {
        return jsonResponse(
            {
                error: "This event is no longer active.",
                attendeeId: attendee.id,
                eventId: attendee.event_id,
                eventStatus: event?.status || null,
                eventInactive: true,
            },
            { status: 409 }
        );
    }

    if (attendee.claimed_status === "Claimed") {
        return jsonResponse(
            {
                error: "This attendee has already claimed a kit.",
                attendeeId: attendee.id,
                claimedStatus: "Claimed",
                alreadyClaimed: true,
            },
            { status: 409 }
        );
    }

    const progress = getProgress(attendee.claimed_status);
    progress.qr = progress.qr || body.qrVerified === true || hasSignal(body, "qr");
    progress.face = progress.face || body.faceVerified === true || hasSignal(body, "face");
    progress.ir =
        progress.ir ||
        body.irBreakbeamTriggered === true ||
        hasSignal(body, "ir");

    const status = nextStatus(progress);
    if (!status) {
        return jsonResponse(
            {
                error: "No verification signal was provided.",
                requiredSignals: ["qrVerified", "faceVerified", "irBreakbeamTriggered"],
            },
            { status: 400 }
        );
    }

    if (progress.ir && (!progress.qr || !progress.face)) {
        return jsonResponse(
            {
                error: "IR breakbeam cannot mark a kit claimed until QR and face verification are recorded.",
                claimedStatus: attendee.claimed_status || null,
                progress,
            },
            { status: 409 }
        );
    }

    const { error: updateError } = await measureLatency(
        "Claim Status Database Update",
        async () =>
            await adminClient
                .from("attendees")
                .update({ claimed_status: status })
                .eq("id", attendee.id),
        {
            attendeeId: attendee.id,
            eventId: attendee.event_id,
            claimedStatus: status,
            updatedAt: new Date().toISOString(),
        }
    );

    if (updateError) {
        return jsonResponse({ error: updateError.message }, { status: 500 });
    }

    let inventoryUpdated = false;
    let inventoryWarning: string | undefined;

    if (status === "Claimed" && attendee.event_id) {
        const assignedRole = attendee.role || "attendee";
        const { data: slot, error: slotError } = await adminClient
            .from("inventory")
            .select("id,stock_count")
            .eq("event_id", attendee.event_id)
            .eq("assigned_role", assignedRole)
            .gt("stock_count", 0)
            .order("slot_number", { ascending: true })
            .limit(1)
            .maybeSingle();

        if (slotError) {
            inventoryWarning = slotError.message;
        } else if (!slot) {
            inventoryWarning = `No stock available for ${assignedRole}.`;
        } else {
            const newStock = Math.max(0, Number(slot.stock_count) - 1);
            const { error: inventoryError } = await measureLatency(
                "Inventory Deduction Database Update",
                async () =>
                    await adminClient
                        .from("inventory")
                        .update({ stock_count: newStock })
                        .eq("id", slot.id),
                {
                    attendeeId: attendee.id,
                    eventId: attendee.event_id,
                    role: assignedRole,
                    slotId: slot.id,
                    previousStock: Number(slot.stock_count),
                    newStock,
                    updatedAt: new Date().toISOString(),
                }
            );

            if (inventoryError) {
                inventoryWarning = inventoryError.message;
            } else {
                inventoryUpdated = true;
            }
        }
    }

    return jsonResponse({
        attendeeId: attendee.id,
        claimedStatus: status,
        progress,
        inventoryUpdated,
        inventoryWarning,
    });
}
