import { onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsap() {
  const cleanups: (() => void)[] = [];

  onUnmounted(() => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  });

  /**
   * Stagger-reveal a list of elements when they enter the viewport.
   */
  function staggerReveal(
    targets: string | Element | Element[],
    options: gsap.TweenVars & { stagger?: number } = {},
  ) {
    const { stagger = 0.1, ...rest } = options;
    const tween = gsap.from(targets, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
      stagger,
      ...rest,
    });
    cleanups.push(() => tween.kill());
    return tween;
  }

  /**
   * Animate a numeric counter from 0 to `end`.
   */
  function animateCounter(
    el: HTMLElement,
    end: number,
    duration = 1.5,
    suffix = "",
    prefix = "",
  ) {
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: end,
      duration,
      ease: "power2.out",
      onUpdate() {
        el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
      },
    });
    cleanups.push(() => tween.kill());
    return tween;
  }

  /**
   * Animate a SVG circle stroke for a score ring.
   */
  function animateScoreRing(
    el: SVGCircleElement,
    score: number, // 0–100
    circumference: number,
    duration = 1.5,
  ) {
    const offset = circumference * (1 - score / 100);
    const tween = gsap.to(el, {
      strokeDashoffset: offset,
      duration,
      ease: "power2.out",
    });
    cleanups.push(() => tween.kill());
    return tween;
  }

  /**
   * Page enter animation.
   */
  function pageEnter(el: Element, done: () => void) {
    gsap.from(el, {
      opacity: 0,
      y: 16,
      duration: 0.4,
      ease: "power2.out",
      onComplete: done,
    });
  }

  /**
   * Page leave animation.
   */
  function pageLeave(el: Element, done: () => void) {
    gsap.to(el, {
      opacity: 0,
      y: -16,
      duration: 0.25,
      ease: "power2.in",
      onComplete: done,
    });
  }

  /**
   * Animate a progress bar width.
   */
  function animateProgress(el: HTMLElement, percent: number, duration = 0.5) {
    const tween = gsap.to(el, {
      width: `${percent}%`,
      duration,
      ease: "power1.out",
    });
    cleanups.push(() => tween.kill());
    return tween;
  }

  /**
   * Hover lift micro-interaction — attach to a container element.
   */
  function hoverLift(el: HTMLElement, amount = -6) {
    const onEnter = () =>
      gsap.to(el, { y: amount, duration: 0.2, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(el, { y: 0, duration: 0.2, ease: "power2.out" });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    });
  }

  /**
   * Scroll-triggered stagger reveal on an element list.
   */
  function scrollReveal(
    targets: string | Element | Element[],
    trigger?: string | Element,
    options: gsap.TweenVars = {},
  ) {
    const tween = gsap.from(targets, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: trigger ?? targets,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      ...options,
    });
    cleanups.push(() => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tween.kill();
    });
    return tween;
  }

  return {
    staggerReveal,
    animateCounter,
    animateScoreRing,
    pageEnter,
    pageLeave,
    animateProgress,
    hoverLift,
    scrollReveal,
    gsap,
  };
}
