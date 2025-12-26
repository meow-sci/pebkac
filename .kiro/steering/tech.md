# Technology Stack

## Framework & Build System
- **Astro 5.16.1** - Static site generator with React integration
- **React 19.2.0** - UI framework with React DOM
- **TypeScript 5.9.3** - Type-safe JavaScript with strict configuration
- **Vite** - Build tool and dev server (via Astro)

## Key Libraries
- **Monaco Editor** - Code editor for CSV/XML editing
- **AG Grid** - Data grid for celestial body visualization
- **React Aria Components** - Accessible UI components
- **Nanostores** - Lightweight state management with persistence
- **XPath** - XML querying and manipulation
- **UDSV** - CSV parsing utilities

## Development Tools
- **Vitest** - Testing framework
- **@astrojs/check** - Astro type checking
- **PNPM** - Package manager

## Common Commands

### Development
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm check        # Run Astro type checking
```

### Testing
```bash
pnpm test         # Run tests in watch mode
pnpm test-run     # Run tests once
pnpm tsc          # TypeScript compilation check
```

## Configuration Notes
- Uses ES modules (`"type": "module"`)
- Deployed to `/pebkac/` base path on `meow.science.fail`
- Strict TypeScript configuration with DOM types
- File System Access API types included for browser file operations