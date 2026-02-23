<script setup lang="ts">
import { useUIStore } from "@/stores/ui";
import ToastContainer from "@/components/ui/ToastContainer.vue";

const ui = useUIStore();
</script>

<template>
  <div class="min-h-screen bg-surface-900 text-white font-sans">
    <!-- Page loading indicator -->
    <div
      v-if="ui.pageLoading"
      class="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 animate-pulse"
    />

    <RouterView v-slot="{ Component, route }">
      <Transition
        :name="route.meta.requiresAuth ? 'fade' : 'slide'"
        mode="out-in"
        appear
      >
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>

    <!-- Global toast notifications -->
    <ToastContainer />
  </div>
</template>

<style>
/* Fade transition (dashboard pages) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition (public pages) */
.slide-enter-active {
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-leave-active {
  transition: all 0.25s cubic-bezier(0.55, 0, 1, 0.45);
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
