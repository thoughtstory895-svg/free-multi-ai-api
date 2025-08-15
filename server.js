import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { callHF, fallbackChat, fallbackSummary, pickRandom } from "./common.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const quotes = [
  "Believe you can and you're halfway there.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Your limitation—it’s only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones."
];

app.post("/api/chat", async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "Send JSON { message: string }" });
  const ai = await callHF(`You are a helpful assistant. Answer concisely.\nUser: ${message}\nAssistant:`);
  res.json({ reply: ai || fallbackChat(message) });
});

app.post("/api/summarize", async (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: "Send JSON { text: string }" });
  const ai = await callHF(`Summarize the following text in 2-3 sentences:\n\n${text}`);
  res.json({ summary: ai || fallbackSummary(text) });
});

app.post("/api/answer", async (req, res) => {
  const { context, question } = req.body || {};
  if (!context || !question) return res.status(400).json({ error: "Send JSON { context: string, question: string }" });
  const prompt = `Answer the question using ONLY the context. If you don't know, say you don't know.\n\nContext:\n${context}\n\nQuestion: ${question}\nAnswer:`;
  const ai = await callHF(prompt);
  res.json({ answer: ai || "Sorry, I can't find the answer in the provided context." });
});

app.get("/api/quote", (req, res) => {
  res.json({ quote: pickRandom(quotes) });
});

app.get("/", (req, res) => {
  res.type("html").send(`
    <h1>Free Multi AI API</h1>
    <p>Endpoints:</p>
    <ul>
      <li>POST /api/chat {"message":"Hello"}</li>
      <li>POST /api/summarize {"text":"Long text..."}</li>
      <li>POST /api/answer {"context":"...", "question":"?"}</li>
      <li>GET  /api/quote</li>
    </ul>
    <p>Optional: add <code>HF_API_KEY</code> in environment for smarter answers.</p>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Local server on http://localhost:" + PORT));
