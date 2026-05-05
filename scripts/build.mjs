import { spawn } from "node:child_process";
import { copyFile, rm } from "node:fs/promises";

const filterStderr = (chunk) => {
	const text = chunk.toString();
	const lines = text.split("\n");
	const filtered = [];
	let skip = 0;
	for (const line of lines) {
		if (skip > 0) {
			skip--;
			if (line.startsWith("⨯ ./styles.css")) continue;
			if (line.trim() === "") continue;
			filtered.push(line);
			continue;
		}
		if (line.includes("exports are defined in package.json but missing source files")) {
			skip = 2;
			continue;
		}
		if (line.includes("[plugin dts] Sourcemap is likely to be incorrect")) continue;
		filtered.push(line);
	}
	return filtered.join("\n");
};

await rm("dist", { recursive: true, force: true });

const bunchee = spawn("./node_modules/.bin/bunchee", [], { stdio: ["inherit", "inherit", "pipe"] });
bunchee.stderr.on("data", (chunk) => {
	const out = filterStderr(chunk);
	if (out) process.stderr.write(out);
});

const code = await new Promise((resolve) => bunchee.on("close", resolve));
if (code !== 0) process.exit(code);

await copyFile("src/styles.css", "dist/styles.css");
