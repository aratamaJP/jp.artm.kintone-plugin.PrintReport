<template>
  <div class="kintoneplugin-dropdown-outer">
    <select
      class="kintone-select"
      :value="value"
      @change="handleChange"
    >
      <option
        v-for="option in normalizedOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import "../../css/like_default_button.css";

interface DropdownOption {
  value: string;
  label: string;
}

export default defineComponent({
  name: "KintoneUiDropdown",
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["callback-on-change"],
  setup(props, { emit }) {
    // Normalize options supporting both strings and custom objects
    const normalizedOptions = computed<DropdownOption[]>(() => {
      return props.options.map((option: any) => {
        if (typeof option === "string") {
          return { value: option, label: option };
        }
        if (option && typeof option === "object") {
          const val = option.value !== undefined ? option.value : "";
          const lbl = option.label || option.name || val;
          return { value: String(val), label: String(lbl) };
        }
        return { value: "", label: "" };
      });
    });

    const handleChange = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      emit("callback-on-change", target.value);
    };

    return {
      normalizedOptions,
      handleChange,
    };
  },
});
</script>

<style scoped>
.kintoneplugin-dropdown-outer {
  display: inline-block;
  position: relative;
}
</style>
