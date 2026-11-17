import { isForbiddenClick } from './forbidden';

describe('isForbiddenClick', () => {
  it.each(['Save', 'Submit', 'Approve', 'Reject', 'Delete', 'Reset', 'Pay', 'Send', 'Save changes', 'delete user'])(
    'with the write control "%s", refuses the click',
    (name) => {
      const allowSave = false;

      const forbidden = isForbiddenClick(name, allowSave);

      expect(forbidden).toBe(true);
    },
  );

  it.each(['Payments', 'Payees', 'Sender list', 'Open', 'Resets log'])('with the safe control "%s", allows the click', (name) => {
    const allowSave = false;

    const forbidden = isForbiddenClick(name, allowSave);

    expect(forbidden).toBe(false);
  });

  it('with allowSave and a plain Save button, allows the click', () => {
    const allowSave = true;

    const forbidden = isForbiddenClick('Save', allowSave);

    expect(forbidden).toBe(false);
  });

  it.each(['Submit', 'Save changes', 'Delete'])('with allowSave and "%s", still refuses the click', (name) => {
    const allowSave = true;

    const forbidden = isForbiddenClick(name, allowSave);

    expect(forbidden).toBe(true);
  });
});
