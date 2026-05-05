/**
 * Type-only assertions mirroring the README examples.
 *
 * Run via `vitest typecheck` (or just `tsc --noEmit` once pulled into a
 * tsconfig). The expectTypeOf calls also execute at runtime as no-ops, but the
 * value comes from the static type checks.
 */
import { describe, expectTypeOf, it } from "vitest";
import { defineComponent, h, ref } from "vue";
import { babi, type Toaster } from "../src";
import type {
	BabiOptions,
	BabiPromoteOptions,
	BabiState,
	BabiStreamHandle,
} from "../src/types";

describe("README typing", () => {
	it("babi.success/error/warning/info/action accept BabiOptions and return string", () => {
		expectTypeOf(babi.success).parameters.toEqualTypeOf<[BabiOptions]>();
		expectTypeOf(babi.success({ title: "x" })).toBeString();
		expectTypeOf(babi.error({ title: "x" })).toBeString();
		expectTypeOf(babi.warning({ title: "x" })).toBeString();
		expectTypeOf(babi.info({ title: "x" })).toBeString();
		expectTypeOf(
			babi.action({
				title: "x",
				button: { title: "Undo", onClick: () => {} },
			}),
		).toBeString();
	});

	it("babi.show with state and component compiles (README custom-component example)", () => {
		const UploadProgress = defineComponent({
			props: { value: { type: Number, required: true } },
			setup: (props) => () => h("div", `${props.value}%`),
		});
		const id = babi.show({
			title: "Uploading files",
			state: "loading",
			duration: null,
			component: UploadProgress,
			componentProps: { value: 42 },
		});
		expectTypeOf(id).toBeString();
	});

	it("babi.promise returns Promise<T> and threads success/error/action", () => {
		const result = babi.promise(Promise.resolve(42), {
			loading: { title: "Saving" },
			success: (v) => ({ title: `Saved ${v}` }),
			error: (err) => ({ title: "Failed", description: String(err) }),
			action: (v) => ({ title: `Decide for ${v}` }),
		});
		expectTypeOf(result).resolves.toBeNumber();
	});

	it("babi.stream supports async iterable / ref / callback sources", () => {
		async function* gen() {
			yield { description: "tick" } as Partial<BabiOptions>;
			return { description: "done" } as Partial<BabiOptions>;
		}
		const fromIter = babi.stream(gen());
		expectTypeOf(fromIter).toMatchTypeOf<BabiStreamHandle<Partial<BabiOptions>>>();

		const r = ref(0);
		const fromRef = babi.stream(r, {
			frame: (v) => ({ description: `${v}%` }),
		});
		expectTypeOf(fromRef).toMatchTypeOf<BabiStreamHandle<number>>();

		const fromCb = babi.stream<{ description: string }>(
			(emit) => {
				emit({ description: "10%" });
				emit.done({ description: "100%" });
				return () => {};
			},
			{ initial: { title: "Up" } },
		);
		expectTypeOf(fromCb.cancel).toBeFunction();
		expectTypeOf(fromCb.done).toEqualTypeOf<Promise<{ description: string } | undefined>>();
	});

	it("babi.dismiss / clear / clearPromoted have the expected signatures", () => {
		expectTypeOf(babi.dismiss).parameters.toEqualTypeOf<[string]>();
		expectTypeOf(babi.clear).toBeFunction();
		expectTypeOf(babi.clearPromoted).toBeFunction();
	});

	it("BabiState union matches the public helpers", () => {
		expectTypeOf<BabiState>().toEqualTypeOf<
			"success" | "loading" | "error" | "warning" | "info" | "action"
		>();
	});

	it("BabiPromoteOptions type covers the README promote example", () => {
		const promote: BabiPromoteOptions = {
			to: "audio-player-tray",
			component: defineComponent({}),
			componentProps: { src: "/x.mp3" },
			successVisibleMs: 600,
			onDismiss: () => {},
		};
		expectTypeOf(promote.to).toBeString();
	});

	it("Toaster is a Vue component export", () => {
		expectTypeOf<typeof Toaster>().not.toBeNever();
	});
});
