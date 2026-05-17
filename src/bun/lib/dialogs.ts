import { Utils } from "electrobun/bun";
import { join } from "path";

export async function openFileDialog(filters?: string): Promise<string> {
    try {
        const parts = filters?.split("|") ?? [];
        const patterns: string[] = [];
        for (let i = 1; i < parts.length; i += 2) {
            for (const e of parts[i].split(";")) {
                const t = e.trim();
                if (t && t !== "*.*" && t !== "*") patterns.push(t);
            }
        }
        // pass the raw patterns (e.g. "*.gguf;*.safetensors") — Electrobun/CEF
        // constructs the native dialog filter from these on each platform
        const allowedFileTypes = patterns.length > 0 ? patterns.join(";") : "*";
        const paths = await Utils.openFileDialog({
            canChooseFiles: true,
            canChooseDirectory: false,
            allowsMultipleSelection: false,
            allowedFileTypes,
        });
        return (Array.isArray(paths) ? paths[0] : paths) ?? "";
    } catch {
        return "";
    }
}

export async function openFolderDialog(): Promise<string> {
    try {
        const paths = await Utils.openFileDialog({
            canChooseFiles: false,
            canChooseDirectory: true,
            allowsMultipleSelection: false,
        });
        return (Array.isArray(paths) ? paths[0] : paths) ?? "";
    } catch {
        return "";
    }
}

export async function pickSavePath(defaultName: string): Promise<string> {
    try {
        const paths = await Utils.openFileDialog({
            canChooseFiles: false,
            canChooseDirectory: true,
            allowsMultipleSelection: false,
        });
        const dir = (Array.isArray(paths) ? paths[0] : paths) ?? "";
        return dir ? join(dir, defaultName) : "";
    } catch {
        return "";
    }
}
