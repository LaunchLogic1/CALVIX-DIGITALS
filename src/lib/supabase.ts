import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "";

const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "";

// Safely instantiate client or null if not configured
let supabaseClient: any = null;
try {
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });
  }
} catch (e) {
  supabaseClient = null;
}

export const supabase = supabaseClient;

export interface SupabaseBookingRecord {
  id?: string;
  created_at?: string;
  full_name: string;
  email: string;
  phone?: string;
  business_name?: string;
  service?: string;
  message?: string;
  budget?: string;
  project_type?: string;
  status?: string;
  source?: string;
  ip_address?: string;
  notes?: string;
}

/**
 * Saves any booking, contact form submission, inquiry, quote request, or newsletter signup
 * directly into the Supabase `bookings` table if configured.
 */
export async function saveBookingToSupabase(booking: SupabaseBookingRecord) {
  if (!supabase) {
    return { success: true, localOnly: true };
  }

  try {
    const record = {
      full_name: booking.full_name?.trim() || "Anonymous Inquiry",
      email: booking.email?.trim()?.toLowerCase() || "",
      phone: booking.phone?.trim() || null,
      business_name: booking.business_name?.trim() || null,
      service: booking.service?.trim() || "General Service",
      message: booking.message?.trim() || null,
      budget: booking.budget?.trim() || null,
      project_type: booking.project_type?.trim() || null,
      status: booking.status || "New",
      source: booking.source || "Website",
      ip_address: booking.ip_address || null,
      notes: booking.notes?.trim() || null,
    };

    const { error } = await supabase.from("bookings").insert([record]);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Connection error",
    };
  }
}

/**
 * Retrieves all bookings from the Supabase `bookings` table if available.
 */
export async function getBookingsFromSupabase() {
  if (!supabase) {
    return { success: true, bookings: [] };
  }

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message, bookings: [] };
    }

    return { success: true, bookings: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to fetch bookings", bookings: [] };
  }
}

