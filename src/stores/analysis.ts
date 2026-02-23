import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { analysisService } from "@/services/analysisService";
import type { Analysis, HistoryFilters } from "@/types/analysis";

export const useAnalysisStore = defineStore("analysis", () => {
  // ── State ─────────────────────────────────────────────────────────────
  const current = ref<Analysis | null>(null);
  const history = ref<Analysis[]>([]);
  const historyTotal = ref(0);
  const historyPage = ref(1);
  const historyTotalPages = ref(1);

  const uploading = ref(false);
  const uploadProgress = ref(0);
  const loadingCurrent = ref(false);
  const loadingHistory = ref(false);
  const error = ref<string | null>(null);

  // ── Getters ──────────────────────────────────────────────────────────
  const hasResults = computed(
    () => !!current.value && current.value.status === "completed",
  );
  const latestAtsScore = computed(
    () =>
      current.value?.atsScore?.overall ??
      history.value[0]?.atsScore?.overall ??
      null,
  );
  const totalAnalyses = computed(() => historyTotal.value);

  // ── Actions ───────────────────────────────────────────────────────────
  async function submitAnalysis(
    file: File,
    portfolioUrl: string,
    jobDescription: string,
  ) {
    uploading.value = true;
    uploadProgress.value = 0;
    error.value = null;
    try {
      const result = await analysisService.submitAnalysis(
        file,
        portfolioUrl,
        jobDescription,
        (pct) => {
          uploadProgress.value = pct;
        },
      );
      current.value = result;
      return result;
    } catch (e) {
      error.value = (e as { message: string }).message ?? "Submission failed";
      throw e;
    } finally {
      uploading.value = false;
    }
  }

  async function fetchAnalysis(id: string) {
    loadingCurrent.value = true;
    error.value = null;
    try {
      current.value = await analysisService.getAnalysis(id);
    } catch (e) {
      error.value =
        (e as { message: string }).message ?? "Failed to load analysis";
      throw e;
    } finally {
      loadingCurrent.value = false;
    }
  }

  async function fetchHistory(filters?: HistoryFilters) {
    loadingHistory.value = true;
    error.value = null;
    try {
      const res = await analysisService.getHistory(filters);
      history.value = res.data;
      historyTotal.value = res.total;
      historyPage.value = res.page;
      historyTotalPages.value = res.totalPages;
    } catch (e) {
      error.value =
        (e as { message: string }).message ?? "Failed to load history";
    } finally {
      loadingHistory.value = false;
    }
  }

  async function downloadReport(id: string, filename = "resume-report.pdf") {
    const blob = await analysisService.downloadReport(id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearCurrent() {
    current.value = null;
    uploadProgress.value = 0;
    error.value = null;
  }

  return {
    current,
    history,
    historyTotal,
    historyPage,
    historyTotalPages,
    uploading,
    uploadProgress,
    loadingCurrent,
    loadingHistory,
    error,
    hasResults,
    latestAtsScore,
    totalAnalyses,
    submitAnalysis,
    fetchAnalysis,
    fetchHistory,
    downloadReport,
    clearCurrent,
  };
});
