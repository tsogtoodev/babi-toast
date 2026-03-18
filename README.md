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

The demo covers helper states, generic `show`, dismiss, clear, custom component bodies, promise success/error/action flows, styling overrides, stacking, and positioned toasts.

### Mount the toaster

```vue
<!-- App.vue -->
<script setup>
import { Toaster } from "@tsogtbayar/babi-toast";
import "@tsogtbayar/babi-toast/styles.css";
</script>

<template>
  <Toaster position="top-right" />
  <RouterView />
</template>
```

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

### Clear toasts

```ts
babi.clear();
babi.clear("top-right");
```

Unnamed toasts stack by default. Provide an explicit `id` when you want later calls to update an existing toast.
