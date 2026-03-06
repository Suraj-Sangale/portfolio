import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import Layout from "@/components/layout";

export default function DashboardWrapper() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const redirectingRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    let redirectTimeoutId = null;

    const getSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      // Small delay + re-check prevents immediate bounce right after login navigation.
      if (!currentSession) {
        redirectTimeoutId = setTimeout(async () => {
          if (!mounted || redirectingRef.current) return;
          const {
            data: { session: recheckedSession },
          } = await supabase.auth.getSession();
          if (!mounted) return;
          if (!recheckedSession) {
            redirectingRef.current = true;
            router.replace("/auth/login");
            return;
          }
          setSession(recheckedSession);
          setUser(recheckedSession.user ?? null);
        }, 200);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      if (!session && !redirectingRef.current) {
        redirectingRef.current = true;
        router.replace("/auth/login");
      }
    });

    return () => {
      mounted = false;
      if (redirectTimeoutId) clearTimeout(redirectTimeoutId);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once on mount

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!session || !user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Welcome back, {user.email || "User"}!
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <a
                  href="/admin/messages"
                  className="block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-center"
                >
                  View Messages
                </a>
                <a
                  href="/contact"
                  className="block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-center"
                >
                  Contact Form
                </a>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User Info
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">User ID:</span>{" "}
                  {user.id.substring(0, 8)}...
                </p>
                <p>
                  <span className="font-medium">Last Sign In:</span>{" "}
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Session Info
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-green-600">Active</span>
                </p>
                <p>
                  <span className="font-medium">Expires:</span>{" "}
                  {session?.expires_at
                    ? new Date(session.expires_at * 1000).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <a
                  href="/admin/page-builder"
                  className="block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-center"
                >
                  View Pages
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
