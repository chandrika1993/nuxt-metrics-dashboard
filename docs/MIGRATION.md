# Migrating a server-rendered legacy frontend to Vue and Nuxt

How I would approach an incremental migration from a server-rendered frontend that is tightly coupled to a monolithic backend (for example PHP templates rendering business logic directly) to a Vue-based architecture like the one in this repository.

The goal is to keep shipping product work throughout. There is no big-bang rewrite and no feature freeze.

## 1. Understand before changing

- **Map the surface.** Inventory routes, templates, shared partials, inline scripts and the data each page pulls from the backend. Rank pages by traffic, change frequency and business criticality.
- **Write characterization tests first.** Before touching a page, cover its key user flows with Playwright against the legacy version. The same tests then run against the Vue version and become the definition of "done" for that page.
- **Record a baseline.** Capture Core Web Vitals, error rates and axe results per page so every migration step can be compared against real numbers.

## 2. Define the contract between frontend and backend

The main risk in a coupled monolith is that templates reach directly into backend logic. Migration starts by putting an explicit boundary there.

- Introduce a small JSON API (or a backend-for-frontend layer) for each page being migrated, next to the existing templates.
- Describe it with a schema (OpenAPI or Zod) and generate or share TypeScript types, as `shared/types` does here, so contract drift fails the build instead of reaching production.
- Keep the API shaped around screens and use cases, not database tables. Pagination, sorting and filtering happen on the server, as in `/api/teams`.

## 3. Migrate incrementally (strangler fig)

Two patterns, chosen per page:

1. **Vue islands inside legacy pages.** For pages that are mostly static with one complex widget, mount a Vue component into the existing server-rendered page. This delivers value early and proves the component library in production.
2. **Route-by-route takeover.** A reverse proxy or edge router sends migrated paths to Nuxt and everything else to the legacy app. Users move between them through normal links; shared session and authentication are agreed up front.

Order of work: start with a page that is valuable but not the most critical, to prove the pipeline, then move to high-change pages where developer speed improves the most.

Every migrated route ships behind a feature flag so it can be rolled back instantly and rolled out gradually.

## 4. Build the foundation once

- **Design tokens and a component library** that both the islands and the Nuxt pages use, so the UI stays consistent during the years when old and new pages coexist.
- **Standards as tooling:** strict TypeScript, linting, unit tests for components, Playwright for flows, axe in CI. A pull request that lowers accessibility or breaks a contract fails automatically.
- **Accessibility as part of the definition of done**, because migrations are a cheap moment to fix semantic HTML, focus handling and contrast that the legacy templates got wrong.

## 5. Manage risk and measure progress

- Track migration progress in the open: routes migrated, legacy templates deleted, test coverage of migrated flows.
- Compare each migrated page to its baseline (performance, errors, conversion) before removing the legacy version.
- Delete legacy code as soon as a route is fully switched over, so the old and new systems do not drift into permanent coexistence.
- Keep product, design and backend in the loop: each migration step should be visible as user value (speed, accessibility, fewer bugs) and not only as technical work.
