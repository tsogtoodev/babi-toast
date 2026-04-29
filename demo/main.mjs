import {
	createApp,
	defineComponent,
	h,
	nextTick,
	ref,
} from "vue";
import { BabiPromoteViewport, Toaster, babi } from "@tsogtbayar/babi-toast";

const POSITIONS = [
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
];

const PIXEL_GRID_PRESETS = [
	"wave-lr",
	"wave-rl",
	"wave-tb",
	"wave-bt",
	"spiral-cw",
	"corners-first",
	"center-out",
	"diagonal-tl",
	"snake",
	"cross",
	"checkerboard",
	"rain",
	"pinwheel",
	"orbit",
	"converge",
	"zigzag",
	"aurora",
	"ember",
	"prism",
	"neon-cross",
	"tide",
	"sunset",
	"toxic",
	"frost",
];

const ProgressCard = defineComponent({
	name: "ProgressCard",
	props: {
		caption: { type: String, default: "" },
		label: { type: String, required: true },
		milestones: { type: Array, default: () => [] },
		stats: { type: Array, default: () => [] },
		value: { type: Number, required: true },
	},
	setup(props) {
		return () =>
			h("div", { class: "progress-card" }, [
				props.caption ? h("p", { class: "body-caption" }, props.caption) : null,
				h("div", { class: "progress-meta" }, [
					h("strong", props.label),
					h("span", `${props.value}%`),
				]),
				h("div", { class: "progress-track" }, [
					h("div", {
						class: "progress-fill",
						style: { width: `${props.value}%` },
					}),
				]),
				props.stats.length
					? h(
						"div",
						{ class: "body-stats" },
						props.stats.map((item) =>
							h("div", { class: "body-stat", key: item.label }, [
								h("strong", item.value),
								h("span", item.label),
							]),
						),
					)
					: null,
				props.milestones.length
					? h(
						"div",
						{ class: "body-list" },
						props.milestones.map((item) =>
							h("div", { class: "body-list-item", key: item }, [
								h("span", { class: "body-dot", "aria-hidden": "true" }, ""),
								h("span", item),
							]),
						)
					)
					: null,
			]);
	},
});

const RetryCard = defineComponent({
	name: "RetryCard",
	props: {
		details: { type: Array, default: () => [] },
		hint: { type: String, default: "" },
		onRetry: { type: Function, required: true },
		secondaryLabel: { type: String, default: "Dismiss notification" },
		title: { type: String, default: "Action required" },
	},
	setup(props) {
		return () =>
			h("div", { class: "retry-card" }, [
				h("div", { class: "retry-header" }, [
					h("strong", props.title),
					props.hint ? h("p", { class: "retry-hint" }, props.hint) : null,
				]),
				props.details.length
					? h(
						"div",
						{ class: "body-list" },
						props.details.map((item) =>
							h("div", { class: "body-list-item", key: item }, [
								h("span", { class: "body-dot body-dot-warn", "aria-hidden": "true" }, ""),
								h("span", item),
							]),
						),
					)
					: null,
				h("div", { class: "body-actions" }, [
					h(
						"button",
						{
							type: "button",
							onClick: () => props.onRetry(),
						},
						"Try again",
					),
					h(
						"button",
						{
							type: "button",
							class: "body-button-secondary",
							onClick: () => babi.clear(),
						},
						props.secondaryLabel,
					),
				]),
			]);
	},
});

const SummaryCard = defineComponent({
	name: "SummaryCard",
	props: {
		ctaLabel: { type: String, default: "" },
		headline: { type: String, required: true },
		items: { type: Array, default: () => [] },
		onAction: { type: Function, default: null },
		tone: { type: String, default: "default" },
	},
	setup(props) {
		return () =>
			h("div", { class: ["summary-card", `summary-${props.tone}`] }, [
				h("strong", { class: "summary-headline" }, props.headline),
				props.items.length
					? h(
						"div",
						{ class: "summary-grid" },
						props.items.map((item) =>
							h("div", { class: "summary-cell", key: item.label }, [
								h("strong", item.value),
								h("span", item.label),
							]),
						),
					)
					: null,
				props.ctaLabel && props.onAction
					? h(
						"button",
						{
							type: "button",
							class: "summary-cta",
							onClick: () => props.onAction(),
						},
						props.ctaLabel,
					)
					: null,
			]);
	},
});

const AudioPlayerCard = defineComponent({
	name: "AudioPlayerCard",
	props: {
		duration: { type: String, required: true },
		format: { type: String, default: "" },
		level: { type: String, default: "" },
		onPrimary: { type: Function, default: null },
		project: { type: String, default: "" },
		title: { type: String, required: true },
		voice: { type: String, required: true },
		waveform: { type: Array, default: () => [] },
	},
	setup(props) {
		const playing = ref(false);
		const currentTime = ref("00:00");

		function togglePlayback() {
			playing.value = !playing.value;
			currentTime.value = playing.value ? "00:37" : "00:00";
		}

		return () =>
			h("div", { class: "audio-player-card" }, [
				h("div", { class: "audio-player-shell" }, [
					h("div", { class: "audio-player-art", "aria-hidden": "true" }, [
						h("span", { class: "audio-player-art-ring" }),
						h("span", { class: "audio-player-art-core" }, playing.value ? "❚❚" : "▶"),
					]),
					h("div", { class: "audio-player-main" }, [
						h("div", { class: "audio-player-head" }, [
							h("div", [
								h("p", { class: "body-caption" }, "Audio preview"),
								h("strong", { class: "summary-headline" }, props.title),
								h("p", { class: "audio-player-copy" }, `${props.voice}${props.project ? ` • ${props.project}` : ""}`),
							]),
							h(
								"button",
								{
									type: "button",
									class: "audio-player-toggle",
									onClick: togglePlayback,
								},
								playing.value ? "Pause" : "Play",
							),
						]),
						h(
							"div",
							{ class: "audio-waveform", "data-playing": playing.value ? "true" : "false" },
							props.waveform.map((bar, index) =>
								h("span", {
									class: "audio-wave-bar",
									key: `${index}-${bar}`,
									style: { height: `${bar}%` },
								}),
							),
						),
						h("div", { class: "audio-player-footer" }, [
							h("span", currentTime.value),
							h("div", { class: "audio-player-scrub" }, [
								h("span", {
									class: "audio-player-scrub-fill",
									style: { width: playing.value ? "34%" : "0%" },
								}),
							]),
							h("span", props.duration),
						]),
						h("div", { class: "audio-player-meta" }, [
							props.format
								? h("span", { class: "audio-meta-pill" }, props.format)
								: null,
							props.level
								? h("span", { class: "audio-meta-pill" }, props.level)
								: null,
							h("span", { class: "audio-meta-pill" }, playing.value ? "Preview active" : "Preview ready"),
						]),
						h("div", { class: "audio-player-actions" }, [
							h(
								"button",
								{
									type: "button",
									class: "audio-mini-button",
									onClick: togglePlayback,
								},
								playing.value ? "Restart" : "Listen",
							),
							h(
								"button",
								{
									type: "button",
									class: "audio-mini-button audio-mini-button-secondary",
								},
								"View waveform",
							),
						]),
					]),
				]),
				props.onPrimary
					? h(
						"button",
						{
							type: "button",
							class: "summary-cta",
							onClick: () => props.onPrimary(),
						},
						"Attach to description",
					)
					: null,
			]);
	},
});

const App = defineComponent({
	name: "DemoApp",
	setup() {
		const counter = ref(0);
		const lastLoadingId = ref(null);
		const activePixelGridPreset = ref("wave-lr");
		const eventLog = ref("Ready. Use the sections below to exercise every API flow.");

		function log(message) {
			eventLog.value = message;
		}

		function nextCount() {
			counter.value += 1;
			return counter.value;
		}

		function showSuccess() {
			babi.success({
				fill: "#000000",
				title: "Saved",
				description: "Document changes saved successfully.",
			});
			log("`babi.success(...)` fired.");
		}

		function showError() {
			babi.error({
				fill: "#000000",
				title: "Publish failed",
				description: "The release validation rolled this change back.",
			});
			log("`babi.error(...)` fired.");
		}

		function showWarning() {
			babi.warning({
				fill: "#000000",
				title: "Disk space low",
				description: "The render cache is approaching its current quota.",
			});
			log("`babi.warning(...)` fired.");
		}

		function showInfo() {
			babi.info({
				fill: "#000000",
				title: "New version available",
				description: "A new editor build is ready to install.",
			});
			log("`babi.info(...)` fired.");
		}

		function showAction() {
			babi.action({
				fill: "#000000",
				title: "Heads up",
				description: "We found an old draft. Restore it if you need it.",
				button: {
					title: "Restore draft",
					onClick: () => {
						log("Clicked the button inside `babi.action(...)`.");
						babi.success({
							fill: "#000000",
							title: "Draft restored",
							description: "Your previous draft is back in the editor.",
						});
					},
				},
			});
			log("`babi.action(...)` fired with a button.");
		}

		function showGenericLoading() {
			lastLoadingId.value = babi.show({
				fill: "#000000",
				title: "Uploading files",
				state: "loading",
				duration: null,
				description: "This uses the generic `babi.show(...)` API.",
			});
			log(`Generic loading toast fired via \`babi.show(...)\`. id=${lastLoadingId.value}`);
		}

		function dismissLastLoading() {
			if (!lastLoadingId.value) {
				log("No loading toast to dismiss right now.");
				return;
			}
			babi.dismiss(lastLoadingId.value);
			log(`Tracked toast dismissed via \`babi.dismiss(${lastLoadingId.value})\`.`);
			lastLoadingId.value = null;
		}

		function showCustomStyles() {
			babi.info({
				title: "Custom-styled toast",
				description: "Fill, roundness, icon, border, and class overrides are active.",
				fill: "#f3e2c8",
				border: "rgba(15, 23, 42, 0.18)",
				roundness: 26,
				icon: h("span", { style: "font-size:14px;" }, "✦"),
				styles: {
					title: "demo-toast-title",
					description: "demo-toast-copy",
					badge: "demo-toast-badge",
					button: "demo-toast-button",
				},
				button: {
					title: "Check",
					onClick: () => log("Clicked the button on the custom-styled toast."),
				},
			});
			log("Toast with custom fill, roundness, icon, and style classes fired.");
		}

		function showAutopilotOff() {
			babi.info({
				fill: "#000000",
				title: "Autopilot off",
				description: "This toast stays open while hovered but does not auto-expand or auto-collapse.",
				autopilot: false,
				duration: 8000,
			});
			log("Toast with `autopilot: false` fired.");
		}

		async function showPixelGridPromiseLoader(preset = "wave-lr") {
			activePixelGridPreset.value = preset;
			await nextTick();
			babi.promise(
				new Promise((resolve) => {
					setTimeout(() => resolve({ files: 24, preset }), 1800);
				}),
				{
					loading: {
						fill: "#000000",
						title: preset,
						description: "The promise loading badge uses the selected 3x3 pixel-grid preset.",
					},
					success: ({ files, preset: donePreset }) => ({
						fill: "#000000",
						title: `${donePreset} complete`,
						description: `${files} files processed.`,
					}),
					error: (err) => ({
						fill: "#000000",
						title: "Pixel grid demo error",
						description: String(err),
					}),
				},
			);
			log(`Pixel-grid promise loading indicator demo fired. preset=${preset}`);
		}

		function showComponentToast() {
			babi.show({
				fill: "#000000",
				title: "Uploading campaign deck",
				state: "loading",
				duration: null,
				component: ProgressCard,
				componentProps: {
					caption: "Live upload session",
					label: "Assets uploaded",
					milestones: [
						"Re-encoding the master video",
						"Bundling static images",
						"Syncing motion presets",
					],
					stats: [
						{ label: "Files", value: "18/42" },
						{ label: "Speed", value: "6.4 MB/s" },
						{ label: "Remaining", value: "14s" },
					],
					value: 42,
				},
			});
			log("Toast with a custom component body fired.");
		}

		function showAudioUploadDemo() {
			babi.promise(
				new Promise((resolve) => {
					setTimeout(() => resolve({
						duration: "02:48",
						title: "Podcast intro",
						voice: "Female voice · 48 kHz",
						waveform: [32, 58, 44, 66, 41, 77, 53, 37, 69, 49, 61, 34],
					}), 2600);
				}),
				{
					loading: {
						fill: "#000000",
						title: "Uploading audio file",
						component: ProgressCard,
						componentProps: {
							caption: "Upload in progress",
							label: "voice_intro_final.wav",
							milestones: [
								"Validating noise-reduction metadata",
								"Confirming loudness normalization settings",
								"Generating waveform preview",
							],
							stats: [
								{ label: "Size", value: "12.4 MB" },
								{ label: "Length", value: "02:48" },
								{ label: "Format", value: "WAV 48k" },
							],
							value: 63,
						},
					},
					success: (audio) => ({
						fill: "#000000",
						title: "Audio ready",
						description: "Upload complete. Play the preview below.",
						component: AudioPlayerCard,
						componentProps: {
							duration: audio.duration,
							format: "WAV • 48 kHz",
							level: "-14 LUFS",
							project: "Podcast intro master",
							title: audio.title,
							voice: audio.voice,
							waveform: audio.waveform,
							onPrimary: () => {
								log("Attached the audio preview to the description.");
								babi.success({
									fill: "#000000",
									title: "Audio attached",
									description: "Added to the description with the preview player.",
								});
							},
						},
					}),
					error: (err) => ({
						fill: "#000000",
						title: "Audio upload failed",
						description: String(err),
					}),
				},
			);
			log("Audio upload → custom audio player morph demo fired.");
		}

		function showAudioTrayPromotion() {
			babi.promise(
				new Promise((resolve) => {
					setTimeout(() => resolve({
						duration: "03:21",
						title: "Production interview",
						voice: "Male voice · 48 kHz",
						waveform: [44, 28, 62, 39, 71, 47, 56, 33, 68, 51, 42, 60],
					}), 2200);
				}),
				{
					loading: {
						fill: "#000000",
						border: "rgba(255, 255, 255, 0.18)",
						title: "Uploading to tray",
						component: ProgressCard,
						componentProps: {
							caption: "Upload in progress",
							label: "interview_take_03.wav",
							stats: [
								{ label: "Size", value: "16.1 MB" },
								{ label: "Length", value: "03:21" },
								{ label: "Format", value: "WAV 48k" },
							],
							value: 48,
						},
					},
					success: (audio) => ({
						fill: "#000000",
						border: "rgba(255, 255, 255, 0.18)",
						title: "Landed in audio tray",
						description: "Appeared inside the player tray.",
						promote: {
							to: "audio-player-tray",
							component: AudioPlayerCard,
							componentProps: {
								duration: audio.duration,
								format: "WAV • 48 kHz",
								level: "-12 LUFS",
								project: "Tray promotion demo",
								title: audio.title,
								voice: audio.voice,
								waveform: audio.waveform,
							},
							successVisibleMs: 700,
						},
					}),
					error: (err) => ({
						fill: "#000000",
						title: "Tray upload error",
						description: String(err),
					}),
				},
			);
			log("Audio upload → tray promotion flow fired.");
		}

		function clearAudioTray() {
			babi.clearPromoted("audio-player-tray");
			log("Audio tray cleared.");
		}

		function showPromiseMorph() {
			babi.promise(
				new Promise((resolve) => {
					setTimeout(() => resolve({ shareUrl: "https://example.com/share/alpha" }), 1500);
				}),
				{
					loading: {
						fill: "#000000",
						title: "Saving workspace",
						component: ProgressCard,
						componentProps: {
							caption: "Preparing collaborative share link",
							label: "Writing snapshot",
							milestones: [
								"Locking the current canvas state",
								"Sending comment anchors",
								"Indexing asset references",
							],
							stats: [
								{ label: "Layer", value: "214" },
								{ label: "Comments", value: "7" },
								{ label: "Size", value: "18 MB" },
							],
							value: 12,
						},
					},
					success: ({ shareUrl }) => ({
						fill: "#000000",
						title: "Workspace saved",
						description: shareUrl,
						component: SummaryCard,
						componentProps: {
							headline: "Snapshot validated and published",
							items: [
								{ label: "Version", value: "v18" },
								{ label: "Reviewers", value: "3" },
								{ label: "Time", value: "1.5s" },
							],
							ctaLabel: "Copy share link",
							onAction: () => {
								log("Copied the share link from the success summary card.");
								babi.info({
									fill: "#000000",
									title: "Share link copied",
									description: shareUrl,
								});
							},
							tone: "success",
						},
					}),
					error: (err) => ({
						fill: "#000000",
						title: "Save failed",
						description: String(err),
						component: RetryCard,
						componentProps: {
							details: [
								"Snapshot upload was not confirmed.",
								"Review permissions are not synced.",
							],
							hint: "Check your workspace network tunnel and try again.",
							onRetry: showPromiseMorph,
						},
					}),
				},
			);
			log("`babi.promise(...)` success morph flow fired.");
		}

		function showRejectingPromise() {
			babi.promise(
				new Promise((_, reject) => {
					setTimeout(() => reject(new Error("Timed out waiting for the remote archive store.")), 1500);
				}),
				{
					loading: {
						fill: "#000000",
						title: "Preparing archive session",
						component: ProgressCard,
						componentProps: {
							caption: "Building cold-storage archive",
							label: "Bundling files",
							milestones: [
								"Collecting source media files",
								"Hashing final renders",
								"Compressing backup manifest",
							],
							stats: [
								{ label: "Batches", value: "9" },
								{ label: "Archive", value: "2.4 GB" },
								{ label: "Node", value: "4" },
							],
							value: 67,
						},
					},
					success: {
						fill: "#000000",
						title: "Archived",
					},
					error: (err) => ({
						fill: "#000000",
						title: "Archive failed",
						description: err instanceof Error ? err.message : String(err),
						component: RetryCard,
						componentProps: {
							details: [
								"The remote archive store responded too slowly.",
								"Manifest validation did not complete.",
							],
							hint: "Try again to resume from the last confirmed segment.",
							onRetry: showRejectingPromise,
							secondaryLabel: "Clear notification",
							title: "Archive flow interrupted",
						},
					}),
				},
			).catch(() => undefined);
			log("`babi.promise(...)` error morph flow fired.");
		}

		function showPromiseAction() {
			babi.promise(
				new Promise((resolve) => {
					setTimeout(() => resolve({ changes: 7 }), 1300);
				}),
				{
					loading: {
						fill: "#000000",
						title: "Preparing review packet",
						component: ProgressCard,
						componentProps: {
							caption: "Compiling review packet",
							label: "Collecting comments",
							milestones: [
								"Merging unresolved feedback",
								"Grouping changes by owner",
								"Building approval packet",
							],
							stats: [
								{ label: "Thread", value: "12" },
								{ label: "Mention", value: "5" },
								{ label: "Remaining", value: "9s" },
							],
							value: 34,
						},
					},
					success: {
						fill: "#000000",
						title: "Review ready",
					},
					error: (err) => ({
						fill: "#000000",
						title: "Review preparation failed",
						description: String(err),
					}),
					action: ({ changes }) => ({
						fill: "#000000",
						title: "Review prepared",
						description: `${changes} comments awaiting confirmation.`,
						component: SummaryCard,
						componentProps: {
							headline: "Approval packet ready",
							items: [
								{ label: "Comments", value: String(changes) },
								{ label: "Owners", value: "4" },
								{ label: "Priority", value: "High" },
							],
							ctaLabel: "View reviewers",
							onAction: () => {
								log("Opened the reviewer preview from the action summary card.");
								babi.info({
									fill: "#000000",
									title: "Reviewer preview",
									description: "Assigned to Alex, Naraa, Saran, Tuvshin.",
								});
							},
							tone: "accent",
						},
						button: {
							title: "Open review",
							onClick: () => {
								log("Clicked the promise action-state button.");
								babi.info({
									fill: "#000000",
									title: "Review opened",
									description: "Action-state promise flow completed successfully.",
								});
							},
						},
					}),
				},
			);
			log("Promise flow with `action` terminal state fired.");
		}

		async function showTokenStreamDemo() {
			const tokens = [
				"Hello", " there", ".", " This", " message",
				" is", " streaming", " into", " place",
				" token", " by", " token", ".",
			];
			async function* generate() {
				let text = "";
				for (const t of tokens) {
					await new Promise((r) => setTimeout(r, 140));
					text += t;
					yield { description: text };
				}
				return { description: text, title: "Reply ready" };
			}
			babi.stream(generate(), {
				initial: {
					fill: "#000000",
					title: "Composing reply",
				},
				success: {
					fill: "#000000",
				},
			});
			log("Async iterator token-stream toast fired.");
		}

		function showRefStreamDemo() {
			const progress = ref(0);
			const handle = babi.stream(progress, {
				initial: {
					fill: "#000000",
					title: "Toast bound to a reactive ref",
				},
				frame: (v) => ({
					description: `${v}% complete`,
					...(v >= 100 && {
						state: "success",
						title: "Ref stream complete",
					}),
				}),
			});
			const tick = setInterval(() => {
				progress.value = Math.min(100, progress.value + 8);
				if (progress.value >= 100) clearInterval(tick);
			}, 220);
			log(`Vue \`ref\`-driven stream toast fired. id=${handle.id}`);
		}

		function showCallbackStreamDemo() {
			const total = 18;
			let sent = 0;
			babi.stream(
				(emit) => {
					const tick = setInterval(() => {
						sent += 1;
						emit({
							description: `${sent}/${total} files uploaded`,
						});
						if (sent >= total) {
							clearInterval(tick);
							emit.done({
								description: `${total} files uploaded successfully.`,
							});
						}
					}, 180);
					return () => clearInterval(tick);
				},
				{
					initial: {
						fill: "#000000",
						title: "Batch upload",
						component: ProgressCard,
						componentProps: {
							caption: "Stream from callback subscriber",
							label: "upload-batch.zip",
							stats: [
								{ label: "Files", value: `0/${total}` },
								{ label: "Speed", value: "—" },
							],
							value: 0,
						},
					},
					frame: (patch) => ({
						...patch,
						fill: "#000000",
						title: "Batch upload",
						component: ProgressCard,
						componentProps: {
							caption: "Stream from callback subscriber",
							label: "upload-batch.zip",
							stats: [
								{ label: "Files", value: `${sent}/${total}` },
								{ label: "Speed", value: "4.1 MB/s" },
							],
							value: Math.round((sent / total) * 100),
						},
					}),
					success: {
						fill: "#000000",
						title: "Batch upload complete",
					},
				},
			);
			log("Callback-subscriber stream toast fired.");
		}

		function showStacking() {
			for (let i = 0; i < 3; i++) {
				const n = nextCount();
				babi.success({
					fill: "#000000",
					title: `Stacked item ${n}`,
					description: "Anonymous toasts should stack without replacing earlier ones.",
				});
			}
			log("Fired three anonymous toasts to verify stacking.");
		}

		function showPositionToast(position) {
			babi.info({
				fill: "#000000",
				title: position,
				description: `Toast appears in the ${position} slot.`,
				position,
			});
			log(`Toast at ${position} fired.`);
		}

		function clearAll() {
			babi.clear();
			log("Cleared all toasts via `babi.clear()`.");
			lastLoadingId.value = null;
		}

		function clearTopRight() {
			babi.clear("top-right");
			log("Cleared only top-right toasts via `babi.clear(\"top-right\")`.");
			lastLoadingId.value = null;
		}

		return () =>
			h("div", { class: "demo-shell" }, [
				h(Toaster, {
					position: "top-right",
					options: {
						promiseLoadingIndicator: "pixel-grid",
						promiseLoadingIndicatorPreset: activePixelGridPreset.value,
					},
					offset: {
						top: 18,
						right: 18,
						bottom: 18,
						left: 18,
					},
				}),
				h("main", { class: "demo-card" }, [
					h("p", { class: "demo-eyebrow" }, "Babi Toast demo"),
					h("h1", { class: "demo-title" }, "Exercise every API flow from one page."),
					h(
						"p",
						{ class: "demo-copy" },
						"The sections below cover helper states, generic show + dismiss flows, custom bodies, promise morphs, stacking, positioning, and clear actions.",
					),
					renderSection("State helpers", "Each helper should appear with the correct badge and icon state.", [
						actionButton("Success", "Exercises `babi.success(...)`.", showSuccess),
						actionButton("Error", "Exercises `babi.error(...)`.", showError),
						actionButton("Warning", "Exercises `babi.warning(...)`.", showWarning),
						actionButton("Info", "Exercises `babi.info(...)`.", showInfo),
						actionButton("Action", "Exercises `babi.action(...)` with a button.", showAction),
					]),
					renderSection("Core controls", "Covers generic `show`, manual dismiss, style overrides, and autopilot.", [
						actionButton("Show loading", "Uses `babi.show(...)` with `state: \"loading\"`.", showGenericLoading),
						actionButton("Dismiss last loading", "Uses the id returned from `babi.show(...)`.", dismissLastLoading),
						actionButton("Styled toast", "Exercises custom fill, roundness, icon, border, and classes.", showCustomStyles),
						actionButton("Autopilot off", "Body content does not auto-choreograph.", showAutopilotOff),
					]),
					renderSection("Custom bodies", "Exercises the new component-body flow and every promise terminal state.", [
						actionButton("Custom component", "Expandable loading toast with a component body.", showComponentToast),
						actionButton("Audio upload → player", "Morphs from upload metadata into a custom audio player.", showAudioUploadDemo),
						actionButton("Audio upload → tray", "Promotes from the toast into the right-side tray.", showAudioTrayPromotion),
						actionButton("Clear tray", "Calls `babi.clearPromoted(\"audio-player-tray\")`.", clearAudioTray),
						actionButton("Promise success", "Morphs a single toast from loading to success.", showPromiseMorph),
						actionButton("Promise error", "Renders the retry UI for a failing promise.", showRejectingPromise),
						actionButton("Promise action", "Successful promise terminates in the `action` state.", showPromiseAction),
						actionButton("Anonymous toast stack", "Verifies default ids do not collide.", showStacking),
					]),
					renderSection(
						"Stream flow",
						"`babi.stream(...)` consumes async iterators, Vue refs, and callback subscribers directly, producing a multi-frame live toast.",
						[
							actionButton(
								"Token stream",
								"Description grows token-by-token from an async generator.",
								showTokenStreamDemo,
							),
							actionButton(
								"Reactive ref",
								"As `ref(0)` climbs to 100 the toast description updates.",
								showRefStreamDemo,
							),
							actionButton(
								"Callback subscriber",
								"Streams batch upload progress into a toast with a custom component body.",
								showCallbackStreamDemo,
							),
						],
					),
					renderSection("Pixel-grid presets", "Exercise every original 3-pixel-grid preset on the promise loading badge.", [
						...PIXEL_GRID_PRESETS.map((preset) =>
							actionButton(preset, `Renders the ${preset} preset on the loading badge.`, () => showPixelGridPromiseLoader(preset)),
						),
					], "wide"),
					renderSection("Positioning & clear actions", "Exercises position routing and store-clearing helpers.", [
						...POSITIONS.map((position) =>
							actionButton(position, `Sends a toast to the ${position} slot.`, () => showPositionToast(position)),
						),
						actionButton("Clear top-right", "Calls `babi.clear(\"top-right\")`.", clearTopRight),
						actionButton("Clear everything", "Calls `babi.clear()`.", clearAll),
					], "wide"),
					h("div", { class: "demo-note" }, [
						h("strong", "Manual checks"),
						h(
							"p",
							"Hovering any toast pauses dismiss. Promise demos reuse a single toast instance and morph their shell content in place. Position buttons should render in the requested corner or center row.",
						),
					]),
					h("div", { class: "demo-log" }, [
						h("strong", "Last action"),
						h("p", eventLog.value),
						h(
							"p",
							lastLoadingId.value
								? `Tracked loading id: ${lastLoadingId.value}`
								: "Tracked loading id: none",
						),
					]),
				]),
				h("aside", { class: "demo-tray" }, [
					h("div", { class: "demo-tray-head" }, [
						h("strong", "Audio tray"),
						h("p", "Toasts with `promote` land here."),
					]),
					h(BabiPromoteViewport, {
						name: "audio-player-tray",
						class: "demo-tray-slot",
					}),
				]),
			]);
	},
});

function renderSection(title, copy, buttons, layout = "default") {
	return h("section", { class: "demo-section" }, [
		h("div", { class: "demo-section-head" }, [
			h("h2", { class: "demo-section-title" }, title),
			h("p", { class: "demo-section-copy" }, copy),
		]),
		h("div", { class: layout === "wide" ? "demo-grid demo-grid-wide" : "demo-grid" }, buttons),
	]);
}

function actionButton(title, copy, onClick) {
	return h(
		"button",
		{
			type: "button",
			class: "demo-button",
			onClick,
		},
		[
			h("div", [
				h("strong", title),
				h("span", copy),
			]),
			h("span", { class: "demo-arrow", "aria-hidden": "true" }, "→"),
		],
	);
}

createApp(App).mount("#app");
