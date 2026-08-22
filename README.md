# Dayflow

**Every workday, perfectly aligned.**

Dayflow is a Human Resource Management System (HRMS) that digitizes core HR operations — employee onboarding, attendance tracking, leave management, payroll visibility, and approval workflows — for small and mid-sized organizations.

Built for [Hackathon Name] 2026.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Demo Credentials](#demo-credentials)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Team](#team)
- [License](#license)

---

## Overview

Most small teams manage HR through a mix of spreadsheets, WhatsApp messages, and manual sign-off chains. Dayflow replaces that with a single system where employees can check in, apply for leave, and view their own records — while HR gets one dashboard to approve, track, and report on all of it.

The system supports two roles:

| Role | Capabilities |
|---|---|
| **Admin / HR Officer** | Manage employees, approve/reject attendance & leave, control payroll, view analytics |
| **Employee** | View profile, track attendance, apply for leave, view (read-only) salary |

---

## Features

- 🔐 **Secure authentication** — email + password sign-up/sign-in with role selection
- 🧑‍💼 **Employee profiles** — personal, job, and salary details; employees edit limited fields, admins edit all
- 🕒 **Attendance tracking** — daily/weekly views, check-in/check-out, status breakdown (present/absent/half-day/leave)
- 📅 **Leave management** — apply by type (paid/sick/unpaid) with date range and remarks; admin approval queue with comments
- 💰 **Payroll visibility** — read-only salary view for employees, full control for admins
- 📊 **Analytics dashboard** — attendance trends, leave distribution, headline HR metrics
- 🧾 **Salary slip export** — downloadable PDF per employee
- ⚡ **Real-time status updates** — leave/attendance changes reflect instantly without a page reload

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| State/Data | React Query |
| Backend | Node.js, Express |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT, bcrypt |
| Charts | Recharts |
| PDF Export | jsPDF |
| Deployment | Vercel (frontend), Railway (backend + DB) |

---

## Architecture

```
┌─────────────┐        REST API        ┌──────────────┐        ┌──────────────┐
│   React SPA  │ ─────────────────────▶ │   Express API │ ─────▶ │  PostgreSQL   │
│ (Vite + TS)  │ ◀───────────────────── │   (JWT auth)  │ ◀───── │  (Prisma ORM) │
└─────────────┘                        └──────────────┘        └──────────────┘
```

Wireframes and flow diagrams: [Excalidraw board](https://link.excalidraw.com/l/65VNwvy7c4X/58RLEJ4oOwh)

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14 (or use the provided Docker Compose setup)

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-org>/dayflow-hrms.git
cd dayflow-hrms

# Install dependencies (frontend + backend)
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations and seed demo data
npx prisma migrate dev
npx prisma db seed

# Start the app
npm run dev
```

The frontend runs at `http://localhost:5173`, the API at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the root based on `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dayflow"
JWT_SECRET="your-secret-key"
PORT=3000
```

---

## Project Structure

```
dayflow-hrms/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages (dashboard, attendance, leave, payroll)
│   │   ├── hooks/          # Custom React Query hooks
│   │   └── lib/            # API client, utilities
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth guards, error handling
│   │   └── prisma/         # Schema and migrations
├── docs/                   # Requirements doc, wireframes
└── README.md
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@dayflow.demo | Demo@1234 |
| Employee | employee@dayflow.demo | Demo@1234 |

> Seed data includes 10 employees with pre-populated attendance history and leave requests in various states for demo purposes.

---

## Roadmap

- [ ] Email verification and notification alerts
- [ ] Automated payroll calculation engine (tax, deductions)
- [ ] Mobile app (React Native)
- [ ] Shift scheduling and multi-location support
- [ ] Document management (contracts, ID uploads)

---

## License

This project was built for hackathon purposes and is available under the [MIT License](LICENSE).
