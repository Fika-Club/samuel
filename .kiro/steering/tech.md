# Tech Stack & Build System

## Core Technologies

- **React 19.1.0**: Latest React with modern features and JSX transform
- **TypeScript 5.8.3**: Strict TypeScript configuration with ESNext target
- **pnpm**: Package manager with workspace support
- **Node.js**: Runtime environment

## Build Tools & Bundlers

- **Webpack 5**: Primary bundler for emotion app with dev server
- **Vite**: Used with Vanilla Extract plugin for CSS-in-JS
- **Babel**: Transpilation with React, TypeScript, and Emotion presets

## Styling Solutions

- **Emotion**: CSS-in-JS with styled components (`@emotion/react`, `@emotion/styled`)
- **Vanilla Extract**: Zero-runtime CSS-in-JS with TypeScript support

## Code Quality & Linting

- **ESLint 8.56.0**: Linting with TypeScript and Prettier integration
- **Prettier 3.2.5**: Code formatting with specific style rules
- **TypeScript ESLint**: Strict TypeScript linting rules

## Common Commands

```bash
# Development
pnpm dev:emotion          # Start emotion app dev server
pnpm dev:context-api      # Start context API form builder

# Linting & Quality
pnpm lint                 # Run ESLint across all apps
pnpm lint:fix             # Auto-fix ESLint issues

# App-specific commands (run from app directory)
npm run dev               # Start webpack dev server
npm run build             # Production build
npm run ts-check          # TypeScript type checking
npm run clean             # Clean dist folder
```

## Workspace Configuration

- **Monorepo**: pnpm workspaces with apps/* pattern
- **Shared Dependencies**: React/React-DOM shared across workspace
- **Individual Configs**: Each app has its own build configuration