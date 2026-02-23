<script setup lang="ts">
import { ref } from "vue";
import { useFileUpload } from "@/composables/useFileUpload";

const emit = defineEmits<{
  "file-selected": [file: File];
}>();

const {
  selectedFile,
  isDragging,
  uploadError,
  fileDisplayName,
  fileSizeMb,
  onDragOver,
  onDragLeave,
  onDrop: _onDrop,
  onFileInput,
  clearFile,
} = useFileUpload();

const inputRef = ref<HTMLInputElement | null>(null);

function onDrop(e: DragEvent) {
  _onDrop(e);
  if (selectedFile.value) emit("file-selected", selectedFile.value);
}

function handleInput(e: Event) {
  onFileInput(e);
  if (selectedFile.value) emit("file-selected", selectedFile.value);
}

function triggerFilePicker() {
  inputRef.value?.click();
}

function removeFile() {
  clearFile();
}
</script>

<template>
  <div class="space-y-3">
    <!-- Drop zone -->
    <div
      role="button"
      tabindex="0"
      :class="[
        'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300',
        isDragging
          ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
          : 'border-white/15 hover:border-brand-500/60 hover:bg-white/[0.02]',
        uploadError ? 'border-red-500/40' : '',
      ]"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click="triggerFilePicker"
      @keydown.enter.space.prevent="triggerFilePicker"
    >
      <!-- Upload icon / file icon -->
      <div
        v-if="!selectedFile"
        :class="[
          'flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300',
          isDragging ? 'bg-brand-500/20' : 'bg-surface-600',
        ]"
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

      <div v-if="!selectedFile">
        <p class="text-base font-medium text-white/80">
          <span class="text-brand-400">Click to upload</span> or drag & drop
        </p>
        <p class="mt-1 text-sm text-white/40">PDF or DOCX — max 10 MB</p>
      </div>

      <!-- Selected file preview -->
      <div v-else class="flex items-center gap-4 w-full max-w-sm">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/20"
        >
          <svg
            class="w-6 h-6 text-brand-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div class="flex-1 min-w-0 text-left">
          <p class="text-sm font-medium text-white truncate">
            {{ fileDisplayName }}
          </p>
          <p class="text-xs text-white/40">{{ fileSizeMb }} MB</p>
        </div>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          @click.stop="removeFile"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Hidden file input -->
      <input
        ref="inputRef"
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        class="hidden"
        @change="handleInput"
      />
    </div>

    <!-- Error message -->
    <Transition name="error-fade">
      <p
        v-if="uploadError"
        class="text-sm text-red-400 flex items-center gap-1.5"
      >
        <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        {{ uploadError }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s;
}
.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
