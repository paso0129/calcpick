```markdown
# calcpick Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `calcpick` TypeScript codebase. You'll learn how to structure files, write imports and exports, follow commit message conventions, and write tests in alignment with the project's standards. This guide also suggests commands for common workflows to streamline your development process.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `calculateSum.ts`, `userInputHandler.ts`

### Import Style
- Use **alias imports** when importing modules.
  - Example:
    ```typescript
    import utils from './utils';
    import { calculateSum as sum } from './mathUtils';
    ```

### Export Style
- Both **default** and **named exports** are used.
  - Default export example:
    ```typescript
    export default function calculateSum(a: number, b: number): number {
      return a + b;
    }
    ```
  - Named export example:
    ```typescript
    export function calculateDifference(a: number, b: number): number {
      return a - b;
    }
    ```

### Commit Messages
- Use **Conventional Commits** with the `feat` prefix for new features.
  - Example: `feat: add sum calculation utility`

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- Test files follow the `*.test.*` naming pattern.
  - Example: `calculateSum.test.ts`
- The testing framework is **unknown**, but tests are colocated with source files or in dedicated test files.
- Example test file structure:
  ```typescript
  import calculateSum from './calculateSum';

  test('adds two numbers', () => {
    expect(calculateSum(2, 3)).toBe(5);
  });
  ```

## Commands
| Command | Purpose |
|---------|---------|
| /commit-feat | Create a new feature commit using the conventional commit format |
| /run-tests   | Run all test files matching the `*.test.*` pattern              |
| /lint        | Lint the codebase according to project standards                |
```