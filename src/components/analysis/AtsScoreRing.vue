<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useGsap } from "@/composables/useGsap";
import type { AtsScore } from "@/types/analysis";

interface Props {
  score: AtsScore;
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
});

const circleRef = ref<SVGCircleElement | null>(null);
const scoreEl = ref<HTMLElement | null>(null);
const { animateScoreRing, animateCounter } = useGsap();

const radius = computed(() => (props.size / 2) * 0.78);
const circumference = computed(() => 2 * Math.PI * radius.value);
const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);

const overall = computed(() => props.score.overall);

const ringColor = computed(() => {
  if (overall.value >= 80) return "#22c55e"; // green
  if (overall.value >= 50) return "#eab308"; // yellow
  return "#ef4444"; // red
});

const label = computed(() => {
  if (overall.value >= 80) return { text: "Excellent", cls: "text-green-400" };
  if (overall.value >= 50)
    return { text: "Needs Work", cls: "text-yellow-400" };
  return { text: "Poor", cls: "text-red-400" };
});

const subScores = computed(() => [
  { label: "Formatting", value: props.score.formatting },
  { label: "Keywords", value: props.score.keywords },
  { label: "Experience", value: props.score.experience },
  { label: "Education", value: props.score.education },
]);

onMounted(() => {
  if (circleRef.value) {
    // Start from 0 (full dash = hidden arc)
    circleRef.value.style.strokeDashoffset = String(circumference.value);
    animateScoreRing(circleRef.value, overall.value, circumference.value);
  }
  if (scoreEl.value) {
    animateCounter(scoreEl.value, overall.value, 1.5);
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
    <!-- SVG ring -->
    <div
      class="relative shrink-0 flex items-center justify-center"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <svg :width="size" :height="size" class="-rotate-90">
        <!-- Track -->
        <circle
          :cx="cx"
          :cy="cy"
          :r="radius"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          :stroke-width="12"
        />
        <!-- Progress arc -->
        <circle
          ref="circleRef"
          :cx="cx"
          :cy="cy"
          :r="radius"
          fill="none"
          :stroke="ringColor"
          :stroke-width="12"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circumference"
          style="transition: none"
          class="drop-shadow-[0_0_8px_currentColor]"
        />
      </svg>

      <!-- Center score -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span
          ref="scoreEl"
          class="text-5xl font-black text-white tabular-nums leading-none"
          >0</span
        >
        <span
          class="text-xs text-white/40 mt-1 font-medium uppercase tracking-widest"
          >ATS Score</span
        >
        <span :class="['text-sm font-semibold mt-1', label.cls]">{{
          label.text
        }}</span>
      </div>
    </div>

    <!-- Sub-scores -->
    <div class="flex flex-col gap-4 w-full max-w-xs">
      <div v-for="s in subScores" :key="s.label" class="space-y-1.5">
        <div class="flex justify-between text-sm">
          <span class="text-white/60">{{ s.label }}</span>
          <span class="font-semibold text-white">{{ s.value }}</span>
        </div>
        <div class="h-1.5 w-full bg-surface-600 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out"
            :class="
              s.value >= 80
                ? 'from-green-500 to-emerald-400'
                : s.value >= 50
                ? 'from-yellow-500 to-amber-400'
                : 'from-red-500 to-rose-400'
            "
            :style="{ width: `${s.value}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
