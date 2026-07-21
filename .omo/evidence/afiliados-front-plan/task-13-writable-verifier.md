# CONFIRMED

Command run twice exactly:

`npm run test -- --run src/app/App.test.tsx src/modules/afiliados`

Both runs exited `0`:

- Run 1: `Test Files 9 passed (9)`, `Tests 39 passed (39)`
- Run 2: `Test Files 9 passed (9)`, `Tests 39 passed (39)`

`git status --short` was unchanged before/after. Requested SHA-256 hashes were unchanged:

```text
75dbc33f8ad7c89cc7230507a6833b2a221a3a0c606addf614761f5aa84927ab  src/app/App.test.tsx
16b594038a5987c926a710cd328d658d30cf56f2b0f2d086a112d682bb26ae91  src/mocks/shell.ts
9630f9a71bc24e34d7cf953325f6c72397a3db87490da629ec3867130201304c  src/components/layout/topbar/search-pages.ts
767625975a963de18c57bf6da87902c4b9cd4325fbee7b673d6bf04d932bd439  src/components/layout/topbar/topbar-organization.tsx
1e4182dfb1b9146b05fdcd8d2b0108dd7ac12a53f7cc2d2c7859e930be4feb73  src/modules/afiliados/IndicacoesPage.tsx
0a55adfdfb7a99a9a2917e3a0918a7b33b085d761b3c624ec87a6f7f58b90bef  src/modules/afiliados/ConfiguracoesPage.tsx
```