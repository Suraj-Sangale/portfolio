import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function MessageWrapper() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, today, week, month

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      fetchMessages();
    };

    checkAuthAndLoad();
  }, [router, filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch directly from Supabase using the logged-in user's session,
      // instead of going through the API route that expects server cookies.
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching messages:", error);
        throw new Error(error.message || "Failed to fetch messages");
      }

      let filteredMessages = data || [];

      // Apply date filter
      if (filter !== "all") {
        const now = new Date();
        const filterDate = new Date();

        switch (filter) {
          case "today":
            filterDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            filterDate.setDate(now.getDate() - 7);
            break;
          case "month":
            filterDate.setMonth(now.getMonth() - 1);
            break;
          default:
            break;
        }

        filteredMessages = filteredMessages.filter((msg) => {
          const msgDate = new Date(msg.created_at);
          return msgDate >= filterDate;
        });
      }

      setMessages(filteredMessages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("messages")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // Refresh messages
      fetchMessages();
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && messages.length === 0) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Messages Admin
                </h1>
                <p className="mt-2 text-gray-600">
                  Total messages: {messages.length}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="/dashboard"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Back to Dashboard
                </a>
                <button
                  onClick={fetchMessages}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-md ${
                  filter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("today")}
                className={`px-4 py-2 rounded-md ${
                  filter === "today"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setFilter("week")}
                className={`px-4 py-2 rounded-md ${
                  filter === "week"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setFilter("month")}
                className={`px-4 py-2 rounded-md ${
                  filter === "month"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <p className="text-gray-500 text-lg">No messages found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {message.name}
                        </h3>
                        <a
                          href={`mailto:${message.email}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          {message.email}
                        </a>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
