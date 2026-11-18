import { expectAllToursPlay, playAllToursInAuto } from './playAllTours';
import { tourFailure, TourRunFailure } from './TourRunFailure';
import type { TourLocator, TourPage } from './types';

interface Frame {
  step?: number;
  steps?: number;
  skip?: boolean;
  vanishOnRead?: boolean;
}

function fakePage(ids: string[], frames: Frame[]): TourPage {
  let index = -1;
  const frame = (): Frame => (index < 0 ? {} : frames[Math.min(index, frames.length - 1)]);
  const counts = (selector: string): number => {
    if (selector.startsWith('[data-testid^="tour-start-"]')) return ids.length;
    if (selector.includes('tour-group-')) return 0;
    if (selector.includes('tour-picker')) return index < 0 ? 1 : 0;
    if (selector.includes('tour-caption')) return frame().step === undefined ? 0 : 1;
    if (selector.includes('tour-skip')) return frame().skip === true ? 1 : 0;
    return 1;
  };
  const locator = (selector: string, nth = 0): TourLocator => ({
    count: async () => counts(selector),
    click: async () => {
      if (selector.includes('-auto"]')) index = 0;
    },
    getAttribute: async (name: string) => {
      if (name === 'data-testid') return `tour-start-${ids[nth]}-auto`;
      if (frame().vanishOnRead === true) throw new Error('Timeout 250ms exceeded');
      return String(name === 'data-tour-step' ? frame().step : frame().steps);
    },
    nth: (position: number) => locator(selector, position),
    first: () => locator(selector, 0),
  });
  return {
    locator: (selector: string) => locator(selector),
    keyboard: { press: async () => undefined },
    waitForTimeout: async () => {
      index += 1;
    },
  };
}

describe('tourFailure', () => {
  it('with a stuck tour, formats id, step and reason', () => {
    const reason = TourRunFailure.Stuck;

    const message = tourFailure('payees', 2, 5, reason);

    expect(message).toBe('tour payees step 2/5: stuck');
  });
});

describe('playAllToursInAuto', () => {
  it('when the caption walks every step and closes, passes the tour', async () => {
    const page = fakePage(['payees'], [{ step: 1, steps: 2 }, { step: 2, steps: 2 }, {}, {}]);

    const results = await playAllToursInAuto(page, { pollMs: 1 });

    expect(results).toEqual([{ tourId: 'payees', passed: true, step: 2, steps: 2 }]);
  });

  it('when the caption unmounts between the count and the attribute read, keeps polling and passes', async () => {
    const page = fakePage(['payees'], [{ step: 1, steps: 2 }, { step: 1, steps: 2, vanishOnRead: true }, { step: 2, steps: 2 }, {}, {}]);

    const results = await playAllToursInAuto(page, { pollMs: 1 });

    expect(results).toEqual([{ tourId: 'payees', passed: true, step: 2, steps: 2 }]);
  });

  it('when a required target is missing, fails at that step', async () => {
    const page = fakePage(['payees'], [{ step: 1, steps: 3 }, { step: 2, steps: 3, skip: true }]);

    const results = await playAllToursInAuto(page, { pollMs: 1 });

    expect(results[0].message).toBe('tour payees step 2/3: target missing');
  });

  it('when the caption closes before the last step, fails as closed early', async () => {
    const page = fakePage(['payees'], [{ step: 1, steps: 3 }, {}, {}]);

    const results = await playAllToursInAuto(page, { pollMs: 1 });

    expect(results[0].reason).toBe(TourRunFailure.ClosedEarly);
  });

  it('when the step never changes within the timeout, fails as stuck', async () => {
    const page = fakePage(['payees'], [{ step: 1, steps: 3 }]);

    const results = await playAllToursInAuto(page, { pollMs: 10, stepTimeoutMs: 30 });

    expect(results[0].message).toBe('tour payees step 1/3: stuck');
  });
});

describe('expectAllToursPlay', () => {
  it('with a failing tour, throws its message', async () => {
    const page = fakePage(['payees'], [{ step: 1, steps: 3 }, { step: 1, steps: 3, skip: true }]);

    const run = expectAllToursPlay(page, { pollMs: 1 });

    await expect(run).rejects.toThrow('tour payees step 1/3: target missing');
  });
});
