import { StepAction } from './enums/StepAction';
import { TargetRole } from './enums/TargetRole';
import type { Tour } from './types';
import { validateTours } from './validateTours';

const tourWith = (steps: unknown[], id = 'a'): Tour => ({ id, title: 'A', category: 'C', steps }) as unknown as Tour;

describe('validateTours', () => {
  it('with well-formed tours, reports valid with no errors', () => {
    const tours = [tourWith([{ target: 'x', text: 'Hi', action: StepAction.None }, { target: { role: TargetRole.Button, name: 'Open' }, text: 'Go', action: StepAction.Click }])];

    const result = validateTours(tours);

    expect(result).toEqual({ valid: true, errors: [] });
  });

  it('with a step that has no target, reports the missing target', () => {
    const tours = [tourWith([{ text: 'Hi', action: StepAction.None }])];

    const result = validateTours(tours);

    expect(result).toEqual({ valid: false, errors: ['tour a step 1: missing target'] });
  });

  it('with a step that has no text, reports the missing text', () => {
    const tours = [tourWith([{ target: 'x', text: ' ', action: StepAction.None }])];

    const result = validateTours(tours);

    expect(result).toEqual({ valid: false, errors: ['tour a step 1: missing text'] });
  });

  it('with a role target whose name is empty, reports the missing target', () => {
    const tours = [tourWith([{ target: { role: TargetRole.Button, name: '' }, text: 'Hi', action: StepAction.None }])];

    const result = validateTours(tours);

    expect(result.errors).toEqual(['tour a step 1: missing target']);
  });

  it('with a type step that has no value, reports the missing value', () => {
    const tours = [tourWith([{ target: 'x', text: 'Hi', action: StepAction.Type }])];

    const result = validateTours(tours);

    expect(result.errors).toEqual(['tour a step 1: type step needs a value']);
  });

  it('with two tours sharing an id and one with no steps, reports both', () => {
    const tours = [tourWith([{ target: 'x', text: 'Hi', action: StepAction.None }]), tourWith([])];

    const result = validateTours(tours);

    expect(result.errors).toEqual(['tour a: duplicate id', 'tour a: has no steps']);
  });
});
