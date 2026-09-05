# StatLearn AI - MoSPI Competency & Workforce Intelligence Platform

StatLearn AI is an AI-powered competency management, diagnostic assessment, and workforce intelligence platform custom-designed for the **Ministry of Statistics and Programme Implementation (MoSPI)** and statistical cadre officers (Indian Statistical Service - ISS & Subordinate Statistical Service - SSS).

---

## 🚀 Quick Start Guide (Run on Your Laptop)

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (v20+ recommended). [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **pnpm** / **yarn**
- **Git**: [Download Git](https://git-scm.com/)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/) (free tier available)

---

### 2. Setup on Your Local Machine

1. **Extract or Clone the Project**
   If you downloaded the ZIP, extract it into a folder. Open your terminal (Command Prompt, PowerShell, or macOS/Linux Terminal) in that folder:
   ```bash
   cd statlearn-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3000
   ```
   *(Note: If you don't provide a Gemini key right away, the platform will still run with built-in intelligent fallback responses and simulation data).*

4. **Run in Development Mode**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to:
   👉 **http://localhost:3000**

---

### 3. Production Build & Local Test

To build the optimized production bundle and run the standalone server:
```bash
npm run build
npm start
```
The server will boot the bundled `dist/server.cjs` and serve static assets seamlessly on port 3000.

---

## 🐙 How to Push to GitHub

1. **Initialize Git (if not already initialized)**
   ```bash
   git init
   ```

2. **Stage and Commit All Files**
   ```bash
   git add .
   git commit -m "Initial commit: StatLearn AI MoSPI Competency Platform"
   ```

3. **Create a New Repository on GitHub**
   - Go to [GitHub](https://github.com/new).
   - Create a new repository (e.g., `statlearn-ai` or `mospi-statlearn`).
   - Do **not** initialize it with a README, `.gitignore`, or license (you already have them).

4. **Link and Push**
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

*(Alternatively, in Google AI Studio, click the **Settings / Export** menu in the top-right corner to directly export or push this applet to a GitHub repository).*

---

## 🌐 Deployment Options

Because StatLearn AI uses a unified Express + Vite architecture, it is ready to deploy on any Node-capable platform.

### Option A: Render (Recommended & Free/Easy)
1. Sign up at [Render.com](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = *your Gemini API key*
   - `NODE_ENV` = `production`
6. Click **Deploy Web Service**.

---

### Option B: Railway
1. Sign up at [Railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. In Settings / Variables, add:
   - `GEMINI_API_KEY` = *your Gemini API key*
5. Railway will automatically detect Node.js, run `npm run build`, and execute `npm start`.

---

### Option C: Google Cloud Run / Docker
You can create a simple `Dockerfile` in the root directory:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```
Deploy to Google Cloud Run:
```bash
gcloud run deploy statlearn-ai --source . --port 3000 --set-env-vars GEMINI_API_KEY=your_key
```

---

## 📂 Project Architecture

```
├── server.ts                  # Express server & Vite middleware entry
├── server/
│   ├── db.ts                  # Persistent in-memory data store (cadres, profiles, quizzes, enrollments)
│   ├── gemini.ts              # Google GenAI SDK integration & RAG engine
│   └── routes/
│       ├── ai.ts              # AI Copilot, gap analysis, and recommendations
│       ├── analytics.ts       # Ministry leadership analytics & project readiness
│       ├── assessment.ts      # Adaptive competency assessment engine
│       ├── auth.ts            # User profile switcher & cadre management
│       ├── competencies.ts    # MoSPI 4-pillar competency catalog
│       ├── courses.ts         # iGOT Karmayogi & NSSTA course catalog & enrollment
│       └── quiz.ts            # RAG-based multi-format quiz generator
├── src/
│   ├── components/            # Reusable UI modules (Navbar, Sidebar, CopilotDrawer)
│   ├── pages/                 # Full feature views:
│   │   ├── DashboardPage.tsx      # Officer overview & profile calibration
│   │   ├── SkillGapsPage.tsx      # Radar charts, benchmark comparisons & AI diagnostics
│   │   ├── LearningPathPage.tsx   # Personalized pathways & course catalog
│   │   ├── QuizGeneratorPage.tsx  # Document upload, RAG generator & test player
│   │   ├── AdminAnalyticsPage.tsx # Leadership analytics, department metrics & TNA reports
│   │   └── AssessmentPage.tsx     # Adaptive competency tests
│   ├── services/              # Client API client connecting to /api/* routes
│   └── types/                 # Shared TypeScript interfaces & cadre definitions
```

---

## 🛡️ License & Institutional Attribution
Designed for the **Ministry of Statistics and Programme Implementation (MoSPI)**, Government of India.
Developed with React 19, Vite, Express, Tailwind CSS v4, and Google Gemini.
