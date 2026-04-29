import {
	type Component,
	type VNode,
	defineComponent,
	h,
	onMounted,
	onUnmounted,
	ref,
	resolveDynamicComponent,
} from "vue";
import {
	registerPromoteViewport,
	unregisterPromoteViewport,
} from "./promote";
import {
	type BabiItem,
	type BabiListener,
	dismissToast,
	store,
} from "./store";
import type { BabiOptions, BabiPromoteHelpers } from "./types";

const updateItem = (id: string, options: Partial<BabiOptions>) => {
	store.update((prev) =>
		prev.map((t) => (t.id === id ? ({ ...t, ...options } as BabiItem) : t)),
	);
};

export default defineComponent({
	name: "BabiPromoteViewport",
	props: {
		name: {
			type: String,
			required: true,
		},
		class: {
			type: [String, Array, Object] as unknown as () =>
				| string
				| string[]
				| Record<string, boolean>
				| undefined,
			default: undefined,
		},
	},
	setup(props) {
		const root = ref<HTMLElement>();
		const items = ref<BabiItem[]>([]);

		const sync = () => {
			items.value = store.toasts.filter(
				(t) =>
					t.placement.kind === "promoted" &&
					t.placement.viewport === props.name,
			);
		};

		const listener: BabiListener = () => sync();

		onMounted(() => {
			if (root.value) registerPromoteViewport(props.name, root.value);
			store.listeners.add(listener);
			sync();
		});

		onUnmounted(() => {
			store.listeners.delete(listener);
			if (root.value) unregisterPromoteViewport(props.name, root.value);
			// Clear promoted items in this viewport on unmount.
			store.update((prev) =>
				prev.filter(
					(t) =>
						t.placement.kind !== "promoted" ||
						t.placement.viewport !== props.name,
				),
			);
		});

		return () =>
			h(
				"div",
				{
					ref: root,
					class: props.class,
					"data-babi-promote-viewport": props.name,
				},
				items.value.map((item) => {
					const helpers: BabiPromoteHelpers = {
						id: item.id,
						dismiss: () => dismissToast(item.id),
						update: (options) => updateItem(item.id, options),
					};
					const componentProps = {
						...(item.promote?.componentProps ?? {}),
						babi: helpers,
					};
					const Comp =
						(item.promote?.component as Component | VNode) ?? null;
					return h(
						"div",
						{
							key: item.id,
							"data-babi-promoted": "",
							"data-exiting": item.exiting ? "true" : "false",
						},
						Comp
							? [h(resolveDynamicComponent(Comp) as Component, componentProps)]
							: [],
					);
				}),
			);
	},
});
