<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const scrolled = ref(false);
const menuOpen = ref(false);
const router = useRouter();

onMounted(() => {
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 20;
  });
});

function navigateTo(name: string) {
  menuOpen.value = false;
  router.push({ name });
}
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-surface-900/80 backdrop-blur-xl border-b border-white/[0.06] shadow-glass-sm'
        : 'bg-transparent',
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 group">
        <div
          class="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand"
        >
          <svg
            class="w-4 h-4 text-white"
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
        <span class="font-bold text-white text-base tracking-tight"
          >ResumeAI</span
        >
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-1">
        <a
          v-for="link in [
            { label: 'Features', href: '#features' },
            { label: 'How it works', href: '#how-it-works' },
          ]"
          :key="link.href"
          :href="link.href"
          class="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors group"
        >
          {{ link.label }}
          <span
            class="absolute bottom-0 left-4 right-4 h-px bg-brand-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
          />
        </a>
      </nav>

      <!-- CTA buttons -->
      <div class="hidden md:flex items-center gap-3">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          @click="navigateTo('login')"
        >
          Sign in
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-brand hover:brightness-110 transition-all duration-200"
          @click="navigateTo('register')"
        >
          Get started free
        </button>
      </div>

      <!-- Mobile hamburger -->
      <button
        type="button"
        class="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10"
        @click="menuOpen = !menuOpen"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div
        v-if="menuOpen"
        class="md:hidden border-t border-white/[0.06] bg-surface-900/95 backdrop-blur-xl px-6 py-4 space-y-3"
      >
        <button
          type="button"
          class="block w-full text-left py-2 text-sm text-white/70 hover:text-white"
          @click="navigateTo('login')"
        >
          Sign in
        </button>
        <button
          type="button"
          class="block w-full text-left py-2 text-sm text-white/70 hover:text-white"
          @click="navigateTo('register')"
        >
          Create account
        </button>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
