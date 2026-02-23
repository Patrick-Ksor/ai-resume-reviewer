<script setup lang="ts">
import { ref, computed } from "vue";
import FilterPill from "@/components/ui/FilterPill.vue";
import type { InterviewQuestion } from "@/types/analysis";

const props = defineProps<{ questions: InterviewQuestion[] }>();

const openId = ref<string | null>(null);
const activeCategory = ref("All");

const categories = computed(() => {
  const cats = ["All", ...new Set(props.questions.map((q) => q.category))];
  return cats;
});

const filtered = computed(() =>
  activeCategory.value === "All"
    ? props.questions
    : props.questions.filter((q) => q.category === activeCategory.value)
);

function toggle(id: string) {
  openId.value = openId.value === id ? null : id;
}
</script>

<template>
  <div class="space-y-4">
    <!-- Category filter -->
    <div class="flex flex-wrap gap-2">
      <FilterPill
        v-for="cat in categories"
        :key="cat"
        :label="cat"
        :active="activeCategory === cat"
        @click="
          activeCategory = cat;
          openId = null;
        "
      />
    </div>

    <!-- Questions list -->
    <div class="space-y-2">
      <div
        v-for="q in filtered"
        :key="q.id"
        class="glass-card-hover rounded-xl overflow-hidden"
      >
        <button
          type="button"
          class="w-full flex items-start gap-4 p-4 text-left"
          @click="toggle(q.id)"
        >
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-400 mt-0.5"
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
                stroke-width="2.5"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white leading-snug">
              {{ q.question }}
            </p>
            <p class="text-xs text-white/40 mt-0.5">{{ q.category }}</p>
          </div>
          <svg
            class="w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 mt-0.5"
            :class="{ 'rotate-180': openId === q.id }"
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

        <Transition name="expand">
          <div v-if="openId === q.id" class="px-4 pb-4 space-y-3">
            <div class="h-px bg-white/[0.06]" />
            <div class="rounded-lg bg-surface-700 p-3 space-y-2">
              <p
                class="text-xs font-semibold text-white/50 uppercase tracking-wide"
              >
                Why they ask this
              </p>
              <p class="text-sm text-white/70 leading-relaxed">
                {{ q.whyAsked }}
              </p>
            </div>
            <div
              class="rounded-lg border border-brand-500/20 bg-brand-500/5 p-3"
            >
              <p
                class="text-xs font-semibold text-brand-400 uppercase tracking-wide mb-1"
              >
                Answer tip
              </p>
              <p class="text-sm text-white/70 leading-relaxed">
                {{ q.tipAnswer }}
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </div>
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
  max-height: 400px;
}
</style>
