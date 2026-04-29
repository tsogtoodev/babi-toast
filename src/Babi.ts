import {
	type CSSProperties,
	type Component,
	type PropType,
	type VNode,
	computed,
	defineComponent,
	h,
	isVNode,
	nextTick,
	onMounted,
	onUnmounted,
	ref,
	watch,
} from "vue";
import type { BabiButton, BabiState, BabiStyles } from "./types";
import {
	ArrowRight,
	Check,
	CircleAlert,
	LifeBuoy,
	LoaderCircle,
	X,
} from "./icons";

/* --------------------------------- Config --------------------------------- */

const HEIGHT = 40;
const WIDTH = 350;
const DEFAULT_ROUNDNESS = 18;
const BLUR_RATIO = 0.5;
const PILL_PADDING = 10;
const MIN_EXPAND_RATIO = 2.25;
const SWAP_COLLAPSE_MS = 200;
const HEADER_EXIT_MS = 150;

type State = BabiState;

interface View {
	title?: string;
	description?: VNode | string;
	component?: Component | VNode;
	componentProps?: Record<string, unknown>;
	state: State;
	icon?: VNode | null;
	styles?: BabiStyles;
	button?: BabiButton;
	fill: string;
}

/* ---------------------------------- Icons --------------------------------- */

const STATE_ICON: Record<State, () => VNode> = {
	success: Check,
	loading: () => LoaderCircle({ "data-babi-icon": "spin", "aria-hidden": "true" }),
	error: X,
	warning: CircleAlert,
	info: LifeBuoy,
	action: ArrowRight,
};

/* ---------------------------------- Defs ---------------------------------- */

function renderGooeyDefs(filterId: string, blur: number) {
	return h("defs", [
		h(
			"filter",
			{
				id: filterId,
				x: "-20%",
				y: "-20%",
				width: "140%",
				height: "140%",
				colorInterpolationFilters: "sRGB",
			},
			[
				h("feGaussianBlur", { in: "SourceGraphic", stdDeviation: blur, result: "blur" }),
				h("feColorMatrix", {
					in: "blur",
					mode: "matrix",
					values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10",
					result: "goo",
				}),
				h("feComposite", { in: "SourceGraphic", in2: "goo", operator: "atop" }),
			],
		),
	]);
}

/* ------------------------------- Component -------------------------------- */

export default defineComponent({
	name: "Babi",
	props: {
		id: { type: String, required: true },
		fill: { type: String, default: "#FFFFFF" },
		state: { type: String as PropType<State>, default: "success" },
		title: { type: String, default: undefined },
		description: { type: [String, Object] as PropType<VNode | string>, default: undefined },
		component: {
			type: [Object, Function] as PropType<Component | VNode>,
			default: undefined,
		},
		componentProps: {
			type: Object as PropType<Record<string, unknown>>,
			default: undefined,
		},
		position: { type: String as PropType<"left" | "center" | "right">, default: "left" },
		expand: { type: String as PropType<"top" | "bottom">, default: "bottom" },
		class: { type: String, default: undefined },
		icon: { type: [Object, null] as PropType<VNode | null>, default: undefined },
		styles: { type: Object as PropType<BabiStyles>, default: undefined },
		button: { type: Object as PropType<BabiButton>, default: undefined },
		roundness: { type: Number, default: undefined },
		exiting: { type: Boolean, default: false },
		autoExpandDelayMs: { type: Number, default: undefined },
		autoCollapseDelayMs: { type: Number, default: undefined },
		canExpand: { type: Boolean, default: undefined },
		interruptKey: { type: String, default: undefined },
		refreshKey: { type: String, default: undefined },
	},
	emits: ["mouseenter", "mouseleave", "dismiss"],
	setup(props, { emit }) {
		const resolvedTitle = computed(() => props.title ?? props.state);

		const next = computed<View>(() => ({
			title: resolvedTitle.value,
			description: props.description,
			component: props.component,
			componentProps: props.componentProps,
			state: props.state,
			icon: props.icon,
			styles: props.styles,
			button: props.button,
			fill: props.fill,
		}));

		const view = ref<View>({ ...next.value });
		const applied = ref(props.refreshKey);
		const isExpanded = ref(false);
		const ready = ref(false);
		const pillWidth = ref(0);
		const contentHeight = ref(0);

		const hasCustomComponent = computed(() => Boolean(view.value.component));
		const hasBody = computed(() =>
			Boolean(view.value.description) ||
			Boolean(view.value.button) ||
			hasCustomComponent.value,
		);
		const isLoading = computed(() => view.value.state === "loading");
		const open = computed(() =>
			hasBody.value &&
			isExpanded.value &&
			(!isLoading.value || hasCustomComponent.value),
		);
		const allowExpand = computed(() => {
			if (isLoading.value && !hasCustomComponent.value) return false;
			return props.canExpand ?? (!props.interruptKey || props.interruptKey === props.id);
		});
		const hasExpandableBody = computed(() =>
			hasBody.value && (!isLoading.value || hasCustomComponent.value),
		);

		const headerKey = computed(() => `${view.value.state}-${view.value.title}`);
		const filterId = computed(() => `babi-gooey-${props.id}`);
		const resolvedRoundness = computed(() => Math.max(0, props.roundness ?? DEFAULT_ROUNDNESS));
		const blur = computed(() => resolvedRoundness.value * BLUR_RATIO);

		/* ---------------------------------- Refs ---------------------------------- */

		const buttonRef = ref<HTMLButtonElement | null>(null);
		const headerRef = ref<HTMLDivElement | null>(null);
		const contentRef = ref<HTMLDivElement | null>(null);
		const innerRef = ref<HTMLDivElement | null>(null);

		let headerExitTimer: number | null = null;
		let autoExpandTimer: number | null = null;
		let autoCollapseTimer: number | null = null;
		let swapTimer: number | null = null;
		let lastRefreshKey = props.refreshKey;
		let pending: { key?: string; payload: View } | null = null;
		let headerPad: number | null = null;

		const headerLayer = ref<{
			current: { key: string; view: View };
			prev: { key: string; view: View } | null;
		}>({ current: { key: headerKey.value, view: { ...view.value } }, prev: null });

		/* ------------------------------ Measurements ------------------------------ */

		let pillRo: ResizeObserver | null = null;
		let pillRaf = 0;
		let contentRo: ResizeObserver | null = null;
		let contentRaf = 0;

		function measurePill() {
			const el = innerRef.value;
			const header = headerRef.value;
			if (!el || !header) return;
			if (headerPad === null) {
				const cs = getComputedStyle(header);
				headerPad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
			}
			const w = el.scrollWidth + headerPad + PILL_PADDING;
			if (w > PILL_PADDING) {
				pillWidth.value = w;
			}
		}

		function setupPillObserver() {
			if (pillRo) {
				cancelAnimationFrame(pillRaf);
				pillRo.disconnect();
				pillRo = null;
			}
			const el = innerRef.value;
			if (!el) return;
			measurePill();
			pillRo = new ResizeObserver(() => {
				cancelAnimationFrame(pillRaf);
				pillRaf = requestAnimationFrame(measurePill);
			});
			pillRo.observe(el);
		}

		function setupContentObserver() {
			if (contentRo) {
				cancelAnimationFrame(contentRaf);
				contentRo.disconnect();
				contentRo = null;
			}
			if (!hasBody.value) {
				contentHeight.value = 0;
				return;
			}
			const el = contentRef.value;
			if (!el) return;
			const measure = () => {
				contentHeight.value = el.scrollHeight;
			};
			measure();
			contentRo = new ResizeObserver(() => {
				cancelAnimationFrame(contentRaf);
				contentRaf = requestAnimationFrame(measure);
			});
			contentRo.observe(el);
		}

		onMounted(() => {
			requestAnimationFrame(() => {
				ready.value = true;
			});
			setupPillObserver();
			setupContentObserver();
		});

		onUnmounted(() => {
			if (pillRo) { cancelAnimationFrame(pillRaf); pillRo.disconnect(); }
			if (contentRo) { cancelAnimationFrame(contentRaf); contentRo.disconnect(); }
			if (headerExitTimer) clearTimeout(headerExitTimer);
			if (autoExpandTimer) clearTimeout(autoExpandTimer);
			if (autoCollapseTimer) clearTimeout(autoCollapseTimer);
			if (swapTimer) clearTimeout(swapTimer);
		});

		watch(() => headerLayer.value.current.key, () => {
			nextTick(setupPillObserver);
		});

		watch(hasBody, () => {
			nextTick(setupContentObserver);
		});

		/* ----------------------------- Header layers ------------------------------ */

		watch([headerKey, view], () => {
			const hk = headerKey.value;
			const v = view.value;
			const state = headerLayer.value;
			if (state.current.key === hk) {
				if (state.current.view !== v) {
					headerLayer.value = { ...state, current: { key: hk, view: v } };
				}
			} else {
				headerLayer.value = {
					prev: state.current,
					current: { key: hk, view: v },
				};
			}
		});

		watch(() => headerLayer.value.prev, (prev) => {
			if (!prev) return;
			if (headerExitTimer) clearTimeout(headerExitTimer);
			headerExitTimer = window.setTimeout(() => {
				headerExitTimer = null;
				headerLayer.value = { ...headerLayer.value, prev: null };
			}, HEADER_EXIT_MS);
		});

		/* ----------------------------- Refresh logic ------------------------------ */

		watch([() => props.refreshKey, next, open], () => {
			const refreshKey = props.refreshKey;
			const nextView = next.value;

			if (refreshKey === undefined) {
				view.value = nextView;
				applied.value = undefined;
				pending = null;
				lastRefreshKey = refreshKey;
				return;
			}

			if (lastRefreshKey === refreshKey) return;
			lastRefreshKey = refreshKey;

			if (swapTimer) {
				clearTimeout(swapTimer);
				swapTimer = null;
			}

			if (open.value) {
				pending = { key: refreshKey, payload: nextView };
				isExpanded.value = false;
				swapTimer = window.setTimeout(() => {
					swapTimer = null;
					if (!pending) return;
					view.value = pending.payload;
					applied.value = pending.key;
					pending = null;
				}, SWAP_COLLAPSE_MS);
			} else {
				pending = null;
				view.value = nextView;
				applied.value = refreshKey;
			}
		});

		/* ----------------------------- Auto expand/collapse ----------------------- */

		watch(
			[() => props.autoExpandDelayMs, () => props.autoCollapseDelayMs, hasExpandableBody, allowExpand, () => props.exiting, applied],
			() => {
				if (!hasExpandableBody.value) {
					isExpanded.value = false;
					return;
				}

				if (autoExpandTimer) clearTimeout(autoExpandTimer);
				if (autoCollapseTimer) clearTimeout(autoCollapseTimer);

				if (props.exiting || !allowExpand.value) {
					isExpanded.value = false;
					return;
				}

				if (props.autoExpandDelayMs == null && props.autoCollapseDelayMs == null) return;

				const expandDelay = props.autoExpandDelayMs ?? 0;
				const collapseDelay = props.autoCollapseDelayMs ?? 0;

				if (expandDelay > 0) {
					autoExpandTimer = window.setTimeout(
						() => { isExpanded.value = true; },
						expandDelay,
					);
				} else {
					isExpanded.value = true;
				}

				if (collapseDelay > 0) {
					autoCollapseTimer = window.setTimeout(
						() => { isExpanded.value = false; },
						collapseDelay,
					);
				}
			},
			{ immediate: true },
		);

		/* ------------------------------ Derived values ---------------------------- */

		const minExpanded = HEIGHT * MIN_EXPAND_RATIO;

		const rawExpanded = computed(() =>
			hasBody.value
				? Math.max(minExpanded, HEIGHT + contentHeight.value)
				: minExpanded,
		);

		let frozenExpanded = rawExpanded.value;
		watch([open, rawExpanded], () => {
			if (open.value) {
				frozenExpanded = rawExpanded.value;
			}
		});

		const expanded = computed(() => (open.value ? rawExpanded.value : frozenExpanded));
		const svgHeight = computed(() => (hasBody.value ? Math.max(expanded.value, minExpanded) : HEIGHT));
		const expandedContent = computed(() => Math.max(0, expanded.value - HEIGHT));
		const resolvedPillWidth = computed(() => Math.max(pillWidth.value || HEIGHT, HEIGHT));
		const pillHeight = computed(() => HEIGHT + blur.value * 3);

		const pillX = computed(() =>
			props.position === "right"
				? WIDTH - resolvedPillWidth.value
				: props.position === "center"
					? (WIDTH - resolvedPillWidth.value) / 2
					: 0,
		);

		/* ------------------------------- Inline styles ---------------------------- */

		const rootStyle = computed<CSSProperties & Record<string, string>>(() => ({
			"--_h": `${open.value ? expanded.value : HEIGHT}px`,
			"--_pw": `${resolvedPillWidth.value}px`,
			"--_px": `${pillX.value}px`,
			"--_sy": `${open.value ? 1 : HEIGHT / pillHeight.value}`,
			"--_ph": `${pillHeight.value}px`,
			"--_by": `${open.value ? 1 : 0}`,
			"--_ht": `translateY(${open.value ? (props.expand === "bottom" ? 3 : -3) : 0}px) scale(${open.value ? 0.9 : 1})`,
			"--_co": `${open.value ? 1 : 0}`,
		}));

		/* -------------------------------- Handlers -------------------------------- */

		function handleEnter(e: MouseEvent) {
			emit("mouseenter", e);
			if (hasExpandableBody.value) isExpanded.value = true;
		}

		function handleLeave(e: MouseEvent) {
			emit("mouseleave", e);
			isExpanded.value = false;
		}

		function handleTransitionEnd(e: TransitionEvent) {
			if (e.propertyName !== "height" && e.propertyName !== "transform") return;
			if (open.value) return;
			if (!pending) return;
			if (swapTimer) {
				clearTimeout(swapTimer);
				swapTimer = null;
			}
			view.value = pending.payload;
			applied.value = pending.key;
			pending = null;
		}

		/* -------------------------------- Swipe ----------------------------------- */

		const SWIPE_DISMISS = 30;
		const SWIPE_MAX = 20;
		let pointerStart: number | null = null;

		onMounted(() => {
			const el = buttonRef.value;
			if (!el) return;

			const onMove = (e: PointerEvent) => {
				if (pointerStart === null) return;
				const dy = e.clientY - pointerStart;
				const sign = dy > 0 ? 1 : -1;
				const clamped = Math.min(Math.abs(dy), SWIPE_MAX) * sign;
				el.style.transform = `translateY(${clamped}px)`;
			};

			const onUp = (e: PointerEvent) => {
				if (pointerStart === null) return;
				const dy = e.clientY - pointerStart;
				pointerStart = null;
				el.style.transform = "";
				if (Math.abs(dy) > SWIPE_DISMISS) {
					emit("dismiss");
				}
			};

			el.addEventListener("pointermove", onMove, { passive: true });
			el.addEventListener("pointerup", onUp, { passive: true });
		});

		function handlePointerDown(e: PointerEvent) {
			if (props.exiting) return;
			const target = e.target as HTMLElement;
			if (target.closest("[data-babi-button]")) return;
			pointerStart = e.clientY;
			(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		}

		/* ---------------------------------- Icon ---------------------------------- */

		function getIcon(v: View) {
			if (v.icon !== undefined) return v.icon;
			return STATE_ICON[v.state]();
		}

		function renderComponent(v: View) {
			if (!v.component) return null;
			return isVNode(v.component)
				? v.component
				: h(v.component as Component, v.componentProps);
		}

		/* --------------------------------- Render --------------------------------- */

		function renderHeaderInner(
			layerView: View,
			layerKey: string,
			layer: "current" | "prev",
			isExiting?: boolean,
		) {
			const attrs: Record<string, unknown> = {
				"data-babi-header-inner": "",
				"data-layer": layer,
			};
			if (isExiting) attrs["data-exiting"] = "true";
			if (layer === "current") attrs.ref = innerRef;
			attrs.key = layerKey;

			return h("div", attrs, [
				h(
					"div",
					{
						"data-babi-badge": "",
						"data-state": layerView.state,
						class: layerView.styles?.badge,
					},
					[getIcon(layerView)],
				),
				h(
					"span",
					{
						"data-babi-title": "",
						"data-state": layerView.state,
						class: layerView.styles?.title,
					},
					layerView.title,
				),
			]);
		}

		return () => {
			const v = view.value;
			const hl = headerLayer.value;

			const headerStack = [
				renderHeaderInner(hl.current.view, hl.current.key, "current"),
			];
			if (hl.prev) {
				headerStack.push(
					renderHeaderInner(hl.prev.view, hl.prev.key, "prev", true),
				);
			}

			const children: VNode[] = [
				// Canvas
				h("div", { "data-babi-canvas": "", "data-edge": props.expand }, [
					h(
						"svg",
						{
							"data-babi-svg": "",
							width: WIDTH,
							height: svgHeight.value,
							viewBox: `0 0 ${WIDTH} ${svgHeight.value}`,
						},
						[
							h("title", "Babi Notification"),
							renderGooeyDefs(filterId.value, blur.value),
							h("g", { filter: `url(#${filterId.value})` }, [
								h("rect", {
									"data-babi-pill": "",
									x: pillX.value,
									rx: resolvedRoundness.value,
									ry: resolvedRoundness.value,
									fill: v.fill,
								}),
								h("rect", {
									"data-babi-body": "",
									y: HEIGHT,
									width: WIDTH,
									height: expandedContent.value,
									rx: resolvedRoundness.value,
									ry: resolvedRoundness.value,
									fill: v.fill,
								}),
							]),
						],
					),
				]),
				// Header
				h(
					"div",
					{ ref: headerRef, "data-babi-header": "", "data-edge": props.expand },
					[h("div", { "data-babi-header-stack": "" }, headerStack)],
				),
			];

			// Content
			if (hasBody.value) {
				const descChildren: VNode[] = [];
				if (v.description) {
					if (typeof v.description === "string") {
						descChildren.push(h("span", v.description));
					} else {
						descChildren.push(v.description);
					}
				}
				const customComponent = renderComponent(v);
				if (customComponent) {
					descChildren.push(customComponent);
				}
				if (v.button) {
					descChildren.push(
						h(
							"a",
							{
								href: "#",
								"data-babi-button": "",
								"data-state": v.state,
								class: v.styles?.button,
								onClick: (e: MouseEvent) => {
									e.preventDefault();
									e.stopPropagation();
									v.button?.onClick();
								},
							},
							v.button.title,
						),
					);
				}

				children.push(
					h(
						"div",
						{
							"data-babi-content": "",
							"data-edge": props.expand,
							"data-visible": open.value,
						},
						[
							h(
								"div",
								{
									ref: contentRef,
									"data-babi-description": "",
									class: v.styles?.description,
								},
								descChildren,
							),
						],
					),
				);
			}

			return h(
				"button",
				{
					ref: buttonRef,
					type: "button",
					"data-babi-toast": "",
					"data-babi-id": props.id,
					"data-ready": ready.value,
					"data-expanded": open.value,
					"data-exiting": props.exiting,
					"data-edge": props.expand,
					"data-position": props.position,
					"data-state": v.state,
					class: props.class,
					style: rootStyle.value,
					onMouseenter: handleEnter,
					onMouseleave: handleLeave,
					onTransitionend: handleTransitionEnd,
					onPointerdown: handlePointerDown,
				},
				children,
			);
		};
	},
});
