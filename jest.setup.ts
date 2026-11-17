import '@testing-library/jest-dom';

Element.prototype.getBoundingClientRect = function getBoundingClientRect(): DOMRect {
  return { x: 10, y: 10, left: 10, top: 10, width: 20, height: 20, right: 30, bottom: 30, toJSON: () => ({}) } as DOMRect;
};
