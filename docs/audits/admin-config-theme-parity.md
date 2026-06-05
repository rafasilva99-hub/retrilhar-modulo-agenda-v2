# Admin Config And Theme Parity

## Compared Files

- Prototype: `components.json`
- Prototype: `src/styles/index.css`
- Prototype: `src/styles/tailwind.css`
- Prototype: `src/styles/theme.css`
- Prototype: `src/styles/fonts.css`
- Admin reference: `components.json`
- Admin reference: `app/globals.css`

## Already aligned

- `components.json` uses `style: "radix-luma"`.
- `components.json` uses `iconLibrary: "hugeicons"`.
- `components.json` uses `menuColor: "inverted-translucent"`.
- `components.json` uses `menuAccent: "subtle"`.
- `src/styles/tailwind.css` imports `tw-animate-css`.
- `src/styles/tailwind.css` imports `shadcn/tailwind.css`.
- `src/styles/theme.css` defines `@custom-variant dark`.

## Vite-safe divergence

- Prototype keeps `rsc: false`; Admin uses RSC because it is a Next.js app.
- Prototype keeps `tailwind.css: "src/styles/index.css"`; Admin points at `app/globals.css`.
- Prototype uses CSS font fallbacks in `src/styles/fonts.css`; Admin can use Next-specific font loading.
- Prototype must stay hash-routed and mock-only, so no Next/App Router theme provider is copied here.

## Needs implementation

- Shell/layout component parity should continue in later waves, using Admin as read-only reference.
- Any future theme change must remain Vite-safe and must not copy `rsc: true`.
- Any future font change must avoid Next-only `localFont` usage.

## Guardrails

- Do not port Next.js, auth, OpenAPI SDKs, organization headers, or real API calls into this prototype.
- Do not mutate the Retrilhar Admin repository; use it only as read-only reference.
