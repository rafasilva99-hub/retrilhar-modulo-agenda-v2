import "@testing-library/jest-dom/vitest";

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

if (!window.IntersectionObserver) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin = "";
    readonly scrollMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];

    disconnect = () => undefined;
    observe = () => undefined;
    takeRecords = () => [];
    unobserve = () => undefined;
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  });
}
