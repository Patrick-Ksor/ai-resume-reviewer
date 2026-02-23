<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import BaseSkeleton from "@/components/ui/BaseSkeleton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import FilterPill from "@/components/ui/FilterPill.vue";
import { useAnalysisStore } from "@/stores/analysis";
import type { AnalysisStatus } from "@/types/analysis";

const store = useAnalysisStore();

const search = ref("");
const statusFilter = ref<AnalysisStatus | "all">("all");
const page = ref(1);

const statuses = ["all", "completed", "processing", "failed"] as const;

async function load() {
  await store.fetchHistory({
    page: page.value,
    limit: 10,
    search: search.value || undefined,
    status: statusFilter.value === "all" ? undefined : statusFilter.value,
  });
}

onMounted(load);

const debouncedSearch = useDebounceFn(async () => {
  page.value = 1;
  await load();
}, 400);

watch(search, debouncedSearch);
watch(statusFilter, async () => {
  page.value = 1;
  await load();
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusColors: Record<string, string> = {
  completed: "text-green-400 bg-green-400/10",
  processing: "text-yellow-400 bg-yellow-400/10",
  pending: "text-white/40 bg-white/5",
  failed: "text-red-400 bg-red-400/10",
};
</script>

<template>
  <div class="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-black text-white">Analysis History</h1>
      <p class="text-sm text-white/40 mt-1">
        Browse and review all your past resume analyses.
      </p>
    </div>

    <!-- Search + filters row -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <BaseInput
          v-model="search"
          placeholder="Search by filename…"
          type="search"
        >
          <template #prefix>
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </template>
        </BaseInput>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-1">
        <FilterPill
          v-for="s in statuses"
          :key="s"
          :label="s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)"
          :active="statusFilter === s"
          @click="statusFilter = s"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="glass-card rounded-2xl overflow-hidden">
      <!-- Loading -->
      <div v-if="store.loadingHistory" class="divide-y divide-white/[0.04]">
        <div v-for="n in 5" :key="n" class="px-6 py-4 flex items-center gap-4">
          <BaseSkeleton width="2.5rem" height="2.5rem" rounded="rounded-xl" />
          <div class="flex-1 space-y-2">
            <BaseSkeleton width="50%" height="0.875rem" />
            <BaseSkeleton width="30%" height="0.75rem" />
          </div>
          <BaseSkeleton width="4rem" height="1.5rem" rounded="rounded-full" />
          <BaseSkeleton width="2rem" height="1rem" rounded="rounded" />
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!store.history.length" class="px-6 py-16 text-center">
        <svg
          class="w-12 h-12 text-white/10 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p class="text-white/30 text-sm">
          {{ search ? "No results found." : "No analyses yet." }}
        </p>
      </div>

      <!-- Rows -->
      <div v-else class="divide-y divide-white/[0.04]">
        <RouterLink
          v-for="a in store.history"
          :key="a.id"
          :to="{ name: 'analysis-results', params: { id: a.id } }"
          class="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-all duration-200 group"
        >
          <!-- ATS score bubble -->
          <div
            :class="[
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-transform duration-200 group-hover:-translate-y-0.5',
              (a.atsScore?.overall ?? 0) >= 80
                ? 'bg-green-400/10 text-green-300'
                : (a.atsScore?.overall ?? 0) >= 50
                ? 'bg-yellow-400/10 text-yellow-300'
                : a.atsScore
                ? 'bg-red-400/10 text-red-300'
                : 'bg-surface-600 text-white/30',
            ]"
          >
            {{ a.atsScore?.overall ?? "—" }}
          </div>

          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-white truncate group-hover:text-brand-300 transition-colors"
            >
              {{ a.resumeFilename ?? "Untitled Analysis" }}
            </p>
            <p class="text-xs text-white/40 mt-0.5">
              {{ formatDate(a.createdAt) }}
            </p>
          </div>

          <span
            :class="[
              'text-xs px-2.5 py-1 rounded-full font-medium capitalize',
              statusColors[a.status] ?? '',
            ]"
          >
            {{ a.status }}
          </span>

          <svg
            class="w-4 h-4 text-white/20 group-hover:text-brand-400 transition-colors shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </RouterLink>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="store.historyTotalPages > 1"
      class="flex justify-center items-center gap-3"
    >
      <button
        type="button"
        :disabled="page <= 1"
        class="h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        @click="
          page--;
          load();
        "
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <span class="text-sm text-white/50"
        >{{ page }} / {{ store.historyTotalPages }}</span
      >
      <button
        type="button"
        :disabled="page >= store.historyTotalPages"
        class="h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        @click="
          page++;
          load();
        "
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
