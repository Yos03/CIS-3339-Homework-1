<script setup>
import { computed, useId } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  // [{ value, label }]
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Select…' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
const model = defineModel({ type: String, default: '' });

const id = useId();
const errorId = computed(() => `${id}-error`);
</script>

<template>
  <div class="field" :class="{ 'field--invalid': error }">
    <label :for="id">
      {{ label }}<span v-if="required" class="required" aria-hidden="true"> *</span>
    </label>
    <select
      :id="id"
      v-model="model"
      :required="required"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <p v-if="error" :id="errorId" class="field__error">{{ error }}</p>
  </div>
</template>
