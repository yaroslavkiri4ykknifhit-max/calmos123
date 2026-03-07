// ============================================================
// MindMetrics — Supabase Client (Placeholder)
// ============================================================
//
// In production you would install `@supabase/supabase-js` and
// initialise the client here:
//
//   import { createClient } from '@supabase/supabase-js';
//
//   const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
//   const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;
//
//   export const supabase = createClient(supabaseUrl, supabaseAnon);
//
// For this structural scaffold we export a placeholder so the
// rest of the app can reference it without crashing.
// ============================================================

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

// Placeholder — replace with real createClient() call
export const supabase = {
  auth: {
    signInWithPassword: async (_creds: { email: string; password: string }) => ({
      data: null as any,
      error: null as any,
    }),
    signUp: async (_creds: { email: string; password: string }) => ({
      data: null as any,
      error: null as any,
    }),
    signOut: async () => ({ error: null as any }),
    getUser: async () => ({ data: { user: null as any }, error: null as any }),
    onAuthStateChange: (_cb: Function) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
  from: (_table: string) => ({
    select: (_cols?: string) => ({
      eq: (_col: string, _val: any) => ({
        order: (_col2: string, _opts?: any) => ({
          data: [] as any[],
          error: null as any,
        }),
        single: () => ({ data: null as any, error: null as any }),
      }),
    }),
    insert: (_row: any) => ({
      select: () => ({
        single: () => ({ data: null as any, error: null as any }),
      }),
    }),
    update: (_vals: any) => ({
      eq: (_col: string, _val: any) => ({ data: null as any, error: null as any }),
    }),
    delete: () => ({
      eq: (_col: string, _val: any) => ({ data: null as any, error: null as any }),
    }),
  }),
};
