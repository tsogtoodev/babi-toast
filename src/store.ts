import { isRef, watch } from "vue";
import { PixelGridLoader } from "./icons";
import type {
	BabiOptions,
	BabiPlacement,
	BabiPosition,
	BabiPromoteOptions,
	BabiStreamEmitter,
	BabiStreamHandle,
	BabiStreamOptions,
	BabiStreamSource,
	BabiToasterOptions,
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
	placement: BabiPlacement;
	pendingPromote?: BabiPromoteOptions;
}

export const DEFAULT_SUCCESS_VISIBLE_MS = 600;

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
	options: undefined as BabiToasterOptions | undefined,

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

	if (item.placement.kind === "promoted" && item.promote?.onDismiss) {
		try {
			item.promote.onDismiss();
		} catch {}
	}

	store.update((prev) =>
		prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
	);

	setTimeout(
		() => store.update((prev) => prev.filter((t) => t.id !== id)),
		EXIT_DURATION,
	);
};

export const flipPromotion = (id: string) => {
	store.update((prev) =>
		prev.map((t) => {
			if (t.id !== id || !t.pendingPromote) return t;
			return {
				...t,
				placement: { kind: "promoted", viewport: t.pendingPromote.to },
				pendingPromote: undefined,
				state: undefined,
				duration: null,
				icon: null,
			};
		}),
	);
};

export const cancelPromotion = (id: string) => {
	store.update((prev) =>
		prev.map((t) =>
			t.id === id ? { ...t, pendingPromote: undefined } : t,
		),
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

const mergeOptions = (options: InternalBabiOptions) => {
	const {
		promiseLoadingIndicator: _indicator,
		promiseLoadingIndicatorPreset: _preset,
		...globalOptions
	} = store.options ?? {};
	return {
		...globalOptions,
		...options,
		styles: { ...globalOptions.styles, ...options.styles },
	};
};

const buildBabiItem = (
	merged: InternalBabiOptions,
	id: string,
	fallbackPosition?: BabiPosition,
	previous?: BabiItem,
): BabiItem => {
	const duration = merged.duration ?? DEFAULT_DURATION;
	const auto = resolveAutopilot(merged, duration);
	const placement: BabiPlacement =
		previous?.placement ?? { kind: "toast" };

	const next: BabiItem = {
		...merged,
		id,
		instanceId: generateId(),
		position: merged.position ?? fallbackPosition ?? store.position,
		autoExpandDelayMs: auto.expandDelayMs,
		autoCollapseDelayMs: auto.collapseDelayMs,
		placement,
	};

	// Auto-schedule promotion when entering success state with a promote option,
	// while the item is still in toast placement and not already pending.
	if (
		next.promote &&
		next.state === "success" &&
		next.placement.kind === "toast" &&
		!previous?.pendingPromote
	) {
		next.pendingPromote = next.promote;
	} else if (previous?.pendingPromote) {
		// Preserve in-flight promotion across updates.
		next.pendingPromote = previous.pendingPromote;
	}

	return next;
};

const createToast = (options: InternalBabiOptions) => {
	const live = store.toasts.filter((t) => !t.exiting);
	const merged = mergeOptions(options);

	const id = merged.id ?? generateId();
	const prev = merged.id ? live.find((t) => t.id === id) : undefined;
	const item = buildBabiItem(merged, id, prev?.position, prev);

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

	const item = buildBabiItem(
		mergeOptions(options),
		id,
		existing.position,
		existing,
	);
	store.update((prev) => prev.map((t) => (t.id === id ? item : t)));
};

export interface BabiPromiseOptions<T = unknown> {
	loading: BabiOptions;
	success: BabiOptions | ((data: T) => BabiOptions);
	error: BabiOptions | ((err: unknown) => BabiOptions);
	action?: BabiOptions | ((data: T) => BabiOptions);
	position?: BabiPosition;
}

const withPromiseLoadingDefaults = (loading: BabiOptions): BabiOptions => {
	if (
		loading.icon !== undefined ||
		store.options?.promiseLoadingIndicator !== "pixel-grid"
	) {
		return loading;
	}

	return {
		...loading,
		icon: PixelGridLoader(store.options.promiseLoadingIndicatorPreset),
	};
};

/* --------------------------------- Stream --------------------------------- */

const isReadableStream = <T,>(s: unknown): s is ReadableStream<T> =>
	typeof ReadableStream !== "undefined" && s instanceof ReadableStream;

const isAsyncIterable = <T,>(s: unknown): s is AsyncIterable<T> =>
	s != null &&
	typeof (s as { [Symbol.asyncIterator]?: unknown })[Symbol.asyncIterator] ===
		"function";

const isPlainObjectPatch = (v: unknown): v is BabiOptions =>
	v != null && typeof v === "object" && !Array.isArray(v);

const subscribeAsyncIterable = <T,>(
	iter: AsyncIterable<T>,
	emit: BabiStreamEmitter<T>,
): (() => void) => {
	let cancelled = false;
	const iterator = iter[Symbol.asyncIterator]();
	(async () => {
		let last: T | undefined;
		try {
			while (true) {
				const { value, done } = await iterator.next();
				if (cancelled) return;
				if (done) {
					emit.done(last);
					return;
				}
				last = value;
				emit(value);
			}
		} catch (err) {
			if (!cancelled) emit.error(err);
		}
	})();
	return () => {
		cancelled = true;
		iterator.return?.(undefined).catch(() => {});
	};
};

const subscribeReadableStream = <T,>(
	stream: ReadableStream<T>,
	emit: BabiStreamEmitter<T>,
): (() => void) => {
	let cancelled = false;
	const reader = stream.getReader();
	(async () => {
		let last: T | undefined;
		try {
			while (true) {
				const { value, done } = await reader.read();
				if (cancelled) return;
				if (done) {
					emit.done(last);
					return;
				}
				last = value;
				emit(value);
			}
		} catch (err) {
			if (!cancelled) emit.error(err);
		} finally {
			try {
				reader.releaseLock();
			} catch {}
		}
	})();
	return () => {
		cancelled = true;
		reader.cancel().catch(() => {});
	};
};

const subscribeSource = <T,>(
	source: BabiStreamSource<T>,
	emit: BabiStreamEmitter<T>,
): (() => void) => {
	if (isReadableStream<T>(source)) return subscribeReadableStream(source, emit);
	if (isAsyncIterable<T>(source)) return subscribeAsyncIterable(source, emit);
	if (isRef(source)) {
		return watch(source, (v) => emit(v as T), {
			immediate: true,
			flush: "sync",
		});
	}
	if (typeof source === "function") {
		const teardown = (source as (e: BabiStreamEmitter<T>) => unknown)(emit);
		return typeof teardown === "function"
			? (teardown as () => void)
			: () => {};
	}
	return () => {};
};

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
			...withPromiseLoadingDefaults(opts.loading),
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

	stream: <T,>(
		source: BabiStreamSource<T>,
		opts: BabiStreamOptions<T> = {},
	): BabiStreamHandle<T> => {
		const initial = withPromiseLoadingDefaults(opts.initial ?? {});
		const { id } = createToast({
			...initial,
			state: initial.state ?? "loading",
			duration: initial.duration ?? null,
			position: opts.position,
		});

		let lastValue: T | undefined;
		let settled = false;
		let teardown: () => void = () => {};

		let resolveDone!: (v: T | undefined) => void;
		let rejectDone!: (err: unknown) => void;
		const donePromise = new Promise<T | undefined>((res, rej) => {
			resolveDone = res;
			rejectDone = rej;
		});
		donePromise.catch(() => {});

		const toPatch = (value: T): BabiOptions => {
			if (opts.frame) return opts.frame(value) ?? {};
			if (isPlainObjectPatch(value)) return value;
			return { description: String(value) };
		};

		const finishSuccess = (final: T | undefined, patch: BabiOptions) => {
			settled = true;
			teardown();
			const successPatch =
				typeof opts.success === "function"
					? opts.success(final)
					: opts.success;
			updateToast(id, {
				...patch,
				...(successPatch ?? {}),
				state: "success",
				id,
			});
			resolveDone(final);
		};

		const finishError = (err: unknown, patch?: BabiOptions) => {
			settled = true;
			teardown();
			const errorPatch =
				typeof opts.error === "function"
					? opts.error(err)
					: (opts.error ?? { description: String(err) });
			updateToast(id, {
				...(patch ?? {}),
				...errorPatch,
				state: "error",
				id,
			});
			rejectDone(err);
		};

		const emitFrame = (value: T) => {
			if (settled) return;
			lastValue = value;
			const patch = toPatch(value);
			if (patch.state === "success") {
				finishSuccess(value, patch);
				return;
			}
			if (patch.state === "error") {
				const msg =
					typeof patch.description === "string"
						? patch.description
						: "stream error";
				finishError(new Error(msg), patch);
				return;
			}
			updateToast(id, {
				state: "loading",
				duration: null,
				...patch,
				id,
			});
		};

		const emitter: BabiStreamEmitter<T> = Object.assign(emitFrame, {
			done: (value?: T) => {
				if (settled) return;
				const final = value ?? lastValue;
				const patch = final !== undefined ? toPatch(final) : {};
				finishSuccess(final, patch);
			},
			error: (err: unknown) => {
				if (settled) return;
				finishError(err);
			},
		}) as BabiStreamEmitter<T>;

		const initialTeardown = subscribeSource(source, emitter);
		if (settled) initialTeardown();
		else teardown = initialTeardown;

		const cancel = () => {
			if (settled) return;
			settled = true;
			teardown();
			dismissToast(id);
			resolveDone(lastValue);
		};

		if (opts.signal) {
			if (opts.signal.aborted) cancel();
			else opts.signal.addEventListener("abort", cancel, { once: true });
		}

		return { id, cancel, done: donePromise };
	},

	promote: (id: string) => {
		const existing = store.toasts.find((t) => t.id === id);
		if (!existing) return;
		if (!existing.promote) return;
		if (existing.pendingPromote) return;
		if (existing.placement.kind !== "toast") return;
		store.update((prev) =>
			prev.map((t) =>
				t.id === id ? { ...t, pendingPromote: t.promote } : t,
			),
		);
	},

	dismiss: dismissToast,

	clear: (position?: BabiPosition) =>
		store.update((prev) =>
			position
				? prev.filter(
					(t) =>
						t.placement.kind !== "toast" || t.position !== position,
				)
				: [],
		),

	clearPromoted: (name?: string) =>
		store.update((prev) =>
			prev.filter(
				(t) =>
					t.placement.kind !== "promoted" ||
					(name !== undefined && t.placement.viewport !== name),
			),
		),
};
