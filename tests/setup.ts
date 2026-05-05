// jsdom does not implement ResizeObserver — Babi.ts uses it for pill sizing.
// A no-op stub is enough for tests that don't assert on layout-driven sizing.
class NoopResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
	(globalThis as unknown as { ResizeObserver: typeof NoopResizeObserver }).ResizeObserver = NoopResizeObserver;
}
