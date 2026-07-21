import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import EventsMonitor from "@/components/admin/eventsMonitor";

export default function AdminEventsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const redirectingRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session && !redirectingRef.current) {
        redirectingRef.current = true;
        router.replace("/auth/login");
        return;
      }

      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session && !redirectingRef.current) {
        redirectingRef.current = true;
        router.replace("/auth/login");
        return;
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#020817",
      }}>
        <div style={{
          width: "40px", height: "40px",
          border: "3px solid #1e293b", borderTopColor: "#6366f1",
          borderRadius: "50%", animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  return <EventsMonitor user={user} />;
}
