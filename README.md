# @dloizides/ui-tour

In-app guided tours for React Native Web apps. Three modes:

- **Guide me**: the page is dimmed, the target is ringed, the user clicks it (or presses Next / Right arrow).
- **Show me**: a themed cursor moves to the target and clicks or types by itself, then waits for Next.
- **Auto**: like Show me, and advances on its own every 2 s; Space pauses.

Write controls (Save, Submit, Approve, Reject, Delete, Reset, Pay, Send) are never clicked. Only a tour flagged `allowSave`, in an app that passes `allowWrites`, may press a plain "Save".

Web only. On native (`Platform.OS !== 'web'`) the provider renders its children and the tour API does nothing.

## Install

```bash
npm install @dloizides/ui-tour
```

Peers: `react`, `react-dom`, `react-native` (with `react-native-web`).

## Quick start

```tsx
import { FirstRunOffer, StepAction, TargetRole, TourPicker, TourProvider, validateTours } from '@dloizides/ui-tour';
import type { Tour } from '@dloizides/ui-tour';

const tours: Tour[] = [
  {
    id: 'payees',
    title: 'Add a payee',
    category: 'Payments',
    steps: [
      { route: '/payees', target: 'payees-add-button', text: 'Open the new payee form', action: StepAction.Click },
      { target: { role: TargetRole.Field, name: 'Name' }, text: 'Type the payee name', action: StepAction.Type, value: 'Demo Payee' },
    ],
  },
];

validateTours(tours);

<TourProvider tours={tours} navigate={router.push} theme={tourTheme} user={user} onEvent={trackTourEvent} labels={tourLabels}>
  <App />
  <TourPicker />
  <FirstRunOffer />
</TourProvider>;
```

Open the picker from a Help menu with `useTour().openPicker()`; F2 opens it anywhere.

## API

| Export | What it is |
|---|---|
| `TourProvider` | `tours`, `navigate`, `theme`, `onEvent?`, `user?`, `labels?`, `allowWrites?`, `vars?`, `timing?`, `getPathname?`, `children` |
| `useTour()` | `start(tourId, mode)`, `next`, `back`, `end`, `togglePause`, `openPicker`, `closePicker`, `active`, `pickerOpen`, `tours` |
| `TourPicker` | Tours grouped by category, collapsible, step count, Guide me / Show me / Auto per tour; focus starts on the first tour |
| `FirstRunOffer` | `tourId?`, `mode?`: a dismissible card shown once per user; dismissing or finishing a tour hides it for good |
| `validateTours(tours)` | `{ valid, errors[] }`: every step needs a target and text; type steps need a value; ids are unique |
| `findTarget`, `isForbiddenClick` | The element finder and the write-control rule used by the engine |
| `defaultTourLabels`, `formatLabel` | English defaults; pass translated `labels` (placeholders `{{p1}}`, `{{p2}}`) |

A step target is a testID string (`data-testid`) or `{ role, name, nth?, exact?, within? }` with role `button`, `heading`, `group`, `field` or `text`. `{name}` placeholders in a step are filled from `vars`.

### Theme

Every colour comes from the `theme` prop; map it from your design tokens or tenant theme:

`accent`, `onAccent`, `surface`, `onSurface`, `muted`, `scrim`, `divider`, `radius`, `fontFamily`.

### Events

`onEvent({ type, tourId, mode })` with `type` one of `tour_start`, `tour_finish`, `tour_quit`. No personal data is sent.

### Routes and reload

Steps with a `route` call your `navigate` (never a full page load). The tour state lives in `sessionStorage`, so a reload resumes the same step. A missing target is awaited for 8 s; an `optional` step is then skipped, a required one shows "This step isn't available here" with Skip and End.

## License

MIT
