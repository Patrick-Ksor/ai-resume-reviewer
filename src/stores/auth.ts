import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authService } from "@/services/authService";
import type {
  User,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

const STORAGE_KEY = "auth_tokens";

export const useAuthStore = defineStore("auth", () => {
  // ── State ─────────────────────────────────────────────────────────────
  const user = ref<User | null>(null);
  const tokens = ref<AuthTokens | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ── Getters ──────────────────────────────────────────────────────────
  const isAuthenticated = computed(
    () => !!tokens.value?.accessToken && !!user.value,
  );
  const fullName = computed(() => user.value?.name ?? "");
  const initials = computed(() => {
    if (!user.value?.name) return "?";
    return user.value.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  });

  // ── Helpers ───────────────────────────────────────────────────────────
  function persistTokens(t: AuthTokens) {
    tokens.value = t;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
  }

  function clearTokens() {
    tokens.value = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  function hydrateFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        tokens.value = JSON.parse(raw) as AuthTokens;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────
  async function login(payload: LoginPayload) {
    loading.value = true;
    error.value = null;
    try {
      const result = await authService.login(payload);
      user.value = result.user;
      persistTokens(result.tokens);
    } catch (e) {
      error.value = (e as { message: string }).message ?? "Login failed";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true;
    error.value = null;
    try {
      const result = await authService.register(payload);
      user.value = result.user;
      persistTokens(result.tokens);
    } catch (e) {
      error.value = (e as { message: string }).message ?? "Registration failed";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } catch {
      // ignore server errors on logout
    } finally {
      user.value = null;
      clearTokens();
    }
  }

  async function fetchMe() {
    if (!tokens.value) return;
    loading.value = true;
    try {
      user.value = await authService.getMe();
    } catch {
      clearTokens();
    } finally {
      loading.value = false;
    }
  }

  function setTokens(t: AuthTokens) {
    persistTokens(t);
  }

  // Hydrate on store init
  hydrateFromStorage();

  return {
    user,
    tokens,
    loading,
    error,
    isAuthenticated,
    fullName,
    initials,
    login,
    register,
    logout,
    fetchMe,
    setTokens,
    hydrateFromStorage,
  };
});
