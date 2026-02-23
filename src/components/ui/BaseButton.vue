<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  full?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  loading: false,
  disabled: false,
  type: "button",
  full: false,
});

const classes = computed(() => {
  const base =
    "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-gradient-brand text-white shadow-brand hover:brightness-110 hover:shadow-lg active:scale-[0.98]",
    secondary:
      "bg-surface-600 text-white hover:bg-surface-500 active:scale-[0.98]",
    ghost:
      "text-white/70 hover:text-white hover:bg-white/[0.07] active:scale-[0.98]",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 active:scale-[0.98]",
    outline:
      "border border-white/20 text-white hover:bg-white/[0.07] active:scale-[0.98]",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-7 text-base",
  };

  return [
    base,
    variants[props.variant],
    sizes[props.size],
    props.full ? "w-full" : "",
  ];
});
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="classes">
    <!-- Loading spinner -->
    <span
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="3"
          stroke-dasharray="30 70"
        />
      </svg>
    </span>

    <span :class="{ 'opacity-0': loading }" class="flex items-center gap-2">
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
    </span>
  </button>
</template>
