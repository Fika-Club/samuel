# Project Structure

## Workspace Organization
This is a pnpm workspace with multiple React applications under the `apps/` directory. Each app is self-contained with its own dependencies and build configuration.

```
react-study/
├── apps/                           # Individual React applications
│   ├── emotion/                    # Emotion CSS-in-JS demo
│   ├── react-hook-form-yup/        # Form validation demo
│   ├── compound/                   # Compound components demo
│   └── context-api-form-builder/   # Context API demo
├── .kiro/                          # Kiro AI assistant configuration
└── [config files]                 # Shared workspace configuration
```

## Application Structure Pattern
Each app follows a consistent structure:

```
apps/[app-name]/
├── src/
│   ├── components/          # React components
│   │   └── __tests__/      # Component tests
│   ├── types/              # TypeScript type definitions
│   ├── schemas/            # Validation schemas (Yup)
│   ├── utils/              # Utility functions
│   ├── styles/             # CSS/styling files
│   └── main.tsx           # Application entry point
├── public/
│   └── index.html         # HTML template
├── package.json           # App-specific dependencies
├── webpack.config.js      # Webpack configuration
└── tsconfig.json         # TypeScript configuration
```

## Code Organization Conventions

### Components
- Use PascalCase for component files and names
- Include TypeScript interfaces for props
- Implement accessibility features (ARIA labels, keyboard navigation)
- Use React.memo for performance optimization where appropriate
- Include comprehensive JSDoc comments

### Testing
- Place tests in `__tests__/` directories alongside source files
- Use descriptive test names in Korean or English
- Test accessibility, performance, and user interactions
- Maintain high test coverage

### Types
- Define interfaces in dedicated `types/` directories
- Use descriptive names with proper TypeScript conventions
- Export types for reuse across components

### Utilities
- Place reusable functions in `utils/` directories
- Focus on accessibility helpers, performance utilities, and form management
- Include proper TypeScript typing

## File Naming Conventions
- Components: `ComponentName.tsx`
- Types: `componentName.types.ts`
- Schemas: `schemaName.ts`
- Tests: `ComponentName.test.tsx`
- Styles: `ComponentName.css` or `componentName.style.ts`

## Import Organization
1. React and external libraries
2. Internal components and utilities
3. Types and schemas
4. Styles (imported last)