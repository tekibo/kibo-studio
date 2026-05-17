import { Utils } from "electrobun/bun";
import { join } from "path";

export async function openFileDialog(extensions?: string[]): Promise<string> {
    try {
        const allowedFileTypes = extensions && extensions.length > 0 ? extensions.join(",") : "*";
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
