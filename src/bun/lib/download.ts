import { existsSync, mkdirSync, unlinkSync } from "fs";
import { dirname } from "path";
import type { DownloadProgressInfo } from "#shared/rpc.types";

type ActiveDownload = {
    state: DownloadProgressInfo;
    abort: () => void;
};

const activeDownloads = new Map<string, ActiveDownload>();

export function startDownload(
    url: string,
    destPath: string,
    downloadId: string,
    onProgress?: (info: DownloadProgressInfo) => void,
): void {
    const abortController = new AbortController();
    const state: DownloadProgressInfo = {
        percent: 0,
        bytesDownloaded: 0,
        totalBytes: 0,
        status: "downloading",
    };

    activeDownloads.set(downloadId, { state, abort: () => abortController.abort() });

    downloadInBackground(url, destPath, state, abortController.signal, onProgress).finally(() => {
        activeDownloads.delete(downloadId);
    });
}

async function downloadInBackground(
    url: string,
    destPath: string,
    state: DownloadProgressInfo,
    abortSignal: AbortSignal,
    onProgress?: (info: DownloadProgressInfo) => void,
): Promise<void> {
    try {
        if (!existsSync(dirname(destPath))) {
            mkdirSync(dirname(destPath), { recursive: true });
        }

        const response = await fetch(url, { signal: abortSignal });
        if (!response.ok) {
            state.status = "error";
            state.error = `Download failed: ${response.status} ${response.statusText}`;
            onProgress?.(state);
            return;
        }

        const totalBytes = parseInt(response.headers.get("content-length") ?? "0");
        state.totalBytes = totalBytes;

        const reader = response.body?.getReader();
        if (!reader) {
            state.status = "error";
            state.error = "No response body";
            onProgress?.(state);
            return;
        }

        const chunks: Uint8Array[] = [];
        let downloaded = 0;

        while (true) {
            if (abortSignal.aborted) {
                state.status = "cancelled";
                state.percent = 0;
                onProgress?.(state);
                return;
            }

            const { done, value } = await reader.read();
            if (done) break;

            downloaded += value.length;
            chunks.push(value);
            state.bytesDownloaded = downloaded;

            if (totalBytes > 0) {
                state.percent = Math.round((downloaded / totalBytes) * 100);
            }

            onProgress?.(state);
        }

        const fullBuffer = new Uint8Array(downloaded);
        let offset = 0;
        for (const chunk of chunks) {
            fullBuffer.set(chunk, offset);
            offset += chunk.length;
        }
        await Bun.write(destPath, fullBuffer);

        state.status = "completed";
        state.percent = 100;
        state.bytesDownloaded = downloaded;
        onProgress?.(state);
    } catch (error) {
        if (abortSignal.aborted) {
            state.status = "cancelled";
            state.percent = 0;
        } else {
            state.status = "error";
            state.error = error instanceof Error ? error.message : "Unknown download error";
        }
        onProgress?.(state);
    }
}

export function cancelDownload(downloadId: string): boolean {
    const entry = activeDownloads.get(downloadId);
    if (entry && entry.state.status === "downloading") {
        entry.abort();
        return true;
    }
    return false;
}

export function waitForDownload(downloadId: string): Promise<DownloadProgressInfo | null> {
    return new Promise((resolve) => {
        const entry = activeDownloads.get(downloadId);
        if (!entry) {
            resolve(null);
            return;
        }
        const check = () => {
            const e = activeDownloads.get(downloadId);
            if (!e || e.state.status !== "downloading") {
                resolve(e?.state ?? null);
                return;
            }
            setTimeout(check, 200);
        };
        check();
    });
}

export async function downloadFile(url: string, destPath: string): Promise<string | null> {
    try {
        if (!existsSync(dirname(destPath))) {
            mkdirSync(dirname(destPath), { recursive: true });
        }
        const response = await fetch(url);
        if (!response.ok) return `Download failed: ${response.status} ${response.statusText}`;

        const buffer = await response.arrayBuffer();
        await Bun.write(destPath, new Uint8Array(buffer));
        return null;
    } catch (error) {
        return error instanceof Error ? error.message : "Unknown download error";
    }
}

export async function extractArchive(zipPath: string, destDir: string): Promise<string | null> {
    try {
        if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
        }

        if (process.platform === "win32") {
            const script = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory('${zipPath.replace(/'/g, "''")}', '${destDir.replace(/'/g, "''")}')
`;
            const proc = Bun.spawnSync(["powershell", "-NoProfile", "-Command", script]);
            if (proc.exitCode !== 0) return "Extraction failed";
        } else {
            const proc = Bun.spawnSync(["unzip", "-o", zipPath, "-d", destDir]);
            if (proc.exitCode !== 0) return "Extraction failed";
        }

        return null;
    } catch (error) {
        return error instanceof Error ? error.message : "Unknown extraction error";
    }
}

export async function writeBase64File(filePath: string, base64: string): Promise<string | null> {
    try {
        if (!existsSync(dirname(filePath))) {
            mkdirSync(dirname(filePath), { recursive: true });
        }
        const bytes = new Uint8Array(Buffer.from(base64, "base64"));
        await Bun.write(filePath, bytes);
        return null;
    } catch (error) {
        return error instanceof Error ? error.message : "Unknown write error";
    }
}

export function deleteFile(filePath: string): boolean {
    try {
        if (existsSync(filePath)) {
            unlinkSync(filePath);
            return true;
        }
        return false;
    } catch {
        return false;
    }
}
