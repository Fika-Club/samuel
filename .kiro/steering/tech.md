# Technology Stack

## Build System & Package Management
- **pnpm**: Package manager with workspace support
- **Webpack**: Module bundler for all applications
- **Babel**: JavaScript/TypeScript transpilation
- **TypeScript**: Primary language with strict configuration

## Core Technologies
- **React 19**: Latest React version with modern hooks and patterns
- **TypeScript 5.8**: Strict type checking enabled
- **ESLint + Prettier**: Code quality and formatting

## Styling Solutions
- **Emotion**: CSS-in-JS for the emotion app
- **Vanilla Extract**: CSS-in-TS utility classes
- **CSS Modules**: Traditional CSS with scoped classes

## Form Libraries
- **React Hook Form**: Performance-focused form library
- **Yup**: Schema validation
- **@hookform/resolvers**: Integration between RHF and validation libraries

## Testing
- **Jest**: Test runner and framework
- **@testing-library/react**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers
- **@testing-library/user-event**: User interaction simulation

## Common Commands

### Development
```bash
# Start specific app
pnpm dev:emotion
pnpm dev:react-hook-form-yup
pnpm dev:context-api

# Run from app directory
pnpm dev
```

### Testing
```bash
# Run tests (from react-hook-form-yup)
pnpm test
pnpm test:watch
pnpm test:coverage
```

### Code Quality
```bash
# Lint entire workspace
pnpm lint
pnpm lint:fix

# Type checking
pnpm ts-check
```

### Build
```bash
# Build specific app
pnpm build  # from app directory
pnpm clean  # clean dist folder
```