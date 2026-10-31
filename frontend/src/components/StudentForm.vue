<script setup>
import { reactive, ref } from 'vue';
import { useStudentStore } from '../stores/students';
import BaseInput from './BaseInput.vue';

const store = useStudentStore();
const blank = () => ({ name: '', studentId: '', phone: '', zip: '' });
const form = reactive(blank());
const errors = reactive({});
const formError = ref('');
const saving = ref(false);

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  const v = Object.fromEntries(Object.entries(form).map(([k, val]) => [k, val.trim()]));
  if (!v.name) errors.name = 'Name is required.';
  if (!v.studentId) errors.studentId = 'Student ID is required.';
  else if (!/^[A-Za-z0-9-]+$/.test(v.studentId)) errors.studentId = 'Use only letters, numbers, and hyphens.';
  if (!v.phone) errors.phone = 'Phone number is required.';
  else if (!/^[\d\s()+.-]{7,20}$/.test(v.phone)) errors.phone = 'Enter a valid phone number, e.g. 555-1234.';
  if (!v.zip) errors.zip = 'ZIP code is required.';
  else if (!/^\d{5}(-\d{4})?$/.test(v.zip)) errors.zip = 'Enter a 5-digit ZIP code, e.g. 77001.';
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
    await store.addStudent({
      name: form.name.trim(),
      studentId: form.studentId.trim(),
      phone: form.phone.trim(),
      zip: form.zip.trim(),
    });
    Object.assign(form, blank());
    Object.keys(errors).forEach((k) => delete errors[k]);
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
    <BaseInput v-model="form.name" label="Name" required autocomplete="name" :error="errors.name" />
    <BaseInput v-model="form.studentId" label="Student ID" required :error="errors.studentId" hint="Must be unique." />
    <BaseInput v-model="form.phone" label="Phone" type="tel" required autocomplete="tel" :error="errors.phone" placeholder="555-1234" />
    <BaseInput v-model="form.zip" label="ZIP code" required inputmode="numeric" autocomplete="postal-code" :error="errors.zip" placeholder="77001" />
    <div class="form-grid__actions">
      <button type="submit" class="btn" :disabled="saving">{{ saving ? 'Adding…' : 'Add student' }}</button>
    </div>
  </form>
</template>
