<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Delete' },
});
const emit = defineEmits(['confirm', 'cancel']);

const dialog = ref(null);

// Native <dialog> gives us focus trapping, Escape handling and a backdrop for free.
watch(
  () => props.open,
  async (isOpen) => {
    await nextTick();
    if (!dialog.value) return;
    if (isOpen && !dialog.value.open) dialog.value.showModal();
    if (!isOpen && dialog.value.open) dialog.value.close();
  },
  { immediate: true }
);

function onBackdropClick(event) {
  if (event.target === dialog.value) emit('cancel');
}
</script>

<template>
  <dialog ref="dialog" class="dialog" aria-labelledby="confirm-title" @cancel.prevent="emit('cancel')" @click="onBackdropClick">
    <form method="dialog" class="dialog__body" @submit.prevent="emit('confirm')">
      <h2 id="confirm-title">{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="dialog__actions">
        <button type="button" class="btn btn--secondary" autofocus @click="emit('cancel')">Cancel</button>
        <button type="submit" class="btn btn--danger">{{ confirmText }}</button>
      </div>
    </form>
  </dialog>
</template>
