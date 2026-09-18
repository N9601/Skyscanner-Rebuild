import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url: string = import.meta.env.VITE_SUPABASE_URL ?? "";
const anonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabaseEnabled = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = supabaseEnabled ? createClient(url, anonKey) : null;
