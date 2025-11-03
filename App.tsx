import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import Auth from './components/auth/Auth';
import Dashboard from './components/dashboard/Dashboard';
import { Spinner } from './components/ui/Spinner';
import { StarIcon } from './components/icons/ChristmasIcons';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Set theme: default to dark unless light is specified
  useEffect(() => {
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);


  if (loading) {
    return (
        <div className="min-h-screen bg-snow-white dark:bg-dark-primary flex flex-col justify-center items-center text-christmas-red dark:text-christmas-gold transition-colors duration-500">
            <h1 className="text-4xl font-bold mb-4 flex items-center">
                Cargando Lotería <StarIcon className="w-8 h-8 ml-2 animate-spin" />
            </h1>
            <Spinner />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-snow-white dark:bg-dark-primary transition-colors duration-500">
      {!session ? <Auth /> : <Dashboard key={session.user.id} session={session} />}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: 'dark:bg-dark-secondary dark:text-snow-white',
        }}
      />
    </div>
  );
}