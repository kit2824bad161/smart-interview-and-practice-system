# SmartInterview — AI Hiring Assessment & Practice System

A comprehensive full-stack platform providing a locked 4-round AI hiring assessment system alongside dedicated practice modules for Aptitude, Technical MCQs, DSA Problem Solving, and Spoken Communication.

---

## Key Features

### 1. Locked 4-Round AI Hiring Assessment
- **Round 1 — Quantitative & Logical Aptitude**: Timed adaptive aptitude evaluation with automatic scoring and analysis.
- **Round 2 — Technical MCQs**: Core Computer Science concepts (OOP, DBMS, OS, Computer Networks, DSA).
- **Round 3 — DSA Problem Solving**: Coding challenges evaluated against test cases via an isolated sandbox execution engine (Judge0).
- **Round 4 — AI One-on-One Interview**: Voice-enabled conversational AI technical interview with real-time speech-to-text and AI evaluation.

### 2. Practice Center (Deliberate Practice)
- **Aptitude Practice**: Filter by category, topic, and difficulty with instant step-by-step explanations.
- **Technical Practice**: Domain-specific quizzes with instant feedback.
- **Problem Solving (DSA)**: 200+ curated LeetCode-style algorithmic challenges across 18 DSA topics with multi-language code editor (Java, Python, C++).
- **Spoken Communication & Timed Speech Challenges**: AI-powered speech clarity, fluency, vocabulary, and relevance assessment.

---

## Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Axios, Lucide React, Monaco-style coding interface.
- **Backend**: Node.js, Express, MongoDB with Mongoose, JWT Authentication, Multer.
- **AI & Speech**: Groq API / OpenAI SDK layer (LLM question generation & answer scoring), Whisper speech transcription.
- **Code Execution**: Isolated Judge0 CE sandbox via secure HTTPS API.
- **Deployment**: Vercel (Frontend SPA) + Render (Backend Web Service) + MongoDB Atlas (Database).

---

## Project Structure

```text
├── frontend/             # React + Vite frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth & state contexts
│   │   ├── pages/        # Application views & assessment pages
│   │   └── services/     # API client (Axios)
│   ├── vercel.json       # SPA route rewrite configuration
│   └── package.json
│
├── backend/              # Node.js + Express backend API
│   ├── config/           # Database and OAuth configurations
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express REST API endpoints
│   ├── services/         # AI (Groq/OpenAI) and Code Execution (Judge0)
│   └── server.js         # Entrypoint binding to 0.0.0.0:PORT
│
└── .gitignore            # Git exclusion rules for secrets and builds
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local community edition or Atlas URI)
- Groq / OpenAI API key

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure MONGO_URI, JWT_SECRET, and GROQ_API_KEY / OPENAI_API_KEY in .env
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api in .env
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## Deployment Guide

### Backend (Render)
1. Create a new **Web Service** connected to this repository.
2. Set **Root Directory** to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `PORT`: `5000` (or leave default, Render sets `PORT` automatically)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `<Your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `<Strong 64-char random string>`
   - `CLIENT_URL`: `https://<your-vercel-app>.vercel.app`
   - `FRONTEND_URL`: `https://<your-vercel-app>.vercel.app`
   - `OPENAI_API_KEY`: `<Your Groq or OpenAI API key>`
   - `JUDGE0_URL`: `https://ce.judge0.com`

### Frontend (Vercel)
1. Import this repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Configure Environment Variable:
   - `VITE_API_URL`: `https://<your-render-service>.onrender.com/api`

---

## License
MIT
