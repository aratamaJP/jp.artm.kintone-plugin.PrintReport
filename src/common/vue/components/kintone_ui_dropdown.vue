<template>
  <div ref="dropdownRef" class="kintoneplugin-dropdown-outer">
    <div class="kintoneplugin-dropdown" @click="toggleDropdown">
      <div class="kintoneplugin-dropdown-selected">
        <span class="kintoneplugin-dropdown-selected-name">
          {{ selectedLabel }}
        </span>
      </div>
    </div>
    <div v-show="isOpen" class="kintoneplugin-dropdown-list">
      <div
        v-for="option in normalizedOptions"
        :key="option.value"
        class="kintoneplugin-dropdown-list-item"
        :class="{
          'kintoneplugin-dropdown-list-item-selected': option.value === value,
        }"
        @click="selectOption(option.value)"
      >
        <span class="kintoneplugin-dropdown-list-item-name">
          {{ option.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";

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
    const isOpen = ref(false);
    const dropdownRef = ref<HTMLElement | null>(null);

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

    const selectedLabel = computed(() => {
      const found = normalizedOptions.value.find(
        (opt) => opt.value === String(props.value)
      );
      return found ? found.label : "";
    });

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const closeDropdown = () => {
      isOpen.value = false;
    };

    const selectOption = (selectedValue: string) => {
      emit("callback-on-change", selectedValue);
      closeDropdown();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.value &&
        !dropdownRef.value.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      isOpen,
      dropdownRef,
      normalizedOptions,
      selectedLabel,
      toggleDropdown,
      selectOption,
    };
  },
});
</script>

<style scoped>
.kintoneplugin-dropdown-outer {
  position: relative;
  display: inline-block;
}

.kintoneplugin-dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  margin-top: 4px;
}
</style>
