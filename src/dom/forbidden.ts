import { normalise } from './text';

const WRITE_CONTROL = /^(save|submit|approve|reject|delete|reset|pay|send)\b/i;
const PLAIN_SAVE = /^save$/i;

/** True when a control's accessible name marks it as a write action the tour must never click. */
export function isForbiddenClick(name: string, allowSave: boolean): boolean {
  const clean = normalise(name);
  if (!WRITE_CONTROL.test(clean)) return false;
  return !(allowSave && PLAIN_SAVE.test(clean));
}
