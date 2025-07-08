# NTQ Grocery Frontend

This project is a modern frontend application built with Next.js and TypeScript. It is designed to provide a seamless user experience and integrates with a backend API for data management.

---


### Key Files and Directories
- **`public/assets/`**: Contains static resources such as images, icons, and other assets used throughout the application.
- **`src/app`**: Contains the Next.js App Router structure, including server components, layouts, and pages (if using the App Router).
- **`src/actions`**: Contains API interaction logic, such as `user.ts`, `session.ts`, and `product-review.ts`.
- **`src/auth`**: Includes authentication utilities like `auth-provider.tsx` and `auth-context.tsx`.
- **`src/components`**: Houses reusable UI components, e.g., `carousel` and `notifications-drawer`.
- **`src/hooks`**: Custom React hooks for managing reusable logic across components.
- **`src/ultis/axios.ts`**: Centralized Axios instance and API endpoint definitions.
- **`src/layouts`**: Layout components for consistent page structure.
- **`src/locales`**: Localization utilities for internationalization.
- **`src/models`**: TypeScript models for data structures.
- **`@/theme`**: Contains theme-related configurations, such as color palettes, typography, and global styles.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org) (React-based)
- **TypeScript**: For static typing and type safety

### Backend Integration
- **Axios**: For API requests (`src/ultis/axios.ts`)
- **SWR**: For data fetching and caching


## Getting Started

1. Install dependencies:
   ```bash
   npm install

2. Run the development server:
     ```bash
    npm run dev