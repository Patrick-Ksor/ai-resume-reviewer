<script setup lang="ts">
import { useRoute } from "vue-router";
import { useUIStore } from "@/stores/ui";
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const ui = useUIStore();
const { user, initials, logout } = useAuth();

interface NavItem {
  name: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "analysis-new",
    label: "New Analysis",
    icon: "M12 4v16m8-8H4",
  },
  {
    name: "history",
    label: "History",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    name: "settings",
    label: "Settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

const isActive = (name: string) => route.name === name;
</script>

<template>
  <!-- Desktop sidebar -->
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex flex-col bg-surface-800 border-r border-white/[0.06] transition-all duration-300',
      ui.sidebarOpen ? 'w-60' : 'w-[70px]',
      // on mobile, hidden unless explicitly opened
      'hidden lg:flex',
    ]"
  >
    <!-- Logo -->
    <div
      class="h-16 flex items-center px-5 border-b border-white/[0.06] shrink-0"
    >
      <RouterLink
        to="/dashboard"
        class="flex items-center gap-3 overflow-hidden"
      >
        <div
          class="h-8 w-8 shrink-0 rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand"
        >
          <svg
            class="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <Transition name="fade-text">
          <span
            v-if="ui.sidebarOpen"
            class="font-bold text-white text-sm tracking-tight whitespace-nowrap overflow-hidden"
          >
            ResumeAI
          </span>
        </Transition>
      </RouterLink>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
          isActive(item.name)
            ? 'bg-brand-500/15 text-brand-300'
            : 'text-white/50 hover:text-white hover:bg-white/[0.06]',
        ]"
      >
        <svg
          class="w-5 h-5 shrink-0"
          :class="
            isActive(item.name)
              ? 'text-brand-400'
              : 'text-white/40 group-hover:text-white/70'
          "
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            :d="item.icon"
          />
        </svg>
        <Transition name="fade-text">
          <span
            v-if="ui.sidebarOpen"
            class="whitespace-nowrap overflow-hidden"
            >{{ item.label }}</span
          >
        </Transition>
        <!-- Active indicator -->
        <div
          v-if="isActive(item.name)"
          class="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0"
        />
      </RouterLink>
    </nav>

    <!-- Collapse toggle -->
    <div class="px-3 pb-3 shrink-0">
      <button
        type="button"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200 text-sm"
        @click="ui.toggleSidebar"
      >
        <svg
          class="w-5 h-5 shrink-0 transition-transform duration-300"
          :class="ui.sidebarOpen ? '' : 'rotate-180'"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
        <Transition name="fade-text">
          <span v-if="ui.sidebarOpen" class="whitespace-nowrap overflow-hidden"
            >Collapse</span
          >
        </Transition>
      </button>
    </div>

    <!-- User footer -->
    <div class="px-3 pb-4 border-t border-white/[0.06] pt-4 shrink-0">
      <div class="flex items-center gap-3">
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-white text-xs font-bold"
        >
          {{ initials }}
        </div>
        <Transition name="fade-text">
          <div v-if="ui.sidebarOpen" class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">
              {{ user?.name }}
            </p>
            <p class="text-xs text-white/40 truncate">{{ user?.email }}</p>
          </div>
        </Transition>
        <Transition name="fade-text">
          <button
            v-if="ui.sidebarOpen"
            type="button"
            class="shrink-0 text-white/30 hover:text-red-400 transition-colors"
            title="Sign out"
            @click="logout"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </Transition>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.fade-text-enter-active,
.fade-text-leave-active {
  transition: opacity 0.15s ease;
}
.fade-text-enter-from,
.fade-text-leave-to {
  opacity: 0;
}
</style>
