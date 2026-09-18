import { create } from "zustand";
import { supabase, supabaseEnabled } from "@/lib/supabase";
import { pullUserData, startSync, stopSync } from "@/lib/sync";

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  ready: boolean;
  init: () => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

let initialized = false;

export const useAuth = create<AuthState>()((set) => ({
  user: null,
  ready: !supabaseEnabled,

  init: () => {
    if (!supabase || initialized) return;
    initialized = true;
    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ? { id: session.user.id, email: session.user.email ?? "" } : null;
      set({ user, ready: true });
      if (user) {
        void pullUserData(user.id).then(() => startSync(user.id));
      } else {
        stopSync();
      }
    });
  },

  signIn: async (email, password) => {
    if (!supabase) return "Auth is not configured.";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  },

  signUp: async (email, password) => {
    if (!supabase) return "Auth is not configured.";
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (!data.session) return "CONFIRM_EMAIL";
    return null;
  },

  signOut: async () => {
    await supabase?.auth.signOut();
  },
}));
