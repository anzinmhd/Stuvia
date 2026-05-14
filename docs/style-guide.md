# Code Style Guide - Stuvia

This document outlines the coding standards, patterns, and best practices for the Stuvia project.

## 🟦 TypeScript

- **Strict Mode**: Always use strict TypeScript settings.
- **Interfaces over Types**: Use `interface` for object shapes and `type` for unions or aliases.
- **Explicit Returns**: Provide explicit return types for functions, especially for API routes and complex logic.
- **Avoid `any`**: Use `unknown` or specific types instead of `any`.

## ⚛️ React & Components

- **Functional Components**: Use arrow functions for components.
- **Naming**: Use PascalCase for component files (e.g., `AttendanceCard.tsx`) and camelCase for hooks (e.g., `useAttendance.ts`).
- **Component Structure**:
  ```tsx
  import { FC } from 'react';

  interface Props {
    title: string;
  }

  export const MyComponent: FC<Props> = ({ title }) => {
    return <div>{title}</div>;
  };
  ```
- **Shadcn/UI**: Always check if a component exists in `components/ui` before creating a new one.

## 💅 Styling (Tailwind CSS)

- **Utility First**: Use Tailwind utility classes for all styling.
- **Conditional Classes**: Use the `cn()` utility for merging classes.
- **Theming**: Use CSS variables (e.g., `text-primary`, `bg-root`) to ensure dark mode compatibility.

## 🌐 API Routes

- **Validation**: Use a validation library or manual checks at the beginning of every route.
- **Error Handling**: Use `NextResponse.json()` with appropriate status codes.
- **Consistency**: All error responses must contain an `error` field.

## 📂 File Organization

- **Pages**: Put routes in the `app/` directory.
- **Components**: Reusable components go in `components/`.
- **Logic**: Domain-specific logic goes in `lib/`.
- **Styles**: Global styles in `app/globals.css`.

## 🛠️ Tooling

- **ESLint**: Run `npm run lint` before committing.
- **Prettier**: Ensure your editor is configured to use the project's Prettier settings.
