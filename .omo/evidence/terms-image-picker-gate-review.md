# Gate review: terms editor image picker (Visual QA Pass A)

recommendation: APPROVE (user-facing verdict: PASS)

## originalIntent

Clicking the terms rich-text editor button whose accessible name is `Adicionar imagem` must open the native system image picker and insert the selected image into the term editor.

## desiredOutcome

A real React/DOM interaction, not prompt/URL behavior or a mock: an accessible toolbar button invokes an `accept="image/*"` file input, the selected local image becomes an `<img>` in `aria-label="Texto do termo"`, the editor HTML is synchronized, and the interaction has no blocking UX or accessibility defect.

## successCriteria

- `IMG-PICKER-1`: Activating `Adicionar imagem` opens the browser/system file chooser.
- `IMG-INSERT-2`: Choosing an image inserts it into the terms editor as real image DOM and synchronizes the editor HTML/draft.
- `REAL-DOM-3`: The behavior is implemented in production React/DOM code, not with a prompt, URL-only path, static raster, or test-only mock.
- `UX-A11Y-4`: The image-picker flow has no blocking UX or accessibility issue.

## userOutcomeReview

PASS. A fresh headless Chrome reproduction against the already-running Vite app clicked `Novo produto`, opened `Participante e termos`, activated the exact `button[aria-label="Adicionar imagem"]`, observed and accepted the native file chooser, and waited for a real descendant `img[src^="data:image/png"]` in the terms editor. The resulting DOM had a data-URL image, `max-width: 100%`, automatic height, synchronized editor HTML and a persisted draft; focus returned to `Texto do termo`. There were no console/page errors.

The source independently confirms the complete production path: the toolbar button calls `handleInsertImage`; that invokes the hidden native file input; its change handler reads an image with `FileReader`; `insertImageIntoEditor` creates and inserts a real `<img>` at the current selection or appends it; then `syncEditorHtml` propagates `innerHTML` to React state.

The control is a native `button type="button"` with an explicit accessible name and visible focus treatment. Keyboard activation therefore uses normal button semantics. The input restricts the picker to `image/*`, cancel/no-file is harmless, and clearing the input value permits choosing the same file again. No blocking UX or accessibility issue was found.

## blockers

None.

## notes

- `[evidence]` The supplied upload fixture is a transparent 1x1 PNG, so the inserted content cannot be visually distinguished in either screenshot. This does not block `IMG-INSERT-2` because fresh browser DOM evidence proves the image node, data URL, synchronized HTML, and persisted draft.
- `[product]` Inserted images receive `alt=""` and there is no alt-text authoring UI. This makes an inserted content-bearing image silent to screen readers. It is an accessibility enhancement worth addressing, but it does not block the picker/insertion flow required by `UX-A11Y-4` as stated.
- The target file is 8,994 pure LOC, well above the programming/remove-ai-slops 250 LOC ceiling. This is existing architectural debt and is not tied to a stated success criterion, so it is a note rather than a blocker.

## directProgrammingAndSlopPass

- No `any`, type assertion, non-null assertion, `@ts-ignore`, `@ts-expect-error`, catch/swallow, debug logging, new dependency, parser/normalizer, or unrelated abstraction was introduced in the reviewed image path.
- The single image insertion helper is shared by the terms editor and communication editors; it is not a speculative single-use extraction.
- The duplicated per-editor input/ref/handler plumbing is maintenance duplication, but preserving separate editor state makes it scoped and does not violate a success criterion.
- No new tests were included in the changed-file artifact. Therefore no deletion-only, removal-verification, tautological, implementation-mirroring, or excessive test was introduced. The browser check asserts observable behavior through the real UI rather than mirroring implementation.
- No task-specific code-review report, manual-QA matrix file, or notepad was found. Direct source review and a fresh browser reproduction provide the required completion evidence; the absence is not tied to a stated success criterion.

## checkedArtifactPaths

- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/src/modules/produtos/NewProductFlow.tsx` (source mtime 2026-08-20 01:50:28; image path at lines 2456-2481, 2494-2559, 2613-2620, 2713-2715; toolbar primitive at 3071-3094)
- `/tmp/retrilhar-terms-image-upload-desktop.png` (valid 1280x900 RGB PNG; mtime 2026-08-20 01:53:49)
- `/tmp/retrilhar-terms-image-upload-mobile.png` (valid 375x900 RGB PNG; mtime 2026-08-20 01:53:50)
- `/tmp/retrilhar-editor-image.png` (valid transparent 1x1 PNG fixture)
- `/Users/rafaelsilva/Documents/Projetos HTML/Retrilhar - Módulo de Agenda V2/.omo/evidence/responsibility-terms-editor-pass-a-gate-review.md` (older review; inspected as untrusted historical context)
- Git status and no-index target-file diff; the target file is untracked, so no baseline hunk-level diff exists.
- Existing live app at `http://127.0.0.1:5173/#produtos`; no server or build was started by this review.

## reproducedEvidence

Fresh Chrome result: `imageExists=true`, `srcPrefix="data:image/png;base64,"`, `alt=""`, `maxWidth="100%"`, `height="auto"`, `editorHtmlIncludesImage=true`, `fileInputs=3`, all file inputs `accept="image/*"`, exact button label present, active element after insertion `Texto do termo`, draft contains image data, and `consoleErrors=[]`.

## exactEvidenceGaps

- No serialized executor JSON artifact was supplied; the prior result existed only in the brief. This reviewer independently reproduced it.
- The 1x1 transparent fixture prevents meaningful visual confirmation of the inserted pixels in the supplied captures.
- No task-specific code-review report demonstrates programming/remove-ai-slops coverage; this report records the direct reviewer pass instead.
- No ulw-loop plan could be queried because the `omo` executable is unavailable, so the mandated fallback path `.omo/evidence/terms-image-picker-gate-review.md` was used.
