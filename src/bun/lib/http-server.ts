import { networkInterfaces } from "os";
import { existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import type { ImageRequest } from "../../mainview/lib/sd/types";
import generateImage, { getJobStatus, cancelGeneration } from "./sd/generate";
import { getSdSettings, writeSdUserConfig } from "./sd/settings";
import type { SdUserConfig } from "../../mainview/lib/sd/types";
import { WORKSPACE_DIR, addManifestEntry, listImages, readImageDataUrl, deleteImage as deleteWorkspaceImage } from "./workspace";

const PORT = 3456;
const DIST_DIR = findDistDir();

function findDistDir(): string {
    const cwd = process.cwd();
    const candidates = [
        // dev mode: cwd = project root/bin
        join(cwd, "..", "dist"),
        join(cwd, "..", "views", "mainview"),
        // dev mode: cwd = build/dev-win-x64/kibo-studio-dev/bin
        join(cwd, "..", "..", "..", "..", "dist"),
        // built app: import.meta.dir = Resources/app/bun/
        join(import.meta.dir, "..", "views", "mainview"),
        join(import.meta.dir, "..", "..", "..", "..", "dist"),
    ];
    for (const dir of candidates) {
        const testPath = join(dir, "index.html");
        if (existsSync(testPath)) {
            return dir;
        }
    }
    console.error("[http-server] Could not find dist directory. Tried:", candidates);
    return join(cwd, "..", "dist");
}

function getLanIp(): string {
    const interfaces = networkInterfaces();
    for (const iface of Object.values(interfaces).flat()) {
        if (iface && !iface.internal && iface.family === "IPv4") {
            return iface.address;
        }
    }
    return "127.0.0.1";
}

export function getWebUiUrl(): string {
    return `http://${getLanIp()}:${PORT}`;
}

async function handleApiRoute(pathname: string, method: string, request: Request): Promise<Response> {
    const json = (data: unknown, status = 200) =>
        new Response(JSON.stringify(data), {
            status,
            headers: { "Content-Type": "application/json" },
        });

    // POST /api/generate
    if (pathname === "/api/generate" && method === "POST") {
        const body = (await request.json()) as ImageRequest;
        const result = await generateImage(body);
        return json(result);
    }

    // GET /api/generate/:jobId
    const genMatch = pathname.match(/^\/api\/generate\/(.+)$/);
    if (genMatch && method === "GET") {
        const result = getJobStatus(genMatch[1]);
        return json(result);
    }

    // POST /api/generate/:jobId/cancel
    const cancelMatch = pathname.match(/^\/api\/generate\/(.+)\/cancel$/);
    if (cancelMatch && method === "POST") {
        const success = cancelGeneration(cancelMatch[1]);
        return json({ success });
    }

    // POST /api/upload
    if (pathname === "/api/upload" && method === "POST") {
        const formData = await request.formData();
        const file = formData.get("image");
        if (!(file instanceof File)) {
            return json({ error: "No image file provided" }, 400);
        }

        const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
        const id = randomUUID();
        const fileName = `${id}.${ext}`;
        const destPath = join(WORKSPACE_DIR, fileName);
        const buffer = await file.arrayBuffer();
        await Bun.write(destPath, buffer);

        let width = 0;
        let height = 0;
        try {
            const view = new DataView(buffer);
            if (ext === "png" && buffer.byteLength >= 24) {
                width = view.getUint32(16);
                height = view.getUint32(20);
            }
        } catch {}

        const entry = { id, fileName, width, height, createdAt: Date.now(), source: "imported" as const };
        addManifestEntry(entry);

        const dataUrl = await readImageDataUrl(fileName);
        return json({ image: { ...entry, image: dataUrl ?? "" } });
    }

    // GET /api/images
    if (pathname === "/api/images" && method === "GET") {
        const images = await listImages();
        return json({ images });
    }

    // DELETE /api/images/:id
    const deleteMatch = pathname.match(/^\/api\/images\/(.+)$/);
    if (deleteMatch && method === "DELETE") {
        const success = deleteWorkspaceImage(deleteMatch[1]);
        return json({ success });
    }

    // GET /api/settings
    if (pathname === "/api/settings" && method === "GET") {
        const settings = await getSdSettings();
        return json(settings);
    }

    // POST /api/settings
    if (pathname === "/api/settings" && method === "POST") {
        const { config } = (await request.json()) as { config: SdUserConfig };
        const saved = await writeSdUserConfig(config);
        return json(saved);
    }

    return json({ error: "Not found" }, 404);
}

async function serveStatic(pathname: string): Promise<Response | null> {
    const filePath = join(DIST_DIR, pathname === "/" ? "index.html" : pathname);
    const file = Bun.file(filePath);
    if (await file.exists()) return new Response(file);
    const fallback = Bun.file(join(DIST_DIR, "index.html"));
    if (await fallback.exists()) return new Response(fallback);
    return null;
}

export async function startHttpServer(): Promise<string> {
    const lanUrl = getWebUiUrl();
    console.log(`Web UI available at ${lanUrl}`);

    Bun.serve({
        port: PORT,
        async fetch(request) {
            const url = new URL(request.url);
            const pathname = url.pathname;
            const method = request.method;

            const corsHeaders = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            };

            if (method === "OPTIONS") {
                return new Response(null, { headers: corsHeaders });
            }

            // API routes
            if (pathname.startsWith("/api/")) {
                const response = await handleApiRoute(pathname, method, request);
                for (const [key, value] of Object.entries(corsHeaders)) {
                    response.headers.set(key, value);
                }
                return response;
            }

            // Serve workspace images
            const wsMatch = pathname.match(/^\/workspace\/(.+)$/);
            if (wsMatch) {
                const filePath = join(WORKSPACE_DIR, wsMatch[1]);
                const file = Bun.file(filePath);
                if (await file.exists()) return new Response(file);
                return new Response("Not found", { status: 404 });
            }

            // Serve static dist files (SPA)
            const staticResponse = await serveStatic(pathname);
            if (staticResponse) return staticResponse;

            return new Response("Not found", { status: 404 });
        },
    });

    return lanUrl;
}
