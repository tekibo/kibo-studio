import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, unlinkSync } from "fs";
import { randomUUID } from "crypto";

const WORKSPACE_DIR = "workspace";
const MANIFEST_PATH = `${WORKSPACE_DIR}/manifest.json`;

export type ManifestEntry = {
    id: string;
    fileName: string;
    prompt?: string;
    width: number;
    height: number;
    createdAt: number;
    source: "generated" | "imported";
};

function ensureDir() {
    if (!existsSync(WORKSPACE_DIR)) {
        mkdirSync(WORKSPACE_DIR, { recursive: true });
    }
}

function readManifest(): ManifestEntry[] {
    try {
        ensureDir();
        if (!existsSync(MANIFEST_PATH)) return [];
        return JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")) as ManifestEntry[];
    } catch {
        return [];
    }
}

function writeManifest(entries: ManifestEntry[]) {
    ensureDir();
    writeFileSync(MANIFEST_PATH, JSON.stringify(entries, null, 2));
}

export function addManifestEntry(entry: ManifestEntry) {
    const entries = readManifest();
    entries.unshift(entry);
    writeManifest(entries.slice(0, 200));
}

export function removeManifestEntry(id: string) {
    writeManifest(readManifest().filter((e) => e.id !== id));
}

export function getImagePath(fileName: string): string {
    return `${WORKSPACE_DIR}/${fileName}`;
}

/**
 * Copy an external image file into the workspace, add to manifest, return the entry.
 */
export async function importImage(sourcePath: string): Promise<ManifestEntry | null> {
    ensureDir();
    const ext = sourcePath.split(".").pop()?.toLowerCase() ?? "png";
    const id = randomUUID();
    const fileName = `${id}.${ext}`;
    const destPath = `${WORKSPACE_DIR}/${fileName}`;

    try {
        copyFileSync(sourcePath, destPath);
    } catch {
        return null;
    }

    // Read back to get dimensions
    let width = 0;
    let height = 0;
    try {
        const img = Bun.file(destPath);
        const buffer = await img.arrayBuffer();
        // Parse PNG dimensions from header (IHDR chunk)
        const view = new DataView(buffer);
        if (ext === "png" && buffer.byteLength >= 24) {
            width = view.getUint32(16);
            height = view.getUint32(20);
        }
    } catch {}

    const entry: ManifestEntry = {
        id,
        fileName,
        width,
        height,
        createdAt: Date.now(),
        source: "imported",
    };
    addManifestEntry(entry);
    return entry;
}

/**
 * Register a newly generated image in the workspace.
 */
export function addGeneratedImage(
    id: string,
    prompt: string,
    width: number,
    height: number,
): ManifestEntry {
    const fileName = `${id}.png`;
    const entry: ManifestEntry = {
        id,
        fileName,
        prompt,
        width,
        height,
        createdAt: Date.now(),
        source: "generated",
    };
    addManifestEntry(entry);
    return entry;
}

/**
 * Read an image file from the workspace and return its base64 data URL.
 */
export async function readImageDataUrl(fileName: string): Promise<string | null> {
    const filePath = `${WORKSPACE_DIR}/${fileName}`;
    try {
        if (!existsSync(filePath)) return null;
        const file = Bun.file(filePath);
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const ext = fileName.split(".").pop()?.toLowerCase() ?? "png";
        const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
        return `data:${mime};base64,${base64}`;
    } catch {
        return null;
    }
}

/**
 * List all images in the workspace with base64 data URLs.
 */
export async function listImages(): Promise<(ManifestEntry & { image: string })[]> {
    const entries = readManifest();
    const results: (ManifestEntry & { image: string })[] = [];

    for (const entry of entries) {
        const dataUrl = await readImageDataUrl(entry.fileName);
        if (dataUrl) {
            results.push({ ...entry, image: dataUrl });
        }
    }

    return results;
}

/**
 * Delete an image from the workspace (manifest + file).
 */
export function deleteImage(id: string): boolean {
    const entries = readManifest();
    const entry = entries.find((e) => e.id === id);
    if (!entry) return false;

    removeManifestEntry(id);

    const filePath = `${WORKSPACE_DIR}/${entry.fileName}`;
    try {
        if (existsSync(filePath)) {
            unlinkSync(filePath);
        }
    } catch {}

    return true;
}
