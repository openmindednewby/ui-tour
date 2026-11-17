import { placeCaption } from './placement';

const viewport = { width: 390, height: 844 };
const size = { width: 300, height: 120 };

describe('placeCaption', () => {
  it('with room below the target, places the caption under it', () => {
    const rect = { left: 40, top: 100, width: 100, height: 40 };

    const position = placeCaption(rect, size, viewport);

    expect(position).toEqual({ left: 12, top: 156 });
  });

  it('with no room below the target, places the caption above it', () => {
    const rect = { left: 40, top: 700, width: 100, height: 40 };

    const position = placeCaption(rect, size, viewport);

    expect(position.top).toBe(564);
  });

  it('with no target, centres the caption at the bottom', () => {
    const rect = null;

    const position = placeCaption(rect, size, viewport);

    expect(position).toEqual({ left: 45, top: 700 });
  });
});
