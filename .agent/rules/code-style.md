---
trigger: always_on
---

# AI Rules & Guidelines

This document outlines the operating rules, technology stack, and best practices for this project. All AI agents (Antigravity, Gemini, Copilot, etc.) must adhere to these guidelines.

## Technology Stack

- **Framework**: Expo SDK 54 (React Native 0.81.5) - Managed workflow.
- **Language**: TypeScript (Strict mode).
- **Routing**: Expo Router 6 (File-based routing).
- **Styling**: TailwindCSS via Uniwind/Nativewind (Utility-first).
- **State Management**: Zustand (Global state), React Query (Server state).
- **Forms**: TanStack Form + Zod validation.
- **Storage**: MMKV (Encrypted local storage).
- **Testing**: Jest + React Testing Library.

## Project Structure

```
src/
├── app/              # Expo Router file-based routes
├── features/         # Feature modules (auth, inventory, etc.) containing screens, components, hooks
├── components/ui/    # Reusable UI components (primitives)
├── lib/              # Utilities (api client, auth, storage, date formatting)
├── translations/     # i18n files
└── global.css        # TailwindCSS config
```

## Key Patterns & Guidelines

### 1. File Structure & Organization
- **Feature-First**: Group related code by feature in `src/features/[feature-name]/`.
- **Routes**: Place route files in `src/app/`. Keep route components thin; delegate logic to feature screens.
- **Imports**: ALWAYS use absolute imports with the `@/` alias (e.g., `@/components/ui/button`, `@/features/auth/api`). NEVER use relative imports like `../../`.

### 2. Coding Standards
- **functional components**: Use React Functional Components with Hooks.
- **Types**: Define explicit types for props and API responses. Avoid `any`.
- **Forms**: Use `useForm` from TanStack Form with Zod schemas. Do not use `react-hook-form` unless explicitly requested.
- **API**: Use `react-query-kit` (`createQuery`, `createMutation`) for standardized data fetching hooks.

### 3. Styling
- **Tailwind**: Use Tailwind classes for all styling.
- **Responsive**: Use Tailwind's responsive prefixes if needed, but prioritize mobile-first design.

### 4. DOs and DON'Ts
- ✅ **DO** use exact file names matching the component or function.
- ✅ **DO** include error handling in API calls (try/catch in mutations or `onError` callbacks).
- ✅ **DO** use `MMKV` for storage.
- ❌ **DO NOT** modify `android/` or `ios/` directories directly. Use Expo Config Plugins in `app.config.ts`.
- ❌ **DO NOT** use inline styles unless absolutely necessary for dynamic values.

## Agent Behavior
- **Context Awareness**: Before creating new files, check existing patterns in `src/features/`.
- **Verification**: Verify that new code compiles (`tsc`) and adheres to linting rules (`eslint`).
