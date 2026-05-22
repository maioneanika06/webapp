// ============================================================
// TypeScript Interfaces for Admin Dashboard
// ============================================================

export interface Event {
  id: string;
  name: string;
  event_date: string;
  organizer_email: string;
  status: string;
  created_at: string;
}

export type Role = 'attendee' | 'vip' | 'speaker';

export interface Attendee {
  id: string;
  event_id: string | null;
  full_name: string;
  email: string;
  contact_number: string;
  company: string;
  role: Role;
  face_encoding: unknown | null;
  claimed_status: 'QR Verified' | 'Face Verified' | 'Ready to Dispense' | 'Claimed' | string | null;
  created_at: string;
}

export interface InventorySlot {
  id: string;
  event_id: string;
  slot_number: number;
  assigned_role: Role;
  stock_count: number;
  low_stock_threshold: number;
  created_at: string;
}
