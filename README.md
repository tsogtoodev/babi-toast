# Babi Vue

## Usage

### Mount the toaster

```vue
<!-- App.vue -->
<script setup>
import { Toaster } from "babi-vue";
import "babi-vue/styles.css";
</script>

<template>
  <Toaster position="top-right" />
  <RouterView />
</template>
```

### Show toasts

```ts
import { babi } from "babi-vue";

babi.success({ title: "Saved", description: "Your changes have been saved." });
babi.error({ title: "Error", description: "Something went wrong." });
babi.warning({ title: "Warning", description: "Disk space is low." });
babi.info({ title: "Info", description: "New version available." });
babi.action({
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
