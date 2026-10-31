import { createRouter, createWebHistory } from 'vue-router';
import StudentsView from '../views/StudentsView.vue';
import CoursesView from '../views/CoursesView.vue';
import EnrollmentsView from '../views/EnrollmentsView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'students', component: StudentsView, meta: { title: 'Students' } },
    { path: '/courses', name: 'courses', component: CoursesView, meta: { title: 'Courses' } },
    { path: '/enrollments', name: 'enrollments', component: EnrollmentsView, meta: { title: 'Enrollments' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'Page not found' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

router.afterEach((to) => {
  document.title = `${to.meta.title} | Student Management System`;
});

export default router;
