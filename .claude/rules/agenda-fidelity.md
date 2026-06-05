# Agenda Fidelity Guardrails

Este protótipo deve continuar mock-only, Vite/React e roteado por hash.

- O projeto `Retrilhar Admin` é referência de padrão e deve permanecer somente leitura.
- Nunca editar, formatar, instalar dependências, rodar codegen ou aplicar correções automáticas no `Retrilhar Admin`.
- Não trazer Next.js, App Router, RSC, `next/link`, `next/image`, `next-intl`, `better-auth`, OpenAPI SDK, Sentry, PWA, service worker, headers de backend ou API real.
- Não introduzir `fetch(` ou cliente HTTP em código mantido do módulo de agenda.
- Dados do protótipo devem vir de `src/mocks/**` ou serviços mockados em `src/modules/**/services`.
- Manter as rotas de teste por hash: `#agenda`, `#agendaDia`, `#atualizacoes` e `#novaAtividade`.
- Tratar `src/imports/**` como legado do Figma Make atrás de adapters; refatorar gradualmente.
- Usar HugeIcons, shadcn/ui, tokens Tailwind semânticos e componentes de layout/custom do protótipo ao criar código mantido.
