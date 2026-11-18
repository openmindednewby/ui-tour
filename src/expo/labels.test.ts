import { defaultTourLabels } from '@dloizides/ui-tour';
import { StepAction } from '@dloizides/ui-tour';
import { buildTourLabels, localizeTours, translateOr } from './labels';

const dictionary: Record<string, string | undefined> = {
  'tours.labels.next': 'Weiter',
  'app.tours.next': 'Avanti',
  'tours.payees.title': 'Payees tour',
  'tours.payees.category': 'Payments',
  'tours.payees.step1': 'Open the payees list',
};
const translate = (key: string): string => dictionary[key] ?? key;

describe('buildTourLabels', () => {
  it('with a translated key, uses the translation', () => {
    const prefix = 'tours.labels';

    const labels = buildTourLabels(translate, prefix);

    expect(labels.next).toBe('Weiter');
  });

  it('with a missing key, keeps the English default', () => {
    const prefix = 'tours.labels';

    const labels = buildTourLabels(translate, prefix);

    expect(labels.back).toBe(defaultTourLabels.back);
  });

  it('with a custom prefix, reads keys under that prefix', () => {
    const prefix = 'app.tours';

    const labels = buildTourLabels(translate, prefix);

    expect(labels.next).toBe('Avanti');
  });
});

describe('translateOr', () => {
  it('with an empty translation, returns the fallback', () => {
    const empty = (): string => '';

    const value = translateOr(empty, 'any.key', 'Fallback');

    expect(value).toBe('Fallback');
  });
});

describe('localizeTours', () => {
  it('with key-based tours, translates title, category and step text', () => {
    const tours = [{ id: 'payees', title: 'tours.payees.title', category: 'tours.payees.category', steps: [{ target: 'open-payees', text: 'tours.payees.step1', action: StepAction.Click }] }];

    const localized = localizeTours(tours, translate);

    expect([localized[0].title, localized[0].category, localized[0].steps[0].text]).toEqual(['Payees tour', 'Payments', 'Open the payees list']);
  });
});
