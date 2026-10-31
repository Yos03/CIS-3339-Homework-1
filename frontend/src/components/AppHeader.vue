<script setup>
const links = [
  { to: '/', label: 'Students' },
  { to: '/courses', label: 'Courses' },
  { to: '/enrollments', label: 'Enrollments' },
];
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <RouterLink to="/" class="brand">
        <span aria-hidden="true">🎓</span> Student Management
      </RouterLink>
      <nav aria-label="Main">
        <ul class="nav">
          <li v-for="l in links" :key="l.to">
            <RouterLink :to="l.to" class="nav__link">{{ l.label }}</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
