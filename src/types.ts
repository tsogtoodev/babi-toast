import type { Component, VNode } from "vue";

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
	roundness?: number;
	autopilot?: boolean | { expand?: number; collapse?: number };
	button?: BabiButton;
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
