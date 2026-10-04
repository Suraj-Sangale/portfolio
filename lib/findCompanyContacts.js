// lib/findCompanyContacts.js — Robust Corporate Contact Discovery
// -----------------------------------------------------------------------------
// Input : companyName (required), location (optional), website (optional)
// Output: { company, website, primary, hr[], info[], other[], phones[], pagesChecked[], notes }
//
// Capabilities:
//  1. Resolves official company website (DuckDuckGo search + fallback domain guessing)
//  2. Crawls homepage, /contact, /careers, /about pages, and Next.js route manifests
//  3. Handles traditional HTML, static websites, and modern SPAs (Next.js, Nuxt, Vite, React)
//  4. Inspects schema.org JSON-LD, __NEXT_DATA__, and page JS bundles + dynamic chunks
//  5. Extracts exact contact titles (e.g., "Call Us", "Customer Support", "HR Desk")
//  6. Robust phone & email regex with junk/timestamp filtering
//  7. Live DNS MX verification to ensure email deliverability
// -----------------------------------------------------------------------------

import dns from "node:dns/promises";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const MAX_PAGES = 10;
const MAX_SCRIPTS_PER_PAGE = 8;

const SKIP_DOMAINS = [
  "linkedin.", "facebook.", "instagram.", "twitter.", "x.com", "youtube.",
  "wikipedia.", "glassdoor.", "indeed.", "naukri.", "justdial.", "ambitionbox.",
  "crunchbase.", "zaubacorp.", "tofler.", "indiamart.", "quora.", "reddit.",
  "bing.com", "google.", "duckduckgo.", "github.",
];

const IGNORE_SCRIPT_SUBSTRINGS = [
  "cloudflare", "cdn-cgi", "beacon.min.js", "analytics", "gtm.js", "gtag",
  "google-analytics", "facebook.net", "clarity.ms", "hotjar", "sentry",
  "prism", "polyfills", "framework-", "_ssgManifest"
];

const HR_LOCAL = /^(hr|hrd|hrm|career|careers|job|jobs|recruit|recruiter|recruitment|talent|hiring|people|humanresources|resume|resumes|cv|apply|joinus|join)/i;
const INFO_LOCAL = /^(info|contact|contactus|hello|hi|enquiry|enquiries|inquiry|inquiries|query|support|sales|admin|office|mail|care|connect|reach|general)/i;
const JUNK_EMAIL = /(\.(png|jpe?g|gif|svg|webp|css|js|woff2?)$)|sentry|wixpress|example\.|yourdomain|domain\.com|email\.com|@2x|your@|name@|test@|schema\.org/i;

// ---------- helpers ----------
async function getHtml(url, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "";
    if (!type.includes("text/html")) return null;
    return { url: res.url, html: await res.text() };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function getText(url, ms = 6000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

const rootHost = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

function cleanPhone(raw) {
  if (!raw) return null;
  let p = raw.replace(/[^\d+()\s-]/g, "").trim();
  p = p.replace(/^[:\s-]+|[:\s-]+$/g, "");
  const digits = p.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  // Exclude common Unix timestamps or numeric hashes
  if (digits.length === 10 && (digits.startsWith("17") || digits.startsWith("16") || digits.startsWith("15"))) return null;
  // Exclude all repeated digits like 9999999999
  if (/^(\d)\1+$/.test(digits)) return null;
  // Exclude dummy numbers
  if (digits === "1234567890" || digits === "0123456789") return null;
  return p;
}

function getPhoneDigits(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

// ---------- 1. resolve website ----------
async function resolveWebsite(company, location) {
  const q = encodeURIComponent(`${company} ${location || ""} official website`.trim());
  const searchUrls = [
    `https://html.duckduckgo.com/html/?q=${q}`,
    `https://lite.duckduckgo.com/lite/?q=${q}`,
  ];

  for (const sUrl of searchUrls) {
    const page = await getHtml(sUrl, 7000);
    if (page) {
      const re = /<a[^>]+href="([^"]+)"/gi;
      let m;
      while ((m = re.exec(page.html))) {
        let href = m[1].replace(/&amp;/g, "&");
        if (href.startsWith("//")) href = "https:" + href;
        try {
          const u = new URL(href, sUrl);
          const real = u.searchParams.get("uddg");
          const target = real ? decodeURIComponent(real) : href;
          const host = rootHost(target);
          if (host && !SKIP_DOMAINS.some((d) => host.includes(d))) {
            return new URL(target).origin;
          }
        } catch {}
      }
    }
  }

  // fallback: guess domain
  const slug = company
    .toLowerCase()
    .replace(/\b(pvt|private|ltd|limited|llp|inc|technologies|technology|solutions|software|group)\b/g, "")
    .replace(/[^a-z0-9]/g, "");

  if (slug.length >= 3) {
    for (const tld of [".com", ".in", ".co.in", ".io", ".tech", ".org"]) {
      const hit = (await getHtml(`https://www.${slug}${tld}`, 4000)) || (await getHtml(`https://${slug}${tld}`, 4000));
      if (hit) return new URL(hit.url).origin;
    }
  }
  return null;
}

// ---------- 2. pick pages to scan ----------
function discoverLinks(html, baseUrl) {
  const base = new URL(baseUrl);
  const found = new Set();
  const re = /<a[^>]+href=["']([^"'#]+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const u = new URL(m[1], base);
      if (rootHost(u.href) !== rootHost(base.href)) continue;
      if (/contact|career|job|recruit|hiring|join|about|reach|people|work-with/i.test(u.pathname)) {
        found.add(u.origin + u.pathname.replace(/\/$/, ""));
      }
    } catch {}
  }

  // Check for Next.js build manifest routes in HTML
  const manifestMatch = html.match(/static\/[a-zA-Z0-9_\-]+\/_buildManifest\.js/i);
  if (manifestMatch) {
    found.add(new URL(manifestMatch[0], base).href);
  }

  return [...found];
}

// ---------- 3. extract from HTML & Text ----------
function extractFromPage({ url, html }) {
  const emails = [];
  const phones = [];

  // A. Mailto links
  const mailtos = [...html.matchAll(/mailto:([^"'?\s>]+)/gi)].map((x) => decodeURIComponent(x[1].trim()));
  for (const e of mailtos) emails.push({ email: e, context: "mailto link", source: url });

  // B. Tel links
  const telLinks = [...html.matchAll(/tel:([+\d\s().-]{7,25})/gi)].map((x) => x[1].trim());
  for (const raw of telLinks) {
    const p = cleanPhone(raw);
    if (p) phones.push({ phone: p, label: "Phone", context: "tel link", source: url });
  }

  // C. JSON & JSON-LD
  const jsonMatches = [...html.matchAll(/<script[^>]*type=["']application\/(?:ld\+)?json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (nextDataMatch) jsonMatches.push(nextDataMatch[1]);

  for (const jsonText of jsonMatches) {
    const telFields = [...jsonText.matchAll(/"(?:telephone|phone|tel|mobile|contactNumber)":\s*"([^"]+)"/gi)].map((m) => m[1]);
    for (const raw of telFields) {
      const p = cleanPhone(raw);
      if (p) phones.push({ phone: p, label: "Contact Point", context: "schema telephone", source: url });
    }
    const emFields = [...jsonText.matchAll(/"(?:email|emailAddress)":\s*"([^"]+)"/gi)].map((m) => m[1]);
    for (const e of emFields) {
      emails.push({ email: e.trim(), context: "schema email", source: url });
    }
  }

  // D. Keywords in HTML (e.g. Call Us: +91 ...)
  const keywordRegex = /(?:call\s*(?:us)?|phone|tel(?:ephone)?|mobile|mob|contact\s*(?:us|no|number)?|whatsapp|helpline|toll[\s-]?free|reach\s*us)[\s:：\-–—]{1,25}((?:\+?\d{1,4}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?)?\d{3,5}[\s.-]?\d{3,5})/gi;
  let km;
  while ((km = keywordRegex.exec(html))) {
    const raw = cleanPhone(km[1]);
    if (raw) {
      const labelMatch = km[0].match(/^(call\s*(?:us)?|phone|telephone|tel|mobile|contact\s*(?:us)?|whatsapp|helpline|toll[\s-]?free)/i);
      const label = labelMatch ? labelMatch[0].trim().replace(/\b\w/g, (c) => c.toUpperCase()) : "Call Us";
      phones.push({
        phone: raw,
        label,
        context: html.slice(Math.max(0, km.index - 50), km.index + km[0].length + 50).replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
        source: url,
      });
    }
  }

  // E. Visible text
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/\s*[\[\(\{]\s*at\s*[\]\)\}]\s*/gi, "@")
    .replace(/\s*[\[\(\{]\s*dot\s*[\]\)\}]\s*/gi, ".")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");

  const indianMobileRe = /(?:\+91[\s.-]?|0)?[6-9]\d{2,4}[\s.-]?\d{3,5}(?:[\s.-]?\d{1,4})?/g;
  let m;
  while ((m = indianMobileRe.exec(visibleText))) {
    const p = cleanPhone(m[0]);
    if (p) {
      const digits = p.replace(/\D/g, "");
      const cleanDigits = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits.startsWith("0") && digits.length === 11 ? digits.slice(1) : digits;
      if (cleanDigits.length === 10 && /^[6-9]\d{9}$/.test(cleanDigits)) {
        phones.push({ phone: p, label: "Mobile", context: visibleText.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60), source: url });
      }
    }
  }

  const landRe = /(?:\+91[\s.-]?)?\(?0?(?:22|20|80|11|33|44|40|120|124|141|79)\)?[\s.-]?\d{3,4}[\s.-]?\d{4}/g;
  while ((m = landRe.exec(visibleText))) {
    const p = cleanPhone(m[0]);
    if (p) phones.push({ phone: p, label: "Landline", context: visibleText.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60), source: url });
  }

  const emailRe = /[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}/gi;
  while ((m = emailRe.exec(visibleText))) {
    emails.push({ email: m[0], context: visibleText.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60), source: url });
  }

  return { url, emails, phones };
}

// ---------- 4. extract from JS bundles (Next.js / Nuxt / SPAs) ----------
function extractFromJsCode(code, sourceUrl) {
  const emails = [];
  const phones = [];

  // A. Mailto links in JS
  const mailtos = [...code.matchAll(/mailto:([^"'?\s>]+)/gi)].map((x) => decodeURIComponent(x[1].trim()));
  for (const e of mailtos) emails.push({ email: e, context: "script mailto link", source: sourceUrl });

  // B. Tel links in JS
  const telLinks = [...code.matchAll(/tel:([+\d\s().-]{7,25})/gi)].map((x) => x[1].trim());
  for (const raw of telLinks) {
    const p = cleanPhone(raw);
    if (p) phones.push({ phone: p, label: "Phone", context: "script tel link", source: sourceUrl });
  }

  // C. Schema telephone / phone in JS objects
  const telSchemaMatches = [...code.matchAll(/["']?(?:telephone|phone|tel|mobile)["']?\s*:\s*["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const raw of telSchemaMatches) {
    const p = cleanPhone(raw);
    if (p) phones.push({ phone: p, label: "Telephone", context: "schema telephone in JS", source: sourceUrl });
  }

  // D. Call Us / Contact Us JSX elements
  // Matches e.g. children:"Call Us" ... children:"+91 9867664162"
  const callPattern = /(?:children\s*:\s*["'](Call Us|Contact Us|Get in touch|Helpline|Toll Free|Support)["'][\s\S]{1,150}?children\s*:\s*["']([+\d\s().-]{8,25})["']|["'](Call Us|Contact Us|Get in touch|Helpline|Toll Free|Support)["'][\s\S]{1,120}?["']([+\d\s().-]{8,25})["'])/gi;
  let cm;
  while ((cm = callPattern.exec(code))) {
    const title = cm[1] || cm[3] || "Call Us";
    const rawNumber = cm[2] || cm[4];
    const p = cleanPhone(rawNumber);
    if (p) {
      phones.push({ phone: p, label: title, context: `JSX ${title}`, source: sourceUrl });
    }
  }

  // General keyword near phone string in JS
  const keywordInJs = /(?:call\s*(?:us)?|telephone|phone|helpline|whatsapp|mobile)[\s\S]{1,60}?["']([+\d\s().-]{8,25})["']/gi;
  let kjm;
  while ((kjm = keywordInJs.exec(code))) {
    const p = cleanPhone(kjm[1]);
    if (p) {
      phones.push({ phone: p, label: "Call Us", context: "JS keyword", source: sourceUrl });
    }
  }

  // Emails in JS strings
  const stringEmailRegex = /["']([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})["']/g;
  let sem;
  while ((sem = stringEmailRegex.exec(code))) {
    emails.push({ email: sem[1], context: "JS string email", source: sourceUrl });
  }

  return { emails, phones };
}

async function extractFromPageScripts(page, baseOrigin) {
  const scriptsToFetch = [];
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/gi;
  let sm;
  while ((sm = scriptRegex.exec(page.html))) {
    const src = sm[1];
    if (IGNORE_SCRIPT_SUBSTRINGS.some((ig) => src.includes(ig))) continue;
    try {
      const u = new URL(src, page.url);
      if (rootHost(u.href) === rootHost(baseOrigin)) {
        if (/pages\/|chunks\/(pages|_app|contact|about|career|\d{4})/i.test(u.pathname) || scriptsToFetch.length < MAX_SCRIPTS_PER_PAGE) {
          scriptsToFetch.push(u.href);
        }
      }
    } catch {}
  }

  const emails = [];
  const phones = [];
  const fetchedScripts = await Promise.all(
    scriptsToFetch.slice(0, MAX_SCRIPTS_PER_PAGE).map((s) => getText(s).then((code) => ({ s, code })))
  );

  const dynamicChunkIds = new Set();
  for (const { s, code } of fetchedScripts) {
    if (!code) continue;
    // Map extracted contacts to the human-facing page URL for clear source tracking
    const extracted = extractFromJsCode(code, page.url);
    emails.push(...extracted.emails);
    phones.push(...extracted.phones);

    // Dynamic chunk imports like n.e(8291)
    const dynMatches = [...code.matchAll(/n\.e\((\d+)\)/g)].map((dm) => dm[1]);
    dynMatches.forEach((id) => dynamicChunkIds.add(id));
  }

  // Fetch dynamic chunks via webpack map
  if (dynamicChunkIds.size > 0) {
    const webpackSrc = (page.html.match(/src=["']([^"']*webpack-[^"']*\.js)["']/i) || [])[1];
    if (webpackSrc) {
      const webpackUrl = new URL(webpackSrc, page.url).href;
      const webpackCode = await getText(webpackUrl);
      if (webpackCode) {
        for (const chunkId of dynamicChunkIds) {
          const mapRegex = new RegExp(`${chunkId}:"([a-f0-9]+)"`);
          const hm = webpackCode.match(mapRegex);
          if (hm) {
            const chunkHash = hm[1];
            const chunkUrl = new URL(`/_next/static/chunks/${chunkId}.${chunkHash}.js`, baseOrigin).href;
            const chunkCode = await getText(chunkUrl);
            if (chunkCode) {
              const dynExtracted = extractFromJsCode(chunkCode, page.url);
              emails.push(...dynExtracted.emails);
              phones.push(...dynExtracted.phones);
            }
          }
        }
      }
    }
  }

  return { emails, phones };
}

// ---------- 5. MX check ----------
async function hasMx(domain) {
  try {
    return (await dns.resolveMx(domain)).length > 0;
  } catch {
    return false;
  }
}

// ---------- Main Export Function ----------
export async function findCompanyContacts(companyName, location = "", website = "") {
  if (!companyName?.trim()) throw new Error("companyName is required");
  const loc = location.trim().toLowerCase();

  // 1. Resolve website
  let origin = null;
  if (website) {
    try {
      origin = new URL(website.startsWith("http") ? website : `https://${website}`).origin;
    } catch {}
  }
  if (!origin) origin = await resolveWebsite(companyName, location);
  if (!origin) {
    return {
      company: companyName,
      website: null,
      primary: "none",
      hr: [],
      info: [],
      other: [],
      phones: [],
      pagesChecked: [],
      notes: "Could not find the official website. Pass it as the 3rd argument.",
    };
  }
  const siteHost = rootHost(origin);

  // 2. Discover pages
  const home = await getHtml(origin);
  const candidates = new Set();
  if (home) {
    discoverLinks(home.html, home.url).forEach((l) => candidates.add(l));
  }

  // Add standard contact & career paths
  [
    "/contact", "/contact-us", "/contactus", "/contact_us",
    "/careers", "/career", "/jobs", "/work-with-us",
    "/about", "/about-us", "/aboutus",
  ].forEach((p) => candidates.add(origin + p));

  // If a buildManifest is found, inspect routes
  for (const c of [...candidates]) {
    if (c.includes("_buildManifest.js")) {
      const manifestText = await getText(c);
      if (manifestText) {
        const routes = [...manifestText.matchAll(/"(\/[^"]*(?:contact|career|job|about|work)[^"]*)":/gi)].map((rm) => rm[1]);
        routes.forEach((r) => candidates.add(origin + r));
      }
      candidates.delete(c);
    }
  }

  const pages = home ? [home] : [];
  const list = [...candidates].slice(0, MAX_PAGES + 4);
  const fetched = await Promise.all(list.map((u) => getHtml(u, 6000)));
  const seenUrls = new Set(pages.map((p) => p.url));
  for (const p of fetched) {
    if (p && !seenUrls.has(p.url) && pages.length < MAX_PAGES) {
      seenUrls.add(p.url);
      pages.push(p);
    }
  }

  // 3. Extract contacts from pages and their scripts
  const emailMap = new Map();
  const phoneMap = new Map();

  for (const page of pages) {
    const isCareerPage = /career|job|recruit|hiring|join|work/i.test(page.url);
    const fromHtml = extractFromPage(page);
    const fromScripts = await extractFromPageScripts(page, origin);

    const allEmails = [...fromHtml.emails, ...fromScripts.emails];
    const allPhones = [...fromHtml.phones, ...fromScripts.phones];

    // Process Emails
    for (const { email, context, source } of allEmails) {
      const e = email.trim().toLowerCase().replace(/^mailto:/, "");
      if (JUNK_EMAIL.test(e)) continue;
      const [local, domain] = e.split("@");
      if (!domain || !domain.includes(".")) continue;

      if (emailMap.has(e)) {
        const existing = emailMap.get(e);
        if (/contact|career|job/i.test(source) && !/contact|career|job/i.test(existing.source)) {
          existing.source = source;
        }
        continue;
      }

      const type = HR_LOCAL.test(local) ? "hr" : INFO_LOCAL.test(local) ? "info" : isCareerPage ? "hr" : "other";
      emailMap.set(e, {
        email: e,
        type,
        sameDomain: domain === siteHost || siteHost.endsWith("." + domain) || domain.endsWith(siteHost),
        locationMatch: loc ? context.toLowerCase().includes(loc) : false,
        source: source || page.url,
      });
    }

    // Process Phones
    for (const { phone, label, context, source } of allPhones) {
      const digits = getPhoneDigits(phone);
      if (!digits || digits.length < 8) continue;

      const isHr = /hr|career|recruit|hiring|talent/i.test((label || "") + " " + context);
      const isCallUs = /call\s*us/i.test(label || "") || /call\s*us/i.test(context);
      const phoneType = isHr ? "hr" : isCallUs ? "call_us" : "general";

      // If we already have this phone, keep the better labeled / formatted version
      if (phoneMap.has(digits)) {
        const existing = phoneMap.get(digits);
        if (isCallUs || (label && (!existing.label || existing.label === "Telephone" || existing.label === "Phone" || existing.label === "Contact Phone"))) {
          existing.label = label || "Call Us";
          existing.type = phoneType;
        }
        if (/contact|career|job/i.test(source) && !/contact|career|job/i.test(existing.source)) {
          existing.source = source;
        }
        if (phone.includes("+") || existing.phone.length < phone.length) {
          existing.phone = phone;
        }
        continue;
      }

      phoneMap.set(digits, {
        phone,
        label: label || (isCallUs ? "Call Us" : isHr ? "HR Contact" : "Contact Phone"),
        type: phoneType,
        locationMatch: loc ? context.toLowerCase().includes(loc) : false,
        source: source || page.url,
      });
    }
  }

  // 4. MX verification
  const emails = await Promise.all(
    [...emailMap.values()].map(async (e) => ({
      ...e,
      domainCanReceiveMail: await hasMx(e.email.split("@")[1]),
    }))
  );

  // 5. Ranking and grouping
  const rank = (a, b) => (b.locationMatch - a.locationMatch) || (b.sameDomain - a.sameDomain);
  const hr = emails.filter((e) => e.type === "hr").sort(rank);
  const info = emails.filter((e) => e.type === "info").sort(rank);
  const other = emails.filter((e) => e.type === "other" && e.sameDomain).sort(rank);

  // Phone sorting: Call Us / HR / location match first
  const phones = [...phoneMap.values()].sort((a, b) => {
    const scoreA = (a.type === "call_us" ? 3 : a.type === "hr" ? 2 : 1) + (a.locationMatch ? 2 : 0);
    const scoreB = (b.type === "call_us" ? 3 : b.type === "hr" ? 2 : 1) + (b.locationMatch ? 2 : 0);
    return scoreB - scoreA;
  });

  return {
    company: companyName,
    website: origin,
    primary: hr.length ? "hr" : info.length ? "info" : other.length ? "other" : "none",
    hr,
    info,
    other,
    phones,
    pagesChecked: pages.map((p) => p.url),
    notes: !emails.length && !phones.length
      ? "No contacts found in page HTML or script bundles. The site may use an external contact form only, or block scrapers."
      : "",
  };
}