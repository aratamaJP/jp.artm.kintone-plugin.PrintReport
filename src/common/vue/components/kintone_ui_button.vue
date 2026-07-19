<template>
  <button :class="buttonClass" @click="onClick">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "KintoneUiButton",
  props: {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "button", // 'submit' or 'button'
    },
  },
  emits: ["callback-on-click"],
  setup(props, { emit }) {
    const buttonClass = computed(() => {
      return props.type === "submit"
        ? "like_default_button"
        : "like_not_default_button";
    });

    const onClick = (event: MouseEvent) => {
      emit("callback-on-click", event);
    };

    return {
      buttonClass,
      onClick,
    };
  },
});
</script>

<style scoped>
@import "@/common/css/like_default_button.css";
</style>
