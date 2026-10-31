<script setup>
import { ref } from 'vue';
import { useStudentStore } from '../stores/students';
import ConfirmDialog from './ConfirmDialog.vue';

const store = useStudentStore();
const pending = ref(null);

async function confirmDelete() {
  const student = pending.value;
  pending.value = null;
  await store.deleteStudent(student);
}
</script>

<template>
  <div class="table-wrap">
    <table class="table">
      <caption class="sr-only">Students</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Student ID</th>
          <th scope="col">Phone</th>
          <th scope="col">ZIP</th>
          <th scope="col"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in store.students" :key="s._id">
          <td data-label="Name">{{ s.name }}</td>
          <td data-label="Student ID">{{ s.studentId }}</td>
          <td data-label="Phone">{{ s.phone }}</td>
          <td data-label="ZIP">{{ s.zip }}</td>
          <td class="table__actions">
            <button type="button" class="btn btn--danger btn--small" :aria-label="`Delete student ${s.name}`" @click="pending = s">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ConfirmDialog
    :open="!!pending"
    title="Delete student?"
    :message="pending ? `Delete ${pending.name} (ID ${pending.studentId})? Their course enrollments will also be removed.` : ''"
    @confirm="confirmDelete"
    @cancel="pending = null"
  />
</template>
