import fetch from "node-fetch";

export const HF_API_URL_DEFAULT = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it";

export function fallbackChat(message) {
  const text = (message || "").trim();
  if (!text) return "Hi! I'm your free AI assistant. Ask me anything 😊";
  const lc = text.toLowerCase();
  if (/(^|\b)(hi|hello|salam|assalam|hey)(\b|!|\.)/.test(lc)) return "Hello! How can I help you today?";
  if (text.endsWith("?")) return "Good question! It depends on context. Share a bit more so I can be specific.";
  if (text.split(" ").length < 4) return "Got it. Give me a little more detail and I’ll try my best.";
  return "Here's a quick friendly take: " + text.slice(0,120) + (text.length > 120 ? "..." : "");
}

export function fallbackSummary(text) {
  const t = (text || "").trim();
  if (!t) return "No text provided.";
  return t.length > 200 ? (t.slice(0,197) + "...") : t;
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function callHF(prompt, opts = {}) {
  const HF_API_KEY = process.env.HF_API_KEY;
  const HF_API_URL = process.env.HF_API_URL || HF_API_URL_DEFAULT;
  if (!HF_API_KEY) return null;
  const body = opts.body || {
    inputs: prompt,
    parameters: { max_new_tokens: 180, temperature: 0.7, top_p: 0.9, return_full_text: false }
  };
  try {
    const res = await fetch(HF_API_URL, {
      method: "POST",
      headers: { "Authorization": `Bearer ${HF_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length && data[0].generated_text) return data[0].generated_text.trim();
    if (typeof data.generated_text === "string") return data.generated_text.trim();
    return (typeof data === "string") ? data : JSON.stringify(data);
  } catch {
    return null;
  }
}
