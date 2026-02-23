<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@vueuse/core";
import type { BulletPair } from "@/types/analysis";

const props = defineProps<{ pair: BulletPair }>();

const showImproved = ref(true);
const { copy, copied } = useClipboard();

function toggleView() {
  showImproved.value = !showImproved.value;
}

function copyText() {
  copy(props.pair.improved);
}
</script>

<template>
  <div class="glass-card rounded-xl p-5 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-white/40 uppercase tracking-wide">{{
        pair.section
      }}</span>
      <div class="flex items-center gap-2">
        <!-- Toggle original/improved -->
        <button
          type="button"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-600 text-xs font-medium text-white/60 hover:text-white hover:bg-surface-500 transition-colors"
          @click="toggleView"
        >
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
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          {{ showImproved ? "See original" : "See improved" }}
        </button>

        <!-- Copy improved -->
        <button
          type="button"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            copied
              ? 'bg-green-500/15 text-green-400'
              : 'bg-surface-600 text-white/60 hover:text-white hover:bg-surface-500',
          ]"
          @click="copyText"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!copied"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {{ copied ? "Copied!" : "Copy" }}
        </button>
      </div>
    </div>

    <!-- Bullet text with transition -->
    <div class="relative min-h-[4rem]">
      <Transition name="slide-toggle" mode="out-in">
        <div v-if="showImproved" key="improved" class="space-y-2">
          <div class="flex items-center gap-2 mb-1">
            <span class="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
            <span
              class="text-xs font-semibold text-green-400 uppercase tracking-wide"
              >Improved</span
            >
          </div>
          <p class="text-sm text-white/90 leading-relaxed pl-3.5">
            {{ pair.improved }}
          </p>
        </div>
        <div v-else key="original" class="space-y-2">
          <div class="flex items-center gap-2 mb-1">
            <span class="h-1.5 w-1.5 rounded-full bg-white/30 shrink-0" />
            <span
              class="text-xs font-semibold text-white/40 uppercase tracking-wide"
              >Original</span
            >
          </div>
          <p
            class="text-sm text-white/50 leading-relaxed pl-3.5 line-through decoration-white/20"
          >
            {{ pair.original }}
          </p>
        </div>
      </Transition>
    </div>

    <!-- Explanation -->
    <div class="rounded-lg border border-brand-500/20 bg-brand-500/5 px-3 py-2">
      <p class="text-xs text-brand-300/80 leading-relaxed">
        <span class="font-semibold text-brand-300">Why: </span
        >{{ pair.explanation }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.slide-toggle-enter-active,
.slide-toggle-leave-active {
  transition: all 0.25s ease;
}
.slide-toggle-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.slide-toggle-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
