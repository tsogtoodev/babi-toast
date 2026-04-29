import type { Component, Ref, VNode } from "vue";

export type BabiState =
	| "success"
	| "loading"
	| "error"
	| "warning"
	| "info"
	| "action";

export interface BabiStyles {
	title?: string;
	description?: string;
	badge?: string;
	button?: string;
}

export interface BabiButton {
	title: string;
	onClick: () => void;
}

export const BABI_POSITIONS = [
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
] as const;

export type BabiPosition = (typeof BABI_POSITIONS)[number];

export interface BabiOptions {
	title?: string;
	description?: VNode | string;
	component?: Component | VNode;
	componentProps?: Record<string, unknown>;
	position?: BabiPosition;
	duration?: number | null;
	icon?: VNode | null;
	state?: BabiState;
	styles?: BabiStyles;
	fill?: string;
	border?: string;
	roundness?: number;
	autopilot?: boolean | { expand?: number; collapse?: number };
	button?: BabiButton;
	promote?: BabiPromoteOptions;
}

export interface BabiPromoteOptions {
	to: string;
	component: Component | VNode;
	componentProps?: Record<string, unknown>;
	successVisibleMs?: number;
	onDismiss?: () => void;
}

export type BabiPlacement =
	| { kind: "toast" }
	| { kind: "promoted"; viewport: string };

export interface BabiPromoteHelpers {
	id: string;
	dismiss: () => void;
	update: (options: Partial<BabiOptions>) => void;
}

export type BabiPromiseLoadingIndicator = "default" | "pixel-grid";

export type BabiPixelGridPreset =
	| "wave-lr"
	| "wave-rl"
	| "wave-tb"
	| "wave-bt"
	| "spiral-cw"
	| "corners-first"
	| "center-out"
	| "diagonal-tl"
	| "snake"
	| "cross"
	| "checkerboard"
	| "rain"
	| "pinwheel"
	| "orbit"
	| "converge"
	| "zigzag"
	| "aurora"
	| "ember"
	| "prism"
	| "neon-cross"
	| "tide"
	| "sunset"
	| "toxic"
	| "frost";

export interface BabiToasterOptions extends Partial<BabiOptions> {
	promiseLoadingIndicator?: BabiPromiseLoadingIndicator;
	promiseLoadingIndicatorPreset?: BabiPixelGridPreset;
}

export interface BabiStreamEmitter<T> {
	(value: T): void;
	done: (value?: T) => void;
	error: (err: unknown) => void;
}

export type BabiStreamSource<T> =
	| AsyncIterable<T>
	| ReadableStream<T>
	| Ref<T>
	| ((emit: BabiStreamEmitter<T>) => (() => void) | void);

export interface BabiStreamOptions<T = unknown> {
	initial?: BabiOptions;
	frame?: (value: T) => BabiOptions | void;
	success?: BabiOptions | ((value: T | undefined) => BabiOptions);
	error?: BabiOptions | ((err: unknown) => BabiOptions);
	position?: BabiPosition;
	signal?: AbortSignal;
}

export interface BabiStreamHandle<T = unknown> {
	id: string;
	cancel: () => void;
	done: Promise<T | undefined>;
}
