# tsconfig presets

Three layered presets — pick the one that matches the package's role.

| File           | Use for                                                                           | What it adds over `base.json`                                                               |
| -------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `base.json`    | Plain TS modules.                                                                 | strict, `noUncheckedIndexedAccess`, ES2022 + ESNext modules, bundler resolution.            |
| `library.json` | Packages that export components or modules consumed by another workspace package. | `composite`, `declaration`, `declarationMap`, `outDir: dist`, `rootDir: src`, JSX, DOM lib. |
| `nextjs.json`  | A Next.js app.                                                                    | DOM lib, JSX preserve, allowJs, the Next plugin, `noEmit`.                                  |

Consume via:

```jsonc
// tsconfig.json
{ "extends": "@habla/config/tsconfig/nextjs.json" }
```

The `paths` alias and `include` arrays should stay in the consumer; they are project-local.
