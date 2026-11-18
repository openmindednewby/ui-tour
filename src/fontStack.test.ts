import { fontStack } from './fontStack';

describe('fontStack', () => {
  it('with a named family, appends sans-serif', () => {
    const family = 'Inter';

    const stack = fontStack(family);

    expect(stack).toBe('Inter, sans-serif');
  });

  it('with an empty family, returns sans-serif', () => {
    const family = '  ';

    const stack = fontStack(family);

    expect(stack).toBe('sans-serif');
  });

  it('with a stack already ending in a generic family, keeps it unchanged', () => {
    const family = 'Georgia, serif';

    const stack = fontStack(family);

    expect(stack).toBe('Georgia, serif');
  });

  it('with system-ui only, still appends sans-serif', () => {
    const family = 'system-ui';

    const stack = fontStack(family);

    expect(stack).toBe('system-ui, sans-serif');
  });
});
