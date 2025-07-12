# Copilot Instructions for Egor XYZ Site

## Project Overview
This is a modern React portfolio website featuring 3D animations, smooth page transitions, and a responsive design. The site showcases personal projects with an interactive 3D MacBook model as a centerpiece.

## Architecture & Key Patterns

### Component Organization
- **Barrel exports**: All components use `index.ts` files for clean imports (`/components/ComponentName/index.ts`)
- **Page-based routing**: Each route corresponds to a page in `/src/pages/` (Home, About, Digest, Extensions, Devkitty)
- **Atomic components**: Reusable UI components in `/src/components/` (Card, ProductCard, MenuItem, etc.)

### Animation System
- **Motion library**: Uses `motion/react` (formerly Framer Motion) for all animations
- **Animation utility**: `src/utils/a.ts` provides the `a()` helper to standardize motion props with `initial`, `enter`, `exit` variants
- **Page transitions**: Managed by `AnimatePresence` with `mode='wait'` in `Router.tsx`
- **Logo animation**: Central loading animation in `App.tsx` using `useAnimate` hook

### State Management
- **Zustand stores**: Minimal state with `useStore` (loading state) and `useThemeStore` (theme persistence)
- **Theme handling**: Automatic dark/light mode with localStorage persistence and body class updates

### 3D Integration
- **React Three Fiber**: 3D MacBook model loaded via `useGLTF` from `/public/macbook/macbook.gltf`
- **drei helpers**: Uses `OrbitControls`, `Environment` for 3D scene setup
- **Model structure**: GLTF with typed materials and mesh nodes in `Macbook.tsx`

## Development Workflows

### Build & Dev Commands
```bash
pnpm dev           # Start development server (auto-opens browser)
pnpm build         # TypeScript compilation + Vite build
pnpm lint          # ESLint with flat config
pnpm lint:fix      # Auto-fix linting issues
pnpm deploy        # Deploy to GitHub Pages via gh-pages
```

### Key Configuration
- **Vite setup**: Uses SWC for React, SVGR for SVG imports, TypeScript checking, and Tailwind CSS
- **Path aliases**: `src/` aliased for absolute imports
- **SVG handling**: SVGs imported as React components via `?react` suffix

## Project-Specific Conventions

### Styling Approach
- **Tailwind CSS**: Primary styling with custom merge utility in `src/utils/cn.ts`
- **Class merging**: Uses `clsx` + `tailwind-merge` for conditional and conflicting class handling
- **Responsive design**: Mobile-first with `useMedia` hook for breakpoint detection

### File Naming & Structure
- **Component files**: PascalCase with matching folder names
- **Utility files**: camelCase in `/src/utils/`
- **Asset organization**: Images in `/src/assets/`, 3D models in `/public/macbook/`

### Animation Patterns
- **Consistent variants**: Use `initial`, `enter`, `exit` pattern for page transitions
- **Staggered animations**: Custom props for delays (see `TopMenu` item animations)
- **Conditional animations**: Different behavior based on route (home page vs. other pages)

## External Dependencies & Integration
- **3D Models**: GLTF files with textures in `/public/macbook/` directory
- **Icons**: React Icons library for consistent iconography
- **Fonts**: Custom fonts likely loaded via CSS (check `index.css`)
- **Deployment**: GitHub Pages with custom domain support (CNAME in public)

## Common Gotchas
- **3D performance**: MacBook model has detailed materials - avoid unnecessary re-renders
- **Animation conflicts**: Page transitions use `AnimatePresence` - ensure proper key handling
- **Theme flash**: Dark mode is default - ensure SSR/hydration compatibility
- **Asset paths**: 3D assets in public folder use absolute paths from root

## Adding New Pages
1. Create page component in `/src/pages/NewPage/`
2. Add barrel export in `index.ts`
3. Update route in `Router.tsx`
4. Add menu item to `src/utils/menuItems.ts` if needed
5. Follow existing animation patterns with `a()` utility
