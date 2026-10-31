<script setup>
import { computed, useId } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
  inputmode: { type: String, default: undefined },
  maxlength: { type: Number, default: undefined },
});
const model = defineModel({ type: String, default: '' });

const id = useId();
const errorId = computed(() => `${id}-error`);
const hintId = computed(() => `${id}-hint`);
const describedBy = computed(() => [props.error && errorId.value, !props.error && props.hint && hintId.value].filter(Boolean).join(' ') || undefined);
</script>

<template>
  <div class="field" :class="{ 'field--invalid': error }">
    <label :for="id">
      {{ label }}<span v-if="required" class="required" aria-hidden="true"> *</span>
    </label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :maxlength="maxlength"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
    />
    <p v-if="hint && !error" :id="hintId" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="field__error">{{ error }}</p>
  </div>
</template>
