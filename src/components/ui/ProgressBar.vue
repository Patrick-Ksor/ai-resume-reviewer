<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useGsap } from "@/composables/useGsap";

interface Props {
  value: number; // 0–100
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: "h-2",
  showLabel: false,
  animated: true,
});

const barRef = ref<HTMLElement | null>(null);
const { animateProgress } = useGsap();

const colorClass = computed(() => {
  if (props.value >= 80)
    return "bg-gradient-to-r from-green-500 to-emerald-400";
  if (props.value >= 50) return "bg-gradient-to-r from-yellow-500 to-amber-400";
  return "bg-gradient-to-r from-red-500 to-rose-400";
});

onMounted(() => {
  if (barRef.value && props.animated) {
    barRef.value.style.width = "0%";
    animateProgress(barRef.value, props.value);
  }
});

watch(
  () => props.value,
  (val) => {
    if (barRef.value && props.animated) {
      animateProgress(barRef.value, val);
    } else if (barRef.value) {
      barRef.value.style.width = `${val}%`;
    }
  }
);
</script>

<template>
  <div class="w-full space-y-1">
    <div v-if="showLabel" class="flex justify-between text-xs text-white/50">
      <slot name="label" />
      <span>{{ value }}%</span>
    </div>
    <div
      :class="['w-full bg-surface-600 rounded-full overflow-hidden', height]"
    >
      <div
        ref="barRef"
        :class="['h-full rounded-full transition-none', colorClass]"
        :style="{ width: animated ? '0%' : `${value}%` }"
      />
    </div>
  </div>
</template>
