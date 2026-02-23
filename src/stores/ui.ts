import { defineStore } from "pinia";
import { ref } from "vue";
import type { Toast, ToastType } from "@/types/api";

let toastIdCounter = 0;

export const useUIStore = defineStore("ui", () => {
  // ── State ─────────────────────────────────────────────────────────────
  const toasts = ref<Toast[]>([]);
  const sidebarOpen = ref(true);
  const pageLoading = ref(false);

  // ── Toast actions ─────────────────────────────────────────────────────
  function pushToast(
    message: string,
    type: ToastType = "info",
    duration = 4000,
  ) {
    const id = String(++toastIdCounter);
    toasts.value.push({ id, message, type, duration });
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }

  function removeToast(id: string) {
    const idx = toasts.value.findIndex((t) => t.id === id);
    if (idx !== -1) toasts.value.splice(idx, 1);
  }

  // ── Sidebar ───────────────────────────────────────────────────────────
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function setSidebarOpen(val: boolean) {
    sidebarOpen.value = val;
  }

  // ── Page loading ──────────────────────────────────────────────────────
  function setPageLoading(val: boolean) {
    pageLoading.value = val;
  }

  return {
    toasts,
    sidebarOpen,
    pageLoading,
    pushToast,
    removeToast,
    toggleSidebar,
    setSidebarOpen,
    setPageLoading,
  };
});
