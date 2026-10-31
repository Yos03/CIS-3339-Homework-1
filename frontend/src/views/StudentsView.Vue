<script setup>
import { computed, onMounted } from 'vue';
import { useStudentStore } from '../stores/students.js';
import StudentForm from '../components/StudentForm.vue';
import StudentSearch from '../components/StudentSearch.vue';
import StudentTable from '../components/StudentTable.vue';
import StatePanel from '../components/StatePanel.vue';

const store = useStudentStore();
onMounted(() => store.fetchStudents());

const emptyTitle = computed(() => (store.isFiltered ? 'No matching students' : 'No students yet'));
const emptyText = computed(() =>
  store.isFiltered ? `No student matches "${store.searchTerm}". Try a different name or ID.` : 'Add your first student using the form.'
);
const resultLabel = computed(() => {
  if (!store.loaded || store.loading || store.error) return '';
  const n = store.students.length;
  return store.isFiltered ? `${n} result${n === 1 ? '' : 's'} for "${store.searchTerm}"` : `${n} student${n === 1 ? '' : 's'}`;
});
</script>

<template>
  <h1>Students</h1>

  <div class="layout">
    <section class="card" aria-labelledby="add-student-heading">
      <h2 id="add-student-heading">Add a student</h2>
      <StudentForm />
    </section>

    <section class="card card--wide" aria-labelledby="students-heading">
      <h2 id="students-heading">Find students</h2>
      <StudentSearch />
      <p class="muted result-count" role="status">{{ resultLabel }}</p>
      <StatePanel
        :loading="store.loading && !store.loaded"
        :error="store.error"
        :empty="store.loaded && !store.students.length"
        :empty-title="emptyTitle"
        :empty-text="emptyText"
        @retry="store.fetchStudents()"
      >
        <StudentTable />
      </StatePanel>
    </section>
  </div>
</template>
