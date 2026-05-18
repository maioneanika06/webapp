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

export interface Attendee {
  id: string;
  event_id: string | null;
  full_name: string;
  email: string;
  contact_number: string;
  company: string;
  role: 'attendee' | 'vip' | 'speaker';
  face_encoding: unknown | null;
  claimed_status: string | null;
  created_at: string;
}

export interface InventorySlot {
  id: string;
  event_id: string;
  slot_number: number;
  assigned_role: 'VIP' | 'Speaker' | 'Attendee';
  stock_count: number;
  low_stock_threshold: number;
  created_at: string;
}
