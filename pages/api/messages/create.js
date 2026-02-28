import { getServerSupabaseClient } from "@/lib/supabaseClient";

/**
 * API route to create a new message in Supabase
 * POST /api/messages/create
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("req.body", req.body);
    // req.body { name: 'ajskas', email: 'surajdsangale@gmail.com', message: 'ojojj' }
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "Name, email, and message are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    const supabase = getServerSupabaseClient(req, res);

    // Insert message into Supabase
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Failed to save message",
        details: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Message saved successfully",
      data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
