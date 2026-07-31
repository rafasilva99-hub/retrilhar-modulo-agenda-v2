# Gate Review: remove-dashboard-shortcuts

## recommendation

APPROVE

Visual-QA verdict: PASS  
Confidence: HIGH

## blockers

None.

## originalIntent

Remove the rendered affiliate-dashboard shortcuts block identified by
`<nav aria-label="Atalhos do painel">`, including the links Indicações, Ganhos,
Produtos e links, Configurações, and Ajuda, without creating an obvious desktop
or mobile visual regression.

## desiredOutcome

- VF-1: On desktop, the search/filter controls follow the KPI cards directly;
  the shortcuts card/navigation is not rendered.
- VF-2: On mobile, the shortcuts navigation is absent. Existing shell overflow
  is reported separately and blocks only if this diff caused it.
- VF-3: CJK precision is not applicable because the visible content is
  Portuguese/Latin text.
- VF-4: The captures are readable and valid, and DOM evidence proves the
  targeted navigation is absent while core surrounding content remains.

## userOutcomeReview

The shipped render satisfies the requested outcome. The 1280 x 900 screenshot
shows the four KPI cards followed immediately by the search, organization, and
period controls, with no intermediate shortcuts card. The 375 x 900 screenshot
also contains no shortcuts navigation. It displays horizontal shell/content
overflow, but the reviewed diff only deletes the navigation constant,
component, and render call; an older 390 px affiliate capture already exhibits
the same fixed-sidebar mobile shell pattern. This is therefore a non-blocking,
pre-existing product note under VF-2.

The desktop DOM contains zero
`nav[aria-label="Atalhos do painel"]` elements. The surrounding affiliate page
and the remaining `Ver links por organização` action are present. Source order
also places `KpiRow` immediately before the filters container.

## evidenceTrace

- VF-1 PASS: `.omo/evidence/remove-dashboard-shortcuts/afiliados-1280.png`
  is a valid 1280 x 900 RGB PNG. Direct inspection shows KPIs flowing directly
  into filters.
- VF-2 PASS: `.omo/evidence/remove-dashboard-shortcuts/afiliados-375.png`
  is a valid 375 x 900 RGB PNG. Direct inspection shows no shortcuts block.
- VF-2 context: `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-afiliados-390x844.png`
  shows the prior mobile shell layout, supporting that the current narrow-screen
  overflow is not introduced by this deletion-only product diff.
- VF-4 PASS: `.omo/evidence/remove-dashboard-shortcuts/afiliados-1280.dom.html`.
  `rg -n 'Atalhos do painel' ...` exited 1 with no match;
  `rg -n 'Oi Katiely|Ver links por organização|Pesquisar indicações' ...`
  exited 0. A direct JSDOM query returned `navCount: 0` for
  `nav[aria-label="Atalhos do painel"]`.
- Freshness PASS: `AfiliadosPage.tsx` was last modified at 08:20:35 and its
  test at 08:21:40; desktop capture/DOM were created at 08:23:57 and mobile at
  08:25:28 on 2026-07-21.
- Behavior check PASS: `CI=1 npm test -- src/modules/afiliados/AfiliadosPage.test.tsx --reporter=verbose`
  exited 0 with 2/2 tests passing. An earlier reviewer-induced concurrent run
  timed out; the clean exact rerun completed in 2.19 seconds.
- Changed-file lint PASS: `npx eslint src/modules/afiliados/AfiliadosPage.tsx src/modules/afiliados/AfiliadosPage.test.tsx --max-warnings=0 --report-unused-disable-directives`
  exited 0.
- Changed-file format PASS: `npx prettier src/modules/afiliados/AfiliadosPage.tsx src/modules/afiliados/AfiliadosPage.test.tsx --check`
  exited 0.
- Diff integrity PASS: `git diff --check` exited 0.

## checkedArtifactPaths

- `src/modules/afiliados/AfiliadosPage.tsx`
- `src/modules/afiliados/AfiliadosPage.test.tsx`
- `.omo/evidence/remove-dashboard-shortcuts/afiliados-1280.png`
- `.omo/evidence/remove-dashboard-shortcuts/afiliados-375.png`
- `.omo/evidence/remove-dashboard-shortcuts/afiliados-1280.dom.html`
- `.omo/evidence/afiliados-front-plan/f3-real-qa-rerun/screenshots/route-afiliados-390x844.png`
- `CLAUDE.md`
- `.claude/rules/afiliados.md`
- `package.json`

## directSkillPerspectiveReview

### remove-ai-slops / overfit pass

- Production diff: clean deletion of the obsolete constant, single-use
  navigation component, and render call. It introduces no extraction, parser,
  normalization, wrapper, defensive branch, dead import, or duplicate behavior.
- Test diff: the negative accessible-role assertion is a removal-specific test
  and therefore matches the deletion-only-test smell. This is a NOTE, not a
  blocker: it does not violate VF-1 through VF-4, it asserts the exact
  user-visible removal at the DOM accessibility layer, and the same test also
  verifies the surviving `Ver links por organização` navigation behavior.
- No tautological, implementation-derived expected value, excessive test
  matrix, or unnecessary production abstraction was found.

### programming pass

- No strict-type escape hatch, new mutable model, parameter bloat, negative
  naming, broad catch, logging change, or new helper was introduced.
- `AfiliadosPage.tsx` remains oversized at 764 pure LOC, above the skill's
  250-LOC threshold. This is pre-existing maintenance debt and the current diff
  reduces the file; modularization was neither requested nor a stated visual
  success criterion, so it is a NOTE rather than a blocker.

## reportCoverageReview

No task-specific executor report, code-review report, manual-QA matrix, or
notepad was present in `.omo/evidence/remove-dashboard-shortcuts/`; that
directory contained the two screenshots, desktop DOM dump, and browser profile.
Accordingly, there is no report-authored remove-ai-slops/programming coverage to
confirm. Per gate policy, the direct artifact, diff, slop, and programming passes
above supply the completion evidence and do not create a rejection by
themselves.

## exactEvidenceGaps

- No mobile DOM dump was supplied. The mobile screenshot directly proves the
  requested visual absence, while the desktop DOM proves semantic removal, so
  VF-2 and VF-4 remain satisfied.
- No before/after pixel baseline exists at exactly 375 x 900. The requested
  operation is a block removal rather than a reference-fidelity clone, and
  direct source plus desktop/mobile capture inspection is sufficient.
- No task-specific code-review report, manual-QA matrix, or notepad exists.
  None is explicitly required by VF-1 through VF-4.
- Independent visual-QA subagent tools were unavailable in this session. The
  gate reviewer directly opened both required captures and reproduced the DOM,
  source, diff, and targeted test evidence.

## findings

- [product][NOTE] Mobile shell/content overflow is visible at 375 px, but is
  pre-existing and not caused by this deletion. No fix is required for this
  criterion-scoped change.
- [evidence][NOTE] The negative navigation assertion is removal-specific; the
  rendered screenshot and DOM dump are the stronger proof of the visual outcome.
- [maintenance][NOTE] `AfiliadosPage.tsx` remains a 764-pure-LOC legacy module;
  this change reduces rather than expands it.
