<script setup>
import { onMounted } from 'vue';
import { useCourseStore } from '../stores/courses';
import CourseForm from '../components/CourseForm.vue';
import CourseTable from '../components/CourseTable.vue';
import StatePanel from '../components/StatePanel.vue';

const store = useCourseStore();
onMounted(() => store.fetchCourses());
</script>

<template>
  <h1>Courses</h1>

  <div class="layout">
    <section class="card" aria-labelledby="add-course-heading">
      <h2 id="add-course-heading">Add a course</h2>
      <CourseForm />
    </section>

    <section class="card card--wide" aria-labelledby="courses-heading">
      <h2 id="courses-heading">All courses</h2>
      <StatePanel
        :loading="store.loading && !store.loaded"
        :error="store.error"
        :empty="store.loaded && !store.courses.length"
        empty-title="No courses yet"
        empty-text="Add your first course using the form."
        @retry="store.fetchCourses()"
      >
        <CourseTable />
      </StatePanel>
    </section>
  </div>
</template>
