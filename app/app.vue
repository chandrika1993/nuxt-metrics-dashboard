<template>
  <a
    class="skip-link"
    href="#main"
  >Skip to main content</a>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: var(--space-4);
  top: -3rem;
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: var(--color-primary-text);
  border-radius: var(--radius-sm);
  z-index: 10;
}

.skip-link:focus {
  top: var(--space-2);
}
</style>
