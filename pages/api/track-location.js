import { getServerSupabaseClient } from "@/lib/supabaseClient";

// Lightweight UA parser (no extra dependency needed)
function parseUserAgent(ua = '') {
  const mobile  = /mobile|android|iphone|ipad|ipod/i.test(ua);
  const tablet  = /ipad|tablet/i.test(ua);
  const deviceType = tablet ? 'tablet' : mobile ? 'mobile' : 'desktop';

  let browser = 'unknown';
  if (/edg\//i.test(ua))            browser = 'Edge';
  else if (/chrome\//i.test(ua))    browser = 'Chrome';
  else if (/firefox\//i.test(ua))   browser = 'Firefox';
  else if (/safari\//i.test(ua))    browser = 'Safari';
  else if (/opr\//i.test(ua))       browser = 'Opera';

  let os = 'unknown';
  if (/windows/i.test(ua))          os = 'Windows';
  else if (/mac os x/i.test(ua))    os = 'macOS';
  else if (/android/i.test(ua))     os = 'Android';
  else if (/iphone|ipad/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua))       os = 'Linux';

  return { browser, os, deviceType };
}

// Resolve IP → country/city using ip-api.com (free, no key needed)
async function resolveIp(ip) {
  try {
    // Skip private / loopback IPs (localhost dev)
    if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.')) {
      return {};
    }
    const res  = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city,isp`);
    const data = await res.json();
    return {
      country: data.country  || null,
      region:  data.regionName || null,
      city:    data.city     || null,
      isp:     data.isp      || null,
    };
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { latitude, longitude, accuracy, page_path, referrer } = req.body ?? {};

    // ── Resolve client IP ──────────────────────────────────────────────
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      null;

    // ── Parse user agent ───────────────────────────────────────────────
    const ua = req.headers['user-agent'] || '';
    const { browser, os, deviceType } = parseUserAgent(ua);

    // ── IP geo-lookup (parallel with DB call prep) ─────────────────────
    const geoData = await resolveIp(ip);

    // ── Insert into Supabase ───────────────────────────────────────────
    const supabase = getServerSupabaseClient(req, res);

    const { error } = await supabase.from('visitor_locations').insert({
      // Coordinates
      latitude:    latitude  ?? null,
      longitude:   longitude ?? null,
      accuracy:    accuracy  ?? null,

      // IP info
      ip_address:  ip,
      ...geoData,

      // Device info
      user_agent:  ua,
      browser,
      os,
      device_type: deviceType,

      // Page context
      page_path:   page_path ?? null,
      referrer:    referrer  ?? null,
    });

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[track-location]', err);
    return res.status(500).json({ error: 'Failed to store location' });
  }
}