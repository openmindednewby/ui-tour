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

`accent`, `onAccent`, `surface`, `onSurface`, `muted`, `scrim`, `divider`, `radius`, `fontFamily`. The font always falls back to `sans-serif` (`fontStack`).

### Events

`onEvent({ type, tourId, mode })` with `type` one of `tour_start`, `tour_finish`, `tour_quit`. No personal data is sent.

### Routes and reload

Steps with a `route` call your `navigate` (never a full page load). The tour state lives in `sessionStorage`, so a reload resumes the same step. A missing target is awaited for 8 s; an `optional` step is then skipped, a required one shows "This step isn't available here" with Skip and End.

## Adopt tours in an Expo Router app (`@dloizides/ui-tour/expo`)

One provider line in the root layout. Router navigation, theme (light/dark), translated labels, Umami events, the picker, F2 and the first-run card come from the kit.

```tsx
import { AppTours, TourButton } from '@dloizides/ui-tour/expo';
import { TOURS } from '../tours';

<AppTours tours={TOURS} translate={FM} theme={theme} user={user} vars={vars}>
  <Stack />
</AppTours>;

<TourButton />
```

| Prop | What it is |
|---|---|
| `tours` | Key-based tours: `title`, `category` and each step `text` are translation keys |
| `translate` | The app translate function (`FM`); a missing key keeps the English default |
| `theme` | The app theme (`colors`, `palette.primary`, `mode?`, `typography?`); `dark?` overrides the mode |
| `user`, `vars`, `allowWrites`, `onEvent` | As on `TourProvider`; events also go to Umami (`window.umami.track`, tour id and mode only) |
| `navigate` | Overrides `useRouter().push` |
| `labelPrefix` | Label keys root, default `tours.labels` (`tours.labels.next`, `tours.labels.takeTour`, ...) |

`TourButton` is the "Take a tour" button for the shell help slot (44 px hit box, `tours.labels.takeTour` / `takeTourHint`).

### Add a tour in 3 steps

1. Add the tour to `src/tours/`: an `id`, a `title` key, a `category` key and its steps.
2. Add every text key to `src/localization/locales/en.json`.
3. Run the jest check and the Auto E2E spec below.

### Step fields

| Field | Meaning |
|---|---|
| `target` | A testID (`open-payees`) or `{ role, name, nth?, exact?, within? }` |
| `text` | Translation key of the caption text; `{name}` placeholders come from `vars` |
| `action` | `StepAction.Click`, `Type` (needs `value`) or `None` |
| `route?` | Navigates there first |
| `optional?` | Skipped when the target is absent |
| `wait?` | Extra wait in ms before the step |

### Forbidden actions

A click step whose target name starts with Save, Submit, Approve, Reject, Delete, Reset, Pay or Send is never performed. A plain "Save" is allowed only with `allowSave: true` on the tour and `allowWrites` on the provider. Switches, checkboxes and radios are settings, not writes.

### How to test

```ts
import { expectValidTours } from '@dloizides/ui-tour/testing';
import en from '../localization/locales/en.json';

it('every tour is valid', () => expectValidTours(TOURS, en));
```

It fails on a missing text key, a malformed target, a repeated id, a tour without steps or a click on a write control.

```ts
import { expectAllToursPlay } from '@dloizides/ui-tour/playwright';

test('every tour plays to the end in Auto', async ({ page }) => expectAllToursPlay(page));
```

It plays every tour in the picker in Auto and fails with `tour <id> step <n>/<m>: <reason>` (target missing, stuck, closed early, never started). The caption carries `data-tour-id`, `data-tour-step` and `data-tour-steps` for runners. `expo-router` and `@playwright/test` are optional peers.

## License

MIT
