<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

interface Props {
  open: boolean;
  title?: string;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const emit = defineEmits<{ "update:open": [value: boolean] }>();

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

function close() {
  emit("update:open", false);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.open) close();
}

onMounted(() => document.addEventListener("keydown", onKeydown));
onUnmounted(() => document.removeEventListener("keydown", onKeydown));
</script>

<template>
  <Teleport to="#modals">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="close"
        />

        <!-- Panel -->
        <div
          :class="[
            'relative w-full glass-card rounded-2xl p-6 shadow-glass-lg',
            sizes[size],
          ]"
        >
          <!-- Header -->
          <div
            v-if="title || $slots.header"
            class="flex items-center justify-between mb-5"
          >
            <h3 class="text-lg font-semibold text-white">
              <slot name="header">{{ title }}</slot>
            </h3>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              @click="close"
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

          <!-- Body -->
          <slot />

          <!-- Footer -->
          <div v-if="$slots.footer" class="mt-6 flex justify-end gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-leave-active {
  transition: all 0.2s ease-in;
}
.modal-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(8px);
}
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
</style>
