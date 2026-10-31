import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Auth from "../components/Auth";

export default function AuthGate({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(session);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Prevent Auth from flashing before Supabase checks the session.
  if (session === undefined) {
    return <p>Checking authentication...</p>;
  }

  // Show Auth when there is no logged-in user.
  if (!session) {
    return <Auth />;
  }

  return children;
}
