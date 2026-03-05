# Project Guidelines

## Architecture

Chrome extension **options page** built with Vue 3 + TypeScript + Vite. Entry: [`src/main.ts`](../src/main.ts), root component: [`src/App.vue`](../src/App.vue).

- **UI**: Element Plus — components and APIs are **auto-imported** (no explicit imports needed in `.vue` files).
- **State**: Pinia with the **Setup Store** pattern (see [`src/stores/counter.ts`](../src/stores/counter.ts)).
- **Routing**: Vue Router with `createMemoryHistory` (required for Chrome extension pages, not `createWebHistory`).
- **Path alias**: `@` maps to `src/`.

## Code Style

- Vue SFCs use `<script setup lang="ts">` with Composition API.
- Stores use the Setup Store style (`ref`, `computed`, functions returned as object).
- Do **not** manually import Element Plus components or APIs — `unplugin-auto-import` and `unplugin-vue-components` handle this automatically via [`vite.config.ts`](../vite.config.ts).
- CSS is scoped per component via `<style scoped>`. Global styles live in [`src/assets/`](../src/assets/).

## Build and Test

```sh
npm install

# Dev server
npm run dev

# Type-check + production build
npm run build

# Unit tests (Vitest)
npm run test:unit

# E2e tests (Playwright — build first)
npm run build && npm run test:e2e

# Lint (oxlint then ESLint, sequential)
npm run lint

# Format
npm run format
```

## Project Conventions

- Router uses `createMemoryHistory`, not hash or web history — don't change this; it's required by Chrome extension CSP.
- New views go in `src/views/`, reusable components in `src/components/`.
- New stores go in `src/stores/` following the Setup Store pattern in `counter.ts`.
- `base: './'` in `vite.config.ts` ensures correct asset paths in the extension package.

## Integration Points

- This folder is the **options page** sub-project within the larger `ak_translate_chrome_extension` repository. The built output (`dist/`) is expected to be referenced by the extension manifest in the parent directory.
- Element Plus resolver is configured in both `AutoImport` and `Components` plugins — keep both in sync if updating the UI library.
