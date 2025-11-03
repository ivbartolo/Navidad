// NOTE: The authentication logic has been centralized in App.tsx for simplicity.
// This file can be used to create a more abstract `useAuth` hook if needed in the future.

/*
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { session, user, loading, supabase };
}
*/
// This is a placeholder file.
export {}