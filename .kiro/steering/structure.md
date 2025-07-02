# Project Structure & Organization

## Workspace Layout

```
react-study/
├── apps/                           # Individual React applications
│   ├── compound/                   # Compound component patterns
│   │   ├── components/            # Reusable compound components
│   │   ├── PlayGround.tsx         # Demo/testing component
│   │   └── index.ts               # Main exports
│   ├── emotion/                   # Emotion CSS-in-JS examples
│   │   ├── src/                   # Source code
│   │   ├── public/                # Static assets
│   │   ├── webpack.config.js      # Webpack configuration
│   │   └── package.json           # App-specific dependencies
│   ├── context-api-form-builder/  # Context API patterns
│   └── react-hook-form-yup/       # Form validation examples
├── .kiro/                         # Kiro AI assistant configuration
│   └── steering/                  # AI guidance documents
├── node_modules/                  # Shared workspace dependencies
└── package.json                   # Root workspace configuration
```

## Naming Conventions

- **Apps**: Kebab-case directory names (`context-api-form-builder`)
- **Components**: PascalCase files (`SelectDropdown.tsx`, `PlayGround.tsx`)
- **Utilities**: camelCase for functions and variables
- **Styles**: Kebab-case for CSS files (`select-dropdown.style.ts`)

## Component Patterns

### Compound Components
- Use React Context for state sharing between compound parts
- Export both individual components and grouped exports
- Include `displayName` for debugging
- Forward refs where appropriate

### File Organization
- Components in dedicated `components/` directories
- Style files co-located with components (`.style.ts` suffix)
- Index files for clean exports
- Documentation in `doc.md` files

## Architecture Guidelines

- **Separation of Concerns**: Each app demonstrates specific patterns
- **Shared Dependencies**: Common React/TypeScript deps at workspace root
- **Individual Configs**: App-specific build and dev configurations
- **Context Usage**: Leverage React Context for component communication
- **TypeScript**: Strict typing with proper interfaces and generics