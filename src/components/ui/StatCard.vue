<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGsap } from "@/composables/useGsap";

interface Props {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: string;
  trend?: number; // positive or negative change
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  suffix: "",
  prefix: "",
  loading: false,
});

const valueEl = ref<HTMLElement | null>(null);
const { animateCounter } = useGsap();

onMounted(() => {
  if (valueEl.value && !props.loading) {
    animateCounter(valueEl.value, props.value, 1.8, props.suffix, props.prefix);
  }
});
</script>

<template>
  <div class="glass-card-hover rounded-2xl p-6 flex flex-col gap-4">
    <!-- Icon + trend -->
    <div class="flex items-start justify-between">
      <div
        class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15"
      >
        <slot name="icon">
          <svg
            v-if="icon"
            class="w-5 h-5 text-brand-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="icon"
            />
          </svg>
        </slot>
      </div>

      <span
        v-if="trend !== undefined"
        :class="[
          'text-xs font-semibold px-2 py-1 rounded-full',
          trend >= 0
            ? 'text-green-400 bg-green-400/10'
            : 'text-red-400 bg-red-400/10',
        ]"
      >
        {{ trend >= 0 ? "+" : "" }}{{ trend }}%
      </span>
    </div>

    <!-- Value -->
    <div>
      <div v-if="loading" class="skeleton h-8 w-24 rounded-lg mb-1" />
      <p
        v-else
        ref="valueEl"
        class="text-3xl font-bold text-white tabular-nums"
      >
        {{ prefix }}{{ value }}{{ suffix }}
      </p>
      <p class="text-sm text-white/50 mt-1">{{ label }}</p>
    </div>
  </div>
</template>
