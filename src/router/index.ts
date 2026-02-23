import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
    title?: string;
  }
}

const routes: RouteRecordRaw[] = [
  // ── Public ────────────────────────────────────────────────────────────
  {
    path: "/",
    name: "landing",
    component: () => import("@/views/public/LandingView.vue"),
    meta: { title: "AI Resume & Portfolio Analyzer" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/public/LoginView.vue"),
    meta: { guestOnly: true, title: "Sign In" },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/public/RegisterView.vue"),
    meta: { guestOnly: true, title: "Create Account" },
  },

  // ── Private (dashboard shell) ─────────────────────────────────────────
  {
    path: "/dashboard",
    component: () => import("@/components/layout/DashboardShell.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/private/DashboardView.vue"),
        meta: { requiresAuth: true, title: "Dashboard" },
      },
      {
        path: "/analysis/new",
        name: "analysis-new",
        component: () => import("@/views/private/NewAnalysisView.vue"),
        meta: { requiresAuth: true, title: "New Analysis" },
      },
      {
        path: "/analysis/:id",
        name: "analysis-results",
        component: () => import("@/views/private/ResultsView.vue"),
        meta: { requiresAuth: true, title: "Analysis Results" },
        props: true,
      },
      {
        path: "/history",
        name: "history",
        component: () => import("@/views/private/HistoryView.vue"),
        meta: { requiresAuth: true, title: "Analysis History" },
      },
      {
        path: "/settings",
        name: "settings",
        component: () => import("@/views/private/SettingsView.vue"),
        meta: { requiresAuth: true, title: "Account Settings" },
      },
    ],
  },

  // ── Fallback ──────────────────────────────────────────────────────────
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    redirect: { name: "landing" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: "smooth" };
  },
});

// ── Navigation guard ──────────────────────────────────────────────────────
let initialAuthChecked = false;

router.beforeEach(async (to, _from) => {
  const auth = useAuthStore();

  // One-time hydration: if tokens exist but user not loaded, fetch profile
  if (!initialAuthChecked) {
    initialAuthChecked = true;
    if (auth.tokens && !auth.user) {
      await auth.fetchMe();
    }
  }

  // Update page title
  if (to.meta.title) {
    document.title = `${to.meta.title} | AI Resume Analyzer`;
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: "dashboard" };
  }
});

export default router;
