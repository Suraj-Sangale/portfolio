import { getServerSupabaseClient } from "@/lib/supabaseClient";

const response = { status: false, message: "" };

/**
 * API route to create a new message in Supabase
 * POST /api/messages/create
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // req.body { name: 'ajskas', email: 'surajdsangale@gmail.com', message: 'ojojj' }
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      response.error = "Missing required fields";
      response.message = "Name, email, and message are required";
      return res.status(400).json(response);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      response.error = "Invalid email format";
      response.message = "Please provide a valid email address";
      return res.status(400).json(response);
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
      response.error = "Failed to save message";
      response.message = error.message;
      return res.status(500).json(response);
    }

    response.status = true;
    response.message = "Message saved successfully";
    response.data = data;
    return res.status(200).json(response);
  } catch (error) {
    console.error("Unexpected error:", error);
    response.error = "Internal server error";
    response.message = error.message;
    return res.status(500).json(response);
  }
}
