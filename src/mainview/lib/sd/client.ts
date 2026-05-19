import { getElectrobun } from "../electrobun";
import type { SdSettingsResponse, SdUserConfig } from "./types";
export type { ProgressCallback } from "../electrobun";

export async function fetchSdSettings(): Promise<SdSettingsResponse> {
    return await getElectrobun().rpc.request.getSdSettings({});
}

export async function saveSdSettings(config: SdUserConfig): Promise<SdUserConfig> {
    try {
        return await getElectrobun().rpc.request.saveSdSettings({ config });
    } catch (error) {
        throw new Error(`Failed to save settings: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

export async function pickFile(extensions?: string[]): Promise<string> {
    try {
        const { filePath } = await getElectrobun().rpc.request.openFileDialog({ extensions });
        return filePath;
    } catch {
        return "";
    }
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];

export function isImageFile(filePath: string): boolean {
    const ext = filePath.toLowerCase().slice(filePath.lastIndexOf("."));
    return IMAGE_EXTENSIONS.includes(ext);
}

export async function pickImageFile(): Promise<string> {
    return pickFile(["*"]);
}

export async function pickFolder(): Promise<string> {
    try {
        const { folderPath } = await getElectrobun().rpc.request.openFolderDialog({});
        return folderPath;
    } catch {
        return "";
    }
}

export async function detectSystem() {
    return await getElectrobun().rpc.request.detectSystem({});
}

export async function startDownload(url: string, destPath: string): Promise<string> {
    const { downloadId } = await getElectrobun().rpc.request.startDownload({ url, destPath });
    return downloadId;
}

export async function cancelDownload(downloadId: string): Promise<boolean> {
    const { success } = await getElectrobun().rpc.request.cancelDownload({ downloadId });
    return success;
}

export async function extractArchive(zipPath: string, destDir: string): Promise<string | null> {
    const { success, error } = await getElectrobun().rpc.request.extractArchive({ zipPath, destDir });
    return success ? null : (error ?? "Extraction failed");
}

export async function pickSavePath(defaultName: string): Promise<string> {
    try {
        const { filePath } = await getElectrobun().rpc.request.pickSavePath({ defaultName });
        return filePath;
    } catch {
        return "";
    }
}

export async function writeBase64File(filePath: string, data: string): Promise<string | null> {
    const { success, error } = await getElectrobun().rpc.request.writeBase64File({ filePath, data });
    return success ? null : (error ?? "Write failed");
}

export async function deleteImage(id: string): Promise<boolean> {
    try {
        const { success } = await getElectrobun().rpc.request.deleteImage({ id });
        return success;
    } catch {
        return false;
    }
}

export async function readImageFile(filePath: string): Promise<string> {
    const { dataUrl } = await getElectrobun().rpc.request.readImageFile({ filePath });
    return dataUrl;
}

export async function loadWorkingImages() {
    const { images } = await getElectrobun().rpc.request.listWorkingImages({});
    return images;
}

export async function uploadImageToWorkspace(sourcePath: string) {
    const { image } = await getElectrobun().rpc.request.uploadImage({ sourcePath });
    return image;
}
