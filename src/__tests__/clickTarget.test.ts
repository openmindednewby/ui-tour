import { clickTarget, isToggleControl } from '../dom/clickTarget';
import { dispatchClick } from '../dom/pointer';

const POINT = { x: 10, y: 10 };

function switchWrapper(): { wrapper: HTMLDivElement; input: HTMLInputElement } {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-testid', 'cross-currency');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('role', 'switch');
  wrapper.appendChild(input);
  document.body.appendChild(wrapper);
  return { wrapper, input };
}

describe('clickTarget', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('with a switch wrapper, returns the checkable input inside it', () => {
    const { wrapper, input } = switchWrapper();

    const target = clickTarget(wrapper, POINT);

    expect(target).toBe(input);
  });

  it('with a plain button, returns the button itself', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);

    const target = clickTarget(button, POINT);

    expect(target).toBe(button);
  });
});

describe('dispatchClick', () => {
  it('on a React Native Web switch wrapper, toggles the switch on', () => {
    const { wrapper, input } = switchWrapper();

    dispatchClick(wrapper, POINT);

    expect(input.checked).toBe(true);
  });
});

describe('isToggleControl', () => {
  it('with a row wrapping a switch named Pay in a different currency, returns true so the tour may toggle it', () => {
    const { wrapper } = switchWrapper();
    wrapper.setAttribute('aria-label', 'Pay in a different currency');

    const toggle = isToggleControl(wrapper);

    expect(toggle).toBe(true);
  });

  it('with a Pay button, returns false so the write-control rule still applies', () => {
    const button = document.createElement('button');
    button.textContent = 'Pay';
    document.body.appendChild(button);

    const toggle = isToggleControl(button);

    expect(toggle).toBe(false);
  });
});
