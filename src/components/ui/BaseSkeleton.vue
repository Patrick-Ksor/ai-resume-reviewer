<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
  rounded?: string;
  lines?: number;
}

withDefaults(defineProps<Props>(), {
  width: "100%",
  height: "1rem",
  rounded: "rounded-lg",
  lines: 1,
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="i in lines"
      :key="i"
      class="skeleton"
      :class="rounded"
      :style="{
        width: i === lines && lines > 1 ? '65%' : width,
        height,
      }"
    />
  </div>
</template>
