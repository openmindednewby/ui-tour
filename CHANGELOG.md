# Changelog

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
