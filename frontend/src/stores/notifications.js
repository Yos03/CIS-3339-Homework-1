import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '../api/client';
import { useNotificationStore } from './notifications';

export const useEnrollmentStore = defineStore('enrollments', () => {
  const notify = useNotificationStore();
  const selectedCourseId = ref('');
  const roster = ref([]);
  const rosterCourse = ref(null);
  const loadingRoster = ref(false);
  const rosterError = ref('');
  let latestRequest = 0;

  function clearRoster() {
    latestRequest++;
    roster.value = [];
    rosterCourse.value = null;
    rosterError.value = '';
    loadingRoster.value = false;
  }

  async function loadRoster(courseId = selectedCourseId.value) {
    selectedCourseId.value = courseId;
    if (!courseId) return clearRoster();
    const requestId = ++latestRequest;
    loadingRoster.value = true;
    rosterError.value = '';
    try {
      const data = await api.getRoster(courseId);
      if (requestId !== latestRequest) return;
      roster.value = data.students;
      rosterCourse.value = data.course;
    } catch (e) {
      if (requestId !== latestRequest) return;
      roster.value = [];
      rosterCourse.value = null;
      if (e.status === 404) {
        // The selected course was deleted elsewhere.
        selectedCourseId.value = '';
      } else {
        rosterError.value = e.message;
      }
    } finally {
      if (requestId === latestRequest) loadingRoster.value = false;
    }
  }

  // Re-fetch the roster after students/courses are deleted so it never shows stale data.
  const refreshRoster = () => (selectedCourseId.value ? loadRoster() : Promise.resolve());

  // When a course is deleted, drop it from the roster view instead of fetching a missing course.
  function onCourseDeleted(courseId) {
    if (selectedCourseId.value.toLowerCase() === courseId.toLowerCase()) {
      selectedCourseId.value = '';
      clearRoster();
    }
  }

  // Throws ApiError so the form can show the message.
  async function enroll(studentId, courseId) {
    const { message } = await api.enroll(studentId, courseId);
    notify.success(message);
    await loadRoster(courseId);
  }

  async function removeEnrollment(entry) {
    try {
      await api.removeEnrollment(entry.enrollmentId);
      notify.success(`${entry.name} removed from ${rosterCourse.value?.courseId ?? 'the course'}.`);
    } catch (e) {
      notify.error(e.message);
    }
    await loadRoster();
  }

  return {
    selectedCourseId,
    roster,
    rosterCourse,
    loadingRoster,
    rosterError,
    loadRoster,
    refreshRoster,
    onCourseDeleted,
    clearRoster,
    enroll,
    removeEnrollment,
  };
});
