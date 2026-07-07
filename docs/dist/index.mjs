function __insertCSS(code) {
  if (!code || typeof document == 'undefined') return
  let head = document.head || document.getElementsByTagName('head')[0]
  let style = document.createElement('style')
  style.type = 'text/css'
  head.appendChild(style)
  ;style.styleSheet ? (style.styleSheet.cssText = code) : style.appendChild(document.createTextNode(code))
}

import { _ as _extends, a as _object_without_properties_loose } from './cc-B6peeNak.mjs';
import { h, isRef, watch, defineComponent, computed, ref, onMounted, onUnmounted, nextTick, isVNode, resolveDynamicComponent } from 'vue';

__insertCSS(":root{--babi-spring-easing:linear(\n\t\t0,\n\t\t0.002 0.6%,\n\t\t0.007 1.2%,\n\t\t0.015 1.8%,\n\t\t0.026 2.4%,\n\t\t0.041 3.1%,\n\t\t0.06 3.8%,\n\t\t0.108 5.3%,\n\t\t0.157 6.6%,\n\t\t0.214 8%,\n\t\t0.467 13.7%,\n\t\t0.577 16.3%,\n\t\t0.631 17.7%,\n\t\t0.682 19.1%,\n\t\t0.73 20.5%,\n\t\t0.771 21.8%,\n\t\t0.808 23.1%,\n\t\t0.844 24.5%,\n\t\t0.874 25.8%,\n\t\t0.903 27.2%,\n\t\t0.928 28.6%,\n\t\t0.952 30.1%,\n\t\t0.972 31.6%,\n\t\t0.988 33.1%,\n\t\t1.01 35.7%,\n\t\t1.025 38.5%,\n\t\t1.034 41.6%,\n\t\t1.038 45%,\n\t\t1.035 50.1%,\n\t\t1.012 64.2%,\n\t\t1.003 73%,\n\t\t0.999 83.7%,\n\t\t1\n\t);--babi-duration:600ms;--babi-height:40px;--babi-width:350px;--babi-state-success:oklch(0.723 0.219 142.136);--babi-state-loading:oklch(0.556 0 0);--babi-state-error:oklch(0.637 0.237 25.331);--babi-state-warning:oklch(0.795 0.184 86.047);--babi-state-info:oklch(0.685 0.169 237.323);--babi-state-action:oklch(0.623 0.214 259.815)}[data-babi-toast]{position:relative;cursor:pointer;pointer-events:auto;touch-action:none;border:0;background:0 0;padding:0;width:var(--babi-width);height:var(--_h,var(--babi-height));opacity:0;transform:translateZ(0) scale(.95);transform-origin:center;contain:layout style;overflow:visible}[data-babi-toast][data-state=loading]{cursor:default}[data-babi-toast][data-ready=true]{opacity:1;transform:translateZ(0) scale(1);transition:transform calc(var(--babi-duration) * .66) var(--babi-spring-easing),opacity calc(var(--babi-duration) * .66) var(--babi-spring-easing),margin-bottom calc(var(--babi-duration) * .66) var(--babi-spring-easing),margin-top calc(var(--babi-duration) * .66) var(--babi-spring-easing),height var(--babi-duration) var(--babi-spring-easing)}[data-babi-viewport][data-position^=top] [data-babi-toast]:not([data-ready=true]){transform:translateY(-6px) scale(.95)}[data-babi-viewport][data-position^=bottom] [data-babi-toast]:not([data-ready=true]){transform:translateY(6px) scale(.95)}[data-babi-toast][data-ready=true][data-exiting=true]{opacity:0;pointer-events:none}[data-babi-viewport][data-position^=top] [data-babi-toast][data-ready=true][data-exiting=true]{transform:translateY(-6px) scale(.95)}[data-babi-viewport][data-position^=bottom] [data-babi-toast][data-ready=true][data-exiting=true]{transform:translateY(6px) scale(.95)}[data-babi-canvas]{position:absolute;left:0;right:0;pointer-events:none;transform:translateZ(0);contain:layout style;overflow:visible}[data-babi-canvas][data-edge=top]{bottom:0;transform:scaleY(-1) translateZ(0)}[data-babi-canvas][data-edge=bottom]{top:0}[data-babi-svg]{overflow:visible}[data-babi-body],[data-babi-pill]{transform-box:fill-box;transform-origin:50% 0%}[data-babi-pill]{transform:scaleY(var(--_sy,1));width:var(--_pw);height:var(--_ph)}[data-babi-body]{transform:scaleY(var(--_by,0));opacity:var(--_by, 0)}[data-babi-toast][data-ready=true] [data-babi-pill]{transition:transform var(--babi-duration) var(--babi-spring-easing),width var(--babi-duration) var(--babi-spring-easing),x var(--babi-duration) var(--babi-spring-easing)}[data-babi-toast][data-ready=true][data-expanded=true] [data-babi-pill]{transition-delay:calc(var(--babi-duration) * 0.08)}[data-babi-toast][data-ready=true] [data-babi-body]{transition:transform var(--babi-duration) var(--babi-spring-easing),opacity var(--babi-duration) var(--babi-spring-easing)}[data-babi-header]{position:absolute;z-index:20;display:flex;align-items:center;padding:.5rem;height:var(--babi-height);overflow:hidden;left:var(--_px,0);transform:var(--_ht);max-width:var(--_pw)}[data-babi-toast][data-ready=true] [data-babi-header]{transition:transform var(--babi-duration) var(--babi-spring-easing),left var(--babi-duration) var(--babi-spring-easing),max-width var(--babi-duration) var(--babi-spring-easing)}[data-babi-header][data-edge=top]{bottom:0}[data-babi-header][data-edge=bottom]{top:0}[data-babi-header-stack]{position:relative;display:inline-flex;align-items:center;height:100%}[data-babi-header-inner]{display:flex;align-items:center;gap:.5rem;white-space:nowrap;opacity:1;filter:blur(0px);will-change:opacity,filter}[data-babi-header-inner][data-layer=current]{animation:babi-header-enter var(--babi-duration) var(--babi-spring-easing) both}[data-babi-header-inner][data-layer=prev]{position:absolute;left:0;top:0;pointer-events:none}[data-babi-header-inner][data-exiting=true]{animation:babi-header-exit .3s ease forwards}[data-babi-badge]{display:flex;height:24px;width:24px;flex-shrink:0;align-items:center;justify-content:center;padding:2px;box-sizing:border-box;border-radius:9999px;color:var(--babi-tone,currentColor);background-color:var(--babi-tone-bg,transparent)}[data-babi-badge]:has([data-babi-pixel-grid]){background-color:transparent}[data-babi-pixel-grid]{--_pixel-on:var(--babi-tone, currentColor);--_pixel-off:color-mix(in oklch, var(--_pixel-on) 25%, transparent);--_pixel-glow:color-mix(in oklch, var(--_pixel-on) 60%, transparent);display:grid;grid-template-columns:repeat(3,3px);grid-template-rows:repeat(3,3px);gap:1px;width:11px;height:11px}[data-babi-pixel-grid-cell]{--_cell-on:var(--_pixel-cell-on, var(--_pixel-on));--_cell-off:var(--_pixel-cell-off, var(--_pixel-off));--_cell-glow:var(--_pixel-cell-glow, var(--_pixel-glow));border-radius:1px;background-color:var(--_cell-off);animation:babi-pixel-grid var(--_cycle,920ms) ease-in-out var(--_d,0ms) infinite}@keyframes babi-pixel-grid{0%,100%{background-color:var(--_cell-off);box-shadow:none}28%,58%{background-color:var(--_cell-on);box-shadow:0 0 3px var(--_cell-glow),0 0 6px var(--_cell-glow)}}[data-babi-title]{font-size:.825rem;line-height:1rem;font-weight:500;text-transform:capitalize;color:var(--babi-tone,currentColor)}:is([data-babi-badge],[data-babi-title])[data-state]{--_c:var(--babi-state-success);--babi-tone:var(--_c);--babi-tone-bg:color-mix(in oklch, var(--_c) 20%, transparent)}:is([data-babi-badge],[data-babi-title])[data-state=loading]{--_c:var(--babi-state-loading)}:is([data-babi-badge],[data-babi-title])[data-state=error]{--_c:var(--babi-state-error)}:is([data-babi-badge],[data-babi-title])[data-state=warning]{--_c:var(--babi-state-warning)}:is([data-babi-badge],[data-babi-title])[data-state=info]{--_c:var(--babi-state-info)}:is([data-babi-badge],[data-babi-title])[data-state=action]{--_c:var(--babi-state-action)}[data-babi-content]{position:absolute;left:0;z-index:10;width:100%;pointer-events:none;opacity:var(--_co, 0)}[data-babi-content]:not([data-visible=true]){content-visibility:hidden}[data-babi-toast][data-ready=true] [data-babi-content]{transition:opacity calc(var(--babi-duration) * .08) var(--babi-spring-easing) calc(var(--babi-duration) * .04)}[data-babi-content][data-edge=top]{top:0}[data-babi-content][data-edge=bottom]{top:var(--babi-height)}[data-babi-content][data-visible=true]{pointer-events:auto}[data-babi-toast][data-ready=true] [data-babi-content][data-visible=true]{transition:opacity var(--babi-duration) var(--babi-spring-easing) calc(var(--babi-duration) * .25)}[data-babi-description]{width:100%;text-align:left;padding:1rem;font-size:.875rem;line-height:1.25rem;color:oklch(.556 0 0);contain:layout style;content-visibility:auto}[data-babi-button]{display:flex;align-items:center;justify-content:center;height:1.75rem;padding:0 .625rem;margin-top:.75rem;border-radius:9999px;border:0;font-size:.75rem;font-weight:500;cursor:pointer;color:var(--babi-btn-color,currentColor);background-color:var(--babi-btn-bg,transparent);transition:background-color 150ms ease}[data-babi-button]:hover{background-color:var(--babi-btn-bg-hover,transparent)}[data-babi-button][data-state]{--_c:var(--babi-state-success);--babi-btn-color:var(--_c);--babi-btn-bg:color-mix(in oklch, var(--_c) 15%, transparent);--babi-btn-bg-hover:color-mix(in oklch, var(--_c) 25%, transparent)}[data-babi-button][data-state=loading]{--_c:var(--babi-state-loading)}[data-babi-button][data-state=error]{--_c:var(--babi-state-error)}[data-babi-button][data-state=warning]{--_c:var(--babi-state-warning)}[data-babi-button][data-state=info]{--_c:var(--babi-state-info)}[data-babi-button][data-state=action]{--_c:var(--babi-state-action)}[data-babi-icon=spin]{animation:babi-spin 1s linear infinite}@keyframes babi-spin{to{rotate:360deg}}@keyframes babi-header-enter{from{opacity:0;filter:blur(6px)}to{opacity:1;filter:blur(0px)}}@keyframes babi-header-exit{from{opacity:1;filter:blur(0px)}to{opacity:0;filter:blur(6px)}}[data-babi-viewport]{position:fixed;z-index:50;display:flex;gap:.75rem;padding:.75rem;pointer-events:none;max-width:calc(100vw - 1.5rem);contain:layout style}[data-babi-viewport][data-position^=top] [data-babi-toast]:not([data-ready=true]){margin-bottom:calc(-1 * (var(--babi-height) + .75rem))}[data-babi-viewport][data-position^=bottom] [data-babi-toast]:not([data-ready=true]){margin-top:calc(-1 * (var(--babi-height) + .75rem))}[data-babi-viewport][data-position^=top]{top:0;flex-direction:column-reverse}[data-babi-viewport][data-position^=bottom]{bottom:0;flex-direction:column}[data-babi-viewport][data-position$=left]{left:0;align-items:flex-start}[data-babi-viewport][data-position$=right]{right:0;align-items:flex-end}[data-babi-viewport][data-position$=center]{left:50%;transform:translateX(-50%);align-items:center}@media (prefers-reduced-motion:no-preference){[data-babi-toast][data-ready=true]:hover,[data-babi-toast][data-ready=true][data-exiting=true]{will-change:transform,opacity,height}}@media (prefers-reduced-motion:reduce){*,::after,::before{animation-duration:0s;animation-iteration-count:1;transition-duration:0s}[data-babi-pixel-grid-cell]{animation:none;background-color:var(--_cell-on);box-shadow:0 0 3px var(--_cell-glow),0 0 6px var(--_cell-glow)}}[data-babi-promoted]{animation:babi-promoted-in 360ms cubic-bezier(.2,.8,.2,1) both}[data-babi-promoted][data-exiting=true]{animation:babi-promoted-out .2s ease-in both}@keyframes babi-promoted-in{0%{opacity:0}45%{opacity:0}100%{opacity:1}}@keyframes babi-promoted-out{to{opacity:0}}[data-babi-morph-clone]{pointer-events:none;user-select:none}@media (prefers-reduced-motion:reduce){[data-babi-promoted]{animation:none}[data-babi-morph-clone]{display:none}}");

const PIXEL_GRID_PRESETS = {
    "wave-lr": {
        delays: [
            0,
            120,
            240,
            0,
            120,
            240,
            0,
            120,
            240
        ],
        duration: 200
    },
    "wave-rl": {
        delays: [
            240,
            120,
            0,
            240,
            120,
            0,
            240,
            120,
            0
        ],
        duration: 200
    },
    "wave-tb": {
        delays: [
            0,
            0,
            0,
            120,
            120,
            120,
            240,
            240,
            240
        ],
        duration: 200
    },
    "wave-bt": {
        delays: [
            240,
            240,
            240,
            120,
            120,
            120,
            0,
            0,
            0
        ],
        duration: 200
    },
    "spiral-cw": {
        delays: [
            0,
            80,
            160,
            560,
            640,
            240,
            480,
            400,
            320
        ],
        duration: 180
    },
    "corners-first": {
        delays: [
            0,
            200,
            0,
            200,
            400,
            200,
            0,
            200,
            0
        ],
        duration: 200
    },
    "center-out": {
        delays: [
            240,
            120,
            240,
            120,
            0,
            120,
            240,
            120,
            240
        ],
        duration: 200
    },
    "diagonal-tl": {
        delays: [
            0,
            100,
            200,
            100,
            200,
            300,
            200,
            300,
            400
        ],
        duration: 180
    },
    snake: {
        delays: [
            0,
            80,
            160,
            400,
            320,
            240,
            480,
            560,
            640
        ],
        duration: 160
    },
    cross: {
        delays: [
            300,
            0,
            300,
            0,
            0,
            0,
            300,
            0,
            300
        ],
        duration: 250
    },
    checkerboard: {
        delays: [
            0,
            250,
            0,
            250,
            0,
            250,
            0,
            250,
            0
        ],
        duration: 220
    },
    rain: {
        delays: [
            0,
            180,
            60,
            120,
            300,
            240,
            360,
            80,
            420
        ],
        duration: 170
    },
    pinwheel: {
        delays: [
            0,
            160,
            480,
            320,
            640,
            160,
            480,
            320,
            0
        ],
        duration: 150
    },
    orbit: {
        delays: [
            0,
            80,
            160,
            480,
            640,
            240,
            400,
            320,
            560
        ],
        duration: 120
    },
    converge: {
        delays: [
            0,
            160,
            80,
            240,
            320,
            240,
            80,
            160,
            0
        ],
        duration: 260
    },
    zigzag: {
        delays: [
            0,
            160,
            320,
            400,
            240,
            80,
            480,
            560,
            640
        ],
        duration: 140
    },
    aurora: {
        delays: [
            0,
            100,
            200,
            100,
            200,
            300,
            200,
            300,
            400
        ],
        duration: 220,
        colors: [
            "cyan",
            "cyan",
            "teal",
            "teal",
            "blue",
            "blue",
            "purple",
            "purple",
            "magenta"
        ]
    },
    ember: {
        delays: [
            0,
            80,
            160,
            560,
            640,
            240,
            480,
            400,
            320
        ],
        duration: 180,
        colors: [
            "yellow",
            "orange",
            "orange",
            "orange",
            "red",
            "red",
            "red",
            "magenta",
            "magenta"
        ]
    },
    prism: {
        delays: [
            0,
            80,
            160,
            240,
            320,
            400,
            480,
            560,
            640
        ],
        duration: 160,
        colors: [
            "red",
            "orange",
            "yellow",
            "green",
            "cyan",
            "blue",
            "purple",
            "magenta",
            "pink"
        ]
    },
    "neon-cross": {
        delays: [
            300,
            0,
            300,
            0,
            0,
            0,
            300,
            0,
            300
        ],
        duration: 250,
        colors: [
            "magenta",
            "cyan",
            "magenta",
            "cyan",
            "white",
            "cyan",
            "magenta",
            "cyan",
            "magenta"
        ]
    },
    tide: {
        delays: [
            0,
            0,
            0,
            120,
            120,
            120,
            240,
            240,
            240
        ],
        duration: 200,
        colors: [
            "teal",
            "cyan",
            "teal",
            "blue",
            "teal",
            "blue",
            "purple",
            "blue",
            "purple"
        ]
    },
    sunset: {
        delays: [
            240,
            240,
            240,
            120,
            120,
            120,
            0,
            0,
            0
        ],
        duration: 200,
        colors: [
            "purple",
            "blue",
            "purple",
            "magenta",
            "red",
            "magenta",
            "orange",
            "yellow",
            "orange"
        ]
    },
    toxic: {
        delays: [
            0,
            200,
            0,
            200,
            400,
            200,
            0,
            200,
            0
        ],
        duration: 200,
        colors: [
            "lime",
            "green",
            "lime",
            "green",
            "yellow",
            "green",
            "lime",
            "green",
            "lime"
        ]
    },
    frost: {
        delays: [
            240,
            120,
            240,
            120,
            0,
            120,
            240,
            120,
            240
        ],
        duration: 200,
        colors: [
            "blue",
            "cyan",
            "blue",
            "cyan",
            "white",
            "cyan",
            "blue",
            "cyan",
            "blue"
        ]
    }
};
const PIXEL_GRID_COLORS = {
    cyan: {
        off: "oklch(40% 0.08 195 / 0.4)",
        on: "oklch(90% 0.2 195)",
        glow: "oklch(80% 0.25 195 / 0.9)"
    },
    magenta: {
        off: "oklch(40% 0.08 330 / 0.4)",
        on: "oklch(85% 0.25 330)",
        glow: "oklch(75% 0.3 330 / 0.9)"
    },
    yellow: {
        off: "oklch(50% 0.08 90 / 0.4)",
        on: "oklch(95% 0.2 90)",
        glow: "oklch(90% 0.25 90 / 0.9)"
    },
    green: {
        off: "oklch(40% 0.08 145 / 0.4)",
        on: "oklch(90% 0.25 145)",
        glow: "oklch(80% 0.3 145 / 0.9)"
    },
    orange: {
        off: "oklch(45% 0.08 50 / 0.4)",
        on: "oklch(85% 0.22 50)",
        glow: "oklch(75% 0.28 50 / 0.9)"
    },
    blue: {
        off: "oklch(40% 0.08 260 / 0.4)",
        on: "oklch(80% 0.22 260)",
        glow: "oklch(70% 0.28 260 / 0.9)"
    },
    red: {
        off: "oklch(40% 0.08 25 / 0.4)",
        on: "oklch(70% 0.25 25)",
        glow: "oklch(60% 0.3 25 / 0.9)"
    },
    purple: {
        off: "oklch(40% 0.08 300 / 0.4)",
        on: "oklch(75% 0.22 300)",
        glow: "oklch(65% 0.28 300 / 0.9)"
    },
    white: {
        off: "oklch(50% 0 0 / 0.3)",
        on: "oklch(98% 0 0)",
        glow: "oklch(95% 0 0 / 0.8)"
    },
    teal: {
        off: "oklch(40% 0.08 175 / 0.4)",
        on: "oklch(82% 0.18 175)",
        glow: "oklch(72% 0.24 175 / 0.9)"
    },
    pink: {
        off: "oklch(45% 0.08 350 / 0.4)",
        on: "oklch(80% 0.2 350)",
        glow: "oklch(70% 0.26 350 / 0.9)"
    },
    lime: {
        off: "oklch(45% 0.08 120 / 0.4)",
        on: "oklch(88% 0.22 120)",
        glow: "oklch(80% 0.28 120 / 0.9)"
    }
};
function getPixelGridColorVars(color) {
    if (!color) return {};
    const vars = PIXEL_GRID_COLORS[color];
    return {
        "--_pixel-cell-off": vars.off,
        "--_pixel-cell-on": vars.on,
        "--_pixel-cell-glow": vars.glow
    };
}
function Icon(title, children) {
    return h("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
    }, [
        h("title", title),
        ...children
    ]);
}
function ArrowRight() {
    return Icon("Arrow Right", [
        h("path", {
            d: "M5 12h14"
        }),
        h("path", {
            d: "m12 5 7 7-7 7"
        })
    ]);
}
function LifeBuoy() {
    return Icon("Life Buoy", [
        h("circle", {
            cx: "12",
            cy: "12",
            r: "10"
        }),
        h("path", {
            d: "m4.93 4.93 4.24 4.24"
        }),
        h("path", {
            d: "m14.83 9.17 4.24-4.24"
        }),
        h("path", {
            d: "m14.83 14.83 4.24 4.24"
        }),
        h("path", {
            d: "m9.17 14.83-4.24 4.24"
        }),
        h("circle", {
            cx: "12",
            cy: "12",
            r: "4"
        })
    ]);
}
function LoaderCircle(attrs) {
    return h("svg", _extends({
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
    }, attrs), [
        h("title", "Loader Circle"),
        h("path", {
            d: "M21 12a9 9 0 1 1-6.219-8.56"
        })
    ]);
}
function PixelGridLoader(preset = "wave-lr") {
    const config = PIXEL_GRID_PRESETS[preset];
    const cycleMs = Math.max(...config.delays) + config.duration + 50;
    return h("span", {
        "data-babi-pixel-grid": "",
        "data-preset": preset,
        "aria-hidden": "true"
    }, Array.from({
        length: 9
    }, (_, i)=>{
        var _config_colors;
        return h("span", {
            key: i,
            "data-babi-pixel-grid-cell": "",
            style: _extends({}, getPixelGridColorVars((_config_colors = config.colors) == null ? void 0 : _config_colors[i]), {
                "--_d": `${config.delays[i]}ms`,
                "--_hold": `${config.duration}ms`,
                "--_cycle": `${cycleMs}ms`
            })
        });
    }));
}
function X() {
    return Icon("X", [
        h("path", {
            d: "M18 6 6 18"
        }),
        h("path", {
            d: "m6 6 12 12"
        })
    ]);
}
function CircleAlert() {
    return Icon("Circle Alert", [
        h("circle", {
            cx: "12",
            cy: "12",
            r: "10"
        }),
        h("line", {
            x1: "12",
            x2: "12",
            y1: "8",
            y2: "12"
        }),
        h("line", {
            x1: "12",
            x2: "12.01",
            y1: "16",
            y2: "16"
        })
    ]);
}
function Check() {
    return Icon("Check", [
        h("path", {
            d: "M20 6 9 17l-5-5"
        })
    ]);
}

/* -------------------------------- Constants ------------------------------- */ const DEFAULT_DURATION = 6000;
const EXIT_DURATION = DEFAULT_DURATION * 0.1;
const AUTO_EXPAND_DELAY = DEFAULT_DURATION * 0.025;
const AUTO_COLLAPSE_DELAY = DEFAULT_DURATION - 2000;
const pillAlign = (pos)=>pos.includes("right") ? "right" : pos.includes("center") ? "center" : "left";
const expandDir = (pos)=>pos.startsWith("top") ? "bottom" : "top";
const DEFAULT_SUCCESS_VISIBLE_MS = 600;
const store = {
    toasts: [],
    listeners: new Set(),
    position: "top-right",
    options: undefined,
    emit () {
        for (const fn of this.listeners)fn(this.toasts);
    },
    update (fn) {
        this.toasts = fn(this.toasts);
        this.emit();
    }
};
let idCounter = 0;
const generateId = ()=>`${++idCounter}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const timeoutKey = (t)=>`${t.id}:${t.instanceId}`;
/* ------------------------------- Toast API -------------------------------- */ const dismissToast = (id)=>{
    var _item_promote;
    const item = store.toasts.find((t)=>t.id === id);
    if (!item || item.exiting) return;
    if (item.placement.kind === "promoted" && ((_item_promote = item.promote) == null ? void 0 : _item_promote.onDismiss)) {
        try {
            item.promote.onDismiss();
        } catch (unused) {}
    }
    store.update((prev)=>prev.map((t)=>t.id === id ? _extends({}, t, {
                exiting: true
            }) : t));
    setTimeout(()=>store.update((prev)=>prev.filter((t)=>t.id !== id)), EXIT_DURATION);
};
const flipPromotion = (id)=>{
    store.update((prev)=>prev.map((t)=>{
            if (t.id !== id || !t.pendingPromote) return t;
            return _extends({}, t, {
                placement: {
                    kind: "promoted",
                    viewport: t.pendingPromote.to
                },
                pendingPromote: undefined,
                state: undefined,
                duration: null,
                icon: null
            });
        }));
};
const cancelPromotion = (id)=>{
    store.update((prev)=>prev.map((t)=>t.id === id ? _extends({}, t, {
                pendingPromote: undefined
            }) : t));
};
const resolveAutopilot = (opts, duration)=>{
    var _ref, _ref1;
    if (opts.autopilot === false || !duration || duration <= 0) return {};
    const cfg = typeof opts.autopilot === "object" ? opts.autopilot : undefined;
    const clamp = (v)=>Math.min(duration, Math.max(0, v));
    return {
        expandDelayMs: clamp((_ref = cfg == null ? void 0 : cfg.expand) != null ? _ref : AUTO_EXPAND_DELAY),
        collapseDelayMs: clamp((_ref1 = cfg == null ? void 0 : cfg.collapse) != null ? _ref1 : AUTO_COLLAPSE_DELAY)
    };
};
const mergeOptions = (options)=>{
    var _store_options;
    const _ref = (_store_options = store.options) != null ? _store_options : {}, { promiseLoadingIndicator: _indicator, promiseLoadingIndicatorPreset: _preset } = _ref, globalOptions = _object_without_properties_loose(_ref, [
        "promiseLoadingIndicator",
        "promiseLoadingIndicatorPreset"
    ]);
    return _extends({}, globalOptions, options, {
        styles: _extends({}, globalOptions.styles, options.styles)
    });
};
const buildBabiItem = (merged, id, fallbackPosition, previous)=>{
    var _merged_duration, _ref, _ref1, _merged_position;
    const duration = (_merged_duration = merged.duration) != null ? _merged_duration : DEFAULT_DURATION;
    const auto = resolveAutopilot(merged, duration);
    const placement = (_ref = previous == null ? void 0 : previous.placement) != null ? _ref : {
        kind: "toast"
    };
    const next = _extends({}, merged, {
        id,
        instanceId: generateId(),
        position: (_ref1 = (_merged_position = merged.position) != null ? _merged_position : fallbackPosition) != null ? _ref1 : store.position,
        autoExpandDelayMs: auto.expandDelayMs,
        autoCollapseDelayMs: auto.collapseDelayMs,
        placement
    });
    // Auto-schedule promotion when entering success state with a promote option,
    // while the item is still in toast placement and not already pending.
    if (next.promote && next.state === "success" && next.placement.kind === "toast" && !(previous == null ? void 0 : previous.pendingPromote)) {
        next.pendingPromote = next.promote;
    } else if (previous == null ? void 0 : previous.pendingPromote) {
        // Preserve in-flight promotion across updates.
        next.pendingPromote = previous.pendingPromote;
    }
    return next;
};
const createToast = (options)=>{
    var _merged_id, _merged_duration;
    const live = store.toasts.filter((t)=>!t.exiting);
    const merged = mergeOptions(options);
    const id = (_merged_id = merged.id) != null ? _merged_id : generateId();
    const prev = merged.id ? live.find((t)=>t.id === id) : undefined;
    const item = buildBabiItem(merged, id, prev == null ? void 0 : prev.position, prev);
    if (prev) {
        store.update((p)=>p.map((t)=>t.id === id ? item : t));
    } else {
        store.update((p)=>[
                ...p.filter((t)=>t.id !== id),
                item
            ]);
    }
    return {
        id,
        duration: (_merged_duration = merged.duration) != null ? _merged_duration : DEFAULT_DURATION
    };
};
const updateToast = (id, options)=>{
    const existing = store.toasts.find((t)=>t.id === id);
    if (!existing) return;
    const item = buildBabiItem(mergeOptions(options), id, existing.position, existing);
    store.update((prev)=>prev.map((t)=>t.id === id ? item : t));
};
const withPromiseLoadingDefaults = (loading)=>{
    var _store_options;
    if (loading.icon !== undefined || ((_store_options = store.options) == null ? void 0 : _store_options.promiseLoadingIndicator) !== "pixel-grid") {
        return loading;
    }
    return _extends({}, loading, {
        icon: PixelGridLoader(store.options.promiseLoadingIndicatorPreset)
    });
};
/* --------------------------------- Stream --------------------------------- */ const isReadableStream = (s)=>typeof ReadableStream !== "undefined" && s instanceof ReadableStream;
const isAsyncIterable = (s)=>s != null && typeof s[Symbol.asyncIterator] === "function";
const isPlainObjectPatch = (v)=>v != null && typeof v === "object" && !Array.isArray(v);
const subscribeAsyncIterable = (iter, emit)=>{
    let cancelled = false;
    const iterator = iter[Symbol.asyncIterator]();
    (async ()=>{
        let last;
        try {
            while(true){
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
    return ()=>{
        cancelled = true;
        iterator.return == null ? void 0 : iterator.return.call(iterator, undefined).catch(()=>{});
    };
};
const subscribeReadableStream = (stream, emit)=>{
    let cancelled = false;
    const reader = stream.getReader();
    (async ()=>{
        let last;
        try {
            while(true){
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
        } finally{
            try {
                reader.releaseLock();
            } catch (unused) {}
        }
    })();
    return ()=>{
        cancelled = true;
        reader.cancel().catch(()=>{});
    };
};
const subscribeSource = (source, emit)=>{
    if (isReadableStream(source)) return subscribeReadableStream(source, emit);
    if (isAsyncIterable(source)) return subscribeAsyncIterable(source, emit);
    if (isRef(source)) {
        return watch(source, (v)=>emit(v), {
            immediate: true,
            flush: "sync"
        });
    }
    if (typeof source === "function") {
        const teardown = source(emit);
        return typeof teardown === "function" ? teardown : ()=>{};
    }
    return ()=>{};
};
const babi = {
    show: (opts)=>createToast(opts).id,
    success: (opts)=>createToast(_extends({}, opts, {
            state: "success"
        })).id,
    error: (opts)=>createToast(_extends({}, opts, {
            state: "error"
        })).id,
    warning: (opts)=>createToast(_extends({}, opts, {
            state: "warning"
        })).id,
    info: (opts)=>createToast(_extends({}, opts, {
            state: "info"
        })).id,
    action: (opts)=>createToast(_extends({}, opts, {
            state: "action"
        })).id,
    promise: (promise, opts)=>{
        const { id } = createToast(_extends({}, withPromiseLoadingDefaults(opts.loading), {
            state: "loading",
            duration: null,
            position: opts.position
        }));
        const p = typeof promise === "function" ? promise() : promise;
        p.then((data)=>{
            if (opts.action) {
                const actionOpts = typeof opts.action === "function" ? opts.action(data) : opts.action;
                updateToast(id, _extends({}, actionOpts, {
                    state: "action",
                    id
                }));
            } else {
                const successOpts = typeof opts.success === "function" ? opts.success(data) : opts.success;
                updateToast(id, _extends({}, successOpts, {
                    state: "success",
                    id
                }));
            }
        }).catch((err)=>{
            const errorOpts = typeof opts.error === "function" ? opts.error(err) : opts.error;
            updateToast(id, _extends({}, errorOpts, {
                state: "error",
                id
            }));
        });
        return p;
    },
    stream: (source, opts = {})=>{
        var _opts_initial, _initial_state, _initial_duration;
        const initial = withPromiseLoadingDefaults((_opts_initial = opts.initial) != null ? _opts_initial : {});
        const { id } = createToast(_extends({}, initial, {
            state: (_initial_state = initial.state) != null ? _initial_state : "loading",
            duration: (_initial_duration = initial.duration) != null ? _initial_duration : null,
            position: opts.position
        }));
        let lastValue;
        let settled = false;
        let teardown = ()=>{};
        let resolveDone;
        let rejectDone;
        const donePromise = new Promise((res, rej)=>{
            resolveDone = res;
            rejectDone = rej;
        });
        donePromise.catch(()=>{});
        const toPatch = (value)=>{
            var _opts_frame;
            if (opts.frame) return (_opts_frame = opts.frame(value)) != null ? _opts_frame : {};
            if (isPlainObjectPatch(value)) return value;
            return {
                description: String(value)
            };
        };
        const finishSuccess = (final, patch)=>{
            settled = true;
            teardown();
            const successPatch = typeof opts.success === "function" ? opts.success(final) : opts.success;
            updateToast(id, _extends({}, patch, successPatch != null ? successPatch : {}, {
                state: "success",
                id
            }));
            resolveDone(final);
        };
        const finishError = (err, patch)=>{
            var _opts_error;
            settled = true;
            teardown();
            const errorPatch = typeof opts.error === "function" ? opts.error(err) : (_opts_error = opts.error) != null ? _opts_error : {
                description: String(err)
            };
            updateToast(id, _extends({}, patch != null ? patch : {}, errorPatch, {
                state: "error",
                id
            }));
            rejectDone(err);
        };
        const emitFrame = (value)=>{
            if (settled) return;
            lastValue = value;
            const patch = toPatch(value);
            if (patch.state === "success") {
                finishSuccess(value, patch);
                return;
            }
            if (patch.state === "error") {
                const msg = typeof patch.description === "string" ? patch.description : "stream error";
                finishError(new Error(msg), patch);
                return;
            }
            updateToast(id, _extends({
                state: "loading",
                duration: null
            }, patch, {
                id
            }));
        };
        const emitter = Object.assign(emitFrame, {
            done: (value)=>{
                if (settled) return;
                const final = value != null ? value : lastValue;
                const patch = final !== undefined ? toPatch(final) : {};
                finishSuccess(final, patch);
            },
            error: (err)=>{
                if (settled) return;
                finishError(err);
            }
        });
        const initialTeardown = subscribeSource(source, emitter);
        if (settled) initialTeardown();
        else teardown = initialTeardown;
        const cancel = ()=>{
            if (settled) return;
            settled = true;
            teardown();
            dismissToast(id);
            resolveDone(lastValue);
        };
        if (opts.signal) {
            if (opts.signal.aborted) cancel();
            else opts.signal.addEventListener("abort", cancel, {
                once: true
            });
        }
        return {
            id,
            cancel,
            done: donePromise
        };
    },
    promote: (id)=>{
        const existing = store.toasts.find((t)=>t.id === id);
        if (!existing) return;
        if (!existing.promote) return;
        if (existing.pendingPromote) return;
        if (existing.placement.kind !== "toast") return;
        store.update((prev)=>prev.map((t)=>t.id === id ? _extends({}, t, {
                    pendingPromote: t.promote
                }) : t));
    },
    dismiss: dismissToast,
    clear: (position)=>store.update((prev)=>position ? prev.filter((t)=>t.placement.kind !== "toast" || t.position !== position) : []),
    clearPromoted: (name)=>store.update((prev)=>prev.filter((t)=>t.placement.kind !== "promoted" || name !== undefined && t.placement.viewport !== name))
};

/* --------------------------------- Config --------------------------------- */ const HEIGHT = 40;
const WIDTH = 350;
const DEFAULT_ROUNDNESS = 18;
const BLUR_RATIO = 0.5;
const PILL_PADDING = 10;
const MIN_EXPAND_RATIO = 2.25;
const SWAP_COLLAPSE_MS = 200;
const HEADER_EXIT_MS = 150;
/* ---------------------------------- Icons --------------------------------- */ const STATE_ICON = {
    success: Check,
    loading: ()=>LoaderCircle({
            "data-babi-icon": "spin",
            "aria-hidden": "true"
        }),
    error: X,
    warning: CircleAlert,
    info: LifeBuoy,
    action: ArrowRight
};
/* ---------------------------------- Defs ---------------------------------- */ function renderGooeyDefs(filterId, blur) {
    return h("defs", [
        h("filter", {
            id: filterId,
            x: "-20%",
            y: "-20%",
            width: "140%",
            height: "140%",
            colorInterpolationFilters: "sRGB"
        }, [
            h("feGaussianBlur", {
                in: "SourceGraphic",
                stdDeviation: blur,
                result: "blur"
            }),
            h("feColorMatrix", {
                in: "blur",
                mode: "matrix",
                values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10",
                result: "goo"
            }),
            h("feComposite", {
                in: "SourceGraphic",
                in2: "goo",
                operator: "atop"
            })
        ])
    ]);
}
/* ------------------------------- Component -------------------------------- */ var Babi = defineComponent({
    name: "Babi",
    props: {
        id: {
            type: String,
            required: true
        },
        fill: {
            type: String,
            default: "#FFFFFF"
        },
        border: {
            type: String,
            default: undefined
        },
        state: {
            type: String,
            default: "success"
        },
        title: {
            type: String,
            default: undefined
        },
        description: {
            type: [
                String,
                Object
            ],
            default: undefined
        },
        component: {
            type: [
                Object,
                Function
            ],
            default: undefined
        },
        componentProps: {
            type: Object,
            default: undefined
        },
        position: {
            type: String,
            default: "left"
        },
        expand: {
            type: String,
            default: "bottom"
        },
        class: {
            type: String,
            default: undefined
        },
        icon: {
            type: [
                Object,
                null
            ],
            default: undefined
        },
        styles: {
            type: Object,
            default: undefined
        },
        button: {
            type: Object,
            default: undefined
        },
        roundness: {
            type: Number,
            default: undefined
        },
        exiting: {
            type: Boolean,
            default: false
        },
        autoExpandDelayMs: {
            type: Number,
            default: undefined
        },
        autoCollapseDelayMs: {
            type: Number,
            default: undefined
        },
        canExpand: {
            type: Boolean,
            default: undefined
        },
        interruptKey: {
            type: String,
            default: undefined
        },
        refreshKey: {
            type: String,
            default: undefined
        }
    },
    emits: [
        "mouseenter",
        "mouseleave",
        "dismiss"
    ],
    setup (props, { emit }) {
        const resolvedTitle = computed(()=>{
            var _props_title;
            return (_props_title = props.title) != null ? _props_title : props.state;
        });
        const next = computed(()=>({
                title: resolvedTitle.value,
                description: props.description,
                component: props.component,
                componentProps: props.componentProps,
                state: props.state,
                icon: props.icon,
                styles: props.styles,
                button: props.button,
                fill: props.fill,
                border: props.border
            }));
        const view = ref(_extends({}, next.value));
        const applied = ref(props.refreshKey);
        const isExpanded = ref(false);
        const ready = ref(false);
        const pillWidth = ref(0);
        const contentHeight = ref(0);
        const hasCustomComponent = computed(()=>Boolean(view.value.component));
        const hasBody = computed(()=>Boolean(view.value.description) || Boolean(view.value.button) || hasCustomComponent.value);
        const isLoading = computed(()=>view.value.state === "loading");
        const open = computed(()=>hasBody.value && isExpanded.value && (!isLoading.value || hasCustomComponent.value));
        const allowExpand = computed(()=>{
            var _props_canExpand;
            if (isLoading.value && !hasCustomComponent.value) return false;
            return (_props_canExpand = props.canExpand) != null ? _props_canExpand : !props.interruptKey || props.interruptKey === props.id;
        });
        const hasExpandableBody = computed(()=>hasBody.value && (!isLoading.value || hasCustomComponent.value));
        const headerKey = computed(()=>`${view.value.state}-${view.value.title}`);
        const filterId = computed(()=>`babi-gooey-${props.id}`);
        const resolvedRoundness = computed(()=>{
            var _props_roundness;
            return Math.max(0, (_props_roundness = props.roundness) != null ? _props_roundness : DEFAULT_ROUNDNESS);
        });
        const blur = computed(()=>resolvedRoundness.value * BLUR_RATIO);
        /* ---------------------------------- Refs ---------------------------------- */ const buttonRef = ref(null);
        const headerRef = ref(null);
        const contentRef = ref(null);
        const innerRef = ref(null);
        let headerExitTimer = null;
        let autoExpandTimer = null;
        let autoCollapseTimer = null;
        let swapTimer = null;
        let lastRefreshKey = props.refreshKey;
        let pending = null;
        let headerPad = null;
        const headerLayer = ref({
            current: {
                key: headerKey.value,
                view: _extends({}, view.value)
            },
            prev: null
        });
        /* ------------------------------ Measurements ------------------------------ */ let pillRo = null;
        let pillRaf = 0;
        let contentRo = null;
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
            pillRo = new ResizeObserver(()=>{
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
            const measure = ()=>{
                contentHeight.value = el.scrollHeight;
            };
            measure();
            contentRo = new ResizeObserver(()=>{
                cancelAnimationFrame(contentRaf);
                contentRaf = requestAnimationFrame(measure);
            });
            contentRo.observe(el);
        }
        onMounted(()=>{
            requestAnimationFrame(()=>{
                ready.value = true;
            });
            setupPillObserver();
            setupContentObserver();
        });
        onUnmounted(()=>{
            if (pillRo) {
                cancelAnimationFrame(pillRaf);
                pillRo.disconnect();
            }
            if (contentRo) {
                cancelAnimationFrame(contentRaf);
                contentRo.disconnect();
            }
            if (headerExitTimer) clearTimeout(headerExitTimer);
            if (autoExpandTimer) clearTimeout(autoExpandTimer);
            if (autoCollapseTimer) clearTimeout(autoCollapseTimer);
            if (swapTimer) clearTimeout(swapTimer);
        });
        watch(()=>headerLayer.value.current.key, ()=>{
            nextTick(setupPillObserver);
        });
        watch(hasBody, ()=>{
            nextTick(setupContentObserver);
        });
        /* ----------------------------- Header layers ------------------------------ */ watch([
            headerKey,
            view
        ], ()=>{
            const hk = headerKey.value;
            const v = view.value;
            const state = headerLayer.value;
            if (state.current.key === hk) {
                if (state.current.view !== v) {
                    headerLayer.value = _extends({}, state, {
                        current: {
                            key: hk,
                            view: v
                        }
                    });
                }
            } else {
                headerLayer.value = {
                    prev: state.current,
                    current: {
                        key: hk,
                        view: v
                    }
                };
            }
        });
        watch(()=>headerLayer.value.prev, (prev)=>{
            if (!prev) return;
            if (headerExitTimer) clearTimeout(headerExitTimer);
            headerExitTimer = window.setTimeout(()=>{
                headerExitTimer = null;
                headerLayer.value = _extends({}, headerLayer.value, {
                    prev: null
                });
            }, HEADER_EXIT_MS);
        });
        /* ----------------------------- Refresh logic ------------------------------ */ watch([
            ()=>props.refreshKey,
            next,
            open
        ], ()=>{
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
                pending = {
                    key: refreshKey,
                    payload: nextView
                };
                isExpanded.value = false;
                swapTimer = window.setTimeout(()=>{
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
        /* ----------------------------- Auto expand/collapse ----------------------- */ watch([
            ()=>props.autoExpandDelayMs,
            ()=>props.autoCollapseDelayMs,
            hasExpandableBody,
            allowExpand,
            ()=>props.exiting,
            applied
        ], ()=>{
            var _props_autoExpandDelayMs, _props_autoCollapseDelayMs;
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
            const expandDelay = (_props_autoExpandDelayMs = props.autoExpandDelayMs) != null ? _props_autoExpandDelayMs : 0;
            const collapseDelay = (_props_autoCollapseDelayMs = props.autoCollapseDelayMs) != null ? _props_autoCollapseDelayMs : 0;
            if (expandDelay > 0) {
                autoExpandTimer = window.setTimeout(()=>{
                    isExpanded.value = true;
                }, expandDelay);
            } else {
                isExpanded.value = true;
            }
            if (collapseDelay > 0) {
                autoCollapseTimer = window.setTimeout(()=>{
                    isExpanded.value = false;
                }, collapseDelay);
            }
        }, {
            immediate: true
        });
        /* ------------------------------ Derived values ---------------------------- */ const minExpanded = HEIGHT * MIN_EXPAND_RATIO;
        const rawExpanded = computed(()=>hasBody.value ? Math.max(minExpanded, HEIGHT + contentHeight.value) : minExpanded);
        let frozenExpanded = rawExpanded.value;
        watch([
            open,
            rawExpanded
        ], ()=>{
            if (open.value) {
                frozenExpanded = rawExpanded.value;
            }
        });
        const expanded = computed(()=>open.value ? rawExpanded.value : frozenExpanded);
        const svgHeight = computed(()=>hasBody.value ? Math.max(expanded.value, minExpanded) : HEIGHT);
        const expandedContent = computed(()=>Math.max(0, expanded.value - HEIGHT));
        const resolvedPillWidth = computed(()=>Math.max(pillWidth.value || HEIGHT, HEIGHT));
        const pillHeight = computed(()=>HEIGHT + blur.value * 3);
        const pillX = computed(()=>props.position === "right" ? WIDTH - resolvedPillWidth.value : props.position === "center" ? (WIDTH - resolvedPillWidth.value) / 2 : 0);
        /* ------------------------------- Inline styles ---------------------------- */ const rootStyle = computed(()=>({
                "--_h": `${open.value ? expanded.value : HEIGHT}px`,
                "--_pw": `${resolvedPillWidth.value}px`,
                "--_px": `${pillX.value}px`,
                "--_sy": `${open.value ? 1 : HEIGHT / pillHeight.value}`,
                "--_ph": `${pillHeight.value}px`,
                "--_by": `${open.value ? 1 : 0}`,
                "--_ht": `translateY(${open.value ? props.expand === "bottom" ? 3 : -3 : 0}px) scale(${open.value ? 0.9 : 1})`,
                "--_co": `${open.value ? 1 : 0}`
            }));
        /* -------------------------------- Handlers -------------------------------- */ function handleEnter(e) {
            emit("mouseenter", e);
            if (hasExpandableBody.value) isExpanded.value = true;
        }
        function handleLeave(e) {
            emit("mouseleave", e);
            isExpanded.value = false;
        }
        function handleTransitionEnd(e) {
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
        /* -------------------------------- Swipe ----------------------------------- */ const SWIPE_DISMISS = 30;
        const SWIPE_MAX = 20;
        let pointerStart = null;
        onMounted(()=>{
            const el = buttonRef.value;
            if (!el) return;
            const onMove = (e)=>{
                if (pointerStart === null) return;
                const dy = e.clientY - pointerStart;
                const sign = dy > 0 ? 1 : -1;
                const clamped = Math.min(Math.abs(dy), SWIPE_MAX) * sign;
                el.style.transform = `translateY(${clamped}px)`;
            };
            const onUp = (e)=>{
                if (pointerStart === null) return;
                const dy = e.clientY - pointerStart;
                pointerStart = null;
                el.style.transform = "";
                if (Math.abs(dy) > SWIPE_DISMISS) {
                    emit("dismiss");
                }
            };
            el.addEventListener("pointermove", onMove, {
                passive: true
            });
            el.addEventListener("pointerup", onUp, {
                passive: true
            });
        });
        function handlePointerDown(e) {
            if (props.exiting) return;
            const target = e.target;
            if (target.closest("[data-babi-button]")) return;
            pointerStart = e.clientY;
            e.currentTarget.setPointerCapture(e.pointerId);
        }
        /* ---------------------------------- Icon ---------------------------------- */ function getIcon(v) {
            if (v.icon !== undefined) return v.icon;
            return STATE_ICON[v.state]();
        }
        function renderComponent(v) {
            if (!v.component) return null;
            return isVNode(v.component) ? v.component : h(v.component, v.componentProps);
        }
        /* --------------------------------- Render --------------------------------- */ function renderHeaderInner(layerView, layerKey, layer, isExiting) {
            var _layerView_styles, _layerView_styles1;
            const attrs = {
                "data-babi-header-inner": "",
                "data-layer": layer
            };
            if (isExiting) attrs["data-exiting"] = "true";
            if (layer === "current") attrs.ref = innerRef;
            attrs.key = layerKey;
            return h("div", attrs, [
                h("div", {
                    "data-babi-badge": "",
                    "data-state": layerView.state,
                    class: (_layerView_styles = layerView.styles) == null ? void 0 : _layerView_styles.badge
                }, [
                    getIcon(layerView)
                ]),
                h("span", {
                    "data-babi-title": "",
                    "data-state": layerView.state,
                    class: (_layerView_styles1 = layerView.styles) == null ? void 0 : _layerView_styles1.title
                }, layerView.title)
            ]);
        }
        return ()=>{
            const v = view.value;
            const hl = headerLayer.value;
            const headerStack = [
                renderHeaderInner(hl.current.view, hl.current.key, "current")
            ];
            if (hl.prev) {
                headerStack.push(renderHeaderInner(hl.prev.view, hl.prev.key, "prev", true));
            }
            const borderFilter = v.border ? `drop-shadow(0.5px 0 0 ${v.border}) drop-shadow(-0.5px 0 0 ${v.border}) drop-shadow(0 0.5px 0 ${v.border}) drop-shadow(0 -0.5px 0 ${v.border})` : undefined;
            const children = [
                // Canvas
                h("div", {
                    "data-babi-canvas": "",
                    "data-edge": props.expand,
                    style: borderFilter ? `filter: ${borderFilter};` : undefined
                }, [
                    h("svg", {
                        "data-babi-svg": "",
                        width: WIDTH,
                        height: svgHeight.value,
                        viewBox: `0 0 ${WIDTH} ${svgHeight.value}`
                    }, [
                        h("title", "Babi Notification"),
                        renderGooeyDefs(filterId.value, blur.value),
                        h("g", {
                            filter: `url(#${filterId.value})`
                        }, [
                            h("rect", {
                                "data-babi-pill": "",
                                x: pillX.value,
                                rx: resolvedRoundness.value,
                                ry: resolvedRoundness.value,
                                fill: v.fill
                            }),
                            h("rect", {
                                "data-babi-body": "",
                                y: HEIGHT,
                                width: WIDTH,
                                height: expandedContent.value,
                                rx: resolvedRoundness.value,
                                ry: resolvedRoundness.value,
                                fill: v.fill
                            })
                        ])
                    ])
                ]),
                // Header
                h("div", {
                    ref: headerRef,
                    "data-babi-header": "",
                    "data-edge": props.expand
                }, [
                    h("div", {
                        "data-babi-header-stack": ""
                    }, headerStack)
                ])
            ];
            // Content
            if (hasBody.value) {
                var _v_styles;
                const descChildren = [];
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
                    var _v_styles1;
                    descChildren.push(h("a", {
                        href: "#",
                        "data-babi-button": "",
                        "data-state": v.state,
                        class: (_v_styles1 = v.styles) == null ? void 0 : _v_styles1.button,
                        onClick: (e)=>{
                            var _v_button;
                            e.preventDefault();
                            e.stopPropagation();
                            (_v_button = v.button) == null ? void 0 : _v_button.onClick();
                        }
                    }, v.button.title));
                }
                children.push(h("div", {
                    "data-babi-content": "",
                    "data-edge": props.expand,
                    "data-visible": open.value
                }, [
                    h("div", {
                        ref: contentRef,
                        "data-babi-description": "",
                        class: (_v_styles = v.styles) == null ? void 0 : _v_styles.description
                    }, descChildren)
                ]));
            }
            return h("button", {
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
                onPointerdown: handlePointerDown
            }, children);
        };
    }
});

/* -------------------------------------------------------------------------- */ /*  Promotion runtime: viewport registry + FLIP morph layer.                  */ /* -------------------------------------------------------------------------- */ /* ----------------------------- Viewport registry --------------------------- */ const registry = new Map();
const listeners = new Set();
const registerPromoteViewport = (name, el)=>{
    if (registry.has(name) && registry.get(name) !== el) {
        console.warn(`[babi-toast] duplicate promote viewport: ${name}`);
    }
    registry.set(name, el);
    for (const fn of listeners)fn(name);
};
const unregisterPromoteViewport = (name, el)=>{
    if (registry.get(name) === el) {
        registry.delete(name);
        for (const fn of listeners)fn(name);
    }
};
const getPromoteViewportEl = (name)=>registry.get(name);
/* -------------------------------- FLIP morph ------------------------------- */ const MORPH_DURATION = 360;
const MORPH_EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const stripInteractivity = (el)=>{
    el.style.pointerEvents = "none";
    for (const node of el.querySelectorAll("*")){
        node.style.pointerEvents = "none";
    }
};
const runPromotionMorph = (input)=>{
    const { sourceEl, destEl, reducedMotion, onCaptured } = input;
    const sourceRect = sourceEl.getBoundingClientRect();
    const destRect = destEl.getBoundingClientRect();
    const noopResult = ()=>{
        onCaptured == null ? void 0 : onCaptured();
        return {
            finished: Promise.resolve(),
            cancel: ()=>{}
        };
    };
    if (sourceRect.width <= 0 || sourceRect.height <= 0 || destRect.width <= 0 || destRect.height <= 0) {
        return noopResult();
    }
    if (reducedMotion) {
        return noopResult();
    }
    // Clone the live toast DOM to preserve typography, badge, fill, gooey shell.
    const clone = sourceEl.cloneNode(true);
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
    onCaptured == null ? void 0 : onCaptured();
    const dx = destRect.left - sourceRect.left;
    const dy = destRect.top - sourceRect.top;
    const sx = destRect.width / sourceRect.width;
    const sy = destRect.height / sourceRect.height;
    const supportsAnimate = typeof clone.animate === "function";
    if (!supportsAnimate) {
        clone.remove();
        return {
            finished: Promise.resolve(),
            cancel: ()=>{}
        };
    }
    const cloneAnim = clone.animate([
        {
            transform: "translate(0,0) scale(1,1)",
            opacity: 1,
            offset: 0
        },
        {
            opacity: 1,
            offset: 0.45
        },
        {
            transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`,
            opacity: 0,
            offset: 1
        }
    ], {
        duration: MORPH_DURATION,
        easing: MORPH_EASING,
        fill: "forwards"
    });
    let cancelled = false;
    const cleanup = ()=>{
        try {
            clone.remove();
        } catch (unused) {}
    };
    const finished = cloneAnim.finished.then(()=>{
        if (!cancelled) cleanup();
    }).catch(()=>cleanup());
    const cancel = ()=>{
        if (cancelled) return;
        cancelled = true;
        try {
            cloneAnim.cancel();
        } catch (unused) {}
        cleanup();
    };
    return {
        finished,
        cancel
    };
};
/* ----------------------------- Reduced motion ----------------------------- */ const prefersReducedMotion = ()=>{
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const BABI_POSITIONS = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right"
];

var Toaster = defineComponent({
    name: "Toaster",
    props: {
        position: {
            type: String,
            default: "top-right"
        },
        offset: {
            type: [
                Number,
                String,
                Object
            ],
            default: undefined
        },
        options: {
            type: Object,
            default: undefined
        }
    },
    setup (props, { slots }) {
        const toasts = ref(store.toasts);
        const activeId = ref();
        let hovered = false;
        const timers = new Map();
        let latestId;
        const handlersCache = new Map();
        /* -------------------------------- Store sync ------------------------------ */ watch(()=>props.position, (pos)=>{
            store.position = pos;
        }, {
            immediate: true
        });
        watch(()=>props.options, (opts)=>{
            store.options = opts;
        }, {
            immediate: true
        });
        const listener = (next)=>{
            toasts.value = next;
        };
        onMounted(()=>{
            store.listeners.add(listener);
        });
        onUnmounted(()=>{
            store.listeners.delete(listener);
            clearAllTimers();
            for (const t of promotionTimers.values())clearTimeout(t);
            promotionTimers.clear();
            for (const handle of promotionInflight.values())handle.cancel();
            promotionInflight.clear();
        });
        /* --------------------------------- Timers --------------------------------- */ function clearAllTimers() {
            for (const t of timers.values())clearTimeout(t);
            timers.clear();
        }
        function schedule(items) {
            if (hovered) return;
            for (const item of items){
                var _item_duration;
                if (item.exiting) continue;
                if (item.pendingPromote) continue;
                if (item.placement.kind !== "toast") continue;
                const key = timeoutKey(item);
                if (timers.has(key)) continue;
                const dur = (_item_duration = item.duration) != null ? _item_duration : DEFAULT_DURATION;
                if (dur === null || dur <= 0) continue;
                timers.set(key, window.setTimeout(()=>dismissToast(item.id), dur));
            }
        }
        /* ------------------------------ Promotion -------------------------------- */ const promotionTimers = new Map();
        const promotionInflight = new Map();
        function findSourceEl(id) {
            return document.querySelector(`[data-babi-toast][data-babi-id="${CSS.escape(id)}"]`);
        }
        function performPromotion(item) {
            const promote = item.pendingPromote;
            if (!promote) return;
            const sourceEl = findSourceEl(item.id);
            const destEl = getPromoteViewportEl(promote.to);
            if (!destEl) {
                console.warn(`[babi-toast] promote target "${promote.to}" not mounted; keeping completion toast.`);
                cancelPromotion(item.id);
                return;
            }
            if (!sourceEl) {
                flipPromotion(item.id);
                return;
            }
            let flipped = false;
            const flip = ()=>{
                if (flipped) return;
                flipped = true;
                flipPromotion(item.id);
            };
            const morph = runPromotionMorph({
                sourceEl,
                destEl,
                reducedMotion: prefersReducedMotion(),
                onCaptured: flip
            });
            promotionInflight.set(item.id, morph);
            morph.finished.finally(()=>{
                promotionInflight.delete(item.id);
                flip();
            });
        }
        function schedulePromotion(items) {
            for (const item of items){
                var _item_pendingPromote_successVisibleMs;
                if (!item.pendingPromote) continue;
                if (item.exiting) continue;
                if (item.placement.kind !== "toast") continue;
                if (promotionTimers.has(item.id)) continue;
                const delay = (_item_pendingPromote_successVisibleMs = item.pendingPromote.successVisibleMs) != null ? _item_pendingPromote_successVisibleMs : DEFAULT_SUCCESS_VISIBLE_MS;
                promotionTimers.set(item.id, window.setTimeout(()=>{
                    promotionTimers.delete(item.id);
                    const fresh = store.toasts.find((t)=>t.id === item.id);
                    if (!fresh || !fresh.pendingPromote || fresh.exiting) return;
                    if (fresh.placement.kind !== "toast") return;
                    performPromotion(fresh);
                }, delay));
            }
        }
        function syncPromotionTimers(current) {
            const live = new Set(current.filter((t)=>t.pendingPromote && !t.exiting && t.placement.kind === "toast").map((t)=>t.id));
            for (const [id, timer] of promotionTimers){
                if (!live.has(id)) {
                    clearTimeout(timer);
                    promotionTimers.delete(id);
                }
            }
            const present = new Set(current.map((t)=>t.id));
            for (const [id, handle] of promotionInflight){
                if (!present.has(id)) {
                    handle.cancel();
                    promotionInflight.delete(id);
                }
            }
        }
        /* ----------------------------- Toast tracking ----------------------------- */ watch(toasts, (current)=>{
            const toastKeys = new Set(current.map(timeoutKey));
            const toastIds = new Set(current.map((t)=>t.id));
            for (const [key, timer] of timers){
                if (!toastKeys.has(key)) {
                    clearTimeout(timer);
                    timers.delete(key);
                }
            }
            for (const id of handlersCache.keys()){
                if (!toastIds.has(id)) handlersCache.delete(id);
            }
            schedule(current);
            syncPromotionTimers(current);
            schedulePromotion(current);
        }, {
            immediate: true
        });
        /* --------------------------------- Latest --------------------------------- */ const latest = computed(()=>{
            for(let i = toasts.value.length - 1; i >= 0; i--){
                if (!toasts.value[i].exiting) return toasts.value[i].id;
            }
            return undefined;
        });
        watch(latest, (val)=>{
            latestId = val;
            activeId.value = val;
        });
        /* -------------------------------- Handlers -------------------------------- */ function handleMouseEnter() {
            if (hovered) return;
            hovered = true;
            clearAllTimers();
        }
        function handleMouseLeave() {
            if (!hovered) return;
            hovered = false;
            schedule(toasts.value);
        }
        function getHandlers(toastId) {
            let cached = handlersCache.get(toastId);
            if (cached) return cached;
            cached = {
                enter: (_e)=>{
                    activeId.value = toastId;
                    handleMouseEnter();
                },
                leave: (_e)=>{
                    if (activeId.value !== latestId) {
                        activeId.value = latestId;
                    }
                    handleMouseLeave();
                },
                dismiss: ()=>dismissToast(toastId)
            };
            handlersCache.set(toastId, cached);
            return cached;
        }
        /* ------------------------------ Viewport style ---------------------------- */ function getViewportStyle(pos) {
            if (props.offset === undefined) return undefined;
            const o = typeof props.offset === "object" ? props.offset : {
                top: props.offset,
                right: props.offset,
                bottom: props.offset,
                left: props.offset
            };
            const s = {};
            const px = (v)=>typeof v === "number" ? `${v}px` : v;
            if (pos.startsWith("top") && o.top !== undefined) s.top = px(o.top);
            if (pos.startsWith("bottom") && o.bottom !== undefined) s.bottom = px(o.bottom);
            if (pos.endsWith("left") && o.left !== undefined) s.left = px(o.left);
            if (pos.endsWith("right") && o.right !== undefined) s.right = px(o.right);
            return s;
        }
        /* ------------------------------ By position ------------------------------- */ const byPosition = computed(()=>{
            const map = {};
            for (const t of toasts.value){
                var _t_position;
                if (t.placement.kind !== "toast") continue;
                const pos = (_t_position = t.position) != null ? _t_position : props.position;
                const arr = map[pos];
                if (arr) {
                    arr.push(t);
                } else {
                    map[pos] = [
                        t
                    ];
                }
            }
            return map;
        });
        /* --------------------------------- Render --------------------------------- */ return ()=>{
            const sections = [];
            for (const pos of BABI_POSITIONS){
                const items = byPosition.value[pos];
                if (!(items == null ? void 0 : items.length)) continue;
                const pill = pillAlign(pos);
                const expand = expandDir(pos);
                sections.push(h("section", {
                    key: pos,
                    "data-babi-viewport": "",
                    "data-position": pos,
                    "aria-live": "polite",
                    style: getViewportStyle(pos)
                }, items.map((item)=>{
                    const handlers = getHandlers(item.id);
                    return h(Babi, {
                        key: item.id,
                        id: item.id,
                        state: item.state,
                        title: item.title,
                        description: item.description,
                        component: item.component,
                        componentProps: item.componentProps,
                        position: pill,
                        expand,
                        icon: item.icon,
                        fill: item.fill,
                        border: item.border,
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
                        onDismiss: handlers.dismiss
                    });
                })));
            }
            return [
                slots.default == null ? void 0 : slots.default.call(slots),
                ...sections
            ];
        };
    }
});

const updateItem = (id, options)=>{
    store.update((prev)=>prev.map((t)=>t.id === id ? _extends({}, t, options) : t));
};
var PromoteViewport = defineComponent({
    name: "BabiPromoteViewport",
    props: {
        name: {
            type: String,
            required: true
        },
        class: {
            type: [
                String,
                Array,
                Object
            ],
            default: undefined
        }
    },
    setup (props) {
        const root = ref();
        const items = ref([]);
        const sync = ()=>{
            items.value = store.toasts.filter((t)=>t.placement.kind === "promoted" && t.placement.viewport === props.name);
        };
        const listener = ()=>sync();
        onMounted(()=>{
            if (root.value) registerPromoteViewport(props.name, root.value);
            store.listeners.add(listener);
            sync();
        });
        onUnmounted(()=>{
            store.listeners.delete(listener);
            if (root.value) unregisterPromoteViewport(props.name, root.value);
            // Clear promoted items in this viewport on unmount.
            store.update((prev)=>prev.filter((t)=>t.placement.kind !== "promoted" || t.placement.viewport !== props.name));
        });
        return ()=>h("div", {
                ref: root,
                class: props.class,
                "data-babi-promote-viewport": props.name
            }, items.value.map((item)=>{
                var _ref, _ref1;
                var _item_promote, _item_promote1;
                const helpers = {
                    id: item.id,
                    dismiss: ()=>dismissToast(item.id),
                    update: (options)=>updateItem(item.id, options)
                };
                const componentProps = _extends({}, (_ref = (_item_promote = item.promote) == null ? void 0 : _item_promote.componentProps) != null ? _ref : {}, {
                    babi: helpers
                });
                const Comp = (_ref1 = (_item_promote1 = item.promote) == null ? void 0 : _item_promote1.component) != null ? _ref1 : null;
                return h("div", {
                    key: item.id,
                    "data-babi-promoted": "",
                    "data-exiting": item.exiting ? "true" : "false"
                }, Comp ? [
                    h(resolveDynamicComponent(Comp), componentProps)
                ] : []);
            }));
    }
});

export { PromoteViewport as BabiPromoteViewport, Toaster, babi };
