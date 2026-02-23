import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "./useToast";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

export function useAuth() {
  const store = useAuthStore();
  const router = useRouter();
  const route = useRoute();
  const toast = useToast();

  const user = computed(() => store.user);
  const isAuthenticated = computed(() => store.isAuthenticated);
  const loading = computed(() => store.loading);
  const fullName = computed(() => store.fullName);
  const initials = computed(() => store.initials);

  async function login(payload: LoginPayload) {
    await store.login(payload);
    toast.success(`Welcome back, ${store.fullName}!`);
    const redirect = route.query.redirect as string | undefined;
    await router.push(redirect ?? { name: "dashboard" });
  }

  async function register(payload: RegisterPayload) {
    await store.register(payload);
    toast.success(`Account created! Welcome, ${store.fullName}!`);
    await router.push({ name: "dashboard" });
  }

  async function logout() {
    await store.logout();
    toast.info("You have been signed out.");
    await router.push({ name: "landing" });
  }

  return {
    user,
    isAuthenticated,
    loading,
    fullName,
    initials,
    login,
    register,
    logout,
  };
}
