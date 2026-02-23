<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import AppNavbar from "@/components/layout/AppNavbar.vue";
import { useGsap } from "@/composables/useGsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const { scrollReveal } = useGsap();

const features = [
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "ATS Score Analysis",
    desc: "Get an instant 0–100 ATS compatibility score with detailed breakdowns across formatting, keywords, experience, and education.",
  },
  {
    icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
    title: "Bullet Point Rewrites",
    desc: "See AI-powered before/after rewrites of your resume bullets. Copy the improved versions instantly.",
  },
  {
    icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    title: "Project Suggestions",
    desc: "Get personalized project ideas with tech stack recommendations to fill gaps in your portfolio.",
  },
  {
    icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
    title: "Portfolio Critique",
    desc: "Submit your portfolio URL and receive structured feedback on design, content, and technical depth.",
  },
  {
    icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Interview Prep",
    desc: "AI predicts the most likely interview questions for your target role and provides tailored answer tips.",
  },
  {
    icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
    title: "Export & Download",
    desc: "Download your full improvement report as a PDF to share with mentors or apply your changes.",
  },
];

const stats = [
  { value: "94%", label: "User satisfaction" },
  { value: "3×", label: "More interviews" },
  { value: "12s", label: "Analysis time" },
  { value: "50k+", label: "Resumes analyzed" },
];

onMounted(() => {
  // Hero entrance
  gsap.from("#hero-badge", {
    opacity: 0,
    y: -16,
    duration: 0.5,
    ease: "power2.out",
    delay: 0.1,
  });
  gsap.from("#hero-headline", {
    opacity: 0,
    y: 24,
    duration: 0.7,
    ease: "power2.out",
    delay: 0.25,
  });
  gsap.from("#hero-sub", {
    opacity: 0,
    y: 16,
    duration: 0.6,
    ease: "power2.out",
    delay: 0.45,
  });
  gsap.from("#hero-ctas", {
    opacity: 0,
    y: 16,
    duration: 0.5,
    ease: "power2.out",
    delay: 0.6,
  });

  // Feature cards – scroll triggered stagger
  scrollReveal(".feature-card", "#features");

  // Stats
  scrollReveal(".stat-item", "#stats");
});
</script>

<template>
  <div class="min-h-screen bg-surface-900 overflow-x-hidden">
    <AppNavbar />

    <!-- Hero -->
    <section
      id="hero"
      class="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16"
    >
      <!-- Gradient mesh background -->
      <div class="pointer-events-none absolute inset-0 bg-gradient-mesh" />
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(96,87,246,0.12)_0%,_transparent_70%)]"
      />

      <!-- Floating orbs -->
      <div
        class="pointer-events-none absolute top-32 left-[10%] h-64 w-64 rounded-full bg-brand-600/10 blur-3xl animate-float"
      />
      <div
        class="pointer-events-none absolute bottom-32 right-[10%] h-64 w-64 rounded-full bg-purple-600/10 blur-3xl animate-float"
        style="animation-delay: -3s"
      />

      <div class="relative z-10 mx-auto max-w-4xl text-center">
        <!-- Badge -->
        <div
          id="hero-badge"
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-8"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
          Powered by advanced AI models
        </div>

        <!-- Headline -->
        <h1
          id="hero-headline"
          class="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white mb-6"
        >
          Land more interviews<br />
          <span class="gradient-text">with AI feedback</span>
        </h1>

        <!-- Sub-headline -->
        <p
          id="hero-sub"
          class="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Upload your resume and get an instant ATS score, bullet point
          rewrites, portfolio critique, and likely interview questions — in
          under 15 seconds.
        </p>

        <!-- CTAs -->
        <div
          id="hero-ctas"
          class="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            type="button"
            class="px-8 py-3.5 rounded-xl bg-gradient-brand text-white text-base font-semibold shadow-brand hover:brightness-110 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
            @click="router.push({ name: 'register' })"
          >
            Analyze my resume free →
          </button>
          <button
            type="button"
            class="px-8 py-3.5 rounded-xl border border-white/15 text-white text-base font-medium hover:bg-white/[0.05] hover:border-white/25 transition-all duration-200"
            @click="router.push({ name: 'login' })"
          >
            Sign in
          </button>
        </div>

        <!-- Floating resume mockup hint -->
        <p class="mt-10 text-sm text-white/30">
          No credit card required · Results in seconds · Privacy first
        </p>
      </div>
    </section>

    <!-- Stats bar -->
    <section
      id="stats"
      class="py-12 border-y border-white/[0.06] bg-surface-800/40"
    >
      <div class="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div v-for="s in stats" :key="s.label" class="stat-item text-center">
          <p class="text-3xl font-black text-white mb-1">{{ s.value }}</p>
          <p class="text-sm text-white/40">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-24 px-6" ref="featuresRef">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
            Everything you need to<br />
            <span class="gradient-text">get hired faster</span>
          </h2>
          <p class="text-white/50 max-w-xl mx-auto">
            A comprehensive AI-powered toolkit that goes beyond keyword
            matching.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="f in features"
            :key="f.title"
            class="feature-card glass-card-hover rounded-2xl p-6 space-y-4"
          >
            <div
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15"
            >
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
                  :d="f.icon"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-white mb-1.5">
                {{ f.title }}
              </h3>
              <p class="text-sm text-white/50 leading-relaxed">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 px-6">
      <div
        class="max-w-2xl mx-auto text-center glass-card rounded-3xl p-12 relative overflow-hidden"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-30"
        />
        <div class="relative z-10">
          <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to transform<br />your resume?
          </h2>
          <p class="text-white/50 mb-8">
            Join thousands of job seekers who landed their dream role.
          </p>
          <button
            type="button"
            class="px-8 py-3.5 rounded-xl bg-gradient-brand text-white text-base font-semibold shadow-brand hover:brightness-110 transition-all duration-200"
            @click="router.push({ name: 'register' })"
          >
            Get started for free →
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer
      class="py-8 px-6 border-t border-white/[0.06] text-center text-sm text-white/30"
    >
      © {{ new Date().getFullYear() }} ResumeAI. All rights reserved.
    </footer>
  </div>
</template>
