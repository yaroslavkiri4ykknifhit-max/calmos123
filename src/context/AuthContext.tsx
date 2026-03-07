// ============================================================
// MindMetrics — Auth Context
// ============================================================
// Provides authentication state to the entire component tree.
// In production this would listen to supabase.auth.onAuthStateChange
// and expose signIn / signUp / signOut helpers.
//
// For this scaffold it uses local state to simulate auth flow.
// ============================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserProfile } from '@/types/database';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Demo user for the scaffold
const DEMO_USER: UserProfile = {
  id: 'demo-user-001',
  email: 'demo@mindmetrics.app',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: false });

  const signIn = useCallback(async (_email: string, _password: string) => {
    setState({ user: null, loading: true });
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));
    setState({ user: { ...DEMO_USER, email: _email }, loading: false });
  }, []);

  const signUp = useCallback(async (_email: string, _password: string) => {
    setState({ user: null, loading: true });
    await new Promise((r) => setTimeout(r, 600));
    setState({ user: { ...DEMO_USER, email: _email }, loading: false });
  }, []);

  const signOut = useCallback(() => {
    setState({ user: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
