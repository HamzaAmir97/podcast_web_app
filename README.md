# Podcast Web App

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-18-20232a?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State%20Mgmt-000000)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-Server-000000?logo=express)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-4945FF)
![Helmet](https://img.shields.io/badge/Helmet-Security-444) ![CORS](https://img.shields.io/badge/CORS-Enabled-444) ![Morgan](https://img.shields.io/badge/Morgan-Logging-444)

---

## Overview

A production‑ready podcast web application composed of a **Next.js** frontend and an **Express** API backend. Users can browse episodes, play audio with a global player (seek/next/prev/repeat/shuffle), and load assets (covers, audio, JSON) via stable endpoints with HTTP Range support for efficient streaming.

### Key Features

* **Latest & All Episodes** views, with server‑safe sorting.
* **Global Audio Player** (Zustand) with play/pause/seek, next/prev, repeat & shuffle.
* **Streaming endpoint**: `/stream/:id` with HTTP Range (resumable, partial content).
* **Static assets** under `/static/*` (images, audio, JSON) served by the backend.
* **Production routing** with Next.js **rewrites** to avoid CORS.

---

## Tech Stack & Rationale

* **Next.js (App Router)** — modern React SSR/SSG, file‑system routing, and great DX.
* **React + TypeScript** — composable UI with static types for safer builds.
* **Tailwind CSS v4** — utility‑first styling; fast theming with `@theme inline`.
* **Zustand** — minimal, ergonomic global state (perfect for an audio player).
* **Express** — lightweight HTTP server powering `/episodes`, `/stream/:id`, and `/static/*`.
* **Helmet / CORS / Morgan / Rate Limit** — secure headers, cross‑origin control, logging, and abuse protection.
* **Vercel (Frontend) & Render (Backend)** — simple, reliable deployment workflow.

---

## Monorepo Structure

```
.
├─ backend/
│  ├─ src/
│  │  ├─ app.ts
│  │  ├─ server.ts
│  │  ├─ routes/
│  │  │  ├─ episodes.routes.ts
│  │  │  └─ stream.routes.ts
│  │  ├─ controllers/
│  │  │  ├─ episodes.controller.ts
│  │  │  └─ stream.controller.ts
│  │  └─ middlewares/
│  ├─ public/
│  │  ├─ data/podcasts.json
│  │  ├─ data/episodes/<id>.json (optional)
│  │  ├─ audio/<id>.mp3
│  │  └─ images/<id>.(jpg|png)
│  ├─ package.json / tsconfig.json
│  └─ dist/ (build output)
└─ frontend/
   ├─ app/(pages)/page.tsx / layout.tsx
   ├─ components/ …
   ├─ lib/apiPaths.ts
   ├─ stores/usePlayer.ts
   ├─ utils/media.ts
   ├─ public/
   ├─ next.config.js
   ├─ package.json
   └─ .env.local (local only)
```

---

## Quick Start (Local)

### Prerequisites

* **Node.js** 18+ (20+ recommended)
* **npm**

### 1) Install dependencies

```bash
# from repo root
cd backend && npm ci
cd ../frontend && npm ci
```

### 2) Backend — Environment & Run

Create `backend/.env`:

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

Build & start:

```bash
cd backend
npm run build
npm run start
# -> API at http://localhost:5000
```

> Ensure the server binds to `0.0.0.0` for container/cloud usage.

### 3) Frontend — Environment & Run

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_DATA_SOURCE=api
NEXT_PUBLIC_API_URL=http://localhost:5000
BACKEND_ORIGIN=http://localhost:5000
```

Run the dev server:

```bash
cd frontend
npm run dev
# -> Web at http://localhost:3000
```

#### Frontend Rewrites (already configured in `next.config.js`)

* `/stream/:id` → `${BACKEND_ORIGIN}/stream/:id`
* `/static/:path*` → `${BACKEND_ORIGIN}/static/:path*`

These keep audio/images/JSON **same‑origin** in the browser and avoid CORS.

---

## Backend API — Test Locally & on Render

**Backend base (Render):** `https://podcast-web-app.onrender.com`

> Replace with your own Render service URL if different.

### Health

* Local:
  `http://localhost:5000/health`
* Render:
  `https://podcast-web-app.onrender.com/health`

### Episodes

* All episodes:
  Local → `http://localhost:5000/episodes`
  Render → `https://podcast-web-app.onrender.com/episodes`
* Latest (limit=3):
  `https://podcast-web-app.onrender.com/episodes/latest?limit=3`
* By id:
  `https://podcast-web-app.onrender.com/episodes/como-programar-like-a-god`

### Streaming (HTTP Range)

* Stream by id:
  `https://podcast-web-app.onrender.com/stream/como-programar-like-a-god`
* Partial content (first 1KB):

```bash
curl -I -H "Range: bytes=0-1023" \
  https://podcast-web-app.onrender.com/stream/como-programar-like-a-god
```

### Static Assets

* Episodes list (JSON):
  `https://podcast-web-app.onrender.com/static/data/podcasts.json`
* Audio file:
  `https://podcast-web-app.onrender.com/static/audio/como-programar-like-a-god.mp3`
* Cover image:
  `https://podcast-web-app.onrender.com/static/images/a-vida-e-incrivel.jpg`

---

## Demo Links

* **Frontend (Vercel)**: [https://podcast-web-app-six.vercel.app](https://podcast-web-app-six.vercel.app)
* **Backend (Render)**: [https://podcast-web-app.onrender.com](https://podcast-web-app.onrender.com)

> If your project uses different domains, update the values here and in `.env(.local)`.

---

## Configuration Notes

### Frontend Environment

```env
# frontend/.env.local
NEXT_PUBLIC_DATA_SOURCE=api
NEXT_PUBLIC_API_URL=https://podcast-web-app.onrender.com
BACKEND_ORIGIN=https://podcast-web-app.onrender.com
```

These ensure data fetches hit the API and static/stream routes proxy through the frontend origin.

### Backend Environment

```env
# backend/.env
PORT=5000              # or respect platform PORT in production
CORS_ORIGIN=https://<your-frontend>.vercel.app
```

---

## Development Tips

* **Next/Image & static**: Prefer relative `src` like `/static/images/<id>.jpg` (rewritten to backend). If using absolute URLs, add the domain to `images.domains` or set `images.unoptimized=true`.
* **Dates**: Use a fixed timezone (`UTC`) during SSR to avoid hydration mismatches.
* **Player**: The `usePlayer` store wires a single `<audio>` element app‑wide and handles queue, progress, and controls.

---

## License

MIT
