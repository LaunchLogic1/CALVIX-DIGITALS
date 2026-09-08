import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://njefeejrbsewcecbekhx.supabase.co";

const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_popfAZtxMb_sRU2tDFOBGg_B0gEFZ6J";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
 * directly into the Supabase `bookings` table.
 */
export async function saveBookingToSupabase(booking: SupabaseBookingRecord) {
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

    // Insert into Supabase table without requiring select permissions (works seamlessly with Insert-Only RLS)
    const { error } = await supabase.from("bookings").insert([record]);

    if (error) {
      console.error("Supabase DB Insert Error:", error.message);
      return {
        success: false,
        error: "Unable to process submission at this moment. Please try again later.",
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Supabase Connection Exception:", err);
    return {
      success: false,
      error: "Connection error. Please check your network and try again.",
    };
  }
}

/**
 * Retrieves all bookings from the Supabase `bookings` table.
 */
export async function getBookingsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase DB Select Warning:", error.message);
      return { success: false, error: error.message, bookings: [] };
    }

    return { success: true, bookings: data || [] };
  } catch (err: any) {
    console.warn("Supabase Connection Exception on Fetch:", err);
    return { success: false, error: err.message || "Failed to fetch bookings", bookings: [] };
  }
}

