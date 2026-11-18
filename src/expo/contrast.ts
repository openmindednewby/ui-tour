const CHANNEL_MAX = 255;
const HEX_SHORT = 3;
const HEX_RADIX = 16;
const LINEAR_KNEE = 0.03928;
const LINEAR_SLOPE = 12.92;
const GAMMA_OFFSET = 0.055;
const GAMMA_SCALE = 1.055;
const GAMMA = 2.4;
const RED_WEIGHT = 0.2126;
const GREEN_WEIGHT = 0.7152;
const BLUE_WEIGHT = 0.0722;
const FLARE = 0.05;
const WHITE_KEYWORD = 'white';
const RGB_PATTERN = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/i;
const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Minimum WCAG AA contrast for normal-size text. */
export const MIN_TEXT_CONTRAST = 4.5;

type Channels = [number, number, number];

function hexChannels(hex: string): Channels {
  const digits = hex.length === HEX_SHORT ? hex.split('').map((digit) => digit + digit).join('') : hex;
  const read = (start: number): number => parseInt(digits.slice(start, start + 2), HEX_RADIX);
  return [read(0), read(2), read(4)];
}

function channels(color: string): Channels | undefined {
  const value = color.trim();
  if (value.toLowerCase() === WHITE_KEYWORD) return [CHANNEL_MAX, CHANNEL_MAX, CHANNEL_MAX];
  const hex = HEX_PATTERN.exec(value)?.[1];
  if (hex !== undefined) return hexChannels(hex);
  const rgb = RGB_PATTERN.exec(value);
  return rgb === null ? undefined : [Number(rgb[1] ?? 0), Number(rgb[2] ?? 0), Number(rgb[3] ?? 0)];
}

function linear(channel: number): number {
  const unit = channel / CHANNEL_MAX;
  return unit <= LINEAR_KNEE ? unit / LINEAR_SLOPE : ((unit + GAMMA_OFFSET) / GAMMA_SCALE) ** GAMMA;
}

/** WCAG relative luminance of a hex, rgb or white colour, or undefined when it cannot be parsed. */
export function luminance(color: string): number | undefined {
  const rgb = channels(color);
  if (rgb === undefined) return undefined;
  const [red, green, blue] = rgb;
  return RED_WEIGHT * linear(red) + GREEN_WEIGHT * linear(green) + BLUE_WEIGHT * linear(blue);
}

/** WCAG contrast ratio of two hex, rgb or white colours; 0 when either cannot be parsed. */
export function contrastRatio(first: string, second: string): number {
  const a = luminance(first);
  const b = luminance(second);
  if (a === undefined || b === undefined) return 0;
  return (Math.max(a, b) + FLARE) / (Math.min(a, b) + FLARE);
}
