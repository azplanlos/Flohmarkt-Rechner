// jest-dom adds custom matchers for asserting on DOM nodes, e.g.
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom/vitest';
// jsdom has no IndexedDB; provide an in-memory implementation for tests.
import 'fake-indexeddb/auto';

// jsdom has no matchMedia; the app uses it to detect dark mode.
window.matchMedia = window.matchMedia || ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
}) as MediaQueryList);
