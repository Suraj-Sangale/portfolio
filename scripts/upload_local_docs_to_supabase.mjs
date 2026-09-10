import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Read .env manually
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

function getEnvVar(key) {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : process.env[key];
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const bucketName = 'documents';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const docsDir = path.join(process.cwd(), 'public', 'uploads', 'documents');

async function syncDocuments() {
  console.log(`Connecting to Supabase: ${supabaseUrl}`);
  
  if (!fs.existsSync(docsDir)) {
    console.error(`❌ Directory not found: ${docsDir}`);
    return;
  }

  const files = fs.readdirSync(docsDir).filter(f => fs.statSync(path.join(docsDir, f)).isFile());
  console.log(`Found ${files.length} local documents to upload to '${bucketName}' bucket...`);

  // 1. Try to ensure bucket exists
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = (buckets || []).some(b => b.name === bucketName);
    if (!exists) {
      console.log(`Bucket '${bucketName}' not found in list, attempting creation...`);
      const { error: createErr } = await supabase.storage.createBucket(bucketName, { public: true });
      if (createErr) {
        console.warn(`Note on bucket creation: ${createErr.message}`);
      } else {
        console.log(`✅ Bucket '${bucketName}' created.`);
      }
    }
  } catch (err) {
    console.warn(`Could not list buckets: ${err.message}`);
  }

  // 2. Upload each file
  let successCount = 0;
  let failCount = 0;

  for (const fileName of files) {
    const filePath = path.join(docsDir, fileName);
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(fileName).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.pdf') mimeType = 'application/pdf';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    console.log(`Uploading: ${fileName} (${(fileBuffer.length / 1024).toFixed(1)} KB)...`);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.error(`❌ Failed to upload ${fileName}:`, error.message);
      failCount++;
    } else {
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      console.log(`✅ Uploaded: ${fileName} -> ${urlData?.publicUrl}`);
      successCount++;
    }
  }

  console.log(`\n=============================`);
  console.log(`Upload Complete: ${successCount} successful, ${failCount} failed.`);
  console.log(`=============================\n`);
}

syncDocuments().catch(err => console.error('Unexpected error:', err));
