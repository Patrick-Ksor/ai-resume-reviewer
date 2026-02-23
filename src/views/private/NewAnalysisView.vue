<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import FileDropzone from "@/components/ui/FileDropzone.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import { useAnalysisStore } from "@/stores/analysis";
import { useToast } from "@/composables/useToast";

const router = useRouter();
const store = useAnalysisStore();
const toast = useToast();

const selectedFile = ref<File | null>(null);
const portfolioUrl = ref("");
const jobDescription = ref("");
const portfolioError = ref("");

const canSubmit = computed(() => !!selectedFile.value && !store.uploading);

function validateUrl(val: string) {
  if (!val) {
    portfolioError.value = "";
    return true;
  }
  try {
    new URL(val);
    portfolioError.value = "";
    return true;
  } catch {
    portfolioError.value = "Enter a valid URL (e.g. https://yoursite.com)";
    return false;
  }
}

watch(portfolioUrl, validateUrl);

function onFileSelected(file: File) {
  selectedFile.value = file;
}

async function submit() {
  if (!selectedFile.value) return;
  if (!validateUrl(portfolioUrl.value)) return;

  try {
    const analysis = await store.submitAnalysis(
      selectedFile.value,
      portfolioUrl.value,
      jobDescription.value
    );
    toast.success("Analysis complete! Loading your results…");
    await router.push({
      name: "analysis-results",
      params: { id: analysis.id },
    });
  } catch (e) {
    toast.error(
      (e as { message?: string }).message ??
        "Submission failed. Please try again."
    );
  }
}
</script>

<template>
  <div class="p-6 sm:p-8 max-w-2xl mx-auto space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-black text-white">New Analysis</h1>
      <p class="text-sm text-white/40 mt-1">
        Upload your resume and we'll analyze it with AI.
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="submit">
      <!-- Step 1: Resume upload -->
      <div class="glass-card rounded-2xl p-6 space-y-3">
        <div class="flex items-center gap-3 mb-1">
          <span
            class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold"
            >1</span
          >
          <h2 class="text-base font-semibold text-white">Upload Resume</h2>
          <span class="text-xs text-red-400">*required</span>
        </div>
        <FileDropzone @file-selected="onFileSelected" />
      </div>

      <!-- Step 2: Portfolio URL -->
      <div class="glass-card rounded-2xl p-6 space-y-3">
        <div class="flex items-center gap-3 mb-1">
          <span
            class="flex h-6 w-6 items-center justify-center rounded-full bg-surface-500 text-white/60 text-xs font-bold"
            >2</span
          >
          <h2 class="text-base font-semibold text-white">Portfolio URL</h2>
          <span class="text-xs text-white/30">optional</span>
        </div>
        <BaseInput
          v-model="portfolioUrl"
          placeholder="https://yourportfolio.com"
          type="url"
          :error="portfolioError"
          hint="Include your portfolio or GitHub for a full critique"
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
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </template>
        </BaseInput>
      </div>

      <!-- Step 3: Job description -->
      <div class="glass-card rounded-2xl p-6 space-y-3">
        <div class="flex items-center gap-3 mb-1">
          <span
            class="flex h-6 w-6 items-center justify-center rounded-full bg-surface-500 text-white/60 text-xs font-bold"
            >3</span
          >
          <h2 class="text-base font-semibold text-white">
            Target Job Description
          </h2>
          <span class="text-xs text-white/30">optional but recommended</span>
        </div>
        <div class="space-y-1.5">
          <textarea
            v-model="jobDescription"
            placeholder="Paste the job description here to get tailored keyword and skills analysis…"
            rows="5"
            maxlength="3000"
            class="input-base resize-none leading-relaxed"
          />
          <p class="text-xs text-white/30 text-right">
            {{ jobDescription.length }}/3000
          </p>
        </div>
      </div>

      <!-- Upload progress -->
      <Transition name="fade">
        <div
          v-if="store.uploading"
          class="glass-card rounded-2xl p-6 space-y-3"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="text-white/60">Uploading and analyzing…</span>
            <span class="text-white font-semibold"
              >{{ store.uploadProgress }}%</span
            >
          </div>
          <ProgressBar :value="store.uploadProgress" height="h-2" />
          <p class="text-xs text-white/30 text-center">
            This usually takes 10–15 seconds
          </p>
        </div>
      </Transition>

      <!-- Submit -->
      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="store.uploading"
        :disabled="!canSubmit"
        full
      >
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </template>
        {{ store.uploading ? "Analyzing…" : "Analyze Resume" }}
      </BaseButton>
    </form>
  </div>
</template>
