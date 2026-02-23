import { ref, computed } from "vue";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const MAX_SIZE_MB = 10;

export function useFileUpload() {
  const selectedFile = ref<File | null>(null);
  const isDragging = ref(false);
  const uploadError = ref<string | null>(null);

  const fileDisplayName = computed(() => selectedFile.value?.name ?? null);
  const fileSizeMb = computed(() =>
    selectedFile.value
      ? (selectedFile.value.size / 1024 / 1024).toFixed(2)
      : null,
  );

  function validateFile(file: File): string | null {
    if (
      !ALLOWED_TYPES.includes(file.type) &&
      !ALLOWED_EXTENSIONS.some((ext) => file.name.endsWith(ext))
    ) {
      return "Only PDF and DOCX files are supported.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size must be under ${MAX_SIZE_MB} MB.`;
    }
    return null;
  }

  function handleFile(file: File) {
    const err = validateFile(file);
    if (err) {
      uploadError.value = err;
      selectedFile.value = null;
      return false;
    }
    uploadError.value = null;
    selectedFile.value = file;
    return true;
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging.value = true;
  }

  function onDragLeave() {
    isDragging.value = false;
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    isDragging.value = false;
    const file = event.dataTransfer?.files[0];
    if (file) handleFile(file);
  }

  function onFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    input.value = "";
  }

  function clearFile() {
    selectedFile.value = null;
    uploadError.value = null;
  }

  return {
    selectedFile,
    isDragging,
    uploadError,
    fileDisplayName,
    fileSizeMb,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileInput,
    clearFile,
  };
}
