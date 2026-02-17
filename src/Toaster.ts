import {
	type CSSProperties,
	type VNode,
	computed,
	defineComponent,
	h,
	onMounted,
	onUnmounted,
	ref,
	watch,
} from "vue";
import Babi from "./Babi";
import {
	type BabiItem,
	type BabiListener,
	type BabiOffsetConfig,
	type BabiOffsetValue,
	DEFAULT_DURATION,
	dismissToast,
	expandDir,
	pillAlign,
	store,
	timeoutKey,
} from "./store";
import {
	BABI_POSITIONS,
	type BabiOptions,
	type BabiPosition,
} from "./types";

export default defineComponent({
	name: "Toaster",
	props: {
		position: {
			type: String as () => BabiPosition,
			default: "top-right",
		},
		offset: {
			type: [Number, String, Object] as unknown as () => BabiOffsetValue | BabiOffsetConfig | undefined,
			default: undefined,
		},
		options: {
			type: Object as () => Partial<BabiOptions> | undefined,
			default: undefined,
		},
	},
	setup(props, { slots }) {
		const toasts = ref<BabiItem[]>(store.toasts);
		const activeId = ref<string>();

		let hovered = false;
		const timers = new Map<string, number>();
		let latestId: string | undefined;

		const handlersCache = new Map<
			string,
			{
				enter: (e: MouseEvent) => void;
				leave: (e: MouseEvent) => void;
				dismiss: () => void;
			}
		>();

		/* -------------------------------- Store sync ------------------------------ */

		watch(
			() => props.position,
			(pos) => { store.position = pos; },
			{ immediate: true },
		);

		watch(
			() => props.options,
			(opts) => { store.options = opts; },
			{ immediate: true },
		);

		const listener: BabiListener = (next) => {
			toasts.value = next;
		};

		onMounted(() => {
			store.listeners.add(listener);
		});

		onUnmounted(() => {
			store.listeners.delete(listener);
			clearAllTimers();
		});

		/* --------------------------------- Timers --------------------------------- */

		function clearAllTimers() {
			for (const t of timers.values()) clearTimeout(t);
			timers.clear();
		}

		function schedule(items: BabiItem[]) {
			if (hovered) return;

			for (const item of items) {
				if (item.exiting) continue;
				const key = timeoutKey(item);
				if (timers.has(key)) continue;

				const dur = item.duration ?? DEFAULT_DURATION;
				if (dur === null || dur <= 0) continue;

				timers.set(
					key,
					window.setTimeout(() => dismissToast(item.id), dur),
				);
			}
		}

		/* ----------------------------- Toast tracking ----------------------------- */

		watch(toasts, (current) => {
			const toastKeys = new Set(current.map(timeoutKey));
			const toastIds = new Set(current.map((t) => t.id));
			for (const [key, timer] of timers) {
				if (!toastKeys.has(key)) {
					clearTimeout(timer);
					timers.delete(key);
				}
			}
			for (const id of handlersCache.keys()) {
				if (!toastIds.has(id)) handlersCache.delete(id);
			}

			schedule(current);
		}, { immediate: true });

		/* --------------------------------- Latest --------------------------------- */

		const latest = computed(() => {
			for (let i = toasts.value.length - 1; i >= 0; i--) {
				if (!toasts.value[i].exiting) return toasts.value[i].id;
			}
			return undefined;
		});

		watch(latest, (val) => {
			latestId = val;
			activeId.value = val;
		});

		/* -------------------------------- Handlers -------------------------------- */

		function handleMouseEnter() {
			if (hovered) return;
			hovered = true;
			clearAllTimers();
		}

		function handleMouseLeave() {
			if (!hovered) return;
			hovered = false;
			schedule(toasts.value);
		}

		function getHandlers(toastId: string) {
			let cached = handlersCache.get(toastId);
			if (cached) return cached;

			cached = {
				enter: (_e: MouseEvent) => {
					activeId.value = toastId;
					handleMouseEnter();
				},
				leave: (_e: MouseEvent) => {
					if (activeId.value !== latestId) {
						activeId.value = latestId;
					}
					handleMouseLeave();
				},
				dismiss: () => dismissToast(toastId),
			};

			handlersCache.set(toastId, cached);
			return cached;
		}

		/* ------------------------------ Viewport style ---------------------------- */

		function getViewportStyle(pos: BabiPosition): CSSProperties | undefined {
			if (props.offset === undefined) return undefined;

			const o =
				typeof props.offset === "object"
					? props.offset as BabiOffsetConfig
					: { top: props.offset, right: props.offset, bottom: props.offset, left: props.offset } as BabiOffsetConfig;

			const s: Record<string, string> = {};
			const px = (v: BabiOffsetValue) =>
				typeof v === "number" ? `${v}px` : v;

			if (pos.startsWith("top") && o.top) s.top = px(o.top);
			if (pos.startsWith("bottom") && o.bottom) s.bottom = px(o.bottom);
			if (pos.endsWith("left") && o.left) s.left = px(o.left);
			if (pos.endsWith("right") && o.right) s.right = px(o.right);

			return s as unknown as CSSProperties;
		}

		/* ------------------------------ By position ------------------------------- */

		const byPosition = computed(() => {
			const map = {} as Partial<Record<BabiPosition, BabiItem[]>>;
			for (const t of toasts.value) {
				const pos = t.position ?? props.position;
				const arr = map[pos];
				if (arr) {
					arr.push(t);
				} else {
					map[pos] = [t];
				}
			}
			return map;
		});

		/* --------------------------------- Render --------------------------------- */

		return () => {
			const sections: VNode[] = [];

			for (const pos of BABI_POSITIONS) {
				const items = byPosition.value[pos];
				if (!items?.length) continue;

				const pill = pillAlign(pos);
				const expand = expandDir(pos);

				sections.push(
					h(
						"section",
						{
							key: pos,
							"data-babi-viewport": "",
							"data-position": pos,
							"aria-live": "polite",
							style: getViewportStyle(pos),
						},
						items.map((item) => {
							const handlers = getHandlers(item.id);
							return h(Babi, {
								key: item.id,
								id: item.id,
								state: item.state,
								title: item.title,
								description: item.description,
								position: pill,
								expand,
								icon: item.icon,
								fill: item.fill,
								styles: item.styles,
								button: item.button,
								roundness: item.roundness,
								exiting: item.exiting,
								autoExpandDelayMs: item.autoExpandDelayMs,
								autoCollapseDelayMs: item.autoCollapseDelayMs,
								refreshKey: item.instanceId,
								canExpand: activeId.value === undefined || activeId.value === item.id,
								onMouseenter: handlers.enter,
								onMouseleave: handlers.leave,
								onDismiss: handlers.dismiss,
							});
						}),
					),
				);
			}

			return [slots.default?.(), ...sections];
		};
	},
});
