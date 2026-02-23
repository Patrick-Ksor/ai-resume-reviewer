<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label: string;
  score: number; // 0–10
  showScore?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showScore: true,
});

const pct = computed(() => (props.score / 10) * 100);
const color = computed(() => {
  if (props.score >= 7) return "from-green-500 to-emerald-400";
  if (props.score >= 4) return "from-yellow-500 to-amber-400";
  return "from-red-500 to-rose-400";
});
</script>

<template>
  <div class="space-y-1.5">
    <div class="flex justify-between items-center">
      <span class="text-sm text-white/70">{{ label }}</span>
      <span v-if="showScore" class="text-sm font-semibold text-white"
        >{{ score.toFixed(1) }}/10</span
      >
    </div>
    <div class="h-1.5 w-full bg-surface-600 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out"
        :class="color"
        :style="{ width: `${pct}%` }"
      />
    </div>
  </div>
</template>
