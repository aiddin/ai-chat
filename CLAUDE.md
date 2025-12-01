# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
npm run dev        # Start Next.js development server
npm run build      # Build for production (static export to /out)
npm start          # Start production server
npm run lint       # Run ESLint

# Tauri Desktop App
npm run tauri:dev    # Run as desktop app in development mode
npm run tauri:build  # Build cross-platform desktop executables
```

### Backend Connection
The API endpoint is configurable via environment variable `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000`).

The chat interface in `app/page.tsx:44` sends POST requests to `/ask` endpoint with:
```json
{
  "session_id": "string",
  "question": "string"
}
```

To configure a custom API endpoint, create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **React**: Version 19.2.0
- **Styling**: Tailwind CSS v4.1 with custom theme configuration
- **UI Components**: shadcn/ui with Radix UI primitives
- **TypeScript**: Configured with strict null checks but non-strict mode overall

### Project Structure

```
app/
  layout.tsx      - Root layout with Geist font configuration
  page.tsx        - Main chat interface (client component)
  globals.css     - Tailwind imports and CSS custom properties for theming

components/ui/    - shadcn/ui component library
  avatar.tsx
  button.tsx
  input.tsx
  scroll-area.tsx
  separator.tsx
  textarea.tsx
  chat.tsx        - Unused legacy chat component (page.tsx has the active implementation)

lib/
  utils.ts        - cn() utility for className merging with clsx + tailwind-merge
```

### Key Patterns

**Client-Side Chat Implementation**: The main page (`app/page.tsx`) is a client component that:
- Manages message state locally with `Message[]` interface (id, role, content)
- Uses `useEffect` to auto-scroll to new messages via a ref
- Makes POST requests to `http://localhost:8000/ask` with session_id and question
- Displays loading state with Lucide React's `Loader2` icon

**Styling System**: Uses Tailwind CSS v4 with:
- CSS custom properties defined in `globals.css` for theming (`--color-*`, `--radius-*`)
- Dark mode via `.dark` class selector (defined as `@custom-variant`)
- OKLCH color space for all theme colors
- `cn()` utility in `lib/utils.ts` for conditional class merging

**Component Library**: All UI components from shadcn/ui follow the pattern:
- Use Radix UI primitives for accessibility
- Styled with Tailwind using `class-variance-authority` for variants
- Located in `components/ui/` directory

### TypeScript Configuration
- Target: ES2017
- JSX: react-jsx (automatic runtime)
- Strict null checks enabled, but strict mode disabled (`tsconfig.json:11`)
- Path alias: `@/*` maps to root directory for imports

### ESLint Setup
Uses ESLint v9 with Next.js configurations:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Tauri Desktop App

This project is configured to build as a cross-platform desktop application using Tauri.

### Prerequisites
- **Rust**: Install from https://rustup.rs/
- **Windows**: Microsoft Visual Studio C++ Build Tools
- **macOS**: Xcode Command Line Tools
- **Linux**: See https://v2.tauri.app/start/prerequisites/

### Building Desktop App
```bash
npm run tauri:dev      # Development mode (hot reload)
npm run tauri:build    # Production build (creates installers in src-tauri/target/release/bundle/)
```

### Icons
Place app icons in `src-tauri/icons/`:
- Windows: `icon.ico`
- macOS: `icon.icns`
- Linux: PNG files (32x32, 128x128, etc.)

Use tools like https://tauri.app/v1/guides/features/icons/ to generate icons from a single source.

### Configuration
- Tauri config: `src-tauri/tauri.conf.json`
- App identifier: `com.aichat.app`
- Window size: 1200x800 (min 800x600)

## Important Notes

**Standalone Application**: This is configured as a standalone frontend. The API endpoint must be provided via environment variable.

**Duplicate Chat Components**: There are two chat implementations:
1. `app/page.tsx` - The active implementation used by the app
2. `components/ui/chat.tsx` - Legacy component that's not imported anywhere

When modifying chat functionality, update `app/page.tsx`.

**Backend API Contract**: The chat sends requests to `/ask` endpoint (not `/chat`), expecting JSON response with `{ response: string }` field.

**Font Loading**: Uses Next.js font optimization with Geist Sans and Geist Mono, loaded via CSS variables `--font-geist-sans` and `--font-geist-mono`.

**Static Export**: Next.js is configured to export static files (`output: 'export'`) for Tauri compatibility. This means no server-side rendering or API routes.
