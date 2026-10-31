import { ref } from 'vue';
import { defineStore } from 'pinia';

// Global toast messages shared by every view.
export const useNotificationStore = defineStore('notifications', () => {
  const toasts = ref([]);
  let nextId = 1;

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function push(type, message, timeout = 5000) {
    const id = nextId++;
    toasts.value.push({ id, type, message });
    if (timeout) setTimeout(() => dismiss(id), timeout);
  }

  const success = (message) => push('success', message);
  const error = (message) => push('error', message, 8000);

  return { toasts, push, dismiss, success, error };
});
