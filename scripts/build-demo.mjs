import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "demo");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(join(outDir, "dist"), { recursive: true });
mkdirSync(join(outDir, "vendor"), { recursive: true });

for (const file of readdirSync(join(root, "dist"))) {
	if (file.endsWith(".mjs") || file === "styles.css") {
		cpSync(join(root, "dist", file), join(outDir, "dist", file));
	}
}

cpSync(
	join(root, "node_modules/vue/dist/vue.esm-browser.prod.js"),
	join(outDir, "vendor/vue.esm-browser.prod.js"),
);

cpSync(join(root, "examples/main.mjs"), join(outDir, "main.mjs"));

const html = readFileSync(join(root, "examples/index.html"), "utf8")
	.replace('"/dist/styles.css"', '"./dist/styles.css"')
	.replace(
		'"/node_modules/vue/dist/vue.esm-browser.js"',
		'"./vendor/vue.esm-browser.prod.js"',
	)
	.replace('"/dist/index.mjs"', '"./dist/index.mjs"')
	.replace('"/examples/main.mjs"', '"./main.mjs"');

writeFileSync(join(outDir, "index.html"), html);

// GitHub Pages: skip Jekyll processing so nothing gets filtered out.
writeFileSync(join(outDir, ".nojekyll"), "");

process.stdout.write(`Static demo written to ${outDir}\n`);
