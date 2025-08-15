# Free Multi AI API (Chat + Summarize + Q&A + Quotes)

100% free starter API. Works without any paid keys (graceful fallback). Add a free Hugging Face key for smarter AI answers.

## Endpoints
- `POST /api/chat`       → `{ "message": "Hello" }` → `{ "reply": "..." }`
- `POST /api/summarize`  → `{ "text": "long text..." }` → `{ "summary": "..." }`
- `POST /api/answer`     → `{ "context": "...", "question": "?" }` → `{ "answer": "..." }`
- `GET  /api/quote`      → `{ "quote": "..." }`

## Local Dev
```bash
npm install
node server.js
# open http://localhost:3000
```

## Deploy to Vercel (Free)
1) Push to a new GitHub repo.
2) Go to https://vercel.com → New Project → Import the repo → Deploy.
3) Optional: add free Hugging Face env vars in Project Settings → Environment Variables:
   - HF_API_KEY=your_free_key
   - HF_API_URL=https://api-inference.huggingface.co/models/google/gemma-2-2b-it

## Publish on RapidAPI
- Add API → Base URL = your Vercel URL
- Endpoints to document:
  - POST /api/chat (body: { "message": "Hello" })
  - POST /api/summarize (body: { "text": "..." })
  - POST /api/answer (body: { "context": "...", "question": "..." })
  - GET  /api/quote
- Start with Free plan; add paid tiers later.
