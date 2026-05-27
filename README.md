# shrirangmahajan.in

My personal portfolio. Live at **[shrirangmahajan.in](https://www.shrirangmahajan.in/)**.

It's a React + Vite SPA that runs in two modes from the same codebase:

- **`/`** — modern editorial-paper design (Instrument Serif + Manrope, cream paper + burnt sienna). The default for everyone.
- **`/jupyter`** — the original Jupyter-Notebook-styled site, preserved as a second mode. Toggle from the nav.

A few things that aren't typical for a portfolio:

- **In-browser TinyGPT demo** at `/tinygpt` — a 95M-parameter LLM I trained from scratch on a single RTX 3070 Ti (OpenWebText, ~6.5B tokens) and instruction-tuned on Stanford Alpaca, converted to ONNX, running locally via `onnxruntime-web` (WebGPU primary, WASM fallback). No API call — the weights stream from HuggingFace on first click and stay in the browser cache.
- **Site assistant chatbot** (section 06 on `/`, plus an "Ask" button in the nav). Grounded in this site's content + connects to GitHub via tool calls. It can fetch repos, search across them, read READMEs, and redirect visitors to the right page when asked. Per-tab cooldown + SFW guardrails baked in.
- **Animated causal-attention matrix** in the hero — a 16×16 row-by-row decoding wave in pure CSS.
- **Static-HTML fallback** for crawlers — every route renders identical SPA shell at runtime, but `index.html` ships a `<noscript>` block with the full bio + Person/WebSite JSON-LD so non-JS crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) get real content.

## Tech

| Layer | What |
|---|---|
| Frontend | React 18, React Router 7, Vite 6 |
| Styling | CSS Modules. No CSS framework. |
| Fonts | Instrument Serif (self-hosted), Manrope, JetBrains Mono |
| Site assistant | Groq SDK (`openai/gpt-oss-20b`) with function calling |
| TinyGPT inference | `onnxruntime-web` + `js-tiktoken` (gpt2 BPE) |
| PWA | `vite-plugin-pwa` (Workbox, runtime cache for the ONNX file) |
| Forms | Formspree |
| Hosting | Vercel |

## Local setup

```sh
git clone https://github.com/NotShrirang/shrirangmahajan.in.git
cd shrirangmahajan.in
npm install
npm run dev
```

Then open `http://localhost:5173/`.

### Environment

Create a `.env.local` with:

```sh
# Groq API key — powers the site assistant chatbot
VITE_GROQ_API_KEY=gsk_...

# GitHub personal access token (read-only) — for the GraphQL queries
# on the Jupyter-mode home page (pinned repos, language analysis)
VITE_SOME_KEY=ghp_...

# Formspree form ID — for /contact
VITE_FORMSPREE=xxxxxxxx
```

All three are optional for local dev — the site degrades gracefully if any are missing (chatbot will error politely, GitHub widgets will be empty, contact form will fail silently).

## Project structure

```
src/
├── App.jsx                  # Top-level router with /jupyter + modern routes
├── api/
│   ├── fetchData.js         # GitHub GraphQL (Jupyter mode)
│   └── fetchModelInference.js  # Groq client + tool definitions
├── data/                    # Static content (projects, blogs, experiences, skills)
├── modern/                  # Modern editorial-paper site
│   ├── components/          # Nav, Footer, ChatPanel, LiveDemo, Layout
│   ├── lib/
│   │   └── tinygpt-inference.js   # Browser-side ONNX generation loop
│   ├── pages/               # Home, Projects, Writing, Post, Experience, Contact, TinyGPT
│   ├── styles/              # tokens, base, fonts
│   └── fonts/               # Self-hosted Instrument Serif
├── components/              # Legacy Jupyter chrome (TitleBar, MenuBar, ControlBar, …)
└── pages/                   # Legacy Jupyter pages (CellsPage, …)

public/
├── robots.txt              # Welcomes AI crawlers (GPTBot, ClaudeBot, etc.)
└── sitemap.xml             # All routes + blog slugs
```

## Build & deploy

```sh
npm run build      # production bundle in dist/
npm run preview    # serve dist/ locally
```

Deployed on Vercel with the SPA rewrite in `vercel.json`. Any static host works (Netlify, GitHub Pages, Cloudflare Pages).

## Contributing

Fork and PR. Or just steal the ideas — most of the interesting bits (TinyGPT ONNX export, the tool-calling chatbot, the wipe-reveal hero) are self-contained and easy to lift.

## License

The code in this repo is mine to share — feel free to use any of it as a starting point. The *content* (bio, blog posts, project descriptions, training data, model weights, etc.) is licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
