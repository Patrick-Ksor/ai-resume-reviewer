<script setup lang="ts">
import { ref } from "vue";
import type { ProjectSuggestion } from "@/types/analysis";

defineProps<{ project: ProjectSuggestion }>();

const expanded = ref(false);

const difficultyConfig = {
  beginner: { cls: "bg-green-400/10 text-green-300", label: "Beginner" },
  intermediate: {
    cls: "bg-yellow-400/10 text-yellow-300",
    label: "Intermediate",
  },
  advanced: { cls: "bg-red-400/10 text-red-300", label: "Advanced" },
};
</script>

<template>
  <div class="glass-card-hover rounded-xl p-5 space-y-4 flex flex-col">
    <!-- Title + difficulty -->
    <div class="flex items-start justify-between gap-3">
      <h4 class="text-base font-semibold text-white leading-snug">
        {{ project.title }}
      </h4>
      <span
        :class="[
          'shrink-0 text-xs px-2.5 py-1 rounded-full font-medium',
          difficultyConfig[project.difficulty].cls,
        ]"
      >
        {{ difficultyConfig[project.difficulty].label }}
      </span>
    </div>

    <!-- Description preview -->
    <p class="text-sm text-white/60 leading-relaxed line-clamp-2">
      {{ project.description }}
    </p>

    <!-- Tech stack tags -->
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="tech in project.techStack"
        :key="tech"
        class="text-xs px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20"
      >
        {{ tech }}
      </span>
    </div>

    <!-- Footer: time + expand -->
    <div class="flex items-center justify-between pt-1">
      <span class="flex items-center gap-1.5 text-xs text-white/40">
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        ~{{ project.estimatedHours }}h
      </span>
      <button
        type="button"
        class="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors flex items-center gap-1"
        @click="expanded = !expanded"
      >
        {{ expanded ? "Less" : "Why this?" }}
        <svg
          class="w-3.5 h-3.5 transition-transform"
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
    </div>

    <!-- Expanded relevance -->
    <Transition name="expand">
      <div
        v-if="expanded"
        class="rounded-lg bg-surface-700/60 p-3 border border-white/[0.06]"
      >
        <p class="text-sm text-white/60 leading-relaxed">
          {{ project.relevanceReason }}
        </p>
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
  max-height: 200px;
}
</style>
