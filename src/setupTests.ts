// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { server } from "./mocks/server";
import { resetDb } from "./mocks/handlers";
import "resize-observer-polyfill";
import "web-streams-polyfill/es2018";

// Mock ResizeObserver for Headless UI
global.ResizeObserver = require("resize-observer-polyfill");

// Mock window.matchMedia used in ThemeContext for prefers-color-scheme detection.
if (!window.matchMedia) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
// Also, reset our in-memory database.
afterEach(() => {
  server.resetHandlers();
  resetDb();
});

// Clean up after the tests are finished.
afterAll(() => server.close());
