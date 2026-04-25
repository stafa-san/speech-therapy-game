# `@habla/config`

Shared configuration for every workspace package: ESLint flat configs, TypeScript base configs, and the Tailwind v4 design-token preset.

## ESLint (flat config)

```js
// eslint.config.mjs
import nextConfig from '@habla/config/eslint/next';
export default nextConfig;
```

Available presets:

| Export                         | When to use                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `@habla/config/eslint/base`    | TypeScript libraries with no React.                                                                                 |
| `@habla/config/eslint/library` | TypeScript libraries that ship React components.                                                                    |
| `@habla/config/eslint/next`    | Next.js apps. Includes core-web-vitals, jsx-a11y, and the COPPA `no-restricted-imports` guard for the player route. |

## TypeScript

```jsonc
// tsconfig.json
{ "extends": "@habla/config/tsconfig/nextjs.json" }
```

Variants: `base.json` (strict TS), `library.json` (publishable lib), `nextjs.json` (Next.js app).

## Tailwind

```css
/* apps/web/src/app/globals.css */
@import 'tailwindcss';
@import '@habla/config/tailwind/preset.css';
```

The preset defines brand colors (`--color-brand-*`), accents, fonts, and radii. Apps may add their own `@theme` block on top to override.
