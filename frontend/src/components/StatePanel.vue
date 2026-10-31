<script setup>
// Shows a loading / error / empty message, or the default slot when there is data.
defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  empty: { type: Boolean, default: false },
  emptyTitle: { type: String, default: 'Nothing here yet' },
  emptyText: { type: String, default: '' },
});
defineEmits(['retry']);
</script>

<template>
  <div v-if="loading" class="state" role="status">
    <span class="spinner" aria-hidden="true"></span>
    <span>Loading…</span>
  </div>
  <div v-else-if="error" class="state state--error" role="alert">
    <p>{{ error }}</p>
    <button type="button" class="btn btn--secondary" @click="$emit('retry')">Try again</button>
  </div>
  <div v-else-if="empty" class="state state--empty">
    <p class="state__title">{{ emptyTitle }}</p>
    <p v-if="emptyText">{{ emptyText }}</p>
  </div>
  <slot v-else />
</template>
