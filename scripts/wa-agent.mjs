import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  downloadMediaMessage,
} from "@whiskeysockets/baileys";
import qrcodeTerminal from "qrcode-terminal";
import QRCode from "qrcode";
import OpenAI, { toFile } from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import pino from "pino";
import http from "http";

// ----------------------------------------------------
// 1. Environment & AI Client Setup
// ----------------------------------------------------
dotenv.config();
const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

const groqKey = process.env.GROQ_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

let aiClient;
let groqWhisperClient;
let selectedModel = "openai/gpt-oss-120b";
let providerName = "Unknown";
let candidateModels = [];

// Setup Groq Whisper client for free voice transcription if groqKey available
if (groqKey) {
  groqWhisperClient = new OpenAI({
    apiKey: groqKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

if (groqKey) {
  // Groq Cloud (Free Tier)
  aiClient = new OpenAI({
    apiKey: groqKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
  selectedModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  candidateModels = [
    selectedModel,
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b",
  ];
  providerName = `Groq (${selectedModel}) [Free]`;
} else if (geminiKey) {
  // Google Gemini (Free Tier)
  aiClient = new OpenAI({
    apiKey: geminiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
  selectedModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  candidateModels = [selectedModel, "gemini-1.5-flash", "gemini-2.0-flash"];
  providerName = "Google Gemini [Free]";
} else if (openaiKey) {
  // OpenAI
  aiClient = new OpenAI({ apiKey: openaiKey });
  selectedModel = "gpt-4o-mini";
  candidateModels = [selectedModel, "gpt-3.5-turbo"];
  providerName = "OpenAI";
}

console.log(`\n======================================================`);
console.log(`🤖 AI Engine: ${providerName}`);
console.log(
  `🎙️ Voice Transcription: ${groqWhisperClient ? "Groq Whisper (Enabled)" : "Disabled (Requires GROQ_API_KEY)"}`,
);
console.log(`======================================================\n`);

// ----------------------------------------------------
// 2. Load Portfolio Knowledge & Resume Location
// ----------------------------------------------------
let portfolioData = {};
try {
  const portfolioPath = path.join(process.cwd(), "data", "portfolio.json");
  if (fs.existsSync(portfolioPath)) {
    portfolioData = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
  }
} catch (err) {
  console.warn("⚠️ Could not load data/portfolio.json:", err.message);
}

const RESUME_PATHS = [
  path.join(process.cwd(), "public", "Suraj_full_stack_developer.pdf"),
  path.join(process.cwd(), "public", "Suraj_full_stack_developer1.pdf"),
  path.join(process.cwd(), "public", "Suraj_full_stack_developer2.pdf"),
];
const resumePath = RESUME_PATHS.find((p) => fs.existsSync(p)) || null;

const SYSTEM_PROMPT = `
You are the official WhatsApp AI Assistant for Suraj Sangale (Full Stack Software Developer).

STRICT FORMATTING RULES FOR WHATSAPP:
1. Always use SINGLE asterisks for bold (*like this*). Never use double asterisks (**).
2. Never use markdown headers (###, ##, #). Use *Bold Titles* with relevant emojis.
3. For bullet lists, use emojis or bullet points: "• " or "👉 " or "🔹 ".
4. For links, use plain format: "Title: https://link.com" (Never use [Title](url)).
5. Keep answers clear, engaging, professional, and readable on mobile screens.

Capabilities & Actions:
- If a user wants to view or download Suraj's resume/CV, tell them that you are sending the resume document right away.
- Provide accurate information regarding Suraj's projects, tech stack, work experience, achievements, education, background, languages spoken, location, and personal details.
- Answer any general programming or tech questions politely and clearly.

Portfolio Knowledge Base:
${JSON.stringify(
  {
    personal: portfolioData.personal,
    dataAboutMe: portfolioData.dataAboutMe,
    achievements: portfolioData.achievements,
    experience: portfolioData.experience,
    projects: portfolioData.projects,
    skills: portfolioData.skills || portfolioData.dataAboutMe?.skills,
    contact: portfolioData.contact || portfolioData.personal?.socialLinks,
  },
  null,
  2,
)}
`;

// ----------------------------------------------------
// 3. Formatting & Command Helpers
// ----------------------------------------------------
function formatForWhatsApp(text) {
  if (!text) return "";
  return text
    .replace(/^#{1,6}\s*(.+)$/gm, "*$1*")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1: $2")
    .replace(/\*\*([^*]+)\*\*/g, "*$1*")
    .replace(/__([^_]+)__/g, "*$1*")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isResumeRequest(text) {
  const t = text.toLowerCase();
  return (
    t.includes("resume") ||
    t.includes("cv") ||
    t.includes("biodata") ||
    t.includes("curriculum vitae") ||
    t.includes("profile pdf")
  );
}

function handleQuickCommand(cmd, sock, sender, msg) {
  const normalized = cmd.trim().toLowerCase();

  switch (normalized) {
    case "hi":
    case "hello":
    case "hey":
    case "!help":
    case "!menu":
    case "menu":
      return `👋 *Hi! I am the AI Assistant for Suraj Sangale.*

How can I help you today? Reply with a *number* or *command*:

1️⃣ *about* (or reply *1*) - Personal bio & education
2️⃣ *skills* (or reply *2*) - Technical skills & stack
3️⃣ *projects* (or reply *3*) - View featured projects
4️⃣ *experience* (or reply *4*) - Work history & experience
5️⃣ *resume* (or reply *5*) - Download Resume PDF
6️⃣ *contact* (or reply *6*) - Contact info & social links
7️⃣ *achievements* (or reply *7*) - Key highlights & achievements

💬 _Or ask any question naturally (e.g. "Where did Suraj study?" or "Tell me about his key achievements") or send a voice note!_`;

    case "3":
    case "!projects":
    case "projects": {
      const projects = portfolioData.projects || [];
      let projText = `*🚀 Featured Projects by Suraj Sangale*\n\n`;
      const list = Array.isArray(projects) ? projects.slice(0, 5) : [];
      if (list.length > 0) {
        list.forEach((p, idx) => {
          projText += `*${idx + 1}. ${p.title || p.name}*\n`;
          if (p.desc || p.description)
            projText += `📝 ${p.desc || p.description}\n`;
          if (p.link || p.github || p.liveLink)
            projText += `🔗 ${p.link || p.github || p.liveLink}\n`;
          projText += `\n`;
        });
      } else {
        projText += `• Portfolio Web Application (Next.js, Framer Motion, Supabase)\n• WhatsApp AI Agent CLI (Baileys, Groq, Whisper)\n`;
      }
      projText += `_Reply with *2* to get his Resume or *5* to Contact him!_`;
      return projText.trim();
    }

    case "4":
    case "!experience":
    case "experience": {
      const exp = portfolioData.experience || [];
      let expText = `*💼 Work Experience*\n\n`;
      const list = Array.isArray(exp) ? exp : [];
      if (list.length > 0) {
        list.forEach((e) => {
          expText += `• *${e.title}* at *${e.company || e.desc || ""}*\n`;
          if (e.year || e.duration) expText += `  🗓️ ${e.year || e.duration}\n`;
          if (Array.isArray(e.skills))
            expText += `  🛠️ Skills: ${e.skills.join(", ")}\n`;
          expText += `\n`;
        });
      } else {
        expText += `• Software Developer at Fortune4 Technologies (02/2024 - present)\n• Frontend Developer at Boppo Technologies\n`;
      }
      return expText.trim();
    }

    case "2":
    case "!skills":
    case "skills": {
      const skillsData =
        portfolioData.dataAboutMe?.skills || portfolioData.skills || [];
      let skillsText = "*🛠️ Suraj Sangale - Technical Skills*\n\n";
      if (Array.isArray(skillsData) && skillsData.length > 0) {
        skillsData.forEach((cat) => {
          skillsText += `*${cat.category || cat.title || cat.name || "Skills"}:*\n`;
          if (Array.isArray(cat.items || cat.skills)) {
            const list = (cat.items || cat.skills)
              .map((s) => (typeof s === "string" ? s : s.name))
              .join(", ");
            skillsText += `👉 ${list}\n\n`;
          }
        });
      } else {
        skillsText +=
          "• *Frontend:* React, Next.js, Redux, TailwindCSS\n• *Backend:* Node.js, Express, REST APIs\n• *Databases:* MySQL, MariaDB, MongoDB\n• *Languages:* JavaScript, TypeScript, Python, HTML, CSS\n";
      }
      return skillsText.trim();
    }

    case "6":
    case "!contact":
    case "contact": {
      const personal = portfolioData.personal || {};
      const social = personal.socialLinks || [];
      let contactText = `*📬 Get in Touch with Suraj Sangale*\n\n`;
      contactText += `👤 *Name:* ${personal.name || "Suraj Sangale"}\n`;
      contactText += `💼 *Role:* ${personal.title || "Software Developer"}\n`;
      if (personal.email) contactText += `📧 *Email:* ${personal.email}\n`;

      contactText += `\n*🌐 Social & Profiles:*\n`;
      social
        .filter((s) => !s.disabled && s.href)
        .forEach((s) => {
          contactText += `• *${s.label}:* ${s.href}\n`;
        });
      return contactText.trim();
    }

    case "1":
    case "!about":
    case "about":
    case "!bio":
    case "bio":
    case "!education":
    case "education": {
      const me = portfolioData.dataAboutMe || {};
      const edu = me.educationalQualifications || [];
      let aboutText = `*👨‍💻 About Suraj Sangale*\n\n`;
      aboutText += `👤 *Name:* ${me.name || "Suraj Sangale"}\n`;
      aboutText += `💼 *Role:* ${me.role || "Full Stack Developer"}\n`;
      if (me.description) aboutText += `📝 *Bio:* ${me.description}\n`;
      if (me.address) aboutText += `📍 *Location:* ${me.address}\n`;
      if (Array.isArray(me.languages))
        aboutText += `🗣️ *Languages:* ${me.languages.join(", ")}\n`;
      if (me.nationality) aboutText += `🌍 *Nationality:* ${me.nationality}\n`;

      if (Array.isArray(edu) && edu.length > 0) {
        aboutText += `\n*🎓 Educational Qualifications:*\n`;
        edu.forEach((e) => {
          aboutText += `• *${e.degree}*`;
          if (e.specialization) aboutText += ` (${e.specialization})`;
          aboutText += `\n  🏛️ ${e.institution}`;
          if (e.startYear && e.endYear)
            aboutText += ` | 🗓️ ${e.startYear} - ${e.endYear}`;
          else if (e.endYear) aboutText += ` | 🗓️ ${e.endYear}`;
          aboutText += `\n`;
        });
      }
      return aboutText.trim();
    }

    case "7":
    case "!achievements":
    case "achievements":
    case "!highlights":
    case "highlights": {
      const achievements = portfolioData.achievements || [];
      let achText = `*🏆 Key Achievements & Highlights*\n\n`;
      if (Array.isArray(achievements) && achievements.length > 0) {
        achievements.forEach((a, idx) => {
          achText += `*${idx + 1}. ${a.title}*\n`;
          if (a.description) achText += `🔹 ${a.description}\n\n`;
        });
      } else {
        achText += `• Core Web Vitals Optimization for high-traffic web apps.\n• Real-time multi-user applications using Socket.IO and WebSockets.\n• Full Stack Development across frontend, backend, DB & API layers.\n• Performance optimization with Redis caching, code splitting & lazy loading.\n`;
      }
      return achText.trim();
    }

    default:
      return null;
  }
}

async function sendResumeDocument(sock, sender, msg) {
  if (!resumePath) {
    await sock.sendMessage(
      sender,
      {
        text: "📄 Resume file is currently being updated. You can view Suraj's latest details via *!projects* or *!contact*.",
      },
      { quoted: msg },
    );
    return;
  }

  const pdfBuffer = fs.readFileSync(resumePath);
  await sock.sendMessage(
    sender,
    {
      document: pdfBuffer,
      mimetype: "application/pdf",
      fileName: "Suraj_Sangale_FullStack_Developer_Resume.pdf",
      caption: `📄 *Suraj Sangale - Full Stack Developer Resume*\n\nHere is the latest CV document. Let me know if you have any questions or would like to schedule an interview!`,
    },
    { quoted: msg },
  );
  console.log(`📎 [Sent Resume PDF to ${sender}]`);
}

// ----------------------------------------------------
// 4. Web Server for Cloud (Railway/Render) QR Scanning, Health Checks & Bot Controls
// ----------------------------------------------------
let latestQRDataUrl = null;
let isConnected = false;
let isAutoReplyPaused = false;
let isGroupsEnabled = process.env.ENABLE_GROUPS !== "false";
const authDir = path.join(process.cwd(), "wa_auth_session");
let activeSock = null;
let reconnectTimer = null;

export function toggleAutoReply(paused) {
  if (typeof paused === "boolean") {
    isAutoReplyPaused = paused;
  } else {
    isAutoReplyPaused = !isAutoReplyPaused;
  }
  console.log(
    `🤖 Auto-reply is now ${isAutoReplyPaused ? "⏸️ PAUSED" : "🟢 ACTIVE"}`,
  );
  return isAutoReplyPaused;
}

export function toggleGroups(enabled) {
  if (typeof enabled === "boolean") {
    isGroupsEnabled = enabled;
  } else {
    isGroupsEnabled = !isGroupsEnabled;
  }
  console.log(
    `👥 Group replies are now ${isGroupsEnabled ? "🟢 ENABLED" : "⏸️ DISABLED"}`,
  );
  return isGroupsEnabled;
}

export function resetWhatsAppSession() {
  console.log("🔄 Resetting WhatsApp session and clearing auth credentials...");
  try {
    if (activeSock) {
      try {
        activeSock.end();
      } catch (e) {}
      activeSock = null;
    }
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true });
    }
  } catch (err) {
    console.error("Error while resetting session directory:", err.message);
  }
  isConnected = false;
  latestQRDataUrl = null;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    startWhatsAppAgent();
  }, 1500);
}

const port = process.env.PORT || 3001;
const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = urlObj.pathname;

  if (pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        connected: isConnected,
        isPaused: isAutoReplyPaused,
        groupsEnabled: isGroupsEnabled,
      }),
    );
    return;
  }

  if (pathname === "/reset-session") {
    resetWhatsAppSession();
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  if (pathname === "/toggle-pause" || pathname === "/api/toggle") {
    const newState = toggleAutoReply();
    if (req.headers.accept?.includes("application/json")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, isPaused: newState }));
      return;
    }
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  if (pathname === "/toggle-groups" || pathname === "/api/toggle-groups") {
    const newGroupState = toggleGroups();
    if (req.headers.accept?.includes("application/json")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, groupsEnabled: newGroupState }));
      return;
    }
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  if (isConnected) {
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>WhatsApp AI Agent - Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b141a; color: #e9edef; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
          .card { background: #111b21; padding: 2.5rem; border-radius: 20px; border: 1px solid #202c33; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 440px; width: 90%; }
          .badge-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 15px; }
          .badge { padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 13px; display: inline-block; }
          .badge-online { background: #00a884; color: #fff; }
          .badge-paused { background: #eab308; color: #000; }
          .badge-disabled { background: #64748b; color: #fff; }
          h1 { margin: 8px 0; font-size: 22px; }
          p { color: #8696a0; font-size: 14px; line-height: 1.5; margin-bottom: 20px; }
          .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 600; padding: 12px 20px; border-radius: 12px; border: none; cursor: pointer; text-decoration: none; transition: all 0.2s; width: 100%; box-sizing: border-box; margin-bottom: 10px; }
          .btn-pause { background: #ef4444; color: white; }
          .btn-pause:hover { background: #dc2626; }
          .btn-resume { background: #00a884; color: white; }
          .btn-resume:hover { background: #008f6f; }
          .btn-group { background: #2563eb; color: white; }
          .btn-group:hover { background: #1d4ed8; }
          .btn-group-off { background: #475569; color: #e2e8f0; }
          .btn-group-off:hover { background: #334155; }
          .btn-reset { background: #1e293b; color: #94a3b8; font-size: 13px; padding: 10px 16px; margin-top: 5px; }
          .btn-reset:hover { background: #334155; color: white; }
          .info-box { background: #182229; border-radius: 10px; padding: 12px; margin-top: 15px; font-size: 12px; color: #8696a0; text-align: left; }
          .info-box code { color: #53bdeb; background: #111b21; padding: 2px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge-row">
            <div class="badge ${isAutoReplyPaused ? "badge-paused" : "badge-online"}">
              ${isAutoReplyPaused ? "⏸️ AUTO-REPLY PAUSED" : "🟢 ONLINE & ACTIVE"}
            </div>
            <div class="badge ${isGroupsEnabled ? "badge-online" : "badge-disabled"}">
              ${isGroupsEnabled ? "👥 GROUPS: ON" : "👥 GROUPS: OFF"}
            </div>
          </div>
          <h1>WhatsApp AI Agent</h1>
          <p>${isAutoReplyPaused ? "The agent is connected but <b>auto-replies are temporarily paused</b>." : "The agent is actively listening and replying to WhatsApp messages."}</p>
          
          <a href="/toggle-pause" class="btn ${isAutoReplyPaused ? "btn-resume" : "btn-pause"}">
            ${isAutoReplyPaused ? "▶️ Resume Auto-Reply" : "⏸️ Pause Auto-Reply"}
          </a>

          <a href="/toggle-groups" class="btn ${isGroupsEnabled ? "btn-group-off" : "btn-group"}">
            ${isGroupsEnabled ? "👥 Disable Group Replies" : "👥 Enable Group Replies"}
          </a>

          <a href="/reset-session" onclick="return confirm('Do you want to re-link WhatsApp? This will generate a new QR code.')" class="btn btn-reset">
            🔄 Re-link WhatsApp Session
          </a>

          <div class="info-box">
            <b>💡 WhatsApp Commands:</b><br/>
            • <code>!bot pause</code> / <code>!pause</code> - Pause auto-reply<br/>
            • <code>!bot resume</code> / <code>!resume</code> - Resume auto-reply<br/>
            • <code>!groups on</code> / <code>!groups off</code> - Toggle group replies<br/>
            • <code>!bot status</code> - Check bot status
          </div>
        </div>
      </body>
      </html>
    `);
  } else if (latestQRDataUrl) {
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Link WhatsApp AI Agent</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="refresh" content="20">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b141a; color: #e9edef; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
          .card { background: #111b21; padding: 2rem; border-radius: 16px; border: 1px solid #202c33; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 380px; width: 90%; }
          h1 { margin: 0 0 8px 0; font-size: 20px; }
          p { color: #8696a0; font-size: 13px; margin-bottom: 20px; line-height: 1.4; }
          .qr-box { background: white; padding: 12px; border-radius: 12px; display: inline-block; margin: 10px 0; }
          .qr-box img { display: block; width: 260px; height: 260px; }
          .steps { text-align: left; background: #182229; padding: 14px; border-radius: 8px; margin-top: 15px; font-size: 12px; color: #aebac1; }
          .steps ol { margin: 0; padding-left: 20px; }
          .steps li { margin-bottom: 6px; }
          .btn-reload { display: inline-block; margin-top: 12px; font-size: 12px; color: #53bdeb; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Scan to Link WhatsApp</h1>
          <p>Scan this QR code using WhatsApp on your phone.</p>
          <div class="qr-box">
            <img src="${latestQRDataUrl}" alt="WhatsApp QR Code" />
          </div>
          <div class="steps">
            <ol>
              <li>Open <b>WhatsApp</b> on your phone</li>
              <li>Tap <b>Settings > Linked Devices</b></li>
              <li>Tap <b>Link a Device</b> and point camera here</li>
            </ol>
          </div>
          <a href="/reset-session" class="btn-reload">🔄 Fresh QR Code</a>
        </div>
      </body>
      </html>
    `);
  } else {
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Generating QR Code...</title>
        <meta http-equiv="refresh" content="3">
        <style>
          body { font-family: sans-serif; background: #0b141a; color: #8696a0; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
        </style>
      </head>
      <body>
        <h2>Starting WhatsApp Session... Please refresh in a few seconds.</h2>
      </body>
      </html>
    `);
  }
});

server.listen(port, () => {
  console.log(`🌐 Web QR & Health Server listening on port ${port}`);
});

// Per-user short-term conversation memory
const conversationHistories = new Map();

// ----------------------------------------------------
// 5. Main WhatsApp Socket Connection
// ----------------------------------------------------
async function startWhatsAppAgent() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
  });
  activeSock = sock;

  sock.ev.on("creds.update", saveCreds);

  // Pairing code support if PAIRING_PHONE is provided in environment variables
  const pairingPhone = process.env.PAIRING_PHONE
    ? process.env.PAIRING_PHONE.replace(/[^0-9]/g, "")
    : null;
  if (pairingPhone && !sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(pairingPhone);
        console.log(`\n======================================================`);
        console.log(`🔑 YOUR WHATSAPP PAIRING CODE IS: ${code}`);
        console.log(
          `👉 Open WhatsApp > Linked Devices > Link with phone number instead`,
        );
        console.log(`======================================================\n`);
      } catch (err) {
        console.error("Error requesting pairing code:", err?.message || err);
      }
    }, 4000);
  }

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n======================================================");
      console.log("📱 SCAN THIS QR CODE IN WHATSAPP (Linked Devices)");
      console.log("======================================================\n");
      qrcodeTerminal.generate(qr, { small: true });

      try {
        latestQRDataUrl = await QRCode.toDataURL(qr, { margin: 2, scale: 8 });
        console.log(
          `🌐 [WEB QR PAGE]: Open http://localhost:${port} or your Railway URL to scan QR code!\n`,
        );
      } catch (e) {
        console.error("Error creating Web QR code image:", e);
      }
    }

    if (connection === "close") {
      isConnected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const isLoggedOut =
        statusCode === DisconnectReason.loggedOut || statusCode === 401;

      console.log(`⚠️ Connection closed (status: ${statusCode || "unknown"}).`);

      if (isLoggedOut) {
        console.log(
          "🔄 Session expired or unlinked (401). Auto-cleaning session folder and preparing new QR code...",
        );
        try {
          if (fs.existsSync(authDir)) {
            fs.rmSync(authDir, { recursive: true, force: true });
          }
        } catch (e) {
          console.error("Error cleaning auth directory:", e.message);
        }
        latestQRDataUrl = null;
        reconnectTimer = setTimeout(() => {
          startWhatsAppAgent();
        }, 2000);
      } else {
        console.log("🔄 Reconnecting automatically in 3 seconds...");
        reconnectTimer = setTimeout(() => {
          startWhatsAppAgent();
        }, 3000);
      }
    } else if (connection === "open") {
      isConnected = true;
      latestQRDataUrl = null;
      console.log(`\n✅ Advanced WhatsApp AI Agent is online & listening!\n`);
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    if (m.type !== "notify") return;

    for (const msg of m.messages) {
      if (!msg.message || msg.key.remoteJid === "status@broadcast") {
        continue;
      }

      const sender = msg.key.remoteJid;
      const isFromMe = Boolean(msg.key.fromMe);

      let incomingText =
        msg.message.conversation || msg.message.extendedTextMessage?.text || "";

      let lowerText = incomingText.trim().toLowerCase();

      // --------------------------------------------------
      // 1. Handle Admin / Self Commands (!bot pause, !groups on/off, etc.)
      // --------------------------------------------------
      if (
        lowerText === "!pause" ||
        lowerText === "!bot pause" ||
        lowerText === "/pause" ||
        lowerText === "!bot stop"
      ) {
        toggleAutoReply(true);
        await sock.sendMessage(
          sender,
          {
            text: "⏸️ *WhatsApp AI Auto-Reply is now PAUSED.*\n\nThe bot will not respond automatically until resumed. Send *!resume* or visit the web dashboard to resume.",
          },
          { quoted: msg },
        );
        continue;
      }

      if (
        lowerText === "!resume" ||
        lowerText === "!bot resume" ||
        lowerText === "/resume" ||
        lowerText === "!bot start"
      ) {
        toggleAutoReply(false);
        await sock.sendMessage(
          sender,
          {
            text: "🟢 *WhatsApp AI Auto-Reply is now ACTIVE & LISTENING.*\n\nThe bot will automatically assist with portfolio questions, resumes, and project inquiries.",
          },
          { quoted: msg },
        );
        continue;
      }

      if (
        lowerText === "!groups on" ||
        lowerText === "!bot groups on" ||
        lowerText === "!group on" ||
        lowerText === "!bot group on"
      ) {
        toggleGroups(true);
        await sock.sendMessage(
          sender,
          {
            text: "👥🟢 *Group Auto-Replies are now ENABLED.*\n\nThe bot will respond in groups when mentioned, replied to, or invoked with prefixes (`!bot`, `!ai`, `/ask`, `!resume`).",
          },
          { quoted: msg },
        );
        continue;
      }

      if (
        lowerText === "!groups off" ||
        lowerText === "!bot groups off" ||
        lowerText === "!group off" ||
        lowerText === "!bot group off"
      ) {
        toggleGroups(false);
        await sock.sendMessage(
          sender,
          {
            text: "👥❌ *Group Auto-Replies are now DISABLED.*\n\nThe bot will ignore all group messages until re-enabled. Direct messages (DMs) remain active.",
          },
          { quoted: msg },
        );
        continue;
      }

      if (lowerText === "!bot status" || lowerText === "!status") {
        await sock.sendMessage(
          sender,
          {
            text: `🤖 *WhatsApp AI Agent Status*\n\n• Connection: *Online 🟢*\n• Auto-Reply: *${
              isAutoReplyPaused ? "⏸️ PAUSED" : "🟢 ACTIVE"
            }*\n• Group Replies: *${
              isGroupsEnabled ? "🟢 ENABLED" : "⏸️ DISABLED"
            }*\n• AI Engine: *${providerName}*`,
          },
          { quoted: msg },
        );
        continue;
      }

      // Ignore other messages sent by yourself
      if (isFromMe) {
        continue;
      }

      const isGroup = sender.endsWith("@g.us");
      const participant = isGroup ? msg.key.participant || sender : sender;
      const historyKey = isGroup ? `${sender}_${participant}` : sender;

      if (isGroup) {
        // If group replies are toggled off, ignore completely
        if (!isGroupsEnabled) {
          continue;
        }

        const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
        const mentionedJid = contextInfo?.mentionedJid || [];
        const botJid = sock.user?.id?.split(":")[0] + "@s.whatsapp.net";
        const botPhone = botJid.split("@")[0];

        // 1. Check if bot is @mentioned
        const isBotMentioned =
          mentionedJid.some((jid) => jid.split(":")[0] === botPhone) ||
          incomingText.includes(`@${botPhone}`);

        // 2. Check if user is replying / quoting a message from the bot
        const quotedParticipant = contextInfo?.participant?.split(":")[0];
        const isQuotingBot = quotedParticipant === botPhone;

        // 3. Check for command prefixes (!bot, !ai, /ask, !menu, !resume, etc.)
        const hasPrefix =
          lowerText.startsWith("!bot") ||
          lowerText.startsWith("!ai") ||
          lowerText.startsWith("/ask") ||
          lowerText.startsWith("!ask") ||
          lowerText.startsWith("!") ||
          lowerText.startsWith("/");

        // Only reply if one of the 3 conditions is met
        if (!isBotMentioned && !isQuotingBot && !hasPrefix) {
          continue;
        }

        // Clean mentions and prefixes from incomingText so the AI receives a clean question
        incomingText = incomingText
          .replace(new RegExp(`@${botPhone}`, "g"), "")
          .replace(/@\d+/g, "")
          .replace(/^!(bot|ai|ask)\s*/i, "")
          .replace(/^\/ask\s*/i, "")
          .trim();

        lowerText = incomingText.toLowerCase();
        console.log(
          `📢 [Group Trigger] from ${msg.pushName || participant} in ${sender}: "${incomingText}"`,
        );
      }

      // If auto-reply is paused, skip automatic responses
      if (isAutoReplyPaused) {
        console.log(
          `⏸️ [Bot Paused] Skipped auto-reply to ${sender}: "${incomingText || "Media message"}"`,
        );
        continue;
      }

      // --------------------------------------------------
      // A. Handle Incoming Voice Messages / Audio Notes
      // --------------------------------------------------
      if (msg.message.audioMessage) {
        console.log(`🎙️ [Audio Message received from: ${sender}]`);

        if (!groqWhisperClient) {
          await sock.sendMessage(
            sender,
            {
              text: "🎙️ Voice note received! To enable audio transcription, please add `GROQ_API_KEY` to your environment.",
              mentions: isGroup ? [participant] : [],
            },
            { quoted: msg },
          );
          continue;
        }

        try {
          await sock.sendPresenceUpdate("composing", sender);

          const audioBuffer = await downloadMediaMessage(
            msg,
            "buffer",
            {},
            { logger: pino({ level: "silent" }) },
          );

          const audioFile = await toFile(audioBuffer, "voice_note.ogg", {
            type: "audio/ogg",
          });
          const transcription =
            await groqWhisperClient.audio.transcriptions.create({
              file: audioFile,
              model: "whisper-large-v3-turbo",
              language: "en",
            });

          incomingText = transcription.text || "";
          lowerText = incomingText.toLowerCase();
          console.log(`📝 [Transcribed Voice Note]: "${incomingText}"`);

          await sock.sendMessage(
            sender,
            {
              text: `🎙️ _Heard:_ "${incomingText}"`,
              mentions: isGroup ? [participant] : [],
            },
            { quoted: msg },
          );
        } catch (audioErr) {
          console.error(
            "Error processing voice note:",
            audioErr?.message || audioErr,
          );
          await sock.sendMessage(
            sender,
            {
              text: "⚠️ Couldn't process the audio note. Please try sending a text message.",
              mentions: isGroup ? [participant] : [],
            },
            { quoted: msg },
          );
          continue;
        }
      }

      if (!incomingText.trim()) continue;

      console.log(`📩 [From: ${sender}]: ${incomingText}`);

      // --------------------------------------------------
      // B. Handle Quick Commands (!menu, !resume, !skills, etc.)
      // --------------------------------------------------
      if (lowerText === "!clear") {
        conversationHistories.delete(historyKey);
        await sock.sendMessage(
          sender,
          {
            text: "🧹 Conversation history cleared!",
            mentions: isGroup ? [participant] : [],
          },
          { quoted: msg },
        );
        continue;
      }

      if (lowerText === "!resume" || lowerText === "!cv" || lowerText === "2") {
        await sendResumeDocument(sock, sender, msg);
        continue;
      }

      const quickResponse = handleQuickCommand(incomingText, sock, sender, msg);
      if (quickResponse) {
        await sock.sendMessage(
          sender,
          {
            text: quickResponse,
            mentions: isGroup ? [participant] : [],
          },
          { quoted: msg },
        );
        console.log(`⚡ [Quick Command Replied to ${sender}]`);
        continue;
      }

      // --------------------------------------------------
      // C. Handle Resume Intent via Natural Language
      // --------------------------------------------------
      if (isResumeRequest(incomingText)) {
        await sendResumeDocument(sock, sender, msg);
      }

      // --------------------------------------------------
      // D. AI LLM Response Generation
      // --------------------------------------------------
      try {
        if (!aiClient) {
          await sock.sendMessage(
            sender,
            {
              text: "⚠️ AI Agent is offline or API keys are missing in .env.",
              mentions: isGroup ? [participant] : [],
            },
            { quoted: msg },
          );
          continue;
        }

        let history = conversationHistories.get(historyKey) || [];
        history.push({ role: "user", content: incomingText });
        if (history.length > 6) {
          history = history.slice(-6);
        }

        await sock.sendPresenceUpdate("composing", sender);

        let completion;
        let lastError = null;

        for (const candidate of candidateModels) {
          try {
            completion = await aiClient.chat.completions.create({
              model: candidate,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...history,
              ],
              max_tokens: 600,
              temperature: 0.7,
            });
            if (completion?.choices?.[0]?.message?.content) {
              selectedModel = candidate;
              break;
            }
          } catch (modelErr) {
            lastError = modelErr;
          }
        }

        let rawReply = completion?.choices?.[0]?.message?.content;
        if (!rawReply && lastError) {
          console.error("Model API Error:", lastError?.message || lastError);
          rawReply =
            "I am having trouble answering right now. Please try again in a moment.";
        }

        const formattedReply = formatForWhatsApp(rawReply);

        history.push({ role: "assistant", content: formattedReply });
        conversationHistories.set(historyKey, history);

        await sock.sendMessage(
          sender,
          {
            text: formattedReply,
            mentions: isGroup ? [participant] : [],
          },
          { quoted: msg },
        );
        console.log(`🤖 [AI Replied]:\n${formattedReply}\n`);
      } catch (error) {
        console.error("Error in agent loop:", error?.message || error);
      }
    }
  });
}

startWhatsAppAgent();
