<script setup lang="ts">
import { useUIStore } from "@/stores/ui";
import type { Toast } from "@/types/api";

const ui = useUIStore();

const icons: Record<Toast["type"], string> = {
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const colors: Record<Toast["type"], string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
  warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  info: "border-brand-500/30 bg-brand-500/10 text-brand-300",
};

const iconColors: Record<Toast["type"], string> = {
  success: "text-green-400",
  error: "text-red-400",
  warning: "text-yellow-400",
  info: "text-brand-400",
};
</script>

<template>
  <Teleport to="#modals">
    <div
      aria-live="polite"
      class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
        <div
          v-for="toast in ui.toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-glass-md backdrop-blur-sm max-w-sm',
            colors[toast.type],
          ]"
        >
          <svg
            class="w-5 h-5 shrink-0 mt-0.5"
            :class="iconColors[toast.type]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="icons[toast.type]"
            />
          </svg>
          <p class="text-sm font-medium leading-5 flex-1">
            {{ toast.message }}
          </p>
          <button
            type="button"
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            @click="ui.removeToast(toast.id)"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(24px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px) scale(0.95);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
