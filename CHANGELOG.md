# Changelog

## 1.2.1

- `toTourTheme` no longer trusts tokens to be contrast-safe: `onAccent` is white or the background, whichever contrasts more with the accent fill; the new optional `accentText` slot (step label, note, picker item) is the first primary shade reaching 4.5:1 on the caption surface (lighter first in dark, darker first in light), else the text colour. Fixes kefi dark (Next 3.05:1, label 2.75:1).

## 1.2.0

- `vars` placeholders are filled in a step's `route` too (`/t/{tenantSlug}/register`). `expectValidTours(tours, translations, vars)` reports a route placeholder that `vars` does not fill.
- The engine counts the optional steps it skipped in a run: the caption carries `data-tour-skipped`, and `tour_finish` carries `skipped` (a number, no PII).
- `playAllToursInAuto` reads that count into `TourRunResult.skipped`; `expectAllToursPlay` fails a tour that skipped more than `maxSkippedRatio` x steps (default 0.25).

## 1.1.2

- `expectAllToursPlay` fails when the picker lists no tours (app not mounted before F2) and when `ids` names a tour the picker does not list.

## 1.1.0

- `@dloizides/ui-tour/expo`: `AppTours` (one-line setup: expo-router navigate, theme adapter `toTourTheme`, translated labels, Umami events, picker, first-run card) and `TourButton` ("Take a tour").
- `@dloizides/ui-tour/testing`: `expectValidTours` / `findTourProblems` (missing text keys, malformed targets, repeated ids, write-control clicks).
- `@dloizides/ui-tour/playwright`: `playAllToursInAuto` / `expectAllToursPlay`, failures reported as `tour <id> step <n>/<m>: <reason>`.
- Caption font falls back to `sans-serif` (`fontStack`); the caption carries `data-tour-id`, `data-tour-step`, `data-tour-steps`.
- `expo-router` and `@playwright/test` are optional peers; the core entry stays React DOM only.

## 1.0.2

- A switch, checkbox or radio is a setting, so the write-control rule no longer refuses it: "Pay in a different currency" toggles, a "Pay" button is still never clicked.

## 1.0.1

- Show me and Auto clicks reach the control a real pointer would hit: a React Native Web switch or checkbox wrapper now toggles its input instead of swallowing the click.

## 1.0.0

- First release: `TourProvider`, `useTour`, `TourPicker`, `FirstRunOffer`, `validateTours`, `findTarget`, `isForbiddenClick`.
- Guide me, Show me and Auto modes; write controls (Save, Submit, Approve, Reject, Delete, Reset, Pay, Send) are never clicked.
- Route changes through the app's `navigate`; a reload resumes the same step from sessionStorage.
- All colours, radius and font come from the `theme` prop; all text from the `labels` prop.
