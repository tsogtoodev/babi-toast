# Babi Toast

## Usage

### Installation

```bash
yarn add @tsogtbayar/babi-toast --registry=https://git.bolor.net/api/v4/projects/844/packages/npm/
```

### Local demo

```bash
npm run demo
```

Then open `http://127.0.0.1:4173`.

The demo covers helper states, generic `show`, dismiss, clear, custom component bodies, promise success/error/action flows, multi-frame `stream` flows (async iterator / reactive ref / callback subscriber), styling overrides, stacking, and positioned toasts.

### Mount the toaster

```vue
<!-- App.vue -->
<script setup>
import { Toaster } from "@tsogtbayar/babi-toast";
import "@tsogtbayar/babi-toast/styles.css";
</script>

<template>
  <Toaster
    position="top-right"
    :options="{
      promiseLoadingIndicator: 'pixel-grid',
      promiseLoadingIndicatorPreset: 'wave-lr',
    }"
  />
  <RouterView />
</template>
```

Set `promiseLoadingIndicator` to `"pixel-grid"` to use the 3x3 pixel loader for `babi.promise(...)` loading states. Explicit `loading.icon` values still take priority.

Available `promiseLoadingIndicatorPreset` values: `"wave-lr"`, `"wave-rl"`, `"wave-tb"`, `"wave-bt"`, `"spiral-cw"`, `"corners-first"`, `"center-out"`, `"diagonal-tl"`, `"snake"`, `"cross"`, `"checkerboard"`, `"rain"`, `"pinwheel"`, `"orbit"`, `"converge"`, `"zigzag"`, `"aurora"`, `"ember"`, `"prism"`, `"neon-cross"`, `"tide"`, `"sunset"`, `"toxic"`, and `"frost"`.

### Show toasts

```ts
import { babi } from "@tsogtbayar/babi-toast";

babi.success({ fill: "#000000", title: "Saved", description: "Your changes have been saved." });
babi.error({ fill: "#000000", title: "Error", description: "Something went wrong." });
babi.warning({ fill: "#000000", title: "Warning", description: "Disk space is low." });
babi.info({ fill: "#000000", title: "Info", description: "New version available." });
babi.action({
  fill: "#000000",
  title: "Action",
  description: "Click the button below.",
  button: { title: "Undo", onClick: () => console.log("Undone!") },
});
```

### Custom component body

```ts
import { defineComponent, h } from "vue";
import { babi } from "@tsogtbayar/babi-toast";

const UploadProgress = defineComponent({
	props: {
		value: { type: Number, required: true },
	},
	setup(props) {
		return () =>
			h("div", { style: "display:grid;gap:8px;" }, [
				h("strong", `${props.value}% complete`),
				h("div", {
					style: `height:6px;border-radius:999px;background:#00000022;overflow:hidden;`,
				}, [
					h("div", {
						style: `width:${props.value}%;height:100%;background:#000;`,
					}),
				]),
			]);
	},
});

babi.show({
	title: "Uploading files",
	state: "loading",
	duration: null,
	component: UploadProgress,
	componentProps: { value: 42 },
});
```

### Loading + lifecycle

```ts
import { h } from "vue";

const id = babi.show({ title: "Uploading...", state: "loading", duration: null });
// later
babi.dismiss(id);

babi.promise(fetch("/api/save"), {
  loading: {
    title: "Saving...",
    component: UploadProgress,
    componentProps: { value: 10 },
  },
  success: {
    title: "Saved",
    component: {
      setup: () => () => h("div", "Everything synced successfully."),
    },
  },
  error: (err) => ({
    title: "Failed",
    description: String(err),
    component: {
      setup: () => () => h("button", { type: "button" }, "Retry"),
    },
  }),
});
```

### Streaming toasts

`babi.stream(source, opts)` is the multi-frame sibling of `babi.promise(...)`. It accepts an `AsyncIterable`, a `ReadableStream`, a Vue `Ref`, or a callback subscriber, then morphs the same toast across every frame the source produces and lands on `success` / `error` once the source ends.

```ts
// 1. Async iterator — e.g. an LLM token stream
async function* generate() {
  let text = "";
  for await (const token of fetchTokens()) {
    text += token;
    yield { description: text };
  }
  return { description: text };
}

babi.stream(generate(), {
  initial: { title: "Generating..." },
});
```

```ts
// 2. Vue ref — bind a toast to reactive state
import { ref } from "vue";

const progress = ref(0);
babi.stream(progress, {
  initial: { title: "Working" },
  frame: (v) => ({
    description: `${v}%`,
    ...(v >= 100 && { state: "success", title: "Done" }),
  }),
});

progress.value = 42;  // toast updates automatically
```

```ts
// 3. Callback subscriber — e.g. XHR upload progress
const xhr = new XMLHttpRequest();
const { id, cancel, done } = babi.stream(
  (emit) => {
    xhr.upload.onprogress = (e) =>
      emit({ description: `${Math.round((e.loaded / e.total) * 100)}%` });
    xhr.onload = () => emit.done({ title: "Uploaded" });
    xhr.onerror = (err) => emit.error(err);
    return () => xhr.abort();   // teardown on cancel
  },
  { initial: { title: "Uploading" } },
);

// done resolves with the final value (or rejects on error)
// cancel() aborts the source and dismisses the toast
// pass an AbortSignal via opts.signal for the same effect
```

Each yielded/emitted value can be either a `BabiOptions` patch (merged into the toast as the next frame), or a raw value mapped through an explicit `frame(value)`. A patch with `state: "success"` or `state: "error"` is treated as terminal and ends the stream early. Streamed toasts inherit `duration: null` while frames are flowing, then revert to the default duration when they settle — so the auto-dismiss behaves like every other toast.

### Promote toasts into widgets

`promote` lets a terminal toast graduate into a persistent component mounted in a declared `BabiPromoteViewport`, with a FLIP morph from the toast's position to the viewport's. The toast's gooey shell fades during the travel; the destination renders only your component, app-styled.

```vue
<!-- App.vue -->
<script setup>
import { Toaster, BabiPromoteViewport } from "@tsogtbayar/babi-toast";
</script>

<template>
  <Toaster position="top-right" />
  <aside class="audio-tray">
    <BabiPromoteViewport name="audio-player-tray" />
  </aside>
</template>
```

```ts
import { babi } from "@tsogtbayar/babi-toast";
import AudioPlayer from "./AudioPlayer.vue";

babi.promise(uploadAudio(file), {
  loading: { title: "Uploading audio", description: file.name },
  success: (audio) => ({
    title: "Upload complete",
    promote: {
      to: "audio-player-tray",
      component: AudioPlayer,
      componentProps: { src: audio.url, title: audio.title },
      successVisibleMs: 600, // optional, defaults to 600
    },
  }),
  error: { title: "Upload failed" },
});
```

Promotion auto-fires from `success`. On `action` it requires explicit invocation — call `babi.promote(id)` (e.g. from the action button's `onClick`).

Babi injects a reserved `babi: { id, dismiss, update }` prop into the promoted component so it can close itself or update its own toast metadata without importing the singleton:

```ts
const Player = defineComponent({
  props: { src: String, babi: Object },
  setup(props) {
    return () => h("div", [
      h("audio", { src: props.src, controls: true }),
      h("button", { onClick: () => props.babi.dismiss() }, "Close"),
    ]);
  },
});
```

Clear promoted widgets:

```ts
babi.clearPromoted();                    // all promoted
babi.clearPromoted("audio-player-tray"); // one viewport
babi.clear();                             // toasts + promoted
```

If `promote.to` doesn't match a mounted viewport, the completion toast stays visible and a single `console.warn` fires. Promoted widgets are cleared automatically when their viewport unmounts; route persistence is not handled in v1.

### Clear toasts

```ts
babi.clear();
babi.clear("top-right");
```

Unnamed toasts stack by default. Provide an explicit `id` when you want later calls to update an existing toast.
