import { supabase } from "@/lib/supabaseClient";

export const fetchTableData = async ({
  tableName,
  select = "*",
  orderBy = "created_at",
  ascending = false,
  filterType = "all",
}) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(select)
      .order(orderBy, { ascending });

    if (error) {
      throw new Error(error.message || "Failed to fetch data");
    }

    let filteredData = data || [];

    /* ================================
       Optional Date Filter
    ================================== */

    if (filterType !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (filterType) {
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

      filteredData = filteredData.filter((item) => {
        if (!item[orderBy]) return false;
        return new Date(item[orderBy]) >= filterDate;
      });
    }

    return {
      success: true,
      data: filteredData,
    };
  } catch (error) {
    console.error("Supabase fetch error:", error);

    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};

/**
 * Common Supabase UPDATE function
 *
 * @param {string}  tableName   - Table to update
 * @param {object}  payload     - Fields to update  { col: value, ... }
 * @param {object}  match       - Row identifier(s) { id: 1 }  (WHERE clause)
 * @param {string}  select      - Columns to return after update (default "*")
 *
 * @returns {{ status, data, error }}
 */
export const updateTableData = async ({
  tableName,
  payload,
  match,
  select = "*",
}) => {
  try {
    // ── Validation ──────────────────────────────────────────────
    if (!tableName) throw new Error("tableName is required");
    if (!payload || !Object.keys(payload).length)
      throw new Error("payload must have at least one field");
    if (!match || !Object.keys(match).length)
      throw new Error("match is required to identify the row(s)");

    // ── Build query ─────────────────────────────────────────────
    // .match({ id: 5 }) → WHERE id = 5
    // .match({ id: 5, org_id: 2 }) → WHERE id = 5 AND org_id = 2
    const { data, error } = await supabase
      .from(tableName)
      .update(payload)
      .match(match)
      .select(select);

    if (error) throw new Error(error.message || "Failed to update data");

    return { status: true, data };
  } catch (error) {
    console.error("Supabase update error:", error);
    return { status: false, error: error.message || "Something went wrong" };
  }
};

/* ================================================================
   SAMPLE USAGE
================================================================ */

// ── 1. Update a single row by id ────────────────────────────────
// const result = await updateTableData({
//   tableName: "configs",
//   match: { id: 42 },
//   payload: {
//     key_name: "app.feature.darkMode",
//     description: "Enables dark mode for all users",
//     content_json: { enabled: true, rollout: 100 },
//     updated_at: new Date().toISOString(),
//   },
// });

// if (result.status) {
// } else {
//   console.error("Error:", result.error);
// }

// // ── 2. Partial update (only specific fields) ────────────────────
// await updateTableData({
//   tableName: "configs",
//   match: { id: 42 },
//   payload: { description: "Updated description only" },
// });

// // ── 3. Match on multiple columns ────────────────────────────────
// await updateTableData({
//   tableName: "configs",
//   match: { id: 42, org_id: 7 }, // WHERE id=42 AND org_id=7
//   payload: { content_json: { enabled: false } },
// });

// // ── 4. Return only specific columns after update ────────────────
// const { data } = await updateTableData({
//   tableName: "configs",
//   match: { id: 42 },
//   payload: { key_name: "app.feature.newName" },
//   select: "id, key_name, updated_at", // return only these cols
// });

export const addNewIntoTable = async ({ tableName, payload, select = "*" }) => {
  const respose = { status: false, error: null, data: null };
  try {
    console.log("first", { tableName, payload, select });
    // Validation
    if (!tableName) {
      console.log("second");
      respose.message = "tableName is required";
      return respose;
    }
    if (!payload || !Object.keys(payload).length) {
      console.log("third");
      respose.message = "payload must have at least one field";
      return respose;
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert(payload)
      .select(select);

    if (error) {
      console.log("fourth", error);
      respose.message = error.message || "Failed to add data";
      return respose;
    }

    console.log("fifth", data);
    respose.status = true;
    respose.data = data;
    return respose;
  } catch (error) {
    console.log("sixth", error);
    console.error("Supabase add error:", error);
    respose.message = error.message || "Something went wrong";
    return respose;
  }
};
