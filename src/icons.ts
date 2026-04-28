import { type VNode, h } from "vue";
import type { BabiPixelGridPreset } from "./types";

type PixelGridColor =
	| "cyan"
	| "magenta"
	| "yellow"
	| "green"
	| "orange"
	| "blue"
	| "red"
	| "purple"
	| "white"
	| "teal"
	| "pink"
	| "lime";

interface PixelGridPresetConfig {
	delays: readonly number[];
	duration: number;
	colors?: readonly PixelGridColor[];
}

const PIXEL_GRID_PRESETS: Record<BabiPixelGridPreset, PixelGridPresetConfig> = {
	"wave-lr": { delays: [0, 120, 240, 0, 120, 240, 0, 120, 240], duration: 200 },
	"wave-rl": { delays: [240, 120, 0, 240, 120, 0, 240, 120, 0], duration: 200 },
	"wave-tb": { delays: [0, 0, 0, 120, 120, 120, 240, 240, 240], duration: 200 },
	"wave-bt": { delays: [240, 240, 240, 120, 120, 120, 0, 0, 0], duration: 200 },
	"spiral-cw": { delays: [0, 80, 160, 560, 640, 240, 480, 400, 320], duration: 180 },
	"corners-first": { delays: [0, 200, 0, 200, 400, 200, 0, 200, 0], duration: 200 },
	"center-out": { delays: [240, 120, 240, 120, 0, 120, 240, 120, 240], duration: 200 },
	"diagonal-tl": { delays: [0, 100, 200, 100, 200, 300, 200, 300, 400], duration: 180 },
	snake: { delays: [0, 80, 160, 400, 320, 240, 480, 560, 640], duration: 160 },
	cross: { delays: [300, 0, 300, 0, 0, 0, 300, 0, 300], duration: 250 },
	checkerboard: { delays: [0, 250, 0, 250, 0, 250, 0, 250, 0], duration: 220 },
	rain: { delays: [0, 180, 60, 120, 300, 240, 360, 80, 420], duration: 170 },
	pinwheel: { delays: [0, 160, 480, 320, 640, 160, 480, 320, 0], duration: 150 },
	orbit: { delays: [0, 80, 160, 480, 640, 240, 400, 320, 560], duration: 120 },
	converge: { delays: [0, 160, 80, 240, 320, 240, 80, 160, 0], duration: 260 },
	zigzag: { delays: [0, 160, 320, 400, 240, 80, 480, 560, 640], duration: 140 },
	aurora: {
		delays: [0, 100, 200, 100, 200, 300, 200, 300, 400],
		duration: 220,
		colors: ["cyan", "cyan", "teal", "teal", "blue", "blue", "purple", "purple", "magenta"],
	},
	ember: {
		delays: [0, 80, 160, 560, 640, 240, 480, 400, 320],
		duration: 180,
		colors: ["yellow", "orange", "orange", "orange", "red", "red", "red", "magenta", "magenta"],
	},
	prism: {
		delays: [0, 80, 160, 240, 320, 400, 480, 560, 640],
		duration: 160,
		colors: ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "magenta", "pink"],
	},
	"neon-cross": {
		delays: [300, 0, 300, 0, 0, 0, 300, 0, 300],
		duration: 250,
		colors: ["magenta", "cyan", "magenta", "cyan", "white", "cyan", "magenta", "cyan", "magenta"],
	},
	tide: {
		delays: [0, 0, 0, 120, 120, 120, 240, 240, 240],
		duration: 200,
		colors: ["teal", "cyan", "teal", "blue", "teal", "blue", "purple", "blue", "purple"],
	},
	sunset: {
		delays: [240, 240, 240, 120, 120, 120, 0, 0, 0],
		duration: 200,
		colors: ["purple", "blue", "purple", "magenta", "red", "magenta", "orange", "yellow", "orange"],
	},
	toxic: {
		delays: [0, 200, 0, 200, 400, 200, 0, 200, 0],
		duration: 200,
		colors: ["lime", "green", "lime", "green", "yellow", "green", "lime", "green", "lime"],
	},
	frost: {
		delays: [240, 120, 240, 120, 0, 120, 240, 120, 240],
		duration: 200,
		colors: ["blue", "cyan", "blue", "cyan", "white", "cyan", "blue", "cyan", "blue"],
	},
};

const PIXEL_GRID_COLORS: Record<
	PixelGridColor,
	{ off: string; on: string; glow: string }
> = {
	cyan: {
		off: "oklch(40% 0.08 195 / 0.4)",
		on: "oklch(90% 0.2 195)",
		glow: "oklch(80% 0.25 195 / 0.9)",
	},
	magenta: {
		off: "oklch(40% 0.08 330 / 0.4)",
		on: "oklch(85% 0.25 330)",
		glow: "oklch(75% 0.3 330 / 0.9)",
	},
	yellow: {
		off: "oklch(50% 0.08 90 / 0.4)",
		on: "oklch(95% 0.2 90)",
		glow: "oklch(90% 0.25 90 / 0.9)",
	},
	green: {
		off: "oklch(40% 0.08 145 / 0.4)",
		on: "oklch(90% 0.25 145)",
		glow: "oklch(80% 0.3 145 / 0.9)",
	},
	orange: {
		off: "oklch(45% 0.08 50 / 0.4)",
		on: "oklch(85% 0.22 50)",
		glow: "oklch(75% 0.28 50 / 0.9)",
	},
	blue: {
		off: "oklch(40% 0.08 260 / 0.4)",
		on: "oklch(80% 0.22 260)",
		glow: "oklch(70% 0.28 260 / 0.9)",
	},
	red: {
		off: "oklch(40% 0.08 25 / 0.4)",
		on: "oklch(70% 0.25 25)",
		glow: "oklch(60% 0.3 25 / 0.9)",
	},
	purple: {
		off: "oklch(40% 0.08 300 / 0.4)",
		on: "oklch(75% 0.22 300)",
		glow: "oklch(65% 0.28 300 / 0.9)",
	},
	white: {
		off: "oklch(50% 0 0 / 0.3)",
		on: "oklch(98% 0 0)",
		glow: "oklch(95% 0 0 / 0.8)",
	},
	teal: {
		off: "oklch(40% 0.08 175 / 0.4)",
		on: "oklch(82% 0.18 175)",
		glow: "oklch(72% 0.24 175 / 0.9)",
	},
	pink: {
		off: "oklch(45% 0.08 350 / 0.4)",
		on: "oklch(80% 0.2 350)",
		glow: "oklch(70% 0.26 350 / 0.9)",
	},
	lime: {
		off: "oklch(45% 0.08 120 / 0.4)",
		on: "oklch(88% 0.22 120)",
		glow: "oklch(80% 0.28 120 / 0.9)",
	},
};

function getPixelGridColorVars(color?: PixelGridColor) {
	if (!color) return {};
	const vars = PIXEL_GRID_COLORS[color];
	return {
		"--_pixel-cell-off": vars.off,
		"--_pixel-cell-on": vars.on,
		"--_pixel-cell-glow": vars.glow,
	};
}

function Icon(title: string, children: VNode[]) {
	return h(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
		},
		[h("title", title), ...children],
	);
}

export function ArrowRight() {
	return Icon("Arrow Right", [
		h("path", { d: "M5 12h14" }),
		h("path", { d: "m12 5 7 7-7 7" }),
	]);
}

export function LifeBuoy() {
	return Icon("Life Buoy", [
		h("circle", { cx: "12", cy: "12", r: "10" }),
		h("path", { d: "m4.93 4.93 4.24 4.24" }),
		h("path", { d: "m14.83 9.17 4.24-4.24" }),
		h("path", { d: "m14.83 14.83 4.24 4.24" }),
		h("path", { d: "m9.17 14.83-4.24 4.24" }),
		h("circle", { cx: "12", cy: "12", r: "4" }),
	]);
}

export function LoaderCircle(attrs?: Record<string, string>) {
	return h(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			...attrs,
		},
		[h("title", "Loader Circle"), h("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })],
	);
}

export function PixelGridLoader(preset: BabiPixelGridPreset = "wave-lr") {
	const config = PIXEL_GRID_PRESETS[preset];
	const cycleMs = Math.max(...config.delays) + config.duration + 50;
	return h(
		"span",
		{
			"data-babi-pixel-grid": "",
			"data-preset": preset,
			"aria-hidden": "true",
		},
		Array.from({ length: 9 }, (_, i) =>
			h("span", {
				key: i,
				"data-babi-pixel-grid-cell": "",
				style: {
					...getPixelGridColorVars(config.colors?.[i]),
					"--_d": `${config.delays[i]}ms`,
					"--_hold": `${config.duration}ms`,
					"--_cycle": `${cycleMs}ms`,
				},
			}),
		),
	);
}

export function X() {
	return Icon("X", [
		h("path", { d: "M18 6 6 18" }),
		h("path", { d: "m6 6 12 12" }),
	]);
}

export function CircleAlert() {
	return Icon("Circle Alert", [
		h("circle", { cx: "12", cy: "12", r: "10" }),
		h("line", { x1: "12", x2: "12", y1: "8", y2: "12" }),
		h("line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }),
	]);
}

export function Check() {
	return Icon("Check", [h("path", { d: "M20 6 9 17l-5-5" })]);
}
