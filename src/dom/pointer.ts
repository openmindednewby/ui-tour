import type { Point, TargetRect } from '../types';
import { sleep } from './waitForTarget';

export function rectOf(node: Element): TargetRect {
  const rect = node.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

export function centreOf(node: Element): Point {
  const rect = node.getBoundingClientRect();
  return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
}

function isTextField(node: Element): node is HTMLInputElement | HTMLTextAreaElement {
  return node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement;
}

function pointerEvent(type: string, init: PointerEventInit): MouseEvent {
  return typeof window.PointerEvent === 'function' ? new window.PointerEvent(type, init) : new MouseEvent(type, init);
}

export function dispatchClick(node: Element, point: Point): void {
  if (isTextField(node)) {
    node.focus();
    return;
  }
  const init: PointerEventInit = { bubbles: true, cancelable: true, view: window, clientX: point.x, clientY: point.y, button: 0, pointerId: 1, pointerType: 'mouse', isPrimary: true };
  node.dispatchEvent(pointerEvent('pointerdown', init));
  node.dispatchEvent(new MouseEvent('mousedown', init));
  node.dispatchEvent(pointerEvent('pointerup', init));
  node.dispatchEvent(new MouseEvent('mouseup', init));
  node.dispatchEvent(new MouseEvent('click', init));
}

function setNativeValue(node: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const proto = node instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (setter !== undefined) setter.call(node, value);
  else node.value = value;
  node.dispatchEvent(new Event('input', { bubbles: true }));
}

export async function typeValue(node: Element, value: string, typeMs: number): Promise<void> {
  if (!isTextField(node)) return;
  node.focus();
  setNativeValue(node, '');
  for (let length = 1; length <= value.length; length += 1) {
    setNativeValue(node, value.slice(0, length));
    await sleep(typeMs);
  }
}
