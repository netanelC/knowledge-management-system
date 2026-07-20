# Coding Standards

This document outlines the coding standards and quality requirements for this repository. Every pull request, feature addition, or code change must adhere to the following rules:

## 1. Testing

- **Integration Tests:** Add integration tests for any new features or API endpoints. Unit tests should be used only on complex logic. Critical paths and database interactions must have adequate integration test coverage.

## 2. Code Quality & Formatting

- **Don't Repeat Yourself (DRY):** Avoid duplicated code. Extract shared logic into reusable functions, hooks, or components.
- **Use Shared Packages:** Whenever code, types, or utilities are useful across multiple applications (e.g., between frontend and backend), extract and use them from a shared Turborepo package (like `types`).
- **No Lint Errors:** Resolve all lint errors and warnings. Using `eslint-disable` or equivalent suppression comments is strictly prohibited unless explicitly authorized.
- **Code Formatting:** The codebase must be formatted using Prettier. Always run the formatter before finalizing a feature to maintain consistent styling.
- **TypeScript Errors:** Resolve all TypeScript compiler errors. Do not bypass the compiler using `@ts-ignore` or `any` typing as a shortcut.

## 3. Documentation

- **README Updates:** Always revise the main `README.md` and/or component-level READMEs when adding new features, changing environment configurations, or altering setup instructions.

---

_Note for AI Assistants: These instructions must be implicitly applied to every task performed in this repository. Never ignore lint warnings, always format your code, verify type safety, write tests, and update documentation as required._
