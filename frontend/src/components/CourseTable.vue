<script setup>
import { ref } from 'vue';
import { useCourseStore } from '../stores/courses';
import ConfirmDialog from './ConfirmDialog.vue';

const store = useCourseStore();
const pending = ref(null);

async function confirmDelete() {
  const course = pending.value;
  pending.value = null;
  await store.deleteCourse(course);
}
</script>

<template>
  <div class="table-wrap">
    <table class="table">
      <caption class="sr-only">Courses</caption>
      <thead>
        <tr>
          <th scope="col">Course ID</th>
          <th scope="col">Name</th>
          <th scope="col">Enrolled</th>
          <th scope="col"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in store.courses" :key="c._id">
          <td data-label="Course ID">{{ c.courseId }}</td>
          <td data-label="Name">{{ c.name }}</td>
          <td data-label="Enrolled">{{ c.enrollmentCount }}</td>
          <td class="table__actions">
            <button type="button" class="btn btn--danger btn--small" :aria-label="`Delete course ${c.courseId}`" @click="pending = c">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ConfirmDialog
    :open="!!pending"
    title="Delete course?"
    :message="pending ? `Delete ${pending.courseId} – ${pending.name}? ${pending.enrollmentCount} enrollment(s) in this course will also be removed.` : ''"
    @confirm="confirmDelete"
    @cancel="pending = null"
  />
</template>
