import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { babi, store, EXIT_DURATION, DEFAULT_DURATION } from "../src/store";

const reset = () => {
	store.toasts = [];
	store.listeners.clear();
	store.position = "top-right";
	store.options = undefined;
};

beforeEach(reset);
afterEach(() => {
	vi.useRealTimers();
	reset();
});

describe("babi.show", () => {
	it("returns a unique id and appends a toast", () => {
		const id = babi.show({ title: "hi" });
		expect(typeof id).toBe("string");
		expect(store.toasts).toHaveLength(1);
		expect(store.toasts[0].id).toBe(id);
		expect(store.toasts[0].title).toBe("hi");
	});

	it("stacks unnamed toasts (each gets a fresh id)", () => {
		const a = babi.show({ title: "a" });
		const b = babi.show({ title: "b" });
		const c = babi.show({ title: "c" });
		expect(new Set([a, b, c]).size).toBe(3);
		expect(store.toasts.map((t) => t.title)).toEqual(["a", "b", "c"]);
	});

	it("replaces an existing toast when an explicit id is reused", () => {
		const id = babi.show({ id: "shared", title: "first" } as never);
		babi.show({ id: "shared", title: "second" } as never);
		expect(store.toasts).toHaveLength(1);
		expect(store.toasts[0].id).toBe(id);
		expect(store.toasts[0].title).toBe("second");
	});
});

describe("state helpers", () => {
	it.each([
		["success", babi.success],
		["error", babi.error],
		["warning", babi.warning],
		["info", babi.info],
		["action", babi.action],
	] as const)("babi.%s sets state correctly", (state, fn) => {
		const id = fn({ title: state });
		const toast = store.toasts.find((t) => t.id === id);
		expect(toast?.state).toBe(state);
	});
});

describe("dismiss", () => {
	beforeEach(() => vi.useFakeTimers());

	it("flags exiting then removes after EXIT_DURATION", () => {
		const id = babi.show({ title: "x" });
		babi.dismiss(id);
		expect(store.toasts[0].exiting).toBe(true);
		vi.advanceTimersByTime(EXIT_DURATION + 1);
		expect(store.toasts).toHaveLength(0);
	});

	it("is a no-op for unknown ids", () => {
		babi.show({ title: "x" });
		babi.dismiss("nope");
		expect(store.toasts).toHaveLength(1);
		expect(store.toasts[0].exiting).toBeUndefined();
	});

	it("does not double-process a toast already exiting", () => {
		const id = babi.show({ title: "x" });
		babi.dismiss(id);
		const beforeRemove = store.toasts[0];
		babi.dismiss(id);
		expect(store.toasts[0]).toBe(beforeRemove);
	});
});

describe("clear", () => {
	it("clears every toast when called without args", () => {
		babi.show({ title: "a" });
		babi.show({ title: "b", position: "bottom-left" });
		babi.clear();
		expect(store.toasts).toHaveLength(0);
	});

	it("clears only the matching position when called with one", () => {
		babi.show({ title: "a", position: "top-right" });
		babi.show({ title: "b", position: "bottom-left" });
		babi.clear("top-right");
		expect(store.toasts).toHaveLength(1);
		expect(store.toasts[0].position).toBe("bottom-left");
	});
});

describe("listeners", () => {
	it("notifies subscribers when toasts change", () => {
		const fn = vi.fn();
		store.listeners.add(fn);
		babi.show({ title: "a" });
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn.mock.calls[0][0]).toHaveLength(1);
	});
});

describe("position fallback", () => {
	it("uses the default store position when none is provided", () => {
		store.position = "bottom-center";
		const id = babi.show({ title: "x" });
		const toast = store.toasts.find((t) => t.id === id);
		expect(toast?.position).toBe("bottom-center");
	});

	it("respects an explicit position", () => {
		const id = babi.show({ title: "x", position: "top-left" });
		const toast = store.toasts.find((t) => t.id === id);
		expect(toast?.position).toBe("top-left");
	});
});

describe("options merge", () => {
	it("merges global toaster options into each toast", () => {
		store.options = { fill: "#000", styles: { title: "bold" } };
		const id = babi.show({ title: "hi" });
		const toast = store.toasts.find((t) => t.id === id);
		expect(toast?.fill).toBe("#000");
		expect(toast?.styles?.title).toBe("bold");
	});

	it("per-toast options override globals", () => {
		store.options = { fill: "#000" };
		const id = babi.show({ title: "hi", fill: "#fff" });
		const toast = store.toasts.find((t) => t.id === id);
		expect(toast?.fill).toBe("#fff");
	});
});

describe("autopilot", () => {
	it("schedules expand and collapse delays based on duration", () => {
		const id = babi.show({ title: "x" });
		const toast = store.toasts.find((t) => t.id === id)!;
		expect(toast.autoExpandDelayMs).toBeGreaterThan(0);
		expect(toast.autoCollapseDelayMs).toBeGreaterThan(0);
		expect(toast.autoExpandDelayMs).toBeLessThanOrEqual(DEFAULT_DURATION);
		expect(toast.autoCollapseDelayMs).toBeLessThanOrEqual(DEFAULT_DURATION);
	});

	it("disables autopilot when autopilot=false or duration<=0", () => {
		babi.show({ title: "a", autopilot: false });
		babi.show({ title: "b", duration: 0 });
		for (const t of store.toasts) {
			expect(t.autoExpandDelayMs).toBeUndefined();
			expect(t.autoCollapseDelayMs).toBeUndefined();
		}
	});

	it("clamps autopilot config to within duration", () => {
		const id = babi.show({
			title: "x",
			duration: 1000,
			autopilot: { expand: -50, collapse: 9999 },
		});
		const toast = store.toasts.find((t) => t.id === id)!;
		expect(toast.autoExpandDelayMs).toBe(0);
		expect(toast.autoCollapseDelayMs).toBe(1000);
	});
});

describe("babi.promise", () => {
	beforeEach(() => vi.useFakeTimers());

	it("morphs through loading -> success", async () => {
		let resolve!: (v: string) => void;
		const p = new Promise<string>((res) => {
			resolve = res;
		});
		babi.promise(p, {
			loading: { title: "Loading" },
			success: (v) => ({ title: `Got ${v}` }),
			error: { title: "Error" },
		});

		expect(store.toasts).toHaveLength(1);
		expect(store.toasts[0].state).toBe("loading");
		expect(store.toasts[0].title).toBe("Loading");
		expect(store.toasts[0].duration).toBe(null);

		resolve("ok");
		await vi.runAllTimersAsync();

		expect(store.toasts[0].state).toBe("success");
		expect(store.toasts[0].title).toBe("Got ok");
	});

	it("morphs through loading -> error", async () => {
		const p = Promise.reject(new Error("boom"));
		// swallow rejection for the test
		babi.promise(p, {
			loading: { title: "Loading" },
			success: { title: "ok" },
			error: (err) => ({ title: `Failed: ${(err as Error).message}` }),
		}).catch(() => {});

		await vi.runAllTimersAsync();

		expect(store.toasts[0].state).toBe("error");
		expect(store.toasts[0].title).toBe("Failed: boom");
	});
});

describe("babi.stream (callback subscriber)", () => {
	beforeEach(() => vi.useFakeTimers());

	it("emits frames and settles success on done", async () => {
		const handle = babi.stream<{ description: string }>(
			(emit) => {
				emit({ description: "10%" });
				emit({ description: "50%" });
				emit.done({ description: "100%" });
			},
			{ initial: { title: "Up" }, success: { title: "Done" } },
		);

		const final = await handle.done;
		expect(final?.description).toBe("100%");
		expect(store.toasts[0].state).toBe("success");
		expect(store.toasts[0].title).toBe("Done");
		expect(store.toasts[0].description).toBe("100%");
	});

	it("rejects done and shows error on emit.error", async () => {
		const handle = babi.stream<{ description: string }>(
			(emit) => {
				emit({ description: "starting" });
				emit.error(new Error("nope"));
			},
			{ initial: { title: "Up" } },
		);

		await expect(handle.done).rejects.toThrow("nope");
		expect(store.toasts[0].state).toBe("error");
	});

	it("cancel() dismisses the toast and resolves done with last value", async () => {
		const handle = babi.stream<{ description: string }>(
			(emit) => {
				emit({ description: "frame" });
				return () => {};
			},
			{ initial: { title: "Up" } },
		);

		handle.cancel();
		const final = await handle.done;
		expect(final?.description).toBe("frame");
		expect(store.toasts[0]?.exiting).toBe(true);
	});

	it("treats a frame with state:'success' as terminal", async () => {
		const handle = babi.stream<{ state?: string; description?: string }>(
			(emit) => {
				emit({ description: "tick" });
				emit({ state: "success", description: "Final" });
				emit({ description: "should be ignored" });
			},
			{ initial: { title: "Stream" } },
		);

		await handle.done;
		expect(store.toasts[0].state).toBe("success");
		expect(store.toasts[0].description).toBe("Final");
	});
});

describe("babi.promote", () => {
	it("schedules a pending promotion when promote is set and state is success", () => {
		const id = babi.success({
			title: "Done",
			promote: { to: "tray", component: {} },
		});
		const toast = store.toasts.find((t) => t.id === id)!;
		expect(toast.pendingPromote?.to).toBe("tray");
	});

	it("does not auto-schedule when state is action", () => {
		const id = babi.action({
			title: "Decide",
			promote: { to: "tray", component: {} },
		});
		const toast = store.toasts.find((t) => t.id === id)!;
		expect(toast.pendingPromote).toBeUndefined();
	});

	it("babi.promote(id) sets pendingPromote on action toasts", () => {
		const id = babi.action({
			title: "Decide",
			promote: { to: "tray", component: {} },
		});
		babi.promote(id);
		const toast = store.toasts.find((t) => t.id === id)!;
		expect(toast.pendingPromote?.to).toBe("tray");
	});

	it("babi.clearPromoted only removes promoted items, not toasts", () => {
		babi.show({ title: "plain" });
		// fake a promoted toast directly
		store.toasts.push({
			...store.toasts[0],
			id: "promoted-x",
			instanceId: "x",
			placement: { kind: "promoted", viewport: "tray" },
		});
		babi.clearPromoted();
		expect(store.toasts.map((t) => t.id)).not.toContain("promoted-x");
		expect(store.toasts.some((t) => t.placement.kind === "toast")).toBe(true);
	});
});
