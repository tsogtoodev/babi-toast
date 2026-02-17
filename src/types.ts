import type { VNode } from "vue";

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
	position?: BabiPosition;
	duration?: number | null;
	icon?: VNode | null;
	styles?: BabiStyles;
	fill?: string;
	roundness?: number;
	autopilot?: boolean | { expand?: number; collapse?: number };
	button?: BabiButton;
}
