<script setup>
import AppHeader from './components/AppHeader.vue';
import ToastHost from './components/ToastHost.vue';
</script>

<template>
  <a class="skip-link" href="#main">Skip to main content</a>
  <AppHeader />
  <main id="main" class="container" tabindex="-1">
    <RouterView />
  </main>
  <footer class="site-footer container">CIS 3339 Homework 1 · Vue 3 · Express · MongoDB</footer>
  <ToastHost />
</template>
