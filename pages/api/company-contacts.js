// app/api/company-contacts/route.js  (Next.js App Router)
import { NextResponse } from "next/server";
import { findCompanyContacts } from "@/lib/findCompanyContacts";

export const runtime = "nodejs"; // needed for dns (MX check)
export const maxDuration = 30;

/**
 * GET /api/company-contacts?company=Infosys&location=Pune&website=infosys.com
 * - company  (required)
 * - location (optional) e.g. Mumbai, Pune, Bangalore
 * - website  (optional) most accurate if you know it
 */
export default async function handler(req, res) {
  const searchParams = req.query;

  const company = searchParams.company?.trim();
  const location = searchParams.location?.trim() || "";
  const website = searchParams.website?.trim() || "";

  if (!company) {
    return res.status(400).json(
      { error: "Query param 'company' is required" },
      { status: 400 }
    );
  }

  try {
    const result = await findCompanyContacts(company, location, website);
    return res.status(200).json(result);
  } catch (err) {
    console.error("company-contacts error:", err);
    return res.status(500).json(
      { error: err.message || "Failed to fetch contacts" }
    );
  }
}