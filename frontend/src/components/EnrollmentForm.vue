<script setup>
import { computed, ref } from 'vue';
import { useStudentStore } from '../stores/students';
import { useCourseStore } from '../stores/courses';
import { useEnrollmentStore } from '../stores/enrollments';
import BaseSelect from './BaseSelect.vue';

const students = useStudentStore();
const courses = useCourseStore();
const enrollments = useEnrollmentStore();

const studentId = ref('');
const courseId = ref('');
const errors = ref({});
const formError = ref('');
const saving = ref(false);

// Options come from the backend data held in the Pinia stores.
const studentOptions = computed(() => students.students.map((s) => ({ value: s.studentId, label: `${s.name} (${s.studentId})` })));
const courseOptions = computed(() => courses.courses.map((c) => ({ value: c.courseId, label: `${c.courseId} – ${c.name}` })));
const canSelect = computed(() => studentOptions.value.length > 0 && courseOptions.value.length > 0);

async function submit() {
  formError.value = '';
  errors.value = {};
  if (!studentId.value) errors.value.studentId = 'Select a student.';
  if (!courseId.value) errors.value.courseId = 'Select a course.';
  if (Object.keys(errors.value).length) {
    formError.value = 'Please select both a student and a course.';
    return;
  }
  saving.value = true;
  try {
    await enrollments.enroll(studentId.value, courseId.value);
    await courses.fetchCourses(); // refresh enrollment counts
    studentId.value = '';
    courseId.value = '';
  } catch (e) {
    formError.value = e.message;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <p v-if="!canSelect" class="alert alert--info" role="status">
    You need at least one student and one course before you can enroll.
    <RouterLink v-if="!studentOptions.length" to="/">Add a student</RouterLink>
    <template v-if="!studentOptions.length && !courseOptions.length"> or </template>
    <RouterLink v-if="!courseOptions.length" to="/courses">add a course</RouterLink>.
  </p>
  <form class="form-grid" novalidate @submit.prevent="submit">
    <p v-if="formError" class="alert alert--error" role="alert">{{ formError }}</p>
    <BaseSelect v-model="studentId" label="Student" required placeholder="Select a student" :options="studentOptions" :error="errors.studentId" :disabled="saving || !studentOptions.length" />
    <BaseSelect v-model="courseId" label="Course" required placeholder="Select a course" :options="courseOptions" :error="errors.courseId" :disabled="saving || !courseOptions.length" />
    <div class="form-grid__actions">
      <button type="submit" class="btn" :disabled="saving || !canSelect">{{ saving ? 'Enrolling…' : 'Enroll student' }}</button>
    </div>
  </form>
</template>
