<script setup lang="ts">
import { reactive, ref } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import { useAuth } from "@/composables/useAuth";

const { register, loading } = useAuth();

const form = reactive({ name: "", email: "", password: "", confirm: "" });
const errors = reactive({ name: "", email: "", password: "", confirm: "" });
const serverError = ref("");

function validate() {
  errors.name =
    form.name.trim().length < 2 ? "Name must be at least 2 characters." : "";
  errors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? "Enter a valid email address."
    : "";
  errors.password =
    form.password.length < 8 ? "Password must be at least 8 characters." : "";
  errors.confirm =
    form.password !== form.confirm ? "Passwords do not match." : "";
  return !errors.name && !errors.email && !errors.password && !errors.confirm;
}

async function submit() {
  if (!validate()) return;
  serverError.value = "";
  try {
    await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });
  } catch (e) {
    serverError.value =
      (e as { message?: string }).message ?? "Registration failed.";
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-surface-900 px-4 py-12 relative"
  >
    <div class="pointer-events-none absolute inset-0 bg-gradient-mesh" />
    <div
      class="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-600/15 blur-3xl"
    />

    <div class="relative z-10 w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <RouterLink to="/" class="flex items-center gap-2.5">
          <div
            class="h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <span class="font-bold text-white text-lg">ResumeAI</span>
        </RouterLink>
      </div>

      <div class="glass-card rounded-2xl p-8 shadow-glass-lg">
        <h1 class="text-2xl font-black text-white mb-1">Create your account</h1>
        <p class="text-sm text-white/50 mb-7">
          Start analyzing your resume in minutes.
        </p>

        <form class="space-y-4" @submit.prevent="submit">
          <BaseInput
            v-model="form.name"
            label="Full name"
            placeholder="Jane Smith"
            required
            autofocus
            :error="errors.name"
          />
          <BaseInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            :error="errors.email"
          />
          <BaseInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            required
            :error="errors.password"
            hint="Use at least 8 characters"
          />
          <BaseInput
            v-model="form.confirm"
            label="Confirm password"
            type="password"
            placeholder="Repeat password"
            required
            :error="errors.confirm"
          />

          <Transition name="error-fade">
            <div
              v-if="serverError"
              class="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300"
            >
              {{ serverError }}
            </div>
          </Transition>

          <BaseButton
            type="submit"
            variant="primary"
            :loading="loading"
            full
            class="mt-2"
          >
            Create account
          </BaseButton>
        </form>

        <p class="text-sm text-white/40 text-center mt-6">
          Already have an account?
          <RouterLink
            to="/login"
            class="text-brand-400 hover:text-brand-300 font-medium ml-1 transition-colors"
          >
            Sign in →
          </RouterLink>
        </p>
      </div>
    </div>
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
