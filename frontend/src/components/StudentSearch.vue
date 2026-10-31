<script setup>
import { ref, watch } from 'vue';
import { useStudentStore } from '../stores/students';

const store = useStudentStore();
const term = ref(store.searchTerm);

watch(() => store.searchTerm, (v) => (term.value = v));

const search = () => store.fetchStudents(term.value);
function clear() {
  term.value = '';
  store.fetchStudents('');
}
</script>

<template>
  <form class="search" role="search" @submit.prevent="search">
    <div class="field search__field">
      <label for="student-search">Search by name or student ID</label>
      <input id="student-search" v-model="term" type="search" placeholder="e.g. John" autocomplete="off" />
    </div>
    <div class="search__actions">
      <button type="submit" class="btn">Search</button>
      <button v-if="store.isFiltered || term" type="button" class="btn btn--secondary" @click="clear">Clear</button>
    </div>
  </form>
</template>
