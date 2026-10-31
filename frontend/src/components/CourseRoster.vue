<script setup>
import { computed } from 'vue';
import { useCourseStore } from '../stores/courses';
import { useEnrollmentStore } from '../stores/enrollments';
import BaseSelect from './BaseSelect.vue';
import StatePanel from './StatePanel.vue';

const courses = useCourseStore();
const enrollments = useEnrollmentStore();

const courseOptions = computed(() => courses.courses.map((c) => ({ value: c.courseId, label: `${c.courseId} – ${c.name}` })));
const selected = computed({
  get: () => enrollments.selectedCourseId,
  set: (id) => enrollments.loadRoster(id),
});
const heading = computed(() =>
  enrollments.rosterCourse ? `Students enrolled in ${enrollments.rosterCourse.courseId}` : 'Enrolled students'
);
</script>

<template>
  <BaseSelect v-model="selected" label="Course" placeholder="Select a course to view its roster" :options="courseOptions" :disabled="!courseOptions.length" />

  <div class="roster" aria-live="polite">
    <p v-if="!selected" class="muted">Choose a course to list the students enrolled in it.</p>
    <template v-else>
      <h3>{{ heading }}</h3>
      <StatePanel
        :loading="enrollments.loadingRoster"
        :error="enrollments.rosterError"
        :empty="!enrollments.roster.length"
        empty-title="No students enrolled"
        empty-text="Enroll a student using the form above."
        @retry="enrollments.loadRoster()"
      >
        <div class="table-wrap">
          <table class="table">
            <caption class="sr-only">{{ heading }}</caption>
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
              <tr v-for="s in enrollments.roster" :key="s.enrollmentId">
                <td data-label="Name">{{ s.name }}</td>
                <td data-label="Student ID">{{ s.studentId }}</td>
                <td data-label="Phone">{{ s.phone }}</td>
                <td data-label="ZIP">{{ s.zip }}</td>
                <td class="table__actions">
                  <button type="button" class="btn btn--secondary btn--small" :aria-label="`Remove ${s.name} from this course`" @click="enrollments.removeEnrollment(s)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </StatePanel>
    </template>
  </div>
</template>
