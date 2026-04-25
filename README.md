# ⚒️ Forge AI — The Matrix-Themed AI Website Builder

Forge AI is a premium, full-stack platform that transforms your ideas into production-ready websites in seconds. Inspired by "The Matrix" aesthetics, it provides a high-tech "Cockpit" environment where you can generate, iterate, and deploy web projects using natural language.

## 🚀 Key Features

*   **Prompt-to-Website:** Generate complex, responsive layouts (HTML + Tailwind CSS) using the powerful `Qwen2.5-Coder-32B` model.
*   **Intelligent Iteration:** Refine your site in real-time. Revisions are routed to a high-speed `7B` model to ensure latency is kept under 60 seconds.
*   **Live Preview Cockpit:** Toggle between Desktop, Tablet, and Mobile viewports with a seamless, glassmorphic UI.
*   **Stabilized AI Pipeline:** Built-in code validation ensures the AI never returns broken or empty HTML.
*   **Version Control:** Automatically track design history and rollback to previous versions with a single click.
*   **Credit-Safe Engine:** Integrated credit system with automated refunds on generation failures.
*   **One-Click Deployment:** Publish your sites instantly to a public community gallery.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (Production-ready)
- **UI Architecture:** Custom "Void/Nebula" theme with CSS variables and dynamic starfields.
- **Icons:** Lucide React

### Backend
- **Server:** Node.js + Express
- **Database:** PostgreSQL (Neon DB) with Prisma ORM.
- **AI Engine:** Hugging Face Inference API (Qwen-2.5-Coder family).
- **Authentication:** Better-Auth (Social + Email support).
- **Payments:** Stripe API.

## 📦 Setup & Installation

### Prerequisites
- Node.js (v20+)
- Neon DB Account (PostgreSQL)
- Hugging Face API Key
- Stripe Account

### Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/AagoshRajSri/Forge-AI.git
   cd Forge-AI
   # Install both client and server
   cd client && npm install
   cd ../server && npm install
   ```

2. **Configure Environment**
   Copy `.env.example` to `.env` in both `client/` and `server/` folders and fill in your credentials.

3. **Initialize Database**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

4. **Launch the Forge**
   ```bash
   # Terminal 1 (Server)
   cd server && npm run dev
   
   # Terminal 2 (Client)
   cd client && npm run dev
   ```

## 🧠 Architecture Highlights
- **Performance Routing:** Automatically switches between 32B and 7B models based on task complexity to maximize quality while preventing API timeouts.
- **Resilient Prisma Adapter:** Uses `@neondatabase/serverless` to ensure database connectivity even behind restrictive network firewalls.
- **Non-Destructive UI Updates:** Uses `morphdom`-inspired logic in the preview window for smooth, flicker-free updates during the generation process.

## 📜 License
MIT License
