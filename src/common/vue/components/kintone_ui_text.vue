<template>
  <div class="kintoneplugin-input-outer">
    <input
      :id="id"
      class="kintoneplugin-input-text"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      @input="onInput"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "KintoneUiText",
  props: {
    id: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["callback-on-change"],
  setup(props, { emit }) {
    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit("callback-on-change", target.value);
    };

    return {
      onInput,
    };
  },
});
</script>

<style scoped>
.kintoneplugin-input-outer {
  display: inline-block;
}
</style>
