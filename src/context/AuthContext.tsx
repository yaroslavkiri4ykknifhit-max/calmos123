import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { UserProfile } from '@/types/database';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  // 🔹 Восстановление сессии после refresh
  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();

      setState({
        user: data.session?.user ?? null,
        loading: false,
      });
    };

    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        loading: false,
      });
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true }));

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setState({ user: null, loading: false });
      return;
    }

    setState({
      user: data.user as any,
      loading: false,
    });
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true }));

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setState({ user: null, loading: false });
      return;
    }

    setState({
      user: data.user as any,
      loading: false,
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
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