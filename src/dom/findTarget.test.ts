import { TargetRole } from '../enums/TargetRole';
import { findTarget } from './findTarget';

describe('findTarget', () => {
  beforeEach(() => {
    document.body.innerHTML = [
      '<div data-testid="card">Card</div>',
      '<button>Open</button><button>Open</button>',
      '<button style="display:none">Hidden</button>',
      '<label for="amount">Amount</label><input id="amount" />',
      '<section><p>Total <b>42 EUR</b></p></section>',
      '<div data-tour-overlay=""><button>Next</button></div>',
      '<button aria-label="Pay Demo Payee 10:30">x</button>',
    ].join('');
  });

  it('with a testID string, returns the element carrying that testID', () => {
    const target = 'card';

    const node = findTarget(target);

    expect(node?.textContent).toBe('Card');
  });

  it('with a role, name and nth, returns the nth visible match', () => {
    const target = { role: TargetRole.Button, name: 'Open', nth: 1 };

    const node = findTarget(target);

    expect(node).toBe(document.querySelectorAll('button')[1]);
  });

  it('with a hidden match only, returns null', () => {
    const target = { role: TargetRole.Button, name: 'Hidden' };

    const node = findTarget(target);

    expect(node).toBeNull();
  });

  it('with a field role, matches the input by its label', () => {
    const target = { role: TargetRole.Field, name: 'Amount' };

    const node = findTarget(target);

    expect(node).toBe(document.getElementById('amount'));
  });

  it('with a text role, returns the deepest element containing the text', () => {
    const target = { role: TargetRole.Text, name: '42 EUR' };

    const node = findTarget(target);

    expect(node?.tagName).toBe('B');
  });

  it('with a name that only matches inside the tour overlay, returns null', () => {
    const target = { role: TargetRole.Button, name: 'Next' };

    const node = findTarget(target);

    expect(node).toBeNull();
  });

  it('with a variable in the name, substitutes it before matching', () => {
    const target = { role: TargetRole.Button, name: 'Pay {payee}', exact: false };

    const node = findTarget(target, { payee: 'Demo Payee' });

    expect(node?.getAttribute('aria-label')).toBe('Pay Demo Payee 10:30');
  });
});
