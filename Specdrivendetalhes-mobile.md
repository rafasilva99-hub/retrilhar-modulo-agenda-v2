# [RETRILHAR] [AGENDA] Spec-driven: Responsividade mobile dos detalhes da atividade

Fontes: auditoria do código em `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx` (8.600+ linhas), evidências de QA mobile em `.omo/evidence/agenda-front-plan/task-6-details-mobile.md`, baseline de specs em `Specdrivenagenda:46`, e inventário de drawers/modais/overlays existentes no componente. Nada aqui foi inventado.

## 0. Legenda epistêmica

FATO (código auditado ou evidência existente), DECISAO FIRME (comportamento validado pelo teste de usabilidade ou baseline pronto), INFERENCIA (padrão derivado do que já funciona), PROPOSTA (design a validar).

---

## 1. Contexto

O `AgendaAtualizacoes.tsx` implementa a tela de detalhes da atividade com 13+ drawers, modais e overlays. O baseline mobile foi parcialmente construído: a página principal, o bottom menu (resumo, equipe, histórico como bottom sheet), os cenários de QR code e os modais de confirmação (check-in, cancelar, no-show, cancelar em lote, no-show em lote) já funcionam em mobile com pattern de bottom sheet.

**O que falta** são os drawers de painel lateral (right-side drawers de 640-720px) que no desktop deslizam da direita mas no mobile não têm adaptação e ficam cortados ou inacessíveis. Esses drawers devem virar bottom sheets no mobile, seguindo o padrão já estabelecido nos cenários de QR code e no bottom menu.

---

## 2. Inventário: estado atual de cada overlay

### Ja prontos para mobile (nao precisam de trabalho)

| Componente | Tipo desktop | Tipo mobile | Linhas | Status |
| --- | --- | --- | --- | --- |
| Bottom menu (resumo, equipe, histórico) | Tabs desktop | Bottom sheet fullscreen | 8150-8500 | PRONTO |
| QR Scanner (8 cenários) | Right drawer 576px | Bottom sheet 72vh | 3871-4354 | PRONTO |
| Check-in modal (single e bulk) | Modal centralizado | Bottom sheet | 5897-6009 | PRONTO |
| Cancelar reserva modal | Modal centralizado | Bottom sheet | 6010-6062 | PRONTO |
| No-show modal | Modal centralizado | Bottom sheet | 6064-6104 | PRONTO |
| Cancelar em lote modal | Modal centralizado | Bottom sheet | 6916-7094 | PRONTO |
| Resultado cancelamento em lote | Modal centralizado | Bottom sheet | 7095-7160 | PRONTO |
| No-show em lote modal | Modal centralizado | Bottom sheet | 7161-7217 | PRONTO |
| Pendentes na conclusão (nested) | Modal centralizado | Bottom sheet | 3029-3075 | PRONTO |
| Badge sheet | N/A (desktop oculto) | Bottom sheet | 7241-7257 | PRONTO |
| Header more actions | Dropdown | Bottom sheet (md:hidden) | 4683-4762 | PRONTO |
| Confirmar saída modal | Modal centralizado | Bottom sheet | 8590-8643 | PRONTO |

### Pendentes: drawers desktop-only que precisam de adaptação mobile

| # | Componente | Tipo desktop | Largura | Linhas | Estado mobile |
| --- | --- | --- | --- | --- | --- |
| D1 | Drawer de participante | Right drawer | 720px | 1488-1981 | SEM MOBILE |
| D2 | Drawer de pagamento | Right drawer | 720px | 2305-2456 | SEM MOBILE |
| D3 | Drawer de filtros | Right drawer | 720px | 2510-2780 | SEM MOBILE |
| D4 | Concluir atividade | Right drawer | 640px | 2783-3028 | SEM MOBILE |
| D5 | Reagendamento | Right drawer | 720px | 6106-6916 | SEM MOBILE |
| D6 | Equipe responsável (header) | Right drawer | 640px | 5492-5595 | SEM MOBILE |
| D7 | Listas e manifestos | Right drawer | 720px | 5597-5793 | SEM MOBILE |
| D8 | Ficha do participante | Right drawer | 720px | 5794-5866 | SEM MOBILE |

---

## 3. Padrão de bottom sheet mobile (referência)

O padrão já validado no projeto segue estas convenções. FATO (código auditado em QR scanner e bottom menu).

### Estrutura visual

```
Container: fixed inset-0 z-[N] flex flex-col justify-end md:hidden
Overlay:   absolute inset-0 bg-black/40 transition-opacity duration-200
Sheet:     relative z-10 bg-white rounded-t-[16px]
           shadow-[0px_-8px_24px_0px_rgba(0,0,0,0.12)]
           animate-in slide-in-from-bottom duration-200
Handle:    flex justify-center pt-[8px] pb-[4px]
           > div w-[36px] h-[4px] rounded-full bg-[#d0d5dd]
Safe area: pb-[calc(12px+env(safe-area-inset-bottom))]
```

### Comportamento

- Abre deslizando de baixo para cima (slide-in-from-bottom)
- Fecha com tap no overlay, botão X ou tecla Escape
- Altura padrão: `max-h-[90vh]` para conteúdo curto, `h-full pt-[46px]` para conteúdo longo (fullscreen)
- Scroll interno no body, header e footer fixos
- Animação de saída: `animate-out slide-out-to-bottom duration-200 fill-mode-forwards`
- Para drawers com conteúdo longo (participante, reagendamento, manifestos): usar fullscreen `h-full pt-[46px]`
- Para drawers com conteúdo curto/médio (filtros, conclusão): usar `max-h-[90vh]`

### Decisão desktop vs mobile

O componente já usa o hook `useIsMobile()` (breakpoint 768px). O padrão recomendado:

- **Classes responsive (preferido):** manter o container desktop como está e adicionar variantes `md:` para esconder/mostrar. No mobile, renderizar o bottom sheet. Usar `md:hidden` no container mobile e `hidden md:flex` no container desktop.
- **Condicional com hook (quando o layout diverge demais):** usar `isMobile` para renderizar JSX completamente diferente (caso do reagendamento que tem calendário complexo).

---

## 4. Specs por drawer

### D1. Drawer de participante como bottom sheet

**Estado atual:** Right drawer de 720px com seções colapsáveis (dados de saúde, pagamento, anexos), avatar, badges de status, botões de ação (check-in, desfazer, no-show, copiar ID). Slide-in da direita, 200ms. Linha 1575: `w-[720px]`. FATO.

**Estado alvo:** No mobile, vira bottom sheet fullscreen (`h-full pt-[46px]`) com handle de arrasto, scroll interno e botões de ação no footer fixo com safe-area-inset-bottom.

**Comportamento mobile:**
- Header: handle + avatar reduzido + nome + botão X
- Body: scroll vertical com seções colapsáveis preservadas
- Footer fixo: botões de ação (check-in, desfazer, no-show) empilhados verticalmente (`flex-col gap-[8px]`)
- Safe area: `pb-[calc(12px+env(safe-area-inset-bottom))]`

**Critérios de aceite:**
- [ ] No mobile (< 768px), drawer abre como bottom sheet fullscreen
- [ ] No desktop (>= 768px), comportamento inalterado
- [ ] Todas as seções colapsáveis funcionam no bottom sheet
- [ ] Botões de ação acessíveis sem scroll
- [ ] Sem overflow horizontal no viewport 390x844
- [ ] Animação de entrada/saída coerente com o padrão

**Complexidade:** Alta (maior drawer, mais seções, mais ações)
**Prioridade:** P0 (fluxo principal do teste de usabilidade)

---

### D2. Drawer de pagamento como bottom sheet

**Estado atual:** Right drawer de 720px com detalhes de pagamento da reserva: status, valores, histórico de transações, informações de estorno. Linha 2320: `w-[720px]`. FATO.

**Estado alvo:** No mobile, vira bottom sheet com `max-h-[90vh]` e scroll interno.

**Comportamento mobile:**
- Header: handle + título "Pagamento" + botão X
- Body: scroll vertical com informações de pagamento
- Footer: botões de ação se houver

**Critérios de aceite:**
- [ ] No mobile, drawer abre como bottom sheet com max-h-[90vh]
- [ ] No desktop, comportamento inalterado
- [ ] Valores e badges de status legíveis em tela estreita
- [ ] Sem overflow horizontal

**Complexidade:** Média
**Prioridade:** P1

---

### D3. Drawer de filtros como bottom sheet

**Estado atual:** Right drawer de 720px com checkboxes para alertas, tarifa, seguro, pedidos e período. Linha 2533: `w-[720px]`. Renderiza inline (sem portal). FATO.

**Estado alvo:** No mobile, vira bottom sheet com `max-h-[90vh]`, handle de arrasto e botões "Limpar" e "Aplicar" no footer fixo.

**Comportamento mobile:**
- Header: handle + título "Filtros" + botão X
- Body: scroll vertical com grupos de checkboxes
- Footer fixo: "Limpar filtros" (secundário) + "Aplicar" (primário)

**Critérios de aceite:**
- [ ] No mobile, filtros abrem como bottom sheet (nao inline)
- [ ] No desktop, comportamento inalterado
- [ ] Checkboxes com touch target mínimo de 44px
- [ ] Footer fixo com botões de ação
- [ ] Sem overflow horizontal

**Complexidade:** Média
**Prioridade:** P0 (filtros são usados constantemente no teste)

---

### D4. Concluir atividade como bottom sheet

**Estado atual:** Right drawer de 640px com resumo dos participantes (compareceram, nao compareceram, cancelaram, total esperado), inputs de horário real, textarea de observações, seção de intercorrência (sim/nao com tipo, gravidade, descrição). Linha 2840: `w-[640px]`. FATO.

**Estado alvo:** No mobile, vira bottom sheet fullscreen (`h-full pt-[46px]`) com scroll interno e botão "Concluir" no footer fixo.

**Comportamento mobile:**
- Header: handle + título "Concluir atividade" + botão X
- Body: scroll vertical preservando layout de formulário
- Resumo de participantes: grid 2x2 em vez de row
- Inputs de horário: `flex-col` em vez de `flex-row`
- Seção de intercorrência: largura total
- Footer fixo: "Cancelar" + "Concluir atividade"

**Critérios de aceite:**
- [ ] No mobile, drawer abre como bottom sheet fullscreen
- [ ] No desktop, comportamento inalterado
- [ ] Inputs de horário usáveis em touch (não cortados)
- [ ] Botões de gravidade de intercorrência com touch target adequado
- [ ] Modal nested de pendentes (já mobile-ready) continua funcionando
- [ ] Sem overflow horizontal

**Complexidade:** Alta (formulário complexo, estados condicionais)
**Prioridade:** P0 (fluxo de conclusão é parte central do teste)

---

### D5. Reagendamento como bottom sheet

**Estado atual:** Right drawer de 720px com 3 modos (evento, sob demanda, hospedagem), cada um com calendário/seletores de data próprios, opcionais (transporte, lanches), e seletor de notificação. Linha 6168: `w-[720px]`. Usa createPortal. FATO.

**Estado alvo:** No mobile, vira bottom sheet fullscreen (`h-full pt-[46px]`) com scroll interno e footer fixo.

**Comportamento mobile:**
- Header: handle + título "Reagendar" + botão X
- Dropdown de tipo de atividade: largura total (`w-full`)
- Calendário: adaptado para viewport estreito (cells menores, font-size reduzido)
- Hospedagem: range picker em coluna vertical se necessário
- Opcionais: collapse/expand preservado
- Footer fixo: "Cancelar" + "Confirmar reagendamento"

**Critérios de aceite:**
- [ ] No mobile, drawer abre como bottom sheet fullscreen
- [ ] No desktop, comportamento inalterado
- [ ] Calendário legível e navegável em 390px
- [ ] Seletor de datas de hospedagem funcional em touch
- [ ] Dropdown de tipo de atividade não corta texto
- [ ] Sem overflow horizontal

**Complexidade:** Muito alta (3 modos com calendários diferentes)
**Prioridade:** P1

---

### D6. Equipe responsável (header) como bottom sheet

**Estado atual:** Right drawer de 640px com lista de guias, busca, menu de 3 pontos por guia (contratar/desfazer seguro, remover da equipe), banner de conflito, e contagem de seguros no footer. Linha 5495: `w-[640px]`. FATO.

**Estado alvo:** No mobile, vira bottom sheet fullscreen (`h-full pt-[46px]`), seguindo o mesmo padrão do "Equipe responsável" que já existe no bottom menu (mobileSheet === "equipe").

**Nota:** Já existe uma versão mobile de equipe no bottom menu (linha 8227-8500). Avaliar se é possível reutilizar a mesma renderização ou se o drawer do header tem funcionalidades adicionais (busca, menu de 3 pontos, contratar seguro) que o bottom menu nao tem. INFERENCIA: provavelmente o drawer do header é mais completo; o bottom menu pode ser uma versão simplificada de leitura.

**Comportamento mobile:**
- Header: handle + título "Equipe responsável" + botão X
- Busca: input full-width com ícone
- Lista: guias com avatar, nome, status do seguro
- Menu de ações por guia: abre como sub-bottom-sheet ou inline expandido
- Footer fixo: contagem de seguros + botão "Fechar"

**Critérios de aceite:**
- [ ] No mobile, drawer abre como bottom sheet fullscreen
- [ ] No desktop, comportamento inalterado
- [ ] Busca funcional em mobile
- [ ] Menu de 3 pontos por guia acessível em touch
- [ ] Sem duplicação desnecessária com o bottom menu de equipe
- [ ] Sem overflow horizontal

**Complexidade:** Média
**Prioridade:** P2

---

### D7. Listas e manifestos como bottom sheet

**Estado atual:** Right drawer de 720px com card de informações da atividade, grupos de participantes expandíveis, botões de exportar ficha por grupo, download de manifesto, timestamp de última atualização. Linha 5600: `w-[720px]`. FATO.

**Estado alvo:** No mobile, vira bottom sheet fullscreen (`h-full pt-[46px]`) com scroll interno.

**Comportamento mobile:**
- Header: handle + título "Listas e manifestos" + botão X
- Card de atividade: stack vertical, sem truncar
- Grupos: acordeon/expand preservado
- Botões de exportar: largura total
- Footer fixo: botão "Download manifesto"

**Critérios de aceite:**
- [ ] No mobile, drawer abre como bottom sheet fullscreen
- [ ] No desktop, comportamento inalterado
- [ ] Grupos expandíveis funcionam em touch
- [ ] Botões de exportar com touch target adequado
- [ ] Sem overflow horizontal

**Complexidade:** Média
**Prioridade:** P2

---

### D8. Ficha do participante como bottom sheet

**Estado atual:** Right drawer de 720px com dados de ficha de saúde e atestado do participante. Linha 5797: `w-[720px]`. FATO.

**Estado alvo:** No mobile, vira bottom sheet fullscreen (`h-full pt-[46px]`) com scroll interno.

**Comportamento mobile:**
- Header: handle + título "Ficha" + botão X
- Body: scroll vertical com campos de saúde
- Footer: botões de download/exportar

**Critérios de aceite:**
- [ ] No mobile, drawer abre como bottom sheet fullscreen
- [ ] No desktop, comportamento inalterado
- [ ] Campos de texto longos legíveis em tela estreita
- [ ] Sem overflow horizontal

**Complexidade:** Baixa
**Prioridade:** P2

---

## 5. Backlog priorizado

### Wave 1: Fluxo principal do teste (P0)

| Task | Drawer | Complexidade | Dependência |
| --- | --- | --- | --- |
| T1 | D1 - Drawer de participante | Alta | Nenhuma |
| T2 | D3 - Drawer de filtros | Média | Nenhuma |
| T3 | D4 - Concluir atividade | Alta | Nenhuma |

Podem rodar em paralelo. Sem dependências cruzadas.

### Wave 2: Fluxos secundários (P1)

| Task | Drawer | Complexidade | Dependência |
| --- | --- | --- | --- |
| T4 | D2 - Drawer de pagamento | Média | T1 (mesmo contexto de participante) |
| T5 | D5 - Reagendamento | Muito alta | T1 (abre a partir do participante) |

T4 e T5 podem rodar em paralelo entre si, mas depois de T1.

### Wave 3: Fluxos operacionais (P2)

| Task | Drawer | Complexidade | Dependência |
| --- | --- | --- | --- |
| T6 | D6 - Equipe responsável | Média | Nenhuma |
| T7 | D7 - Listas e manifestos | Média | Nenhuma |
| T8 | D8 - Ficha do participante | Baixa | Nenhuma |

Podem rodar em paralelo. Sem dependências cruzadas.

### Wave 4: QA final

| Task | Escopo | Dependência |
| --- | --- | --- |
| T9 | Teste integrado: navegar por todos os drawers no viewport 390x844, verificar transições entre drawers (ex.: participante > pagamento > voltar), confirmar que nenhum drawer quebrou no desktop | T1-T8 |

---

## 6. Guardrails de execução

1. **Nao quebrar o desktop.** Todo drawer mobile é aditivo. O container desktop (`w-[720px]`, right-aligned) fica intacto, envolvido por `hidden md:flex` ou condicional `!isMobile`.
2. **Nao duplicar lógica.** O estado (open/close, dados, animação) já existe. A adaptação mobile reutiliza os mesmos state variables e handlers. Nao criar estados paralelos.
3. **Manter portal.** Os drawers que já usam `createPortal` continuam usando. O bottom sheet mobile também renderiza via portal.
4. **Preservar acessibilidade.** Handle de arrasto visual, foco no primeiro elemento interativo ao abrir, Escape para fechar, overlay para fechar.
5. **Safe area.** Todo footer de bottom sheet usa `pb-[calc(12px+env(safe-area-inset-bottom))]`.
6. **Animações consistentes.** Entrada: `animate-in slide-in-from-bottom duration-200`. Saída: `animate-out slide-out-to-bottom duration-200 fill-mode-forwards`. Overlay: `transition-opacity duration-200`.
7. **Sem novos pacotes.** Nao trazer bibliotecas de bottom sheet (react-spring, framer-motion, react-modal-sheet). Usar as mesmas classes Tailwind e utilidades de animação que o projeto já usa.
8. **Arquivo alvo.** O trabalho acontece dentro de `src/imports/AgendaAtualizacoes/AgendaAtualizacoes.tsx`. Se algum componente for extraído para facilitar a manutenção, colocar em `src/imports/AgendaAtualizacoes/components/`.
9. **Verificação por task.** Cada task roda `npm run check` e valida no viewport 390x844 (Playwright ou Chrome DevTools MCP) que nao há overflow horizontal e que o drawer abre/fecha corretamente.
10. **Nao tocar em modais que já funcionam.** Os modais de confirmação (check-in, cancelar, no-show e variantes bulk) já têm bottom sheet mobile. Nao alterar.

---

## 7. Padrão de implementação por drawer

Para cada drawer, o executor segue este template:

```tsx
// 1. Manter o container desktop existente, adicionar hidden md:flex
<div className="fixed inset-0 z-[60] flex items-stretch justify-end hidden md:flex">
  <div className="absolute inset-0 bg-black/40" onClick={onClose} />
  <div className="w-[720px] ...existing desktop classes...">
    {/* conteúdo desktop inalterado */}
  </div>
</div>

// 2. Adicionar container mobile com md:hidden
<div className="fixed inset-0 z-[60] flex flex-col justify-end md:hidden">
  <div className="absolute inset-0 bg-black/40 transition-opacity duration-200" onClick={onClose} />
  <div className="relative z-10 bg-white rounded-t-[16px] shadow-[0px_-8px_24px_0px_rgba(0,0,0,0.12)] h-full flex flex-col animate-in slide-in-from-bottom duration-200 pt-[46px]">
    {/* Handle */}
    <div className="flex justify-center pt-[8px] pb-[4px] shrink-0">
      <div className="w-[36px] h-[4px] rounded-full bg-[#d0d5dd]" />
    </div>
    {/* Header */}
    <div className="flex items-center justify-between px-[16px] py-[12px] shrink-0">
      <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[16px] text-[#181d27]">Título</p>
      <button onClick={onClose}>X</button>
    </div>
    {/* Body scroll */}
    <div className="flex-1 min-h-0 overflow-y-auto px-[16px]">
      {/* conteúdo adaptado para mobile */}
    </div>
    {/* Footer fixo */}
    <div className="shrink-0 px-[16px] pt-[12px] pb-[calc(12px+env(safe-area-inset-bottom))] border-t border-[#e9eaeb]">
      {/* botões de ação */}
    </div>
  </div>
</div>
```

O conteúdo interno pode ser compartilhado entre desktop e mobile quando a estrutura for similar, ou duplicado quando o layout diverge significativamente (caso do calendário de reagendamento).

---

## 8. Riscos e decisões

| # | Risco | Mitigação |
| --- | --- | --- |
| R1 | Arquivo muito grande (8.600+ linhas) dificulta navegação e diffs | Trabalhar por regiões de linha específicas. Nao reformatar o arquivo inteiro. |
| R2 | Drawer de participante tem sub-drawers (pagamento abre a partir dele) | Testar transição drawer > sub-drawer no mobile. Manter z-index correto. |
| R3 | Calendário de reagendamento pode nao caber em 390px | Reduzir font-size das cells e padding. Testar com 3 modos. |
| R4 | Bottom menu de equipe já existe e pode conflitar com drawer de equipe | Mapear funcionalidades de cada um. Se iguais, reutilizar. Se diferentes, manter ambos. |
| R5 | Animação de saída pode piscar se o state for limpo antes da animação | Usar pattern isClosing + setTimeout(200) já validado no projeto. |

---

## 9. Critérios de conclusão do spec inteiro

- [ ] Todos os 8 drawers (D1-D8) abrem como bottom sheet no viewport 390x844
- [ ] Nenhum drawer quebrou no viewport desktop 1280x800
- [ ] Sem overflow horizontal em nenhuma tela mobile
- [ ] Todas as ações (botões, checkboxes, inputs) acessíveis por touch
- [ ] Transições entre drawers encadeados funcionam (participante > pagamento > voltar)
- [ ] `npm run check` passa (lint, types, build)
- [ ] Teste Playwright ou evidência de QA visual para cada drawer no mobile
