# Babi Vue

## Usage

### Installation

```bash
yarn add @tsogtbayar/babi-toast --registry=https://git.bolor.net/api/v4/projects/844/packages/npm/
```

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

### Loading + lifecycle

```ts
const id = babi.show({ title: "Uploading...", state: "loading", duration: null });
// later
babi.dismiss(id);

babi.promise(fetch("/api/save"), {
  loading: { title: "Saving..." },
  success: { title: "Saved" },
  error: (err) => ({ title: "Failed", description: String(err) }),
});
```

### Clear toasts

```ts
babi.clear();
babi.clear("top-right");
```
