<script setup>
import { onMounted } from 'vue';
import { useStudentStore } from '../stores/students';
import { useCourseStore } from '../stores/courses';
import { useEnrollmentStore } from '../stores/enrollments';
import EnrollmentForm from '../components/EnrollmentForm.vue';
import CourseRoster from '../components/CourseRoster.vue';
import StatePanel from '../components/StatePanel.vue';

const students = useStudentStore();
const courses = useCourseStore();
const enrollments = useEnrollmentStore();

// The student list here must be complete, so clear any search filter left over from the Students page.
async function load() {
  await Promise.all([students.fetchStudents(''), courses.fetchCourses()]);
  await enrollments.refreshRoster();
}
onMounted(load);
</script>

<template>
  <h1>Enrollments</h1>

  <StatePanel :loading="!students.loaded || !courses.loaded" :error="students.error || courses.error" @retry="load">
    <div class="layout">
      <section class="card" aria-labelledby="enroll-heading">
        <h2 id="enroll-heading">Enroll a student</h2>
        <EnrollmentForm />
      </section>

      <section class="card card--wide" aria-labelledby="roster-heading">
        <h2 id="roster-heading">Course roster</h2>
        <CourseRoster />
      </section>
    </div>
  </StatePanel>
</template>
