# Gate Review: Draft Badge Font Weight

- recommendation: APPROVE
- verdict: PASS
- blockers: []

## originalIntent

Diminuir o peso do texto do badge `Rascunho` para Helvetica Neue Regular.

## desiredOutcome

O badge continua exibindo `Rascunho`, com o mesmo fundo, cor, arredondamento e espaçamento, alterando somente a família/peso de `Helvetica_Neue:Medium` para `Helvetica_Neue:Regular`.

## userOutcomeReview

O resultado solicitado está presente em `src/modules/produtos/NewProductFlow.tsx:302-304`. A classe do badge é `rounded-md bg-[#fffaeb] px-2 py-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#dc6803]`, portanto texto, cor, fundo, raio, padding e tamanho permanecem iguais aos valores declarados no brief; apenas o token tipográfico está em Regular. Nenhuma regressão de copy, cor ou spacing foi encontrada na fonte.

O fluxo de teste abre `Novo produto`, encontra `Rascunho` e verifica a presença de Regular e ausência de Medium. A execução direta de `npx vitest run src/modules/produtos/ProdutosPage.test.tsx` passou com 3/3 testes. ESLint direcionado e `npm run typecheck` também passaram com exit code 0.

## Criteria Review

- C1: peso do texto de `Rascunho` em Regular: PASS. Evidência: `src/modules/produtos/NewProductFlow.tsx:302-304`.
- C2: copy preservada: PASS. Evidência: `src/modules/produtos/NewProductFlow.tsx:303` contém exatamente `Rascunho`.
- C3: cor e fundo preservados: PASS. Evidência: `bg-[#fffaeb]` e `text-[#dc6803]` permanecem na mesma classe em `src/modules/produtos/NewProductFlow.tsx:302`.
- C4: raio e spacing preservados: PASS. Evidência: `rounded-md px-2 py-1` permanecem na mesma classe em `src/modules/produtos/NewProductFlow.tsx:302`.
- C5: validações fornecidas: PASS reproduzido. Evidência: Vitest 3/3, ESLint exit 0, TypeScript exit 0 em 2026-08-17.

## Programming and Remove-AI-Slops Pass

Passagem direta realizada sobre os dois arquivos em escopo. A mudança de produção é uma substituição mínima de token, sem nova abstração, parsing, normalização, complexidade, defesa redundante, código morto ou scope drift.

O teste é estreitamente acoplado à implementação de classe e a asserção negativa de `Medium` verifica diretamente a remoção solicitada. Isso é uma NOTE de sobre-especificação/possível manutenção, não um blocker: o critério solicitado é precisamente o token tipográfico, o teste falhou no estado anterior informado e passou após a troca. Não há testes excessivos, tautologia derivada da saída, extração de produção desnecessária ou falsa cobertura de comportamento adicional introduzida por esta mudança.

Nenhum code review report específico desta alteração foi fornecido ou localizado. A ausência não bloqueia porque esta revisão direta cobre os critérios `programming` e `remove-ai-slops` exigidos.

## Checked Artifact Paths

- `src/modules/produtos/NewProductFlow.tsx`
- `src/modules/produtos/ProdutosPage.test.tsx`
- `package.json`
- `.omo/evidence/` (consultado para relatórios/evidências relacionados)

## Exact Evidence Gaps

- Não existe screenshot/browser QA capturado para esta troca. Isso reduz a confirmação visual em runtime, mas não viola critério declarado: a classe fonte comprova Regular e preserva literalmente copy, cores e spacing.
- O comando `omo ulw-loop status --json` não estava disponível (`command not found`), portanto não foi possível obter `currentAttemptDir`; foi usado o fallback exigido em `.omo/evidence/`.
- O red anterior não foi reproduzido porque isso exigiria modificar/reverter temporariamente o arquivo, proibido pelo modo read-only. O red foi apenas evidência fornecida; o green atual foi reproduzido diretamente.

## Notes

- O arquivo `NewProductFlow.tsx` aparece como untracked no estado Git atual, portanto `git diff` não exibe seu hunk. A fonte atual foi inspecionada diretamente. Esse estado não viola o resultado visual solicitado.
