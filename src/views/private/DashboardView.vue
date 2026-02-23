<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import StatCard from "@/components/ui/StatCard.vue";
import BaseSkeleton from "@/components/ui/BaseSkeleton.vue";
import { useAnalysisStore } from "@/stores/analysis";
import { useAuth } from "@/composables/useAuth";
import { useGsap } from "@/composables/useGsap";

const router = useRouter();
const analysisStore = useAnalysisStore();
const { fullName } = useAuth();
const { staggerReveal } = useGsap();

onMounted(async () => {
  await analysisStore.fetchHistory({ limit: 5 });
  staggerReveal(".dash-card", { delay: 0.1 });
});

const greeting = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
});

const statusColors: Record<string, string> = {
  completed: "text-green-400 bg-green-400/10",
  processing: "text-yellow-400 bg-yellow-400/10",
  pending: "text-white/40 bg-white/5",
  failed: "text-red-400 bg-red-400/10",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>

<template>
  <div class="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-black text-white">
          {{ greeting }}, {{ fullName }} 👋
        </h1>
        <p class="text-sm text-white/40 mt-1">
          Here's an overview of your resume performance.
        </p>
      </div>
      <button
        type="button"
        class="px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-brand hover:brightness-110 transition-all duration-200"
        @click="router.push({ name: 'analysis-new' })"
      >
        + New Analysis
      </button>
    </div>

    <!-- Stat cards -->
    <div class="grid gap-4 sm:grid-cols-3">
      <StatCard
        class="dash-card"
        label="Latest ATS Score"
        :value="analysisStore.latestAtsScore ?? 0"
        :loading="analysisStore.loadingHistory"
      >
        <template #icon>
          <svg
            class="w-5 h-5 text-brand-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </template>
      </StatCard>

      <StatCard
        class="dash-card"
        label="Total Analyses"
        :value="analysisStore.totalAnalyses"
        :loading="analysisStore.loadingHistory"
      >
        <template #icon>
          <svg
            class="w-5 h-5 text-brand-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </template>
      </StatCard>

      <StatCard
        class="dash-card"
        label="Avg. Improvement"
        :value="12"
        suffix=" pts"
        :trend="8"
        :loading="analysisStore.loadingHistory"
      >
        <template #icon>
          <svg
            class="w-5 h-5 text-brand-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Recent Analyses -->
    <div class="dash-card glass-card rounded-2xl overflow-hidden">
      <div
        class="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between"
      >
        <h2 class="text-base font-semibold text-white">Recent Analyses</h2>
        <button
          type="button"
          class="text-sm text-brand-400 hover:text-brand-300 transition-colors"
          @click="router.push({ name: 'history' })"
        >
          View all →
        </button>
      </div>

      <!-- Loading skeleton -->
      <div
        v-if="analysisStore.loadingHistory"
        class="divide-y divide-white/[0.04]"
      >
        <div v-for="n in 4" :key="n" class="px-6 py-4 flex items-center gap-4">
          <BaseSkeleton width="2rem" height="2rem" rounded="rounded-full" />
          <div class="flex-1 space-y-2">
            <BaseSkeleton width="60%" height="0.875rem" />
            <BaseSkeleton width="35%" height="0.75rem" />
          </div>
          <BaseSkeleton width="3rem" height="1.5rem" rounded="rounded-full" />
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!analysisStore.history.length"
        class="px-6 py-16 text-center"
      >
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
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-white/30 text-sm">No analyses yet.</p>
        <button
          type="button"
          class="mt-4 text-sm text-brand-400 hover:text-brand-300 transition-colors"
          @click="router.push({ name: 'analysis-new' })"
        >
          Create your first analysis →
        </button>
      </div>

      <!-- History rows -->
      <div v-else class="divide-y divide-white/[0.04]">
        <RouterLink
          v-for="a in analysisStore.history"
          :key="a.id"
          :to="{ name: 'analysis-results', params: { id: a.id } }"
          class="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group"
        >
          <!-- Score bubble -->
          <div
            :class="[
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
              (a.atsScore?.overall ?? 0) >= 80
                ? 'bg-green-400/10 text-green-300'
                : (a.atsScore?.overall ?? 0) >= 50
                ? 'bg-yellow-400/10 text-yellow-300'
                : 'bg-red-400/10 text-red-300',
            ]"
          >
            {{ a.atsScore?.overall ?? "—" }}
          </div>

          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-white truncate group-hover:text-brand-300 transition-colors"
            >
              {{ a.resumeFilename ?? "Resume Analysis" }}
            </p>
            <p class="text-xs text-white/40 mt-0.5">
              {{ formatDate(a.createdAt) }}
            </p>
          </div>

          <span
            :class="[
              'text-xs px-2.5 py-1 rounded-full font-medium capitalize',
              statusColors[a.status],
            ]"
          >
            {{ a.status }}
          </span>
        </RouterLink>
      </div>
    </div>

    <!-- Quick action card -->
    <div
      class="dash-card rounded-2xl overflow-hidden bg-gradient-to-br from-brand-600/20 via-surface-700 to-surface-700 border border-brand-500/20 p-8 flex flex-col sm:flex-row items-center gap-6"
    >
      <div
        class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-500/20"
      >
        <svg
          class="w-8 h-8 text-brand-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      </div>
      <div class="flex-1 text-center sm:text-left">
        <h3 class="text-lg font-bold text-white">
          Ready to improve your resume?
        </h3>
        <p class="text-sm text-white/50 mt-1">
          Upload your resume and get detailed AI feedback in under 15 seconds.
        </p>
      </div>
      <button
        type="button"
        class="shrink-0 px-6 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-brand hover:brightness-110 transition-all"
        @click="router.push({ name: 'analysis-new' })"
      >
        Analyze resume
      </button>
    </div>
  </div>
</template>
