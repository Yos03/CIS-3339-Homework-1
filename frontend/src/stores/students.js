import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { api } from '../api/client';
import { useNotificationStore } from './notifications';
import { useEnrollmentStore } from './enrollments';

export const useStudentStore = defineStore('students', () => {
  const notify = useNotificationStore();
  const students = ref([]);
  const searchTerm = ref('');
  const loading = ref(false);
  const error = ref('');
  const loaded = ref(false);
  let latestRequest = 0;

  const isFiltered = computed(() => searchTerm.value.trim() !== '');

  async function fetchStudents(term = searchTerm.value) {
    searchTerm.value = term;
    const requestId = ++latestRequest;
    loading.value = true;
    error.value = '';
    try {
      const result = await api.listStudents(term.trim());
      if (requestId === latestRequest) students.value = result; // ignore out-of-order responses
    } catch (e) {
      if (requestId === latestRequest) error.value = e.message;
    } finally {
      if (requestId === latestRequest) {
        loading.value = false;
        loaded.value = true;
      }
    }
  }

  // Throws ApiError so the form can show field-level messages.
  async function addStudent(payload) {
    const { student } = await api.addStudent(payload);
    notify.success(`Student "${student.name}" added successfully.`);
    await fetchStudents();
    return student;
  }

  async function deleteStudent(student) {
    try {
      const { removedEnrollments } = await api.deleteStudent(student.studentId);
      const extra = removedEnrollments ? ` ${removedEnrollments} enrollment(s) removed.` : '';
      notify.success(`Student "${student.name}" deleted.${extra}`);
      useEnrollmentStore().refreshRoster();
    } catch (e) {
      notify.error(e.status === 404 ? 'Student not found or already deleted.' : e.message);
    }
    await fetchStudents();
  }

  return { students, searchTerm, loading, error, loaded, isFiltered, fetchStudents, addStudent, deleteStudent };
});
