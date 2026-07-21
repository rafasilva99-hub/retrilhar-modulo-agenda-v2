# Affiliate module guardrails

This rule is subordinate to the repository contract in `AGENTS.md`, `CLAUDE.md`, and
`.claude/rules/agenda-fidelity.md`. It applies to the maintained affiliate module (`afiliacao`)
and protects the confirmed invariants from `Specdrivenafiliados.md`, section 1.

## Domain invariants

1. An affiliate is a global person or legal entity, including a foreign person or entity,
   with one unique code and one or more independent organization relationships. The code is
   shared across organizations.
2. The affiliate panel is a consolidated panel and does not switch companies. Organization
   scope is an in-panel filter, not a change of application.
3. The UI calls the relationship `afiliação`. Do not use `contrato` or `vínculo` as UI terms.
4. Product scope per afiliação is either `todos os produtos` or `produtos específicos`. There
   is no `nenhum produto` state. With all products selected, newly added products enter the
   scope automatically, with the specified product or affiliate alert.
5. An afiliação with no enabled product does not generate commission.
6. Commission may be a percentage or fixed amount, applied in batch or per product. A
   no-overwrite lock preserves values already defined, and changes create history.
7. Affiliate links have three levels: the global affiliate link across eligible products and
   organizations, a global link for one organization, and a product link.
8. Afiliação status values are Ativo, Inativo, and Desativado. Desativado also exists as a
   platform-wide affiliate ban and must not be confused with a single afiliação status.
9. The receiving method is defined in the agreement with each organization. The affiliate may
   change only the receiving destination, meaning the account that receives the money. For
   cash receipt, a destination does not apply.
10. The affiliate does not negotiate or alter commercial conditions. The affiliate shares a
    link or code and is paid after a completed sale.
11. Keep Vite + React with hash routing. Do not introduce Next.js, App Router, RSC, `fetch`, or
    an HTTP client in maintained code.
12. Keep the module mock-only: use fixtures under `src/mocks/**` or mock services under
    `src/modules/afiliados/services/**`; do not add backend or real API behavior.
13. Use HugeIcons, shadcn/ui, semantic Tailwind tokens, and the prototype's existing layout
    components. Prefer existing layout/custom primitives over duplicated native UI.
14. Preserve the product design contract: Helvetica Neue, primary blue `#1E40AF`, semantic
    green/red/amber/blue/orange fills, and rounded HugeIcons stroke treatment.
15. Keep copy in correct Portuguese with diacritics, no em dash or en dash, and no invented
    data. The word `mock` must not appear in visible UI copy.

## Readiness split

### Executable now

The following work may be refined or implemented within this module, using mock-local behavior:

- Alterar destino de repasse in Formas de recebimento: change only the destination, never the
  receiving method.
- Solicitar afiliação de produtos (F5): the affiliate requests in the panel and an admin
  approval remains a separate concern.
- Ver links por organização, following the three-level link hierarchy.
- Produtos e Links, with the `todos` versus `específicos` scope and its automatic-new-product
  behavior.
- Minhas afiliações, preserving Ativo, Inativo, and Desativado semantics.
- Ajuda e suporte, as static content with no external data dependency.

### Blocked until decisions land

- Home de primeiro acesso stays out of scope. It is blocked by P-A (the initial relationship
  direction) and P-C (whether its code belongs in this project).
- Sala de negocios V1, including its landing and registration, stays out of scope. It is
  frozen by P-B and cannot be pulled into this implementation slice.
- Do not implement either blocked surface indirectly through routes, copy, fixtures, or
  shared components. Revisit only after P-A, P-B, and P-C are resolved and the plan is updated.

P-D, about whether settings should support multiple publicity channels, remains a smaller
validation item. Treat it as pending rather than inventing a final product decision.

## Execution guardrails

- Preserve existing affiliate hashes: `#afiliados`, `#indicacoes`, `#ganhos`, `#produtosLinks`,
  `#configuracoes`, and `#ajuda`.
- Keep data synchronous and local. No backend-shaped loading, auth, API, banking integration,
  or network fallback is part of this prototype.
- Inspect existing screen, layout, shadcn, custom, mock, and service files before changing
  implementation. Do not mass-edit managed UI files or rewrite unrelated screens.
- When concurrent work exists, announce and verify the write set. Stop on overlapping or newly
  modified files and report the conflict rather than overwriting it.
- Every task must leave evidence with the exact scenario and invocation, exit status, relevant
  output, binary observable, and artifact path. Use the active OMO attempt directory when one
  is supplied; otherwise use `.omo/evidence/afiliados-front-plan/`.
