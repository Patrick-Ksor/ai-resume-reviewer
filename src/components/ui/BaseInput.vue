<script setup lang="ts">
import { computed, useId } from "vue";

interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  prefix?: string;
  autofocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  type: "text",
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const id = useId();
const hasError = computed(() => !!props.error);
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-white/70">
      {{ label }}
      <span v-if="required" class="text-brand-400 ml-0.5">*</span>
    </label>

    <div class="relative">
      <!-- Prefix icon slot -->
      <div
        v-if="$slots.prefix || prefix"
        class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/40"
      >
        <slot name="prefix">{{ prefix }}</slot>
      </div>

      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autofocus="autofocus"
        :class="[
          'input-base',
          $slots.prefix || prefix ? 'pl-10' : '',
          $slots.suffix ? 'pr-10' : '',
          hasError ? '!border-red-500/60 !ring-red-500/50' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <!-- Suffix icon slot -->
      <div
        v-if="$slots.suffix"
        class="absolute inset-y-0 right-0 flex items-center pr-3.5"
      >
        <slot name="suffix" />
      </div>
    </div>

    <Transition name="error-fade">
      <p v-if="hasError" class="text-xs text-red-400 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        {{ error }}
      </p>
    </Transition>

    <p v-if="hint && !hasError" class="text-xs text-white/40">{{ hint }}</p>
  </div>
</template>

<style scoped>
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s ease;
}
.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
