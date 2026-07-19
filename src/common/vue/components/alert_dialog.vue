<template>
  <ModalDialog>
    <template #header>
      {{ title }}
    </template>
    <template #body>
      <p>{{ message }}</p>
    </template>
    <template #footer>
      <button class="kintoneplugin-button-dialog-ok" @click="onClose">
        {{ okText }}
      </button>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModalDialog from './modal_dialog.vue';

export default defineComponent({
  name: 'AlertDialog',
  components: {
    ModalDialog,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    okText: {
      type: String,
      default: 'OK',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const onClose = () => {
      emit('close');
    };

    return {
      onClose,
    };
  },
});
</script>

<style scoped>
.kintoneplugin-button-dialog-ok {
  border: 1px solid #e3e7e8;
  min-width: 150px;
  height: 48px;
  margin: 8px 0;
  cursor: pointer;
  background-color: #3498db;
  box-shadow: 1px 1px 1px #8ccbee inset;
  color: #fff;
}

.kintoneplugin-button-dialog-ok:hover {
  opacity: 0.7;
}

p {
  white-space: pre-wrap;
}
</style>
