import { contrastRatio } from './contrast';

describe('contrastRatio', () => {
  it('with black on white, returns 21', () => {
    const ratio = contrastRatio('#000', '#ffffff');

    expect(ratio).toBeCloseTo(21, 5);
  });

  it('with rgb and rgba notations, reads the channels', () => {
    const ratio = contrastRatio('rgb(255, 255, 255)', 'rgba(0,0,0,1)');

    expect(ratio).toBeCloseTo(21, 5);
  });

  it('with the kefi dark accent on white, returns about 5.65', () => {
    const ratio = contrastRatio('#c42b22', '#ffffff');

    expect(ratio).toBeCloseTo(5.65, 1);
  });

  it('with the white keyword, reads it as pure white', () => {
    const ratio = contrastRatio('White', '#000000');

    expect(ratio).toBeCloseTo(21, 5);
  });

  it('with a named colour, returns 0', () => {
    const ratio = contrastRatio('navy', '#ffffff');

    expect(ratio).toBe(0);
  });
});
