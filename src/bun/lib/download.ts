import { existsSync, mkdirSync, unlinkSync } from "fs";
import { dirname } from "path";

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
