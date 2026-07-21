# Todo 13 writable test verifier

This is a verification-only session. The sandbox is writable solely because Vite must generate `node_modules/.vite-temp` files. Do not use `apply_patch`; do not edit, format, install, stage, or create any source, test, config, documentation, plan, or evidence file. The outer process will write your final report.

From the repository root:

1. Capture `git status --short` and SHA-256 hashes for these current files: `src/app/App.test.tsx`, `src/mocks/shell.ts`, `src/components/layout/topbar/search-pages.ts`, `src/components/layout/topbar/topbar-organization.tsx`, `src/modules/afiliados/IndicacoesPage.tsx`, `src/modules/afiliados/ConfiguracoesPage.tsx`.
2. Run exactly `npm run test -- --run src/app/App.test.tsx src/modules/afiliados`.
3. If and only if it exits 0, run exactly the same command a second time to check for flakiness.
4. Recapture the same status and hashes and compare them. Any source/status drift caused by you is a failure.
5. Report a heading `CONFIRMED` only if both runs exit 0 with exact file/test counts and all hashes/status are unchanged. Otherwise report `NEEDS-FIX` with the exact failure. Do not claim browser QA or any check you did not run.
