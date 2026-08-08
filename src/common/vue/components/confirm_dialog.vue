<template>
  <ModalDialog>
    <template #header>
      {{ title }}
    </template>
    <template #body>
      <p>{{ message }}</p>
    </template>
    <template #footer>
      <button class="kintoneplugin-button-dialog-cancel" @click="onCancel">
        {{ cancelText }}
      </button>
      <button class="kintoneplugin-button-dialog-ok" @click="onOk">
        {{ okText }}
      </button>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModalDialog from './modal_dialog.vue';

export default defineComponent({
  name: 'ConfirmDialog',
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
    cancelText: {
      type: String,
      default: 'Cancel',
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const onOk = () => {
      emit('ok');
    };
    const onCancel = () => {
      emit('cancel');
    };

    return {
      onOk,
      onCancel,
    };
  },
});
</script>

<style scoped>
.kintoneplugin-button-dialog-cancel,
.kintoneplugin-button-dialog-ok {
  border: 1px solid #e3e7e8;
  min-width: 150px;
  height: 48px;
  margin: 8px 0 8px 8px;
  cursor: pointer;
}

.kintoneplugin-button-dialog-ok {
  background-color: #3498db;
  box-shadow: 1px 1px 1px #8ccbee inset;
  color: #fff;
}

.kintoneplugin-button-dialog-cancel {
  background-color: #f7f9fa;
  box-shadow: 1px 1px 1px #fff inset;
  color: #3498db;
}

.kintoneplugin-button-dialog-cancel:hover,
.kintoneplugin-button-dialog-ok:hover {
  opacity: 0.7;
}

p {
  white-space: pre-wrap;
}
</style>
