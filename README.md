# React Template

This project is a React + TypeScript + Vite starter with Tailwind CSS, React Router, and a small demo authentication flow.

## Features

- React 19 with TypeScript
- Vite for development and production builds
- Tailwind CSS for utility-first styling
- React Router for page routing
- Demo auth flow with login and protected home page
- Shared folders for components, services, hooks, constants, utils, and types

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run test
```

## Demo Login

Use these credentials on the login screen:

```text
user@example.com
password
```

## Folder Structure

```text
src/
├── assets/
├── components/
│   └── common/
│       └── Button.tsx
├── constants/
│   └── index.ts
├── hooks/
│   └── useAuth.ts
├── pages/
│   ├── Home/
│   │   ├── Home.module.css
│   │   └── Home.tsx
│   └── Login/
│       ├── Login.module.css
│       └── Login.tsx
├── router/
│   └── index.tsx
├── services/
│   ├── authService.ts
│   └── axiosClient.ts
├── store/
│   └── AuthContext.tsx
├── types/
│   └── index.ts
├── utils/
│   └── validators.ts
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

## Structure Notes

- `pages/`: screen-level views such as login and home.
- `components/`: reusable UI pieces shared across pages.
- `router/`: route definitions and protected route flow.
- `services/`: API-related logic and request setup.
- `store/`: app state via Context API.
- `hooks/`: custom hooks that wrap shared logic.
- `types/`: shared TypeScript types used across modules.
- `utils/`: small helper functions such as validation.
- `constants/`: shared app constants and seeded demo values.

## Current Flow

- `App.tsx` wraps the app with `AuthProvider` and `BrowserRouter`.
- `router/index.tsx` exposes the app routes.
- `pages/Login/Login.tsx` handles sign-in.
- `pages/Home/Home.tsx` is a protected page shown after login.
- `services/authService.ts` currently mocks authentication.

## Notes

- The page components currently use Tailwind utility classes directly.
- The CSS module files under `pages/` still exist, but the active page styling is now in the TSX files.
- `axiosClient.ts` is prepared for real API integration with bearer token support.
