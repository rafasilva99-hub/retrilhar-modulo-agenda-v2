# Regras de fidelidade ao Figma — Retrilhar

## Direção de maturidade do front mockado

Este projeto é um protótipo de usabilidade, mas deve seguir a disciplina visual e estrutural do
`Retrilhar Admin` sempre que isso não trouxer backend, autenticação real ou rotas Next.js.

### Arquitetura alvo

- `src/components/ui/` — shadcn/ui gerenciado pelo preset; evitar edição manual salvo correção de integração.
- `src/components/layout/` — shell, sidebar, topbar, logo, `AppPage` e componentes de navegação.
- `src/components/custom/` — componentes reutilizáveis específicos da Retrilhar.
- `src/modules/[feature]/` — entrada de cada feature, com `components/`, `services/`, `types.ts` e `index.ts`.
- `src/mocks/` — dados mockados tipados e commitados; neste protótipo mocks são fonte de verdade.
- `src/imports/` — legado exportado do Figma Make; pode ser usado, mas deve ser encapsulado e refatorado gradualmente.

### Regras adaptadas do Retrilhar Admin

- Usar HugeIcons via `@hugeicons/react` + `@hugeicons/core-free-icons`; não introduzir novos pacotes de ícones.
- Preferir shadcn/ui e componentes de `src/components/layout/` antes de criar elementos nativos.
- Código novo não deve expor textos como "mock" na UI; mocks são implementação interna.
- Código novo deve consumir serviços mockados em `src/modules/*/services`, não arrays inline.
- Não trazer `better-auth`, SDK OpenAPI, `next-intl`, MSW real ou backend do Admin.
- Manter navegação por hash (`#agenda`, `#agendaDia`, `#atualizacoes`) enquanto o teste depender dela.
- Refatorar exports do Figma aos poucos: primeiro encapsular, depois extrair cards, badges, filtros, empty states e headers.
- Arquivos exportados do Figma podem permanecer com `@ts-nocheck` até serem transformados em código mantido.
- Rodar `npm run check` antes de considerar uma etapa concluída.

### Padrão para novas telas internas

- Usar `AppShell` para páginas autenticadas do protótipo.
- Usar `AppPage` quando a tela já estiver fora do export bruto do Figma.
- Usar `src/modules/agenda` como referência para organizar novas features mockadas.
- Preservar o fluxo crítico do teste: calendário → dia da agenda → atualizações/detalhes.

Estas regras orientam toda implementação no Antigravity. Devem ser salvas em `.claude/rules/agenda-fidelity.md` na raiz do projeto para que o Claude Code leia automaticamente no início de cada sessão.

## Cenário do projeto

O ponto de partida do código é o **export do Figma Make**, já importado no Antigravity. A partir daqui, o Claude Code refina, ajusta e estende esse código para chegar ao protótipo funcional do teste de usabilidade.

A fidelidade ao design não vem de screenshots nem de interpretação visual — vem de **duas fontes de verdade complementares**, acessadas via MCP:

- **Figma MCP** — autoridade sobre design system, tokens, componentes, hierarquia semântica e intenção do design. Acessa o arquivo Figma original (não o Figma Make).
- **Chrome DevTools MCP** — autoridade sobre a renderização final, validação visual da implementação e estados interativos. Acessa o código rodando em localhost.

## Quando usar cada MCP

A regra geral é: **Figma MCP para entender o que implementar**, **Chrome DevTools MCP para validar o que foi implementado**. Os dois nunca competem — eles cobrem fases diferentes do trabalho.

### Figma MCP — ANTES de implementar

Use o Figma MCP para responder perguntas sobre o design ANTES de tocar no código:

- Qual é a estrutura semântica desta tela? (hierarquia de containers, agrupamentos, regiões)
- Quais tokens estão sendo usados? (cores, tipografia, spacing, radius, sombras)
- Quais componentes do design system aparecem nesta tela? (Button, Badge, Card, etc.)
- Qual é a variante/state de cada componente? (Primary vs Secondary, Default vs Hover, Filled vs Outlined)
- Quais são as proporções e medidas exatas? (gap entre elementos, padding, dimensões fixas)
- Existem comentários ou anotações de design no arquivo?

### Chrome DevTools MCP — DURANTE e DEPOIS de implementar

Use o Chrome DevTools MCP para validar a renderização da implementação contra o design:

- A cor renderizada bate com o token do design? (comparar hex computado vs token Figma)
- O spacing renderizado é exatamente o especificado? (margin/padding em px)
- A tipografia (font-family, size, weight, line-height) corresponde ao design?
- Os estados interativos (hover, focus, active, disabled) estão fiéis?
- Componentes que só aparecem após interação (dropdowns abertos, drawers, modais, tooltips) estão corretos?
- A animação/transição reproduz o comportamento esperado?
- A responsividade está correta nos breakpoints (1280px, 1366px, 1440px, 1680px+)?

### Cenários onde ambos se complementam na mesma tarefa

Para a maioria dos prompts do módulo de Agenda, o fluxo será:

1. **Figma MCP primeiro:** ler `get_design_context` do nó relevante para entender estrutura, tokens e componentes.
2. **Inspeção do código herdado do Figma Make:** ver o que já existe no projeto Antigravity (estrutura de pastas, componentes, classes Tailwind).
3. **Implementação ou ajuste:** alinhar o código existente ao design e à arquitetura do projeto.
4. **Chrome DevTools MCP depois:** rodar o localhost, navegar até a tela, capturar DOM + estilos computados, comparar com a referência Figma.
5. **Ajustes finais:** corrigir divergências encontradas.

## Protocolo Figma MCP

Use `get_design_context` para cada nó relevante antes de implementar. Para o Antigravity com Gemini, o equivalente pode chamar tools diferentes — adaptar conforme a integração disponível, mas o princípio é o mesmo: ler o design via API antes de implementar.

O que extrair de cada nó:

- **Layer structure** — hierarquia de frames, grupos e componentes.
- **Tokens aplicados** — referências a `colors/`, `typography/`, `spacing/`, `radius/`, `effects/`.
- **Component instances** — identificar quando um elemento é instância de um componente do design system (e qual variante).
- **Auto-layout properties** — direction, gap, padding, alignment.
- **Constraints** — comportamento responsivo dos elementos.
- **Comentários e anotações** — se houver instruções do designer no arquivo.

## Protocolo Chrome DevTools MCP

A validação via Chrome DevTools MCP segue este fluxo:

1. **Navegar** até a URL da tela no localhost (ex.: `http://localhost:3000/agenda`).
2. **Capturar o snapshot do DOM** da página ou seção específica.
3. **Extrair estilos computados** dos elementos relevantes — cores em hex, font-family, font-size, font-weight, line-height, spacing em px, border-radius, box-shadow, transitions.
4. **Comparar valores extraídos** com tokens do projeto (`src/styles/tokens.css` ou `tailwind.config.ts`) e com os valores capturados via Figma MCP.
5. **Para componentes interativos** (dropdowns, drawers, modais, tooltips): interagir com o trigger (clique, hover) para abrir o estado expandido e capturar o DOM do estado aberto.
6. **Capturar estados de hover/focus** via emulação de eventos quando relevante.
7. **Para responsividade**: usar emulação de dispositivo do Chrome DevTools para validar em mobile (375px), tablet (768px) e desktop (1280px+).

## Trabalho sobre código existente (herança do Figma Make)

Como o ponto de partida é o código do Figma Make, **não comece do zero**. Antes de qualquer prompt de implementação:

- **Inspecione `src/components/`** e liste o que já existe. Reutilize componentes existentes antes de criar novos.
- **Inspecione `src/app/` ou `src/pages/`** para entender a estrutura de rotas já criada pelo Figma Make.
- **Verifique `tailwind.config.ts`, `globals.css` ou `src/styles/`** para entender quais tokens foram trazidos.
- **Identifique padrões do Figma Make que precisam ser substituídos** — classes Tailwind cruas hardcoded, componentes não-reutilizáveis, lógica inline em vez de hooks/contextos.

O Figma Make tende a gerar código que **funciona visualmente mas não segue boas práticas estruturais**: tudo em um único arquivo, sem separação de componentes, classes Tailwind hardcoded em vez de tokens. Trate o código herdado como ponto de partida visual, mas **refatore conforme implementa** cada prompt:

- Extrair componentes inline para arquivos separados em `src/components/agenda/`.
- Substituir classes Tailwind hardcoded por tokens do design system quando equivalente.
- Centralizar mock data em `src/mocks/` (em vez de inline em cada componente).
- Adicionar tipagem TypeScript estrita onde faltar.

## Tokens e design system

- **NUNCA hardcodar valores** que possam ser referenciados como tokens.
- Quando um valor capturado divergir dos tokens do projeto: preferir os tokens do projeto para manter consistência, mas ajustar spacing/sizing minimamente para preservar fidelidade visual.
- **Tipografia:** usar a escala Helvetica Neue.
- **Cores:** se `#000F2F` aparece, verificar se corresponde a `--color-primary-950` (ou equivalente) antes de hardcodar. Aplicar o mesmo princípio para todas as cores capturadas.
- **Ícones:** usar HugeIcons conforme `.claude/rules/icons.md`. Não importar novos pacotes de ícones (lucide-react, heroicons, etc.) que possam ter sido trazidos pelo Figma Make. Substituir conforme implementa.

## Componentes

- **SEMPRE inspecionar `src/components/ui/`** antes de criar qualquer componente novo.
- **Reutilizar componentes shadcn/ui já customizados** — não recriar.
- Para tabelas, filtros, sidebar, cards, badges, dropdowns, modais, drawers, tabs e barras de ação contextuais, existem componentes oficiais no projeto, na aba Cores, Grids, Branding e Componentes.
- Quando o Figma Make tiver criado um componente duplicando funcionalidade de algo que já existe no design system, **substituir pelo componente oficial** durante a refatoração.

## Validação final por tarefa

Antes de marcar qualquer tarefa como completa, executar este checklist:

1. **Comparação Figma vs implementação** — abrir o nó do Figma referente à tela e comparar com o resultado renderizado. Tokens, spacing, tipografia, hierarquia.
2. **Comparação via Chrome DevTools** — capturar os estilos computados da implementação e validar contra os valores esperados.
3. **Estados interativos** — testar hover, focus, active, disabled em todos os componentes interativos.
4. **Estados condicionais** — testar empty states, loading states, error states quando aplicáveis.
5. **Acessibilidade** — `Helvetica Neue` em todos os botões com texto, ordem de tab navegável, foco visível, modais/drawers com `Helvetica Neue` e foco trapeado.

Se houver divergência intencional entre design e implementação (ex.: acessibilidade, restrição técnica, decisão de arquitetura), documentar o motivo em comentário no código.

## Limites de uso e cuidados

- **Figma MCP tem rate limit.** Não chamar repetidamente para o mesmo nó na mesma sessão — guardar contexto do que já foi capturado.
- **Chrome DevTools MCP exige localhost rodando.** Garantir que `npm run dev` ou equivalente está ativo antes de chamar o MCP. Se a porta mudar, atualizar a URL base.
- **Trabalhar por seleção menor.** Capturar componentes ou seções individuais em vez do arquivo Figma inteiro ou da página completa do localhost. Resultados ficam mais precisos e o contexto não sobrecarrega.
- **Iteração é o caminho.** Após a primeira passada de implementação, comparar lado a lado e ajustar — em geral 2-3 iterações fecham gaps que uma única passada não pega.

## Módulo Gestão de Afiliados (Admin)

Spec de implementação da etapa corrente: `Etapa 01 · Fundação + Home de Afiliados (AFI-01)` (raiz do repositório).
Regras específicas: `.claude/rules/figma.md` e `.claude/rules/gestor-afiliados.md`.
Tokens extraídos do Figma: `design/tokens.json`.

Antes de qualquer tarefa neste módulo, ler o spec da etapa corrente.
Não implementar item marcado PENDENTE: renderizar placeholder com TODO e o ID da pendência.
As telas AFI compõem os blocos de `src/components/blocos/` (vitrine em `#devBlocos`).
