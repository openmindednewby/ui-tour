# Changelog

## 1.0.1

- Show me and Auto clicks reach the control a real pointer would hit: a React Native Web switch or checkbox wrapper now toggles its input instead of swallowing the click.

## 1.0.0

- First release: `TourProvider`, `useTour`, `TourPicker`, `FirstRunOffer`, `validateTours`, `findTarget`, `isForbiddenClick`.
- Guide me, Show me and Auto modes; write controls (Save, Submit, Approve, Reject, Delete, Reset, Pay, Send) are never clicked.
- Route changes through the app's `navigate`; a reload resumes the same step from sessionStorage.
- All colours, radius and font come from the `theme` prop; all text from the `labels` prop.
