<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useGsap } from "@/composables/useGsap";

interface Props {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1.5,
  suffix: "",
  prefix: "",
  decimals: 0,
});

const el = ref<HTMLSpanElement | null>(null);
const { gsap } = useGsap();
const obj = { val: 0 };

function run(to: number) {
  gsap.to(obj, {
    val: to,
    duration: props.duration,
    ease: "power2.out",
    onUpdate() {
      if (el.value) {
        el.value.textContent = `${props.prefix}${obj.val.toFixed(
          props.decimals
        )}${props.suffix}`;
      }
    },
  });
}

onMounted(() => run(props.value));
watch(
  () => props.value,
  (v) => run(v)
);
</script>

<template>
  <span ref="el">{{ prefix }}{{ value.toFixed(decimals) }}{{ suffix }}</span>
</template>
