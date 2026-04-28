import {
	createApp,
	defineComponent,
	h,
	nextTick,
	ref,
} from "vue";
import { Toaster, babi } from "@tsogtbayar/babi-toast";

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
		secondaryLabel: { type: String, default: "Мэдэгдлийг хаах" },
		title: { type: String, default: "Арга хэмжээ шаардлагатай" },
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
						"Дахин оролдох",
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
								playing.value ? "Түр зогсоох" : "Тоглуулах",
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
							h("span", { class: "audio-meta-pill" }, playing.value ? "Preview идэвхтэй" : "Preview бэлэн"),
						]),
						h("div", { class: "audio-player-actions" }, [
							h(
								"button",
								{
									type: "button",
									class: "audio-mini-button",
									onClick: togglePlayback,
								},
								playing.value ? "Эхлэл рүү" : "Сонсож үзэх",
							),
							h(
								"button",
								{
									type: "button",
									class: "audio-mini-button audio-mini-button-secondary",
								},
								"Waveform харах",
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
						"Тайлбарт хавсаргах",
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
		const eventLog = ref("Бэлэн. Доорх хэсгүүдээр API-ийн бүх урсгалыг шалгаж болно.");

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
				title: "Хадгаллаа",
				description: "Баримтын өөрчлөлтүүд амжилттай хадгалагдлаа.",
			});
			log("`babi.success(...)` ажиллалаа.");
		}

		function showError() {
			babi.error({
				fill: "#000000",
				title: "Нийтлэхэд алдаа гарлаа",
				description: "Хувилбар гаргах шалгалт энэ өөрчлөлтийг буцаалаа.",
			});
			log("`babi.error(...)` ажиллалаа.");
		}

		function showWarning() {
			babi.warning({
				fill: "#000000",
				title: "Дискний зай бага байна",
				description: "Рэндэрийн кэш одоогийн квотдоо тулж байна.",
			});
			log("`babi.warning(...)` ажиллалаа.");
		}

		function showInfo() {
			babi.info({
				fill: "#000000",
				title: "Шинэ хувилбар бэлэн боллоо",
				description: "Редакторын шинэ build суулгахад бэлэн байна.",
			});
			log("`babi.info(...)` ажиллалаа.");
		}

		function showAction() {
			babi.action({
				fill: "#000000",
				title: "Анхаарах зүйл байна",
				description: "Хуучин ноорог илэрлээ. Хэрэгтэй бол сэргээнэ үү.",
				button: {
					title: "Ноорог сэргээх",
					onClick: () => {
						log("`babi.action(...)` доторх товч дарлаа.");
						babi.success({
							fill: "#000000",
							title: "Ноорог сэргээгдлээ",
							description: "Өмнөх ноорог редакторт буцаж орлоо.",
						});
					},
				},
			});
			log("`babi.action(...)` товчтойгоор ажиллалаа.");
		}

		function showGenericLoading() {
			lastLoadingId.value = babi.show({
				fill: "#000000",
				title: "Файлууд илгээж байна",
				state: "loading",
				duration: null,
				description: "Энэ нь ерөнхий `babi.show(...)` API-г ашиглаж байна.",
			});
			log(`Ерөнхий loading toast \`babi.show(...)\`-оор ажиллалаа. id=${lastLoadingId.value}`);
		}

		function dismissLastLoading() {
			if (!lastLoadingId.value) {
				log("Одоогоор dismiss хийх loading toast алга.");
				return;
			}
			babi.dismiss(lastLoadingId.value);
			log(`Хянаж байсан toast-ыг \`babi.dismiss(${lastLoadingId.value})\`-оор хаалаа.`);
			lastLoadingId.value = null;
		}

		function showCustomStyles() {
			babi.info({
				title: "Тусгай загвартай toast",
				description: "Fill, roundness, icon болон class override-ууд идэвхтэй байна.",
				fill: "#f3e2c8",
				roundness: 26,
				icon: h("span", { style: "font-size:14px;" }, "✦"),
				styles: {
					title: "demo-toast-title",
					description: "demo-toast-copy",
					badge: "demo-toast-badge",
					button: "demo-toast-button",
				},
				button: {
					title: "Шалгах",
					onClick: () => log("Тусгай загвартай toast-ын товчийг дарлаа."),
				},
			});
			log("Тусгай fill, roundness, icon болон style class-тай toast ажиллалаа.");
		}

		function showAutopilotOff() {
			babi.info({
				fill: "#000000",
				title: "Autopilot унтраалттай",
				description: "Энэ toast hover үед нээлттэй үлдэнэ, харин автоматаар дэлгэх/хумих хөдөлгөөн хийхгүй.",
				autopilot: false,
				duration: 8000,
			});
			log("`autopilot: false` тохиргоотой toast ажиллалаа.");
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
						description: "Promise loading badge нь сонгосон 3x3 pixel-grid preset ашиглана.",
					},
					success: ({ files, preset: donePreset }) => ({
						fill: "#000000",
						title: `${donePreset} дууслаа`,
						description: `${files} файл боловсруулагдлаа.`,
					}),
					error: (err) => ({
						fill: "#000000",
						title: "Pixel grid demo алдаа",
						description: String(err),
					}),
				},
			);
			log(`Pixel-grid promise loading indicator demo ажиллалаа. preset=${preset}`);
		}

		function showComponentToast() {
			babi.show({
				fill: "#000000",
				title: "Кампанит ажлын deck илгээж байна",
				state: "loading",
				duration: null,
				component: ProgressCard,
				componentProps: {
					caption: "Шууд upload сесс",
					label: "Илгээгдсэн asset",
					milestones: [
						"Гол видеог шинэ кодчилолд оруулж байна",
						"Статик зургуудыг багцалж байна",
						"Motion preset-үүдийг синк хийж байна",
					],
					stats: [
						{ label: "Файл", value: "18/42" },
						{ label: "Хурд", value: "6.4 MB/s" },
						{ label: "Үлдсэн", value: "14с" },
					],
					value: 42,
				},
			});
			log("Custom component body-той toast ажиллалаа.");
		}

		function showAudioUploadDemo() {
			babi.promise(
				new Promise((resolve) => {
					setTimeout(() => resolve({
						duration: "02:48",
						title: "Подкастын танилцуулга",
						voice: "Эмэгтэй хоолой · 48 kHz",
						waveform: [32, 58, 44, 66, 41, 77, 53, 37, 69, 49, 61, 34],
					}), 2600);
				}),
				{
					loading: {
						fill: "#000000",
						title: "Аудио файл илгээж байна",
						component: ProgressCard,
						componentProps: {
							caption: "Upload үргэлжилж байна",
							label: "voice_intro_final.wav",
							milestones: [
								"Шуугиан шүүх мета өгөгдөл шалгаж байна",
								"Loudness normalization тохиргоо баталгаажиж байна",
								"Waveform preview үүсгэж байна",
							],
							stats: [
								{ label: "Хэмжээ", value: "12.4 MB" },
								{ label: "Урт", value: "02:48" },
								{ label: "Формат", value: "WAV 48k" },
							],
							value: 63,
						},
					},
					success: (audio) => ({
						fill: "#000000",
						title: "Аудио бэлэн боллоо",
						description: "Upload дууслаа. Доороос preview тоглуулж болно.",
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
								log("Аудио preview-г тайлбарт хавсаргах үйлдэл ажиллалаа.");
								babi.success({
									fill: "#000000",
									title: "Аудио хавсаргалаа",
									description: "Preview player-тэй хамт тайлбарын мөрөнд нэмэгдлээ.",
								});
							},
						},
					}),
					error: (err) => ({
						fill: "#000000",
						title: "Аудио upload алдаа гарлаа",
						description: String(err),
					}),
				},
			);
			log("Аудио upload-аас custom audio player руу morph хийх demo ажиллалаа.");
		}

		function showPromiseMorph() {
			babi.promise(
				new Promise((resolve) => {
					setTimeout(() => resolve({ shareUrl: "https://example.com/share/alpha" }), 1500);
				}),
				{
					loading: {
						fill: "#000000",
						title: "Workspace хадгалж байна",
						component: ProgressCard,
						componentProps: {
							caption: "Хамтран ажиллах share link бэлдэж байна",
							label: "Snapshot бичиж байна",
							milestones: [
								"Одоогийн canvas төлөвийг түгжиж байна",
								"Comment anchor-уудыг илгээж байна",
								"Asset reference-үүдийг индексжүүлж байна",
							],
							stats: [
								{ label: "Layer", value: "214" },
								{ label: "Сэтгэгдэл", value: "7" },
								{ label: "Хэмжээ", value: "18 MB" },
							],
							value: 12,
						},
					},
					success: ({ shareUrl }) => ({
						fill: "#000000",
						title: "Workspace хадгалагдлаа",
						description: shareUrl,
						component: SummaryCard,
						componentProps: {
							headline: "Snapshot баталгаажиж, нийтлэгдлээ",
							items: [
								{ label: "Хувилбар", value: "v18" },
								{ label: "Шалгагч", value: "3" },
								{ label: "Хугацаа", value: "1.5с" },
							],
							ctaLabel: "Share link хуулах",
							onAction: () => {
								log("Амжилтын summary card-аас share link хууллаа.");
								babi.info({
									fill: "#000000",
									title: "Share link хуулагдлаа",
									description: shareUrl,
								});
							},
							tone: "success",
						},
					}),
					error: (err) => ({
						fill: "#000000",
						title: "Хадгалах үед алдаа гарлаа",
						description: String(err),
						component: RetryCard,
						componentProps: {
							details: [
								"Snapshot upload баталгаажаагүй үлдлээ.",
								"Review permission-үүд синк хийгдээгүй байна.",
							],
							hint: "Workspace network tunnel-ээ шалгаад дахин оролдоно уу.",
							onRetry: showPromiseMorph,
						},
					}),
				},
			);
			log("`babi.promise(...)` амжилтын morph урсгал ажиллалаа.");
		}

		function showRejectingPromise() {
			babi.promise(
				new Promise((_, reject) => {
					setTimeout(() => reject(new Error("Алсын архивын сангаас хариу авах хугацаа хэтэрлээ.")), 1500);
				}),
				{
					loading: {
						fill: "#000000",
						title: "Архивын сесс бэлдэж байна",
						component: ProgressCard,
						componentProps: {
							caption: "Удаан хадгалах архив үүсгэж байна",
							label: "Файлуудыг багцалж байна",
							milestones: [
								"Эх медиа файлуудыг цуглуулж байна",
								"Эцсийн render-үүдийг hash хийж байна",
								"Нөөц manifest-ийг шахаж байна",
							],
							stats: [
								{ label: "Багц", value: "9" },
								{ label: "Архив", value: "2.4 GB" },
								{ label: "Node", value: "4" },
							],
							value: 67,
						},
					},
					success: {
						fill: "#000000",
						title: "Архивлагдлаа",
					},
					error: (err) => ({
						fill: "#000000",
						title: "Архивлах үед алдаа гарлаа",
						description: err instanceof Error ? err.message : String(err),
						component: RetryCard,
						componentProps: {
							details: [
								"Алсын архивын сан хэт удаан хариуллаа.",
								"Manifest шалгалт бүрэн дуусаагүй байна.",
							],
							hint: "Сүүлд баталгаажсан хэсгээс үргэлжлүүлэхийн тулд дахин оролдоно уу.",
							onRetry: showRejectingPromise,
							secondaryLabel: "Мэдэгдлийг цэвэрлэх",
							title: "Архивын урсгал тасалдлаа",
						},
					}),
				},
			).catch(() => undefined);
			log("`babi.promise(...)` алдааны morph урсгал ажиллалаа.");
		}

		function showPromiseAction() {
			babi.promise(
				new Promise((resolve) => {
					setTimeout(() => resolve({ changes: 7 }), 1300);
				}),
				{
					loading: {
						fill: "#000000",
						title: "Review багц бэлдэж байна",
						component: ProgressCard,
						componentProps: {
							caption: "Review packet-ийг эмхэтгэж байна",
							label: "Сэтгэгдлүүдийг цуглуулж байна",
							milestones: [
								"Шийдэгдээгүй feedback-ийг нэгтгэж байна",
								"Өөрчлөлтүүдийг эзэмшигчээр нь бүлэглэж байна",
								"Approval packet үүсгэж байна",
							],
							stats: [
								{ label: "Thread", value: "12" },
								{ label: "Mention", value: "5" },
								{ label: "Үлдсэн", value: "9с" },
							],
							value: 34,
						},
					},
					success: {
						fill: "#000000",
						title: "Review бэлэн боллоо",
					},
					error: (err) => ({
						fill: "#000000",
						title: "Review бэлдэхэд алдаа гарлаа",
						description: String(err),
					}),
					action: ({ changes }) => ({
						fill: "#000000",
						title: "Review бэлдэгдлээ",
						description: `${changes} сэтгэгдэл баталгаажуулалт хүлээж байна.`,
						component: SummaryCard,
						componentProps: {
							headline: "Баталгаажуулах багц бэлэн боллоо",
							items: [
								{ label: "Сэтгэгдэл", value: String(changes) },
								{ label: "Эзэмшигч", value: "4" },
								{ label: "Түвшин", value: "Өндөр" },
							],
							ctaLabel: "Шалгагчдыг харах",
							onAction: () => {
								log("Action summary card-аас шалгагчдын preview-г нээлээ.");
								babi.info({
									fill: "#000000",
									title: "Шалгагчдын preview",
									description: "Alex, Naraa, Saran, Tuvshin нарт оноогдсон байна.",
								});
							},
							tone: "accent",
						},
						button: {
							title: "Review нээх",
							onClick: () => {
								log("Promise action-state товчийг дарлаа.");
								babi.info({
									fill: "#000000",
									title: "Review нээгдлээ",
									description: "Action-state promise урсгал амжилттай дууслаа.",
								});
							},
						},
					}),
				},
			);
			log("`action` төгсгөлийн төлөвтэй promise урсгал ажиллалаа.");
		}

		function showStacking() {
			for (let i = 0; i < 3; i++) {
				const n = nextCount();
				babi.success({
					fill: "#000000",
					title: `Дараалалд орсон зүйл ${n}`,
					description: "Нэргүй toast-ууд өмнөхөө солихгүйгээр давхарлан харагдах ёстой.",
				});
			}
			log("Stacking шалгахын тулд гурван нэргүй toast ажиллууллаа.");
		}

		function showPositionToast(position) {
			babi.info({
				fill: "#000000",
				title: position,
				description: `Toast ${position} байрлалд гарч ирнэ.`,
				position,
			});
			log(`${position} байрлалтай toast ажиллалаа.`);
		}

		function clearAll() {
			babi.clear();
			log("Бүх toast-ыг `babi.clear()`-ээр цэвэрлэлээ.");
			lastLoadingId.value = null;
		}

		function clearTopRight() {
			babi.clear("top-right");
			log("Зөвхөн top-right toast-уудыг `babi.clear(\"top-right\")`-ээр цэвэрлэлээ.");
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
					h("h1", { class: "demo-title" }, "Нэг хуудсаас бүх API урсгалыг шалга."),
					h(
						"p",
						{ class: "demo-copy" },
						"Доорх хэсгүүд helper state, ерөнхий show болон dismiss урсгал, custom body, promise morph, stacking, байрлал, clear үйлдлүүдийг бүгдийг нь хамарна.",
					),
					renderSection("State Helper-ууд", "Helper бүр зөв badge болон icon төлөвтэй гарч ирэх ёстой.", [
						actionButton("Success", "`babi.success(...)`-ийг шалгана.", showSuccess),
						actionButton("Error", "`babi.error(...)`-ийг шалгана.", showError),
						actionButton("Warning", "`babi.warning(...)`-ийг шалгана.", showWarning),
						actionButton("Info", "`babi.info(...)`-ийг шалгана.", showInfo),
						actionButton("Action", "Товчтой `babi.action(...)`-ийг шалгана.", showAction),
					]),
					renderSection("Үндсэн удирдлага", "Ерөнхий `show`, гар аргаар dismiss хийх, style override болон autopilot-ыг хамарна.", [
						actionButton("Loading харуулах", "`state: \"loading\"`-той `babi.show(...)` ашиглана.", showGenericLoading),
						actionButton("Сүүлийн loading-ийг хаах", "`babi.show(...)`-оос буцсан id-г ашиглана.", dismissLastLoading),
						actionButton("Styled toast", "Custom fill, roundness, icon болон class-уудыг шалгана.", showCustomStyles),
						actionButton("Autopilot off", "Body content автоматаар choreograph хийхгүй.", showAutopilotOff),
					]),
					renderSection("Custom Body-ууд", "Шинэ component body урсгал болон бүх promise төгсгөлийн төлвүүдийг шалгана.", [
						actionButton("Custom component", "Component body-той expandable loading toast.", showComponentToast),
						actionButton("Аудио upload → player", "Upload metadata-аас custom audio player руу morph хийнэ.", showAudioUploadDemo),
						actionButton("Promise success", "Нэг toast loading-оос success руу morph хийнэ.", showPromiseMorph),
						actionButton("Promise error", "Алдаатай promise retry UI-г render хийнэ.", showRejectingPromise),
						actionButton("Promise action", "Амжилттай promise `action` төлөвт дуусна.", showPromiseAction),
						actionButton("Нэргүй toast stack", "Default id-ууд давтагдахгүй эсэхийг шалгана.", showStacking),
					]),
					renderSection("Pixel-grid preset-үүд", "Original 3-pixel-grid preset бүрийг promise loading badge дээр шалгана.", [
						...PIXEL_GRID_PRESETS.map((preset) =>
							actionButton(preset, `${preset} preset-ийг loading badge дээр харуулна.`, () => showPixelGridPromiseLoader(preset)),
						),
					], "wide"),
					renderSection("Байрлал ба цэвэрлэх үйлдэл", "Position routing болон store clearing helper-уудыг шалгана.", [
						...POSITIONS.map((position) =>
							actionButton(position, `${position} байрлалд toast илгээнэ.`, () => showPositionToast(position)),
						),
						actionButton("Top-right цэвэрлэх", "`babi.clear(\"top-right\")` ашиглана.", clearTopRight),
						actionButton("Бүгдийг цэвэрлэх", "`babi.clear()` ашиглана.", clearAll),
					], "wide"),
					h("div", { class: "demo-note" }, [
						h("strong", "Гараар шалгах зүйлс"),
						h(
							"p",
							"Аль нэг toast дээр hover хийхэд dismiss түр зогсоно. Promise demo-ууд нэг toast instance-ийг дахин ашиглаад, shell content-оо тухайн байрандаа morph хийх ёстой. Position товчнууд хүссэн өнцөг эсвэл төвийн эгнээнд render хийх ёстой.",
						),
					]),
					h("div", { class: "demo-log" }, [
						h("strong", "Сүүлийн үйлдэл"),
						h("p", eventLog.value),
						h(
							"p",
							lastLoadingId.value
								? `Хянаж буй loading id: ${lastLoadingId.value}`
								: "Хянаж буй loading id: алга",
						),
					]),
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
