# Emoji picker — gate review (Visual QA pass B)

## recommendation

REJECT (user-facing verdict: REVISE)

## originalIntent

Add an emoji-library button immediately after underline in the `Template de e-mail` rich-text toolbar, with a familiar picker containing search, category tabs, an emoji list, and per-editor recent emojis after use.

## desiredOutcome

The button order is underline → emoji → color controls; the popover is visually coherent, readable, unclipped, accessible, and usable; insertion works at the restored caret; and `Recentes` appears after an emoji is inserted.

## userOutcomeReview

The screenshots confirm the emoji button is immediately after underline and before the color divider/control. The popover has a clear search field, an eight-column emoji grid, coherent local styling, and no text collision with the editor. The post-insertion screenshot confirms `Recentes` appears and the editor remains visually stable. However, the category strip visibly cuts off the next tab at the right edge in both states without a visible overflow affordance, making later categories undiscoverable and leaving the popover looking unfinished.

## blockers

- violatedCriterion: `2` — Popover controls must be usable, fit, and match a professional local visual pattern.
  evidencePointer: `.omo/evidence/emoji-picker-qa/emoji-picker-open.png` and `.omo/evidence/emoji-picker-qa/emoji-picker-recent.png`, category row at the right edge. The next category label/button is visibly clipped (`Vi...`/partial next tab) and no scrollbar, fade, arrow, or other overflow cue is shown.

## checkedArtifacts

- `.omo/evidence/emoji-picker-qa/emoji-picker-open.png` (PNG, 1440×1100, captured 2026-08-21 15:30:30)
- `.omo/evidence/emoji-picker-qa/emoji-picker-recent.png` (PNG, 1440×1100, captured 2026-08-21 15:30:31)
- `.omo/evidence/emoji-picker-qa/qa-result.json`
- `src/modules/produtos/NewProductFlow.tsx` (source timestamp 2026-08-21 15:26:08; captures are fresh)

## evidenceTrace

- Directly opened both screenshots at original detail.
- Re-read the supplied QA JSON from disk: insertion, recent tab, search, and category visibility are true; console messages and page errors are empty.
- Inspected `EditorEmojiToolbarControl`, `useEditorEmojiControl`, and both toolbar call sites in `NewProductFlow.tsx`.
- Accessibility labels exist for the picker trigger, search label, category tablist, emoji list, and each emoji option.
- Direct `remove-ai-slops`/`programming` pass: no tautological/deletion-only tests were supplied in this evidence packet; the feature uses a large in-file dataset and component inside an already oversized 12,194-line TSX module, a maintenance NOTE but not a blocker because no stated visual success criterion requires modularization.

## exactEvidenceGaps

- No screenshot or interaction evidence demonstrates horizontal navigation to the later category tabs.
- No code-review report, manual QA matrix, or notepad path was supplied or found in the emoji evidence directory. Direct artifact inspection was sufficient for the criteria above; these absences are not additional blockers.
- No separate keyboard-navigation QA evidence was supplied for the tablist or emoji options; labels are present in source, so this remains a note rather than a blocker under the stated criteria.

## notes

- Criterion 1 passes: button placement is correct in the screenshot and source.
- Criterion 3 passes: `Recentes` appears after insertion and the UI remains stable.
- Functional QA passes for insertion/search/category/recent visibility with no console or page errors.
