import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const MIME = {
	".css": "text/css; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".map": "application/json; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".svg": "image/svg+xml",
};

function resolvePath(urlPath) {
	const pathname = urlPath === "/" ? "/examples/index.html" : urlPath;
	const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
	return join(root, safePath);
}

const server = createServer((req, res) => {
	const filePath = resolvePath(req.url || "/");

	if (!filePath.startsWith(root)) {
		res.writeHead(403);
		res.end("Forbidden");
		return;
	}

	if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
		res.writeHead(404);
		res.end("Not found");
		return;
	}

	const type = MIME[extname(filePath)] || "application/octet-stream";
	res.writeHead(200, { "Content-Type": type });
	createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
	process.stdout.write(`Demo server running at http://${host}:${port}\n`);
});
