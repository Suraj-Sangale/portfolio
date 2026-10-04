// lib/findCompanyContacts.js  — 100% FREE version (no AI, no API key, no npm packages)
// -----------------------------------------------------------------------------
// Input : companyName (required), location (optional), website (optional but BEST)
// Output: { company, website, primary, hr[], info[], other[], phones, pages... }
// Priority: 1) HR / careers emails  2) info / contact emails
//
// Steps:
//  1. Find the official website (you pass it, or we search DuckDuckGo, or guess domain)
//  2. Fetch homepage + contact / careers / about pages
//  3. Extract emails + phone numbers with regex (also decodes "name [at] site [dot] com")
//  4. Classify HR vs info using the email name (hr@, careers@, info@, contact@ ...)
//  5. Check domain MX record so dead domains are flagged
//
// Needs Node 18+ (native fetch). Works in Next.js route handlers (nodejs runtime).
// -----------------------------------------------------------------------------

import dns from "node:dns/promises";

const UA = "Mozilla/5.0 (compatible; ContactFinder/1.0)";
const MAX_PAGES = 8;

const SKIP_DOMAINS = [
  "linkedin.", "facebook.", "instagram.", "twitter.", "x.com", "youtube.",
  "wikipedia.", "glassdoor.", "indeed.", "naukri.", "justdial.", "ambitionbox.",
  "crunchbase.", "zaubacorp.", "tofler.", "indiamart.", "quora.", "reddit.",
  "bing.com", "google.", "duckduckgo.",
];

const HR_LOCAL = /^(hr|hrd|hrm|career|careers|job|jobs|recruit|recruiter|recruitment|talent|hiring|people|humanresources|resume|resumes|cv|apply|joinus|join)/i;
const INFO_LOCAL = /^(info|contact|contactus|hello|hi|enquiry|enquiries|inquiry|inquiries|query|support|sales|admin|office|mail|care|connect|reach|general)/i;
const JUNK_EMAIL = /(\.(png|jpe?g|gif|svg|webp|css|js)$)|sentry|wixpress|example\.|yourdomain|domain\.com|email\.com|@2x|your@|name@/i;

// ---------- helpers ----------
async function getHtml(url, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
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

const rootHost = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

// ---------- 1. find website ----------
async function resolveWebsite(company, location) {
  // a) DuckDuckGo HTML search (free, no key). May occasionally be rate-limited.
  const q = encodeURIComponent(`${company} ${location || ""} official website`.trim());
  const page = await getHtml(`https://html.duckduckgo.com/html/?q=${q}`);
  if (page) {
    const re = /<a[^>]+class="result__a"[^>]+href="([^"]+)"/gi;
    let m;
    while ((m = re.exec(page.html))) {
      let href = m[1].replace(/&amp;/g, "&");
      if (href.startsWith("//")) href = "https:" + href;
      try {
        const u = new URL(href);
        const real = u.searchParams.get("uddg");
        const target = real ? decodeURIComponent(real) : href;
        const host = rootHost(target);
        if (host && !SKIP_DOMAINS.some((d) => host.includes(d))) {
          return new URL(target).origin;
        }
      } catch {}
    }
  }

  // b) fallback: guess the domain from the company name
  const slug = company.toLowerCase().replace(/\b(pvt|private|ltd|limited|llp|inc|technologies|technology|solutions)\b/g, "").replace(/[^a-z0-9]/g, "");
  for (const tld of [".com", ".in", ".co.in"]) {
    const hit = await getHtml(`https://www.${slug}${tld}`, 5000);
    if (hit) return new URL(hit.url).origin;
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
  return [...found];
}

// ---------- 3. extract ----------
function toText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/\s*[\[\(\{]\s*at\s*[\]\)\}]\s*/gi, "@")
    .replace(/\s*[\[\(\{]\s*dot\s*[\]\)\}]\s*/gi, ".")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

function extractFromPage({ url, html }) {
  const text = toText(html);
  const emails = [];
  const phones = [];

  const emailRe = /[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}/gi;
  // mailto: links first (most reliable), then visible text
  const mailtos = [...html.matchAll(/mailto:([^"'?\s>]+)/gi)].map((x) => decodeURIComponent(x[1]));
  for (const e of mailtos) emails.push({ email: e, context: "" });
  let m;
  while ((m = emailRe.exec(text))) {
    emails.push({ email: m[0], context: text.slice(Math.max(0, m.index - 120), m.index + 120) });
  }

  const telLinks = [...html.matchAll(/tel:([+\d\s()-]{7,})/gi)].map((x) => x[1]);
  for (const p of telLinks) phones.push({ phone: p.trim(), context: "" });
  const mobileRe = /(?:\+91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}/g;
  const landRe = /(?:\+91[\s-]?)?\(?0?(?:22|20|80|11|33|44|40)\)?[\s-]?\d{3,4}[\s-]?\d{4}/g;
  for (const re of [mobileRe, landRe]) {
    while ((m = re.exec(text))) {
      phones.push({ phone: m[0].trim(), context: text.slice(Math.max(0, m.index - 100), m.index + 100) });
    }
  }

  return { url, emails, phones };
}

// ---------- 4/5. classify + verify ----------
async function hasMx(domain) {
  try {
    return (await dns.resolveMx(domain)).length > 0;
  } catch {
    return false;
  }
}

export async function findCompanyContacts(companyName, location = "", website = "") {
  if (!companyName?.trim()) throw new Error("companyName is required");
  const loc = location.trim().toLowerCase();

  // website
  let origin = null;
  if (website) {
    try {
      origin = new URL(website.startsWith("http") ? website : `https://${website}`).origin;
    } catch {}
  }
  if (!origin) origin = await resolveWebsite(companyName, location);
  if (!origin) {
    return { company: companyName, website: null, primary: "none", hr: [], info: [], other: [], phones: [], notes: "Could not find the official website. Pass it as the 3rd argument." };
  }
  const siteHost = rootHost(origin);

  // pages
  const home = await getHtml(origin);
  const candidates = new Set();
  if (home) discoverLinks(home.html, home.url).forEach((l) => candidates.add(l));
  ["/contact", "/contact-us", "/contactus", "/careers", "/career", "/jobs", "/about", "/about-us"].forEach((p) => candidates.add(origin + p));

  const pages = home ? [home] : [];
  const list = [...candidates].slice(0, MAX_PAGES + 6);
  const fetched = await Promise.all(list.map((u) => getHtml(u, 6000)));
  const seenUrls = new Set(pages.map((p) => p.url));
  for (const p of fetched) {
    if (p && !seenUrls.has(p.url) && pages.length < MAX_PAGES) {
      seenUrls.add(p.url);
      pages.push(p);
    }
  }

  // extract + dedupe
  const emailMap = new Map();
  const phoneMap = new Map();
  for (const page of pages) {
    const isCareerPage = /career|job|recruit|hiring|join/i.test(page.url);
    const { emails, phones } = extractFromPage(page);

    for (const { email, context } of emails) {
      const e = email.trim().toLowerCase().replace(/^mailto:/, "");
      if (JUNK_EMAIL.test(e) || emailMap.has(e)) continue;
      const [local, domain] = e.split("@");
      const type = HR_LOCAL.test(local) ? "hr" : INFO_LOCAL.test(local) ? "info" : isCareerPage ? "hr" : "other";
      emailMap.set(e, {
        email: e,
        type,
        sameDomain: domain === siteHost || siteHost.endsWith("." + domain) || domain.endsWith(siteHost),
        locationMatch: loc ? context.toLowerCase().includes(loc) : false,
        source: page.url,
      });
    }

    for (const { phone, context } of phones) {
      const digits = phone.replace(/\D/g, "").slice(-10);
      if (digits.length < 8 || phoneMap.has(digits)) continue;
      phoneMap.set(digits, {
        phone,
        type: /hr|career|recruit|hiring|talent/i.test(context) ? "hr" : "general",
        locationMatch: loc ? context.toLowerCase().includes(loc) : false,
        source: page.url,
      });
    }
  }

  // MX check
  const emails = await Promise.all(
    [...emailMap.values()].map(async (e) => ({ ...e, domainCanReceiveMail: await hasMx(e.email.split("@")[1]) }))
  );

  // sort: location match first, then company-domain emails first
  const rank = (a, b) => (b.locationMatch - a.locationMatch) || (b.sameDomain - a.sameDomain);
  const hr = emails.filter((e) => e.type === "hr").sort(rank);
  const info = emails.filter((e) => e.type === "info").sort(rank);
  const other = emails.filter((e) => e.type === "other" && e.sameDomain).sort(rank);
  const phones = [...phoneMap.values()].sort((a, b) => (a.type === "hr" ? -1 : 1) - (b.type === "hr" ? -1 : 1) || b.locationMatch - a.locationMatch);

  return {
    company: companyName,
    website: origin,
    primary: hr.length ? "hr" : info.length ? "info" : other.length ? "other" : "none",
    hr,
    info,
    other,
    phones,
    pagesChecked: pages.map((p) => p.url),
    notes: !emails.length
      ? "No emails in the page HTML. The site may load contacts with JavaScript, use a contact form only, or block scrapers. Check the careers/LinkedIn page manually."
      : "",
  };
}