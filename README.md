# 💖 Forge AI — The Joyful Pop AI Website Builder

Forge AI is a premium, full-stack website builder that transforms natural language directives into gorgeous, production-ready websites in seconds. Sporting a fresh, premium **"Joyful Pop"** design language, the platform features soft glassmorphism, playful typography, vibrant magenta `#E040A0` energy accents, and smooth GSAP-powered motion transitions.

---

## ✨ Features & Capabilities

*   **Prompt-to-Website:** Generate complex, responsive layouts (HTML + Tailwind CSS) using the powerful `Qwen2.5-Coder-32B` model.
*   **Aesthetic & Motion:** Fluid page transitions (fade + slide-up) powered by GSAP, smooth inertia scrolling, and playful, tactile micro-animations.
*   **Dynamic Cockpit Navigation:**
    *   **Models Page:** Detailed view of active engines (`Qwen-2.5-Coder-32B` & `7B`), infrastructure pipelines, and performance metrics.
    *   **Workflows Page:** Step-by-step pipeline visualizer (Prompt → Generative Synthesizer → Live Preview → Morphdom Refinement).
    *   **Deployments Gallery:** Gallery of all live-published projects with status badges, instant version rollbacks, and preview cards.
    *   **Monitoring Center:** Real-time infrastructure status, live node checks, and API latency meters.
*   **Version Control:** Automatically track design history and restore previous design versions with one click.
*   **Credit/Token Engine:** A visible, live-updating credits dashboard in the navigation bar with automated refunds on execution failures.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4 + HSL Custom Tokens
- **Animations:** GSAP (GreenSock Animation Platform) + Custom CSS Micro-interactions
- **Icons:** Lucide React

### Backend
- **Server:** Node.js + Express
- **Database:** PostgreSQL (Neon Serverless) + Prisma ORM
- **AI Engine:** Hugging Face Inference API (Qwen-2.5-Coder family)
- **Authentication:** Better-Auth (with custom social and credential adapter)
- **Payments:** Stripe API integration for Credit Packages

---

## 📦 Setup & Installation

### Prerequisites
- Node.js (v20+)
- Neon Database Account (PostgreSQL)
- Hugging Face API Key
- Stripe Account

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AagoshRajSri/Forge-AI.git
   cd Forge-AI
   ```

2. **Install Dependencies**
   ```bash
   # Install root and workspace/client/server dependencies
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. **Configure Environment**
   Copy `.env.example` to `.env` in both `client/` and `server/` directories and fill in your keys.

4. **Initialize Database**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

5. **Start Dev Servers**
   ```bash
   # In root directory
   npm run dev
   ```
   Or run individually:
   - Server: `cd server && npm run dev`
   - Client: `cd client && npm run dev`

---

## 🧠 Architecture Highlights
*   **Dual-Model Routing:** Intelligently splits weight between 32B models for initial structural composition and 7B models for swift refinements.
*   **Non-Destructive UI Morphing:** Uses structural `morphdom` updates in the rendering frame to apply code revisions smoothly without reload flickers.
*   **Edge-Resilient DB Connection:** Leverages Neon's serverless driver to prevent socket timeouts under heavy serverless execution environments.

---

## 📜 License
MIT License · Built by **Aagosh Raj Srivastava** (2026)
