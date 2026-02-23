<script setup lang="ts">
interface Props {
  label: string;
  active?: boolean;
  count?: number;
}

defineProps<Props>();
defineEmits<{ click: [] }>();
</script>

<template>
  <button
    type="button"
    :class="[
      'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
      active
        ? 'bg-brand-500 text-white shadow-brand'
        : 'bg-surface-600 text-white/60 hover:text-white hover:bg-surface-500',
    ]"
    @click="$emit('click')"
  >
    {{ label }}
    <span
      v-if="count !== undefined"
      :class="[
        'text-xs px-1.5 py-0.5 rounded-full',
        active ? 'bg-white/20' : 'bg-white/10',
      ]"
    >
      {{ count }}
    </span>
  </button>
</template>
