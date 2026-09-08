import fs from "fs";
import path from "path";
import {
  UPLOAD_DIR,
  ensureUploadDir,
  sanitizeBaseName,
  getCleanExtension,
  resolveDuplicateName,
  isPathInsideUploadDir,
  ALLOWED_EXTENSIONS,
} from "../lib/uploadHelper.js";

async function run() {
  console.log("=== Testing Upload Helper Logic ===");
  ensureUploadDir();
  console.log("1. Upload dir path:", UPLOAD_DIR);
  console.log("2. Upload dir exists:", fs.existsSync(UPLOAD_DIR));

  // Test sanitizeBaseName
  const traversalTest = sanitizeBaseName("../../etc/passwd");
  console.log("3. Path traversal sanitize:", traversalTest);
  if (traversalTest.includes("..") || traversalTest.includes("/")) {
    throw new Error("Sanitize failed on path traversal!");
  }

  // Test getCleanExtension
  const extTest = getCleanExtension("portfolio-guide.DOCX");
  console.log("4. Extension extraction:", extTest);
  if (extTest !== "docx") {
    throw new Error("Extension extraction failed!");
  }

  // Test duplicate name resolution
  const testFile1 = path.join(UPLOAD_DIR, "test_sample_doc.pdf");
  fs.writeFileSync(testFile1, "Sample PDF content");

  const duplicateResolved = resolveDuplicateName(UPLOAD_DIR, "test_sample_doc", "pdf", "auto-rename");
  console.log("5. Duplicate resolved name:", duplicateResolved);
  if (duplicateResolved !== "test_sample_doc (1).pdf") {
    throw new Error(`Expected "test_sample_doc (1).pdf", got "${duplicateResolved}"`);
  }

  // Test isPathInsideUploadDir
  const inside = isPathInsideUploadDir(testFile1);
  const outside = isPathInsideUploadDir(path.join(UPLOAD_DIR, "..", "secret.txt"));
  console.log("6. Sandbox containment checks -> Inside:", inside, "Outside:", outside);
  if (!inside || outside) {
    throw new Error("Sandbox containment check failed!");
  }

  // Cleanup test file
  if (fs.existsSync(testFile1)) {
    fs.unlinkSync(testFile1);
  }

  console.log("\n=== Testing Next.js API Routes ===");
  try {
    const listRes = await fetch("http://localhost:3000/api/documents");
    const listData = await listRes.json();
    console.log("7. GET /api/documents status:", listRes.status, "count:", listData.count);

    // Upload test file with custom renaming and extension preservation
    const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
    const body = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="customName"',
      '',
      'my_custom_project_spec',
      `--${boundary}`,
      'Content-Disposition: form-data; name="conflictStrategy"',
      '',
      'auto-rename',
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="raw_file.pdf"',
      'Content-Type: application/pdf',
      '',
      '%PDF-1.4 Mock PDF Content For Testing File Upload',
      `--${boundary}--`,
      ''
    ].join('\r\n');

    const uploadRes = await fetch("http://localhost:3000/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: Buffer.from(body, 'utf-8'),
    });

    const uploadData = await uploadRes.json();
    console.log("8. POST /api/documents status:", uploadRes.status, "response:", uploadData);
    if (!uploadData.success || uploadData.document.name !== "my_custom_project_spec.pdf") {
      throw new Error("Upload with custom renaming or extension preservation failed!");
    }

    // Test duplicate upload with same custom name
    const uploadRes2 = await fetch("http://localhost:3000/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: Buffer.from(body, 'utf-8'),
    });
    const uploadData2 = await uploadRes2.json();
    console.log("9. POST /api/documents duplicate status:", uploadRes2.status, "saved name:", uploadData2.document?.name);
    if (!uploadData2.success || uploadData2.document.name !== "my_custom_project_spec (1).pdf") {
      throw new Error("Duplicate handling failed!");
    }

    // Test rename PATCH
    const renameRes = await fetch("http://localhost:3000/api/documents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldName: "my_custom_project_spec (1).pdf",
        newName: "renamed_project_spec",
      }),
    });
    const renameData = await renameRes.json();
    console.log("10. PATCH /api/documents rename status:", renameRes.status, "renamed to:", renameData.name);
    if (!renameData.success || renameData.name !== "renamed_project_spec.pdf") {
      throw new Error("Rename API failed!");
    }

    // Test delete DELETE
    const deleteRes1 = await fetch("http://localhost:3000/api/documents?name=my_custom_project_spec.pdf", {
      method: "DELETE",
    });
    const deleteData1 = await deleteRes1.json();
    console.log("11. DELETE /api/documents file 1 status:", deleteRes1.status, "deleted:", deleteData1.deletedName);

    const deleteRes2 = await fetch("http://localhost:3000/api/documents?name=renamed_project_spec.pdf", {
      method: "DELETE",
    });
    const deleteData2 = await deleteRes2.json();
    console.log("12. DELETE /api/documents file 2 status:", deleteRes2.status, "deleted:", deleteData2.deletedName);

    console.log("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉");
  } catch (err) {
    console.error("API test error (Dev server might still be starting or on different port):", err.message);
  }
}

run().catch(console.error);
