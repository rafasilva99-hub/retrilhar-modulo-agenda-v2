# Gate Review: event-only callout

- recommendation: APPROVE
- reviewType: Visual QA pass B - visual fidelity and interaction precision
- originalIntent: Clicking `Apenas com evento` must hide the `Funcionamento` section and show the supplied informational notice beneath the contract-mode cards, using the established compact info-callout visual structure.
- desiredOutcome: The event-only card is visibly selected; the on-demand card is not selected; `Funcionamento` is absent; the complete event-only guidance appears in a compact, visually consistent info callout.

## User outcome review

PASS. The supplied screenshot shows the requested settled state. The selected `Apenas com evento` card has the established blue border, pale-blue background, blue icon/title/body treatment; `Sob demanda` remains neutral. The notice appears immediately below the card pair and before `Capacidade e duração`, with no visible `Funcionamento` label or options.

The notice exactly reuses the repository's established compact callout geometry and styling: 24 px icon, 10 px icon/text gap, 12 px horizontal and 8 px vertical padding, 10 px radius, `#f8f9fc` background, `#f5f5f5` border, and 12/14 px body type. The complete required copy is visible, including the mandatory-date warning and different-prices-per-date explanation.

Source tracing confirms this is a real interaction state: the card click sets `productContractMode` to `eventOnly`; that state renders `ProductEventOnlyNotice`; the same state returns `null` for the complete `Funcionamento` block. The receipt independently records `eventOnlyPressed: "true"`, `onDemandPressed: "false"`, `hasNotice: true`, `hasFuncionamento: false`, with no console messages or page errors.

## Criteria checked

- C1 layout and spacing: PASS. Callout aligns to the card grid width, sits directly below it, and preserves the surrounding section rhythm.
- C2 icon size: PASS. 24 px, matching existing compact info callouts.
- C3 background/border/radius: PASS. Exact established values: `#f8f9fc`, `#f5f5f5`, 10 px.
- C4 text presence: PASS. All requested semantic content is present and legible.
- C5 interaction removes Funcionamento: PASS. Confirmed by receipt, screenshot, and conditional source path.
- C6 selected-card state: PASS. `Apenas com evento` is pressed/blue; `Sob demanda` is unpressed/neutral.

## Direct slop and programming pass

No criterion-blocking slop, overfit test, tautological test, deletion-only test, unnecessary parsing/normalization, new abstraction, unsafe typing, or scope drift was found in the reviewed change. `ProductEventOnlyNotice` is a small focused component and the state branch is direct. The file is substantially over the programming skill's 250 pure-LOC guideline, but that is pre-existing/outside this visual criterion and is therefore a NOTE, not a blocker.

## Blockers

None.

## Notes and exact evidence gaps

- The original user reference image was not included among the supplied artifact paths, so this review could not perform a direct pixel comparison against that image. The implementation was instead compared against the explicitly requested existing compact-callout pattern in repository source, where its visual values match exactly. This does not violate a stated success criterion.
- The screenshot/receipt timestamp precedes the current source-file modification time by approximately 35 seconds. Current source still contains the exact rendered copy, styling, and state branch shown by the evidence. This is an evidence-freshness note, not a demonstrated criterion failure.
- No separate code-review report, manual-QA matrix, or notepad path was supplied. The receipt and direct artifact/source inspection provide the requested criterion coverage.

## Checked artifact paths

- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/NewProductFlow.tsx`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/ProdutosPage.tsx`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/event-only-callout/event-only-callout.png`
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/event-only-callout/receipt.json`
