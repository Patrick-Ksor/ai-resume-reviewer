<script setup lang="ts">
import { computed } from "vue";
import AppSidebar from "./AppSidebar.vue";
import { useUIStore } from "@/stores/ui";
import { useRoute } from "vue-router";

const ui = useUIStore();
const route = useRoute();

const marginLeft = computed(() =>
  ui.sidebarOpen ? "lg:ml-60" : "lg:ml-[70px]"
);
</script>

<template>
  <div class="min-h-screen flex bg-surface-900">
    <AppSidebar />

    <!-- Main content area -->
    <div
      :class="[
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        marginLeft,
      ]"
    >
      <!-- Top bar (mobile) -->
      <header
        class="lg:hidden h-14 flex items-center justify-between px-4 border-b border-white/[0.06] bg-surface-800 shrink-0"
      >
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:text-white"
          @click="ui.toggleSidebar"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span class="font-semibold text-white text-sm">{{
          route.meta.title
        }}</span>
        <div class="w-9" />
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in" appear>
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>
