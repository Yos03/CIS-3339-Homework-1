<script setup>
import { useNotificationStore } from '../stores/notifications';

const notifications = useNotificationStore();
</script>

<template>
  <div class="toasts" aria-live="polite" aria-atomic="false">
    <div
      v-for="t in notifications.toasts"
      :key="t.id"
      class="toast"
      :class="`toast--${t.type}`"
      :role="t.type === 'error' ? 'alert' : 'status'"
    >
      <span>{{ t.message }}</span>
      <button type="button" class="toast__close" aria-label="Dismiss message" @click="notifications.dismiss(t.id)">×</button>
    </div>
  </div>
</template>
