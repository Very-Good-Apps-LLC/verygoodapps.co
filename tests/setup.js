import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// Native dialog positioning, trapping, and touch scrolling are checked in-browser.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
};
Element.prototype.setPointerCapture = vi.fn();
beforeEach(() => {
  window.matchMedia = vi.fn(() => ({ matches: false }));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
