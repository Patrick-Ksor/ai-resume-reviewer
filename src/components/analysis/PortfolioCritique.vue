<script setup lang="ts">
import RatingBar from "@/components/ui/RatingBar.vue";
import type { PortfolioCritique } from "@/types/analysis";

defineProps<{ critique: PortfolioCritique }>();
</script>

<template>
  <div class="space-y-6">
    <!-- Overall score + summary -->
    <div class="glass-card rounded-2xl p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-white">
          Overall Portfolio Score
        </h3>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-white">{{
            critique.overallScore.toFixed(1)
          }}</span>
          <span class="text-white/40 text-sm">/10</span>
        </div>
      </div>
      <p class="text-sm text-white/60 leading-relaxed">
        {{ critique.summary }}
      </p>
    </div>

    <!-- Criteria breakdown -->
    <div class="glass-card rounded-2xl p-6 space-y-4">
      <h3 class="text-sm font-semibold text-white/80 uppercase tracking-wide">
        Breakdown
      </h3>
      <div class="space-y-4">
        <div v-for="c in critique.criteria" :key="c.name" class="space-y-1">
          <RatingBar :label="c.name" :score="c.score" />
          <p class="text-xs text-white/40 pl-1">{{ c.feedback }}</p>
        </div>
      </div>
    </div>

    <!-- Strengths & Weaknesses -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="glass-card rounded-2xl p-5 space-y-3">
        <h4
          class="flex items-center gap-2 text-sm font-semibold text-green-400"
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Strengths
        </h4>
        <ul class="space-y-2">
          <li
            v-for="s in critique.strengths"
            :key="s"
            class="flex items-start gap-2 text-sm text-white/70"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0 mt-2" />
            {{ s }}
          </li>
        </ul>
      </div>

      <div class="glass-card rounded-2xl p-5 space-y-3">
        <h4 class="flex items-center gap-2 text-sm font-semibold text-red-400">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Areas to Improve
        </h4>
        <ul class="space-y-2">
          <li
            v-for="w in critique.weaknesses"
            :key="w"
            class="flex items-start gap-2 text-sm text-white/70"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0 mt-2" />
            {{ w }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
