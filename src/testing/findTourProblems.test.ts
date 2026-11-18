import { StepAction, TargetRole } from '@dloizides/ui-tour';
import type { Tour } from '@dloizides/ui-tour';
import { expectValidTours, findTourProblems } from './findTourProblems';

const translations = { tours: { payees: { title: 'Payees', category: 'Payments', open: 'Open payees', save: 'Save it' } } };

function tourWith(overrides: Partial<Tour>): Tour {
  return {
    id: 'payees',
    title: 'tours.payees.title',
    category: 'tours.payees.category',
    steps: [{ target: 'open-payees', text: 'tours.payees.open', action: StepAction.Click }],
    ...overrides,
  };
}

describe('findTourProblems', () => {
  it('with valid key-based tours, finds nothing', () => {
    const tours = [tourWith({})];

    const problems = findTourProblems(tours, translations);

    expect(problems).toEqual([]);
  });

  it('with a step text key missing in translations, reports the key', () => {
    const tours = [tourWith({ steps: [{ target: 'open-payees', text: 'tours.payees.gone', action: StepAction.None }] })];

    const problems = findTourProblems(tours, translations);

    expect(problems).toEqual(['tour payees step 1: text key "tours.payees.gone" is missing in translations']);
  });

  it('with a malformed testID target, reports it', () => {
    const tours = [tourWith({ steps: [{ target: 'open payees', text: 'tours.payees.open', action: StepAction.None }] })];

    const problems = findTourProblems(tours, translations);

    expect(problems).toEqual(['tour payees step 1: malformed target "open payees"']);
  });

  it('with a negative nth, reports it', () => {
    const tours = [tourWith({ steps: [{ target: { role: TargetRole.Heading, name: 'Payees', nth: -1 }, text: 'tours.payees.open', action: StepAction.None }] })];

    const problems = findTourProblems(tours, translations);

    expect(problems).toEqual(['tour payees step 1: nth must be a whole number >= 0']);
  });

  it('with a repeated tour id, reports the duplicate', () => {
    const tours = [tourWith({}), tourWith({})];

    const problems = findTourProblems(tours, translations);

    expect(problems).toEqual(['tour payees: duplicate id']);
  });

  it('with a click on a Delete button, reports the write control', () => {
    const tours = [tourWith({ steps: [{ target: { role: TargetRole.Button, name: /^Delete payee/ }, text: 'tours.payees.open', action: StepAction.Click }] })];

    const problems = findTourProblems(tours, translations);

    expect(problems).toEqual(['tour payees step 1: clicks write control "Delete payee"']);
  });

  it('with a click on a testID containing save, reports the write control', () => {
    const tours = [tourWith({ steps: [{ target: 'payee-save', text: 'tours.payees.save', action: StepAction.Click }] })];

    const problems = findTourProblems(tours, translations);

    expect(problems).toEqual(['tour payees step 1: clicks write control "save"']);
  });

  it('with allowSave and a plain Save button, finds nothing', () => {
    const tours = [tourWith({ allowSave: true, steps: [{ target: { role: TargetRole.Button, name: 'Save' }, text: 'tours.payees.save', action: StepAction.Click }] })];

    const problems = findTourProblems(tours, translations);

    expect(problems).toEqual([]);
  });
});

describe('findTourProblems route vars', () => {
  it('with a route placeholder that vars does not fill, reports the var', () => {
    const tours = [tourWith({ steps: [{ route: '/t/{tenantSlug}/register', target: 'open-payees', text: 'tours.payees.open', action: StepAction.None }] })];

    const problems = findTourProblems(tours, translations, {});

    expect(problems).toEqual(['tour payees step 1: route var "{tenantSlug}" is not in vars']);
  });

  it('with a route placeholder that vars fills, finds nothing', () => {
    const tours = [tourWith({ steps: [{ route: '/t/{tenantSlug}/register', target: 'open-payees', text: 'tours.payees.open', action: StepAction.None }] })];

    const problems = findTourProblems(tours, translations, { tenantSlug: 'demo' });

    expect(problems).toEqual([]);
  });
});

describe('expectValidTours', () => {
  it('with a problem, throws listing it', () => {
    const tours = [tourWith({ title: 'tours.payees.none' })];

    const run = (): void => expectValidTours(tours, translations);

    expect(run).toThrow('Invalid tours:\ntour payees: title key "tours.payees.none" is missing in translations');
  });
});
