# Project Structure

## Root Level
- `package.json` - Dependencies and scripts
- `astro.config.ts` - Astro configuration with React integration
- `tsconfig.json` - TypeScript configuration (extends Astro strict)
- `pnpm-lock.yaml` - Package lock file

## Source Organization (`src/`)

### Pages (`src/pages/`)
- `index.astro` - Landing page
- `builder.astro` - Main application page with BuilderPage component

### Components (`src/components/`)
- `BuilderPage.tsx` - Main application container with tab navigation
- `TabContent.tsx` - Reusable tab component
- `builder/` - Builder-specific components (grid, editors, settings)
- `monaco/` - Monaco editor wrappers for CSV/XML editing
- `rac/` - React Aria Components extensions

### State Management (`src/state/`)
- `builder-state.ts` - Nanostores-based global state with computed values
  - CSV data, system entries, settings, generated XML
  - Uses reactive computed stores for derived state

### TypeScript Modules (`src/ts/`)
- `data/` - Type definitions and interfaces
  - `SystemEntry.ts` - Core celestial body data structure
  - `SystemSettings.ts` - Application configuration
  - `CelestialType.ts`, `ExtractedCelestials.ts` - Domain types
- `xml/` - XML processing utilities
  - XPath-based celestial body extraction
  - XML serialization and formatting
- `transform/` - Data transformation logic
- `util/` - General utility functions
- `builder/` - Application-specific business logic

### Data (`src/data/`)
- `earth_system_data.csv` - Default celestial body dataset
- `mods/Core/` - KSA game XML files (updated with game versions)

### Testing (`src/test/`)
- Vitest-based tests with XML assertion utilities
- `util/xml-assertions.ts` - Custom test helpers

### Styles (`src/styles/`)
- Component-specific CSS files
- `theme.css` - Global theming

## External Resources
- `examples/` - Sample XML and JSON files
- `scripts/` - PowerShell scripts for data generation
- `public/` - Static assets and favicon

## Naming Conventions
- React components: PascalCase (e.g., `BuilderPage.tsx`)
- TypeScript modules: camelCase (e.g., `systemEntry.ts`)
- CSS files: kebab-case (e.g., `builder-page.css`)
- Nanostores: `$` prefix (e.g., `$csvData`, `$systemEntries`)