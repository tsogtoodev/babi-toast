# @tsogtoodev/babi-toast

Morphing toast notifications for Vue 3, with a Sonner-style API. One toast can update itself over time — through a promise, a stream of frames, or a Vue ref — and even graduate into a persistent widget in your layout.

## Features

- **Simple API** — `babi.success()`, `babi.error()`, `babi.warning()`, `babi.info()`, `babi.action()`
- **Promise toasts** — `babi.promise()` shows loading, then morphs to success or error
- **Streaming toasts** — `babi.stream()` drives one toast from an async iterator, `ReadableStream`, Vue `Ref`, or callback (great for LLM output and upload progress)
- **Promote to widget** — a finished toast can FLIP-morph into a persistent component anywhere in your app
- **Custom bodies** — render any Vue component inside a toast
- **TypeScript** — written in TypeScript, all option types exported
- **6 positions**, stacking, per-toast duration, ESM + CJS builds

## Installation

```bash
npm install @tsogtoodev/babi-toast
```

## Usage

Mount the `Toaster` once, then call `babi` from anywhere:

```vue
<!-- App.vue -->
<script setup>
import { Toaster } from "@tsogtoodev/babi-toast";
import "@tsogtoodev/babi-toast/styles.css";
</script>

<template>
  <Toaster position="top-right" />
  <RouterView />
</template>
```

```ts
import { babi } from "@tsogtoodev/babi-toast";

babi.success({ title: "Saved", description: "Your changes have been saved." });

babi.promise(fetch("/api/save"), {
  loading: { title: "Saving..." },
  success: { title: "Saved" },
  error: (err) => ({ title: "Failed", description: String(err) }),
});
```

### Streaming

Bind a toast to a Vue ref (or an async iterator, `ReadableStream`, or callback):

```ts
import { ref } from "vue";

const progress = ref(0);

babi.stream(progress, {
  initial: { title: "Uploading" },
  frame: (v) => ({
    description: `${v}%`,
    ...(v >= 100 && { state: "success", title: "Done" }),
  }),
});

progress.value = 42; // the toast updates automatically
```

### Promote to widget

Declare a `BabiPromoteViewport`, and a toast can morph into it as a persistent component:

```vue
<template>
  <Toaster position="top-right" />
  <BabiPromoteViewport name="audio-tray" />
</template>
```

```ts
babi.promise(uploadAudio(file), {
  loading: { title: "Uploading audio" },
  success: (audio) => ({
    title: "Upload complete",
    promote: { to: "audio-tray", component: AudioPlayer, componentProps: { src: audio.url } },
  }),
  error: { title: "Upload failed" },
});
```

Other useful calls: `babi.show()` for full control, `babi.dismiss(id)`, `babi.clear()`, `babi.clearPromoted()`.

## Examples

Run the local demo to explore every feature — helpers, custom components, promise flows, streaming, promotion, styling, and positions:

```bash
npm run demo   # then open http://127.0.0.1:4173
```

Source for the demo lives in [`examples/`](examples/).

## License

[MIT](LICENSE)
