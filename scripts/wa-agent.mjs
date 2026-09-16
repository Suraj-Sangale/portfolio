import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  downloadMediaMessage,
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import OpenAI, { toFile } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import pino from 'pino';

// ----------------------------------------------------
// 1. Environment & AI Client Setup
// ----------------------------------------------------
dotenv.config();
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

const groqKey = process.env.GROQ_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

let aiClient;
let groqWhisperClient;
let selectedModel = 'openai/gpt-oss-120b';
let providerName = 'Unknown';
let candidateModels = [];

// Setup Groq Whisper client for free voice transcription if groqKey available
if (groqKey) {
  groqWhisperClient = new OpenAI({
    apiKey: groqKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });
}

if (groqKey) {
  // Groq Cloud (Free Tier)
  aiClient = new OpenAI({
    apiKey: groqKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  selectedModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
  candidateModels = [selectedModel, 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
  providerName = `Groq (${selectedModel}) [Free]`;
} else if (geminiKey) {
  // Google Gemini (Free Tier)
  aiClient = new OpenAI({
    apiKey: geminiKey,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  });
  selectedModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  candidateModels = [selectedModel, 'gemini-1.5-flash', 'gemini-2.0-flash'];
  providerName = 'Google Gemini [Free]';
} else if (openaiKey) {
  // OpenAI
  aiClient = new OpenAI({ apiKey: openaiKey });
  selectedModel = 'gpt-4o-mini';
  candidateModels = [selectedModel, 'gpt-3.5-turbo'];
  providerName = 'OpenAI';
}

console.log(`\n======================================================`);
console.log(`🤖 AI Engine: ${providerName}`);
console.log(`🎙️ Voice Transcription: ${groqWhisperClient ? 'Groq Whisper (Enabled)' : 'Disabled (Requires GROQ_API_KEY)'}`);
console.log(`======================================================\n`);

// ----------------------------------------------------
// 2. Load Portfolio Knowledge & Resume Location
// ----------------------------------------------------
let portfolioData = {};
try {
  const portfolioPath = path.join(process.cwd(), 'data', 'portfolio.json');
  if (fs.existsSync(portfolioPath)) {
    portfolioData = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));
  }
} catch (err) {
  console.warn('⚠️ Could not load data/portfolio.json:', err.message);
}

// Resume PDF path candidates
const RESUME_PATHS = [
  path.join(process.cwd(), 'public', 'Suraj_full_stack_developer.pdf'),
  path.join(process.cwd(), 'public', 'Suraj_full_stack_developer1.pdf'),
  path.join(process.cwd(), 'public', 'Suraj_full_stack_developer2.pdf'),
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
- Provide accurate information regarding Suraj's projects, tech stack, work experience, and background.
- Answer any general programming or tech questions politely and clearly.

Portfolio Knowledge Base:
${JSON.stringify(
  {
    personal: portfolioData.personal,
    experience: portfolioData.experience,
    projects: portfolioData.projects,
    skills: portfolioData.skills,
    contact: portfolioData.contact,
  },
  null,
  2
)}
`;

// ----------------------------------------------------
// 3. Formatting & Command Helpers
// ----------------------------------------------------
function formatForWhatsApp(text) {
  if (!text) return '';
  return text
    .replace(/^#{1,6}\s*(.+)$/gm, '*$1*')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1: $2')
    .replace(/\*\*([^*]+)\*\*/g, '*$1*')
    .replace(/__([^_]+)__/g, '*$1*')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Check if the user message indicates a request for Resume/CV
 */
function isResumeRequest(text) {
  const t = text.toLowerCase();
  return (
    t.includes('resume') ||
    t.includes('cv') ||
    t.includes('biodata') ||
    t.includes('curriculum vitae') ||
    t.includes('profile pdf')
  );
}

/**
 * Quick static command responses & Number Shortcuts (1, 2, 3, 4, 5)
 */
function handleQuickCommand(cmd, sock, sender, msg) {
  const normalized = cmd.trim().toLowerCase();

  switch (normalized) {
    case 'hi':
    case 'hello':
    case 'hey':
    case '!help':
    case '!menu':
    case 'menu':
      return `👋 *Hi! I am the AI Assistant for Suraj Sangale.*

How can I help you today? Reply with a *number* or *command*:

1️⃣ *!projects* (or reply *1*) - View featured projects
2️⃣ *!resume* (or reply *2*) - Download Resume PDF
3️⃣ *!experience* (or reply *3*) - Work history & experience
4️⃣ *!skills* (or reply *4*) - Technical skills & stack
5️⃣ *!contact* (or reply *5*) - Contact info & social links

💬 _Or ask any question naturally (e.g. "Tell me about his React experience") or send a voice note!_`;

    case '1':
    case '!projects':
    case 'projects': {
      const projects = portfolioData.projects || [];
      let projText = `*🚀 Featured Projects by Suraj Sangale*\n\n`;
      const list = Array.isArray(projects) ? projects.slice(0, 5) : [];
      if (list.length > 0) {
        list.forEach((p, idx) => {
          projText += `*${idx + 1}. ${p.title || p.name}*\n`;
          if (p.desc || p.description) projText += `📝 ${p.desc || p.description}\n`;
          if (p.link || p.github || p.liveLink) projText += `🔗 ${p.link || p.github || p.liveLink}\n`;
          projText += `\n`;
        });
      } else {
        projText += `• Portfolio Web Application (Next.js, Framer Motion, Supabase)\n• WhatsApp AI Agent CLI (Baileys, Groq, Whisper)\n`;
      }
      projText += `_Reply with *2* to get his Resume or *5* to Contact him!_`;
      return projText.trim();
    }

    case '3':
    case '!experience':
    case 'experience': {
      const exp = portfolioData.experience || [];
      let expText = `*💼 Work Experience*\n\n`;
      const list = Array.isArray(exp) ? exp : [];
      if (list.length > 0) {
        list.forEach((e) => {
          expText += `• *${e.title}* at *${e.company || e.desc || ''}*\n`;
          if (e.year || e.duration) expText += `  🗓️ ${e.year || e.duration}\n`;
          if (Array.isArray(e.skills)) expText += `  🛠️ Skills: ${e.skills.join(', ')}\n`;
          expText += `\n`;
        });
      } else {
        expText += `• Software Developer at Fortune4 Technologies (02/2024 - present)\n• Frontend Developer at Boppo Technologies\n`;
      }
      return expText.trim();
    }

    case '4':
    case '!skills':
    case 'skills': {
      const skills = portfolioData.skills || [];
      let skillsText = '*🛠️ Suraj Sangale - Technical Skills*\n\n';
      if (Array.isArray(skills)) {
        skills.forEach((cat) => {
          skillsText += `*${cat.title || cat.name || 'Skills'}:*\n`;
          if (Array.isArray(cat.items || cat.skills)) {
            const list = (cat.items || cat.skills).map((s) => (typeof s === 'string' ? s : s.name)).join(', ');
            skillsText += `👉 ${list}\n\n`;
          }
        });
      } else {
        skillsText += '• *Frontend:* React, Next.js, Redux, TailwindCSS\n• *Backend:* Node.js, Express, REST APIs\n• *Databases:* MySQL, Redis, Supabase\n';
      }
      return skillsText.trim();
    }

    case '5':
    case '!contact':
    case 'contact': {
      const personal = portfolioData.personal || {};
      const social = personal.socialLinks || [];
      let contactText = `*📬 Get in Touch with Suraj Sangale*\n\n`;
      contactText += `👤 *Name:* ${personal.name || 'Suraj Sangale'}\n`;
      contactText += `💼 *Role:* ${personal.title || 'Software Developer'}\n`;
      if (personal.email) contactText += `📧 *Email:* ${personal.email}\n`;

      contactText += `\n*🌐 Social & Profiles:*\n`;
      social
        .filter((s) => !s.disabled && s.href)
        .forEach((s) => {
          contactText += `• *${s.label}:* ${s.href}\n`;
        });
      return contactText.trim();
    }

    default:
      return null;
  }
}

/**
 * Send Resume PDF document directly to WhatsApp user
 */
async function sendResumeDocument(sock, sender, msg) {
  if (!resumePath) {
    await sock.sendMessage(
      sender,
      { text: "📄 Resume file is currently being updated. You can view Suraj's latest details via *!projects* or *!contact*." },
      { quoted: msg }
    );
    return;
  }

  const pdfBuffer = fs.readFileSync(resumePath);
  await sock.sendMessage(
    sender,
    {
      document: pdfBuffer,
      mimetype: 'application/pdf',
      fileName: 'Suraj_Sangale_FullStack_Developer_Resume.pdf',
      caption: `📄 *Suraj Sangale - Full Stack Developer Resume*\n\nHere is the latest CV document. Let me know if you have any questions or would like to schedule an interview!`,
    },
    { quoted: msg }
  );
  console.log(`📎 [Sent Resume PDF to ${sender}]`);
}

// Per-user short-term conversation memory
const conversationHistories = new Map();

// ----------------------------------------------------
// 4. Main WhatsApp Socket Connection
// ----------------------------------------------------
async function startWhatsAppAgent() {
  const authDir = path.join(process.cwd(), 'wa_auth_session');
  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n======================================================');
      console.log('📱 SCAN THIS QR CODE IN WHATSAPP (Linked Devices)');
      console.log('======================================================\n');
      qrcode.generate(qr, { small: true });
      console.log('\nWaiting for scan...');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`Connection closed (status: ${statusCode}). Reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) {
        startWhatsAppAgent();
      } else {
        console.log('Session logged out. Delete wa_auth_session folder and restart to re-scan.');
      }
    } else if (connection === 'open') {
      console.log(`\n✅ Advanced WhatsApp AI Agent is online & listening!\n`);
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    if (m.type !== 'notify') return;

    for (const msg of m.messages) {
      // Ignore status broadcasts or bot's own messages
      if (!msg.message || msg.key.fromMe || msg.key.remoteJid === 'status@broadcast') {
        continue;
      }

      const sender = msg.key.remoteJid;

      // Ignore group chats by default
      const isGroup = sender.endsWith('@g.us');
      if (isGroup && process.env.ALLOW_GROUPS !== 'true') {
        continue;
      }

      let incomingText =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        '';

      // --------------------------------------------------
      // A. Handle Incoming Voice Messages / Audio Notes
      // --------------------------------------------------
      if (msg.message.audioMessage) {
        console.log(`🎙️ [Audio Message received from: ${sender}]`);

        if (!groqWhisperClient) {
          await sock.sendMessage(
            sender,
            { text: '🎙️ Voice note received! To enable audio transcription, please add `GROQ_API_KEY` to your environment.' },
            { quoted: msg }
          );
          continue;
        }

        try {
          await sock.sendPresenceUpdate('composing', sender);

          // Download audio media buffer from WhatsApp
          const audioBuffer = await downloadMediaMessage(
            msg,
            'buffer',
            {},
            { logger: pino({ level: 'silent' }) }
          );

          // Transcribe audio using Groq Whisper (Free & Fast)
          const audioFile = await toFile(audioBuffer, 'voice_note.ogg', { type: 'audio/ogg' });
          const transcription = await groqWhisperClient.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-large-v3-turbo',
            language: 'en',
          });

          incomingText = transcription.text || '';
          console.log(`📝 [Transcribed Voice Note]: "${incomingText}"`);

          // Notify user what was heard
          await sock.sendMessage(
            sender,
            { text: `🎙️ _Heard:_ "${incomingText}"` },
            { quoted: msg }
          );
        } catch (audioErr) {
          console.error('Error processing voice note:', audioErr?.message || audioErr);
          await sock.sendMessage(
            sender,
            { text: "⚠️ Couldn't process the audio note. Please try sending a text message." },
            { quoted: msg }
          );
          continue;
        }
      }

      if (!incomingText.trim()) continue;

      console.log(`📩 [From: ${sender}]: ${incomingText}`);

      // --------------------------------------------------
      // B. Handle Quick Commands (!menu, !resume, !skills, etc.)
      // --------------------------------------------------
      const lowerText = incomingText.trim().toLowerCase();

      if (lowerText === '!clear') {
        conversationHistories.delete(sender);
        await sock.sendMessage(sender, { text: '🧹 Conversation history cleared!' }, { quoted: msg });
        continue;
      }

      if (lowerText === '!resume' || lowerText === '!cv' || lowerText === '2') {
        await sendResumeDocument(sock, sender, msg);
        continue;
      }

      const quickResponse = handleQuickCommand(incomingText, sock, sender, msg);
      if (quickResponse) {
        await sock.sendMessage(sender, { text: quickResponse }, { quoted: msg });
        console.log(`⚡ [Quick Command Replied to ${sender}]`);
        continue;
      }

      // --------------------------------------------------
      // C. Handle Resume Intent via Natural Language
      // --------------------------------------------------
      if (isResumeRequest(incomingText)) {
        await sendResumeDocument(sock, sender, msg);
        // Continue to provide an AI reply alongside document if needed
      }

      // --------------------------------------------------
      // D. AI LLM Response Generation
      // --------------------------------------------------
      try {
        if (!aiClient) {
          await sock.sendMessage(
            sender,
            { text: '⚠️ AI Agent is offline or API keys are missing in .env.' },
            { quoted: msg }
          );
          continue;
        }

        let history = conversationHistories.get(sender) || [];
        history.push({ role: 'user', content: incomingText });
        if (history.length > 6) {
          history = history.slice(-6);
        }

        await sock.sendPresenceUpdate('composing', sender);

        let completion;
        let lastError = null;

        for (const candidate of candidateModels) {
          try {
            completion = await aiClient.chat.completions.create({
              model: candidate,
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
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
          console.error('Model API Error:', lastError?.message || lastError);
          rawReply = "I am having trouble answering right now. Please try again in a moment.";
        }

        // Format beautifully for WhatsApp
        const formattedReply = formatForWhatsApp(rawReply);

        history.push({ role: 'assistant', content: formattedReply });
        conversationHistories.set(sender, history);

        await sock.sendMessage(sender, { text: formattedReply }, { quoted: msg });
        console.log(`🤖 [AI Replied]:\n${formattedReply}\n`);
      } catch (error) {
        console.error('Error in agent loop:', error?.message || error);
      }
    }
  });
}

startWhatsAppAgent();
