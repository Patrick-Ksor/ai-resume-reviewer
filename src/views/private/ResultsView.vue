<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AtsScoreRing from "@/components/analysis/AtsScoreRing.vue";
import SuggestionCard from "@/components/analysis/SuggestionCard.vue";
import BulletUpgrade from "@/components/analysis/BulletUpgrade.vue";
import ProjectCard from "@/components/analysis/ProjectCard.vue";
import PortfolioCritique from "@/components/analysis/PortfolioCritique.vue";
import InterviewAccordion from "@/components/analysis/InterviewAccordion.vue";
import BaseSkeleton from "@/components/ui/BaseSkeleton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import FilterPill from "@/components/ui/FilterPill.vue";
import { useAnalysisStore } from "@/stores/analysis";
import { useToast } from "@/composables/useToast";
import type { SuggestionCategory } from "@/types/analysis";

const route = useRoute();
const router = useRouter();
const store = useAnalysisStore();
const toast = useToast();

const activeTab = ref<
  "ats" | "suggestions" | "bullets" | "projects" | "portfolio" | "interview"
>("ats");
const activeCategory = ref<SuggestionCategory | "all">("all");

const tabs = [
  { key: "ats", label: "ATS Score" },
  { key: "suggestions", label: "Improvements" },
  { key: "bullets", label: "Bullet Rewrites" },
  { key: "projects", label: "Projects" },
  { key: "portfolio", label: "Portfolio" },
  { key: "interview", label: "Interview Prep" },
] as const;

onMounted(async () => {
  const id = route.params.id as string;
  if (!store.current || store.current.id !== id) {
    await store.fetchAnalysis(id);
  }
  if (store.error) {
    toast.error("Could not load analysis.");
    router.push({ name: "history" });
  }
});

const analysis = computed(() => store.current);
const loading = computed(() => store.loadingCurrent);

const filteredSuggestions = computed(() => {
  if (!analysis.value?.suggestions) return [];
  if (activeCategory.value === "all") return analysis.value.suggestions;
  return analysis.value.suggestions.filter(
    (s) => s.category === activeCategory.value
  );
});

const suggestionCategories = computed(() => {
  const cats = new Set(
    analysis.value?.suggestions?.map((s) => s.category) ?? []
  );
  return Array.from(cats) as SuggestionCategory[];
});

async function downloadReport() {
  if (!analysis.value) return;
  try {
    await store.downloadReport(
      analysis.value.id,
      `resume-report-${analysis.value.id}.pdf`
    );
    toast.success("Report downloaded!");
  } catch {
    toast.error("Download failed.");
  }
}
</script>

<template>
  <div class="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-black text-white">Analysis Results</h1>
        <p v-if="analysis?.resumeFilename" class="text-sm text-white/40 mt-1">
          {{ analysis.resumeFilename }}
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton
          variant="outline"
          @click="router.push({ name: 'analysis-new' })"
        >
          New Analysis
        </BaseButton>
        <BaseButton variant="primary" @click="downloadReport">
          <template #icon-left>
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </template>
          Download Report
        </BaseButton>
      </div>
    </div>

    <!-- Tab navigation -->
    <div class="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        :class="[
          'shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
          activeTab === tab.key
            ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
            : 'text-white/50 hover:text-white hover:bg-white/[0.05]',
        ]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-4">
      <div class="glass-card rounded-2xl p-8">
        <BaseSkeleton height="200px" rounded="rounded-xl" />
      </div>
      <div class="grid gap-3">
        <BaseSkeleton
          v-for="n in 3"
          :key="n"
          height="5rem"
          rounded="rounded-xl"
        />
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="analysis">
      <!-- ATS Score Tab -->
      <div v-if="activeTab === 'ats'" class="glass-card rounded-2xl p-8">
        <h2 class="text-base font-semibold text-white mb-8">
          ATS Compatibility Score
        </h2>
        <AtsScoreRing
          v-if="analysis.atsScore"
          :score="analysis.atsScore"
          :size="220"
        />
        <p v-else class="text-white/40 text-sm">
          ATS score not available for this analysis.
        </p>
      </div>

      <!-- Improvements Tab -->
      <div v-if="activeTab === 'suggestions'" class="space-y-4">
        <!-- Category filters -->
        <div class="flex flex-wrap gap-2">
          <FilterPill
            label="All"
            :count="analysis.suggestions?.length ?? 0"
            :active="activeCategory === 'all'"
            @click="activeCategory = 'all'"
          />
          <FilterPill
            v-for="cat in suggestionCategories"
            :key="cat"
            :label="cat.charAt(0).toUpperCase() + cat.slice(1)"
            :count="
              analysis.suggestions?.filter((s) => s.category === cat).length
            "
            :active="activeCategory === cat"
            @click="activeCategory = cat"
          />
        </div>

        <div v-if="filteredSuggestions.length" class="space-y-2">
          <SuggestionCard
            v-for="s in filteredSuggestions"
            :key="s.id"
            :suggestion="s"
          />
        </div>
        <p
          v-else
          class="glass-card rounded-2xl p-8 text-center text-white/30 text-sm"
        >
          No suggestions in this category.
        </p>
      </div>

      <!-- Bullet Upgrades Tab -->
      <div v-if="activeTab === 'bullets'" class="space-y-4">
        <div v-if="analysis.bulletPairs?.length" class="grid gap-4">
          <BulletUpgrade
            v-for="bp in analysis.bulletPairs"
            :key="bp.id"
            :pair="bp"
          />
        </div>
        <p
          v-else
          class="glass-card rounded-2xl p-8 text-center text-white/30 text-sm"
        >
          No bullet rewrites available.
        </p>
      </div>

      <!-- Projects Tab -->
      <div v-if="activeTab === 'projects'">
        <div
          v-if="analysis.projectSuggestions?.length"
          class="grid gap-4 sm:grid-cols-2"
        >
          <ProjectCard
            v-for="p in analysis.projectSuggestions"
            :key="p.id"
            :project="p"
          />
        </div>
        <p
          v-else
          class="glass-card rounded-2xl p-8 text-center text-white/30 text-sm"
        >
          No project suggestions available.
        </p>
      </div>

      <!-- Portfolio Tab -->
      <div v-if="activeTab === 'portfolio'">
        <PortfolioCritique
          v-if="analysis.portfolioCritique"
          :critique="analysis.portfolioCritique"
        />
        <div v-else class="glass-card rounded-2xl p-8 text-center">
          <p class="text-white/30 text-sm">
            No portfolio URL was provided for this analysis.
          </p>
          <button
            type="button"
            class="mt-4 text-sm text-brand-400 hover:text-brand-300 transition-colors"
            @click="router.push({ name: 'analysis-new' })"
          >
            Run a new analysis with portfolio URL →
          </button>
        </div>
      </div>

      <!-- Interview Tab -->
      <div v-if="activeTab === 'interview'">
        <div v-if="analysis.interviewQuestions?.length">
          <InterviewAccordion :questions="analysis.interviewQuestions" />
        </div>
        <p
          v-else
          class="glass-card rounded-2xl p-8 text-center text-white/30 text-sm"
        >
          No interview questions available.
        </p>
      </div>
    </template>
  </div>
</template>
