import type { VNode } from "vue";
import type {
	BabiButton,
	BabiOptions,
	BabiPosition,
	BabiStyles,
} from "./types";

/* -------------------------------- Constants ------------------------------- */

export const DEFAULT_DURATION = 6000;
export const EXIT_DURATION = DEFAULT_DURATION * 0.1;
export const AUTO_EXPAND_DELAY = DEFAULT_DURATION * 0.025;
export const AUTO_COLLAPSE_DELAY = DEFAULT_DURATION - 2000;

export const pillAlign = (pos: BabiPosition) =>
	pos.includes("right") ? "right" : pos.includes("center") ? "center" : "left";
export const expandDir = (pos: BabiPosition) =>
	pos.startsWith("top") ? ("bottom" as const) : ("top" as const);

/* ---------------------------------- Types --------------------------------- */

export interface InternalBabiOptions extends BabiOptions {
	id?: string;
}

export interface BabiItem extends InternalBabiOptions {
	id: string;
	instanceId: string;
	exiting?: boolean;
	autoExpandDelayMs?: number;
	autoCollapseDelayMs?: number;
}

export type BabiOffsetValue = number | string;
export type BabiOffsetConfig = Partial<
	Record<"top" | "right" | "bottom" | "left", BabiOffsetValue>
>;

/* ------------------------------ Global State ------------------------------ */

export type BabiListener = (toasts: BabiItem[]) => void;

export const store = {
	toasts: [] as BabiItem[],
	listeners: new Set<BabiListener>(),
	position: "top-right" as BabiPosition,
	options: undefined as Partial<BabiOptions> | undefined,

	emit() {
		for (const fn of this.listeners) fn(this.toasts);
	},

	update(fn: (prev: BabiItem[]) => BabiItem[]) {
		this.toasts = fn(this.toasts);
		this.emit();
	},
};

let idCounter = 0;
const generateId = () =>
	`${++idCounter}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const timeoutKey = (t: BabiItem) => `${t.id}:${t.instanceId}`;

/* ------------------------------- Toast API -------------------------------- */

export const dismissToast = (id: string) => {
	const item = store.toasts.find((t) => t.id === id);
	if (!item || item.exiting) return;

	store.update((prev) =>
		prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
	);

	setTimeout(
		() => store.update((prev) => prev.filter((t) => t.id !== id)),
		EXIT_DURATION,
	);
};

const resolveAutopilot = (
	opts: InternalBabiOptions,
	duration: number | null,
): { expandDelayMs?: number; collapseDelayMs?: number } => {
	if (opts.autopilot === false || !duration || duration <= 0) return {};
	const cfg = typeof opts.autopilot === "object" ? opts.autopilot : undefined;
	const clamp = (v: number) => Math.min(duration, Math.max(0, v));
	return {
		expandDelayMs: clamp(cfg?.expand ?? AUTO_EXPAND_DELAY),
		collapseDelayMs: clamp(cfg?.collapse ?? AUTO_COLLAPSE_DELAY),
	};
};

const mergeOptions = (options: InternalBabiOptions) => ({
	...store.options,
	...options,
	styles: { ...store.options?.styles, ...options.styles },
});

const buildBabiItem = (
	merged: InternalBabiOptions,
	id: string,
	fallbackPosition?: BabiPosition,
): BabiItem => {
	const duration = merged.duration ?? DEFAULT_DURATION;
	const auto = resolveAutopilot(merged, duration);
	return {
		...merged,
		id,
		instanceId: generateId(),
		position: merged.position ?? fallbackPosition ?? store.position,
		autoExpandDelayMs: auto.expandDelayMs,
		autoCollapseDelayMs: auto.collapseDelayMs,
	};
};

const createToast = (options: InternalBabiOptions) => {
	const live = store.toasts.filter((t) => !t.exiting);
	const merged = mergeOptions(options);

	const id = merged.id ?? generateId();
	const prev = merged.id ? live.find((t) => t.id === id) : undefined;
	const item = buildBabiItem(merged, id, prev?.position);

	if (prev) {
		store.update((p) => p.map((t) => (t.id === id ? item : t)));
	} else {
		store.update((p) => [...p.filter((t) => t.id !== id), item]);
	}
	return { id, duration: merged.duration ?? DEFAULT_DURATION };
};

const updateToast = (id: string, options: InternalBabiOptions) => {
	const existing = store.toasts.find((t) => t.id === id);
	if (!existing) return;

	const item = buildBabiItem(mergeOptions(options), id, existing.position);
	store.update((prev) => prev.map((t) => (t.id === id ? item : t)));
};

export interface BabiPromiseOptions<T = unknown> {
	loading: BabiOptions;
	success: BabiOptions | ((data: T) => BabiOptions);
	error: BabiOptions | ((err: unknown) => BabiOptions);
	action?: BabiOptions | ((data: T) => BabiOptions);
	position?: BabiPosition;
}

export const babi = {
	show: (opts: BabiOptions) => createToast(opts).id,
	success: (opts: BabiOptions) =>
		createToast({ ...opts, state: "success" }).id,
	error: (opts: BabiOptions) => createToast({ ...opts, state: "error" }).id,
	warning: (opts: BabiOptions) =>
		createToast({ ...opts, state: "warning" }).id,
	info: (opts: BabiOptions) => createToast({ ...opts, state: "info" }).id,
	action: (opts: BabiOptions) => createToast({ ...opts, state: "action" }).id,

	promise: <T,>(
		promise: Promise<T> | (() => Promise<T>),
		opts: BabiPromiseOptions<T>,
	): Promise<T> => {
		const { id } = createToast({
			...opts.loading,
			state: "loading",
			duration: null,
			position: opts.position,
		});

		const p = typeof promise === "function" ? promise() : promise;

		p.then((data) => {
			if (opts.action) {
				const actionOpts =
					typeof opts.action === "function" ? opts.action(data) : opts.action;
				updateToast(id, { ...actionOpts, state: "action", id });
			} else {
				const successOpts =
					typeof opts.success === "function"
						? opts.success(data)
						: opts.success;
				updateToast(id, { ...successOpts, state: "success", id });
			}
		}).catch((err) => {
			const errorOpts =
				typeof opts.error === "function" ? opts.error(err) : opts.error;
			updateToast(id, { ...errorOpts, state: "error", id });
		});

		return p;
	},

	dismiss: dismissToast,

	clear: (position?: BabiPosition) =>
		store.update((prev) =>
			position ? prev.filter((t) => t.position !== position) : [],
		),
};
