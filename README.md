# AI Resume & Portfolio Analyzer

A production-ready SaaS frontend built with Vue 3 + TypeScript + Vite + TailwindCSS + GSAP.

## Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Framework  | Vue 3 (Composition API, `<script setup>`)       |
| Language   | TypeScript (strict mode)                        |
| Build tool | Vite 6                                          |
| Styling    | TailwindCSS 3 (dark mode, custom design tokens) |
| Animations | GSAP 3 (ScrollTrigger, counters, score ring)    |
| Routing    | Vue Router 4 (lazy routes, nav guards)          |
| State      | Pinia (auth, analysis, UI stores)               |
| HTTP       | Axios (interceptors, token refresh, progress)   |
| Utilities  | @vueuse/core (clipboard, debounce)              |

## Getting Started

```bash
# 1. Clone and enter directory
cd ai-resume-reviewer

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env → set VITE_API_URL to your backend URL

# 4. Start dev server (http://localhost:5173)
npm run dev

# 5. Production build
npm run build

# 6. TypeScript strict check
npm run type-check
```

## Folder Structure

```
src/
├── assets/           # main.css (Tailwind base + component layer)
├── components/
│   ├── analysis/     # AtsScoreRing, SuggestionCard, BulletUpgrade,
│   │                 # ProjectCard, PortfolioCritique, InterviewAccordion
│   ├── layout/       # AppNavbar, AppSidebar, DashboardShell
│   └── ui/           # BaseButton, BaseInput, BaseModal, BaseSkeleton,
│                     # FileDropzone, ProgressBar, StatCard, FilterPill,
│                     # RatingBar, AnimatedCounter, ToastContainer
├── composables/      # useGsap, useFileUpload, useToast, useAuth
├── router/           # index.ts — routes + navigation guards
├── services/         # api.ts (Axios instance), authService, analysisService
├── stores/           # auth.ts, analysis.ts, ui.ts (Pinia)
├── types/            # auth.ts, analysis.ts, api.ts
├── views/
│   ├── private/      # DashboardView, NewAnalysisView, ResultsView,
│   │                 # HistoryView, SettingsView
│   └── public/       # LandingView, LoginView, RegisterView
├── App.vue
└── main.ts
```

## Key Design Decisions

- **Dark mode default** — `class="dark"` on `<html>`, full dark palette via Tailwind config
- **Glassmorphism** — `.glass-card` / `.glass-card-hover` utility classes
- **GSAP animations** — score ring (`stroke-dashoffset`), animated counters, staggered reveals, scroll triggers, hover lifts
- **Token refresh** — Axios response interceptor transparently retries after 401 with a fresh access token
- **Code splitting** — All views are lazy-loaded via dynamic imports; layout shell is eagerly loaded
- **Strict TypeScript** — `noUnusedLocals`, `noUnusedParameters`, `strict: true` — zero type errors
