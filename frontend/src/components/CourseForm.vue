<script setup>
import { reactive, ref } from 'vue';
import { useCourseStore } from '../stores/courses';
import BaseInput from './BaseInput.vue';

const store = useCourseStore();
const form = reactive({ courseId: '', name: '' });
const errors = reactive({});
const formError = ref('');
const saving = ref(false);

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!form.courseId.trim()) errors.courseId = 'Course ID is required.';
  if (!form.name.trim()) errors.name = 'Course name is required.';
  return Object.keys(errors).length === 0;
}

async function submit() {
  formError.value = '';
  if (!validate()) {
    formError.value = 'Please fix the highlighted fields.';
    return;
  }
  saving.value = true;
  try {
    await store.addCourse({ courseId: form.courseId.trim(), name: form.name.trim() });
    form.courseId = '';
    form.name = '';
  } catch (e) {
    Object.assign(errors, e.fields);
    formError.value = e.message;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form class="form-grid" novalidate @submit.prevent="submit">
    <p v-if="formError" class="alert alert--error" role="alert">{{ formError }}</p>
    <BaseInput v-model="form.courseId" label="Course ID" required placeholder="CIS 3339" :error="errors.courseId" hint="Must be unique." />
    <BaseInput v-model="form.name" label="Course name" required placeholder="Enterprise Applications Development" :error="errors.name" />
    <div class="form-grid__actions">
      <button type="submit" class="btn" :disabled="saving">{{ saving ? 'Adding…' : 'Add course' }}</button>
    </div>
  </form>
</template>
