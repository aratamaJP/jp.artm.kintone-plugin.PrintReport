<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <header class="modal-header">
        <slot name="header">
          <!-- Default header content -->
        </slot>
      </header>
      <main class="modal-body">
        <slot name="body">
          <!-- Default body content -->
        </slot>
      </main>
      <footer class="modal-footer">
        <slot name="footer">
          <!-- Default footer content -->
        </slot>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ModalDialog',
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  min-width: 400px;
  max-width: 90%;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  font-size: 1.2em;
  font-weight: bold;
}

.modal-body {
  padding: 16px;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  text-align: right;
}
</style>
