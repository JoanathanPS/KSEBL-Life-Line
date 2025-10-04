# KSEBL-Life-Line
Kerala LT Line Break Detection System — AI-powered platform for monitoring, detecting, and visualizing low-tension line break events across Kerala’s electrical grid. Built with FastAPI, React, Supabase, and real-time telemetry pipelines for a smarter, safer power network.

# ⚡ Kerala LT Line Break Detection System (MVP)

> Real-time LT line break detection and visualization system for Kerala’s power grid.  
> Built with **FastAPI + Supabase + React + TypeScript**, the platform enables **live monitoring, predictive alerts**, and **data-driven analytics** for substations and feeders.

---

## 🚀 Features

### 🧠 Core Functionality
- **AI-powered Detection:** Identifies low-tension line break events in real-time.
- **Supabase Realtime Integration:** Pushes alerts directly from IoT sensors or simulated event sources.
- **Interactive Dashboard:** View network health, live maps, and waveform visualizations.
- **Role-based Access:** Admin, Operator, and Field Crew dashboards.
- **Event Timeline:** Track detection → acknowledgment → resolution with timestamps.

### 📊 Visual Analytics
- Trends and metrics for events per substation.
- Recharts-based performance graphs.
- Live Leaflet map of affected feeders.
- Model accuracy and performance tracking.

---

## 🏗️ Architecture Overview

```text
📦 Kerala_LT_Break_Detection/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/v1/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   └── requirements.txt
├── frontend/              # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── main.tsx
│   └── vite.config.ts
├── .cursorrules           # Cursor AI coding standards
├── README.md
└── .env.example
