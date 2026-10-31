import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '../api/client';
import { useNotificationStore } from './notifications';
import { useEnrollmentStore } from './enrollments';

export const useCourseStore = defineStore('courses', () => {
  const notify = useNotificationStore();
  const courses = ref([]);
  const loading = ref(false);
  const error = ref('');
  const loaded = ref(false);

  async function fetchCourses() {
    loading.value = true;
    error.value = '';
    try {
      courses.value = await api.listCourses();
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
      loaded.value = true;
    }
  }

  // Throws ApiError so the form can show field-level messages.
  async function addCourse(payload) {
    const { course } = await api.addCourse(payload);
    notify.success(`Course "${course.courseId}" added successfully.`);
    await fetchCourses();
    return course;
  }

  async function deleteCourse(course) {
    try {
      const { removedEnrollments } = await api.deleteCourse(course.courseId);
      const extra = removedEnrollments ? ` ${removedEnrollments} enrollment(s) removed.` : '';
      notify.success(`Course "${course.courseId}" deleted.${extra}`);
      useEnrollmentStore().onCourseDeleted(course.courseId);
    } catch (e) {
      notify.error(e.status === 404 ? 'Course not found or already deleted.' : e.message);
    }
    await fetchCourses();
  }

  return { courses, loading, error, loaded, fetchCourses, addCourse, deleteCourse };
});
