<script setup lang="ts">
import { ref } from "vue";
import type { Suggestion } from "@/types/analysis";

defineProps<{ suggestion: Suggestion }>();

const expanded = ref(false);

const priorityConfig = {
  high: {
    cls: "bg-red-400/10 text-red-300 border-red-400/20",
    dot: "bg-red-400",
  },
  medium: {
    cls: "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
    dot: "bg-yellow-400",
  },
  low: {
    cls: "bg-green-400/10 text-green-300 border-green-400/20",
    dot: "bg-green-400",
  },
};

const categoryIcons: Record<string, string> = {
  formatting: "M4 6h16M4 10h16M4 14h10M4 18h6",
  keywords:
    "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  experience:
    "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  education:
    "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  skills:
    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  general: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};
</script>

<template>
  <div
    :class="[
      'glass-card-hover rounded-xl overflow-hidden transition-all duration-300',
      expanded ? 'border-brand-500/30 bg-brand-500/5' : '',
    ]"
  >
    <button
      type="button"
      class="w-full flex items-start gap-4 p-4 text-left"
      @click="expanded = !expanded"
    >
      <!-- Category icon -->
      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-600"
      >
        <svg
          class="w-4 h-4 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            :d="categoryIcons[suggestion.category] ?? categoryIcons.general"
          />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <p class="text-sm font-semibold text-white">{{ suggestion.title }}</p>
          <!-- Priority badge -->
          <span
            :class="[
              'text-xs px-2 py-0.5 rounded-full border font-medium capitalize',
              priorityConfig[suggestion.priority].cls,
            ]"
          >
            <span
              :class="[
                'inline-block h-1.5 w-1.5 rounded-full mr-1',
                priorityConfig[suggestion.priority].dot,
              ]"
            />
            {{ suggestion.priority }}
          </span>
        </div>
        <p class="text-xs text-white/40 mt-0.5 capitalize">
          {{ suggestion.category }}
        </p>
      </div>

      <!-- Chevron -->
      <svg
        class="w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 mt-0.5"
        :class="{ 'rotate-180': expanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Expanded content -->
    <Transition name="expand">
      <div v-if="expanded" class="px-4 pb-4 space-y-3">
        <div class="h-px bg-white/[0.06]" />
        <p class="text-sm text-white/70 leading-relaxed">
          {{ suggestion.description }}
        </p>
        <div
          v-if="suggestion.example"
          class="rounded-lg bg-surface-700 p-3 text-sm text-white/60 italic border-l-2 border-brand-500"
        >
          {{ suggestion.example }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>
