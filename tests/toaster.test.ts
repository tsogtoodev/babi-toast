import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import Toaster from "../src/Toaster";
import { babi, store } from "../src/store";

const reset = () => {
	store.toasts = [];
	store.listeners.clear();
	store.position = "top-right";
	store.options = undefined;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

beforeEach(reset);
afterEach(reset);

describe("Toaster auto-dismiss timer", () => {
	it("auto-dismisses after the toast's duration", async () => {
		const wrapper = mount(Toaster, { props: { position: "top-right" } });
		await nextTick();

		babi.show({ title: "x", duration: 50 });
		await wait(20);
		expect(store.toasts[0].exiting).toBeUndefined();
		await wait(50);
		expect(store.toasts[0].exiting).toBe(true);

		wrapper.unmount();
	});

	it("does not auto-dismiss when duration is null", async () => {
		const wrapper = mount(Toaster);
		await nextTick();

		babi.show({ title: "x", duration: null });
		await wait(120);
		expect(store.toasts[0].exiting).toBeUndefined();

		wrapper.unmount();
	});

	it("clears timers when the Toaster unmounts", async () => {
		const wrapper = mount(Toaster);
		await nextTick();

		babi.show({ title: "x", duration: 50 });
		await wait(10);
		wrapper.unmount();

		await wait(120);
		expect(store.toasts[0].exiting).toBeUndefined();
	});
});

describe("Toaster hover behavior", () => {
	it("pauses auto-dismiss while hovered and resumes on leave", async () => {
		const wrapper = mount(Toaster, { props: { position: "top-right" } });
		await nextTick();

		babi.show({ title: "x", duration: 80 });
		await nextTick();

		const toastEl = wrapper.find('button[data-babi-toast]');
		expect(toastEl.exists()).toBe(true);

		await toastEl.trigger("mouseenter");
		await wait(150);
		expect(store.toasts[0].exiting).toBeUndefined();

		await toastEl.trigger("mouseleave");
		await wait(120);
		expect(store.toasts[0].exiting).toBe(true);

		wrapper.unmount();
	});
});

describe("Toaster offset", () => {
	it("applies a numeric 0 offset to the viewport", async () => {
		const wrapper = mount(Toaster, {
			props: {
				position: "top-right",
				offset: { top: 0, right: 18, bottom: 18, left: 18 },
			},
		});
		await nextTick();

		babi.show({ title: "x", duration: null });
		await nextTick();

		const section = wrapper.find('section[data-babi-viewport][data-position="top-right"]');
		expect(section.exists()).toBe(true);
		const style = section.attributes("style") ?? "";
		expect(style).toMatch(/top:\s*0px/);
		expect(style).toMatch(/right:\s*18px/);

		wrapper.unmount();
	});
});
