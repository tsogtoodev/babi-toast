/* -------------------------------------------------------------------------- */
/*  Promotion runtime: viewport registry + FLIP morph layer.                  */
/* -------------------------------------------------------------------------- */

import type { BabiItem } from "./store";

/* ----------------------------- Viewport registry --------------------------- */

const registry = new Map<string, HTMLElement>();
type RegistryListener = (name: string) => void;
const listeners = new Set<RegistryListener>();

export const registerPromoteViewport = (name: string, el: HTMLElement) => {
	if (registry.has(name) && registry.get(name) !== el) {
		console.warn(`[babi-toast] duplicate promote viewport: ${name}`);
	}
	registry.set(name, el);
	for (const fn of listeners) fn(name);
};

export const unregisterPromoteViewport = (name: string, el: HTMLElement) => {
	if (registry.get(name) === el) {
		registry.delete(name);
		for (const fn of listeners) fn(name);
	}
};

export const getPromoteViewportEl = (name: string): HTMLElement | undefined =>
	registry.get(name);

export const onPromoteViewportChange = (fn: RegistryListener): (() => void) => {
	listeners.add(fn);
	return () => listeners.delete(fn);
};

/* -------------------------------- FLIP morph ------------------------------- */

const MORPH_DURATION = 360;
const MORPH_EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

export interface PromotionMorphInput {
	sourceEl: HTMLElement;
	destEl: HTMLElement;
	item: BabiItem;
	reducedMotion: boolean;
	/** Called once the source rect + clone are captured; the toast may now be unmounted. */
	onCaptured?: () => void;
}

export interface PromotionMorphResult {
	finished: Promise<void>;
	cancel: () => void;
}

const stripInteractivity = (el: HTMLElement) => {
	el.style.pointerEvents = "none";
	for (const node of el.querySelectorAll<HTMLElement | SVGElement>("*")) {
		(node as HTMLElement).style.pointerEvents = "none";
	}
};

export const runPromotionMorph = (
	input: PromotionMorphInput,
): PromotionMorphResult => {
	const { sourceEl, destEl, reducedMotion, onCaptured } = input;

	const sourceRect = sourceEl.getBoundingClientRect();
	const destRect = destEl.getBoundingClientRect();

	const noopResult = (): PromotionMorphResult => {
		onCaptured?.();
		return { finished: Promise.resolve(), cancel: () => {} };
	};

	if (
		sourceRect.width <= 0 ||
		sourceRect.height <= 0 ||
		destRect.width <= 0 ||
		destRect.height <= 0
	) {
		return noopResult();
	}

	if (reducedMotion) {
		return noopResult();
	}

	// Clone the live toast DOM to preserve typography, badge, fill, gooey shell.
	const clone = sourceEl.cloneNode(true) as HTMLElement;
	clone.removeAttribute("data-babi-toast");
	clone.setAttribute("data-babi-morph-clone", "");
	clone.style.position = "fixed";
	clone.style.top = `${sourceRect.top}px`;
	clone.style.left = `${sourceRect.left}px`;
	clone.style.width = `${sourceRect.width}px`;
	clone.style.height = `${sourceRect.height}px`;
	clone.style.margin = "0";
	clone.style.zIndex = "2147483646";
	clone.style.transformOrigin = "top left";
	clone.style.willChange = "transform, opacity";
	stripInteractivity(clone);

	document.body.appendChild(clone);

	// Source has been visually replicated; safe for caller to flip placement now.
	onCaptured?.();

	const dx = destRect.left - sourceRect.left;
	const dy = destRect.top - sourceRect.top;
	const sx = destRect.width / sourceRect.width;
	const sy = destRect.height / sourceRect.height;

	const supportsAnimate =
		typeof (clone as Element & { animate?: unknown }).animate === "function";

	if (!supportsAnimate) {
		clone.remove();
		return { finished: Promise.resolve(), cancel: () => {} };
	}

	const cloneAnim = clone.animate(
		[
			{ transform: "translate(0,0) scale(1,1)", opacity: 1, offset: 0 },
			{ opacity: 1, offset: 0.45 },
			{
				transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`,
				opacity: 0,
				offset: 1,
			},
		],
		{ duration: MORPH_DURATION, easing: MORPH_EASING, fill: "forwards" },
	);

	let cancelled = false;
	const cleanup = () => {
		try {
			clone.remove();
		} catch {}
	};

	const finished = cloneAnim.finished
		.then(() => {
			if (!cancelled) cleanup();
		})
		.catch(() => cleanup());

	const cancel = () => {
		if (cancelled) return;
		cancelled = true;
		try {
			cloneAnim.cancel();
		} catch {}
		cleanup();
	};

	return { finished, cancel };
};

/* ----------------------------- Reduced motion ----------------------------- */

export const prefersReducedMotion = (): boolean => {
	if (typeof window === "undefined" || !window.matchMedia) return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
