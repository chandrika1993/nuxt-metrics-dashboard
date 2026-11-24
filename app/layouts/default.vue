<template>
  <div class="shell">
    <header class="header">
      <NuxtLink
        to="/"
        class="brand"
      >
        Engineering Metrics
      </NuxtLink>
    </header>
    <main
      id="main"
      tabindex="-1"
      class="main"
    >
      <slot />
    </main>
  </div>
</template>

<style scoped>
.header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-3) var(--space-6);
}

.brand {
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
}

.main {
  max-width: 72rem;
  margin: 0 auto;
  padding: var(--space-6);
}

.main:focus {
  outline: none;
}
</style>
