import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../site/", import.meta.url));
const port = Number.parseInt(process.env.PORT ?? "8780", 10);
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".otf", "font/otf"],
  [".png", "image/png"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
]);

function resolveRequest(url) {
  const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const requested = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const candidate = normalize(join(root, requested));
  const route = relative(root, candidate);
  if (route.startsWith("..") || route.includes(":")) {
    throw new RangeError("Request escaped the site root.");
  }
  return candidate;
}

createServer(async (request, response) => {
  try {
    const path = resolveRequest(request.url ?? "/");
    const info = await stat(path);
    if (!info.isFile()) throw new Error("Not a file.");
    response.writeHead(200, {
      "Content-Type": mimeTypes.get(extname(path).toLowerCase()) ?? "application/octet-stream",
      "Cache-Control": "no-cache",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Resource-Policy": "same-origin",
    });
    createReadStream(path).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found.\n");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`A.T.L.A.S. available at http://127.0.0.1:${port}/`);
});
