import { getElectrobun } from "../electrobun";
import type { SdSettingsResponse, SdUserConfig } from "./types";

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

export async function pickFile(filters?: string): Promise<string> {
    try {
        const { filePath } = await getElectrobun().rpc.request.openFileDialog({ filters });
        return filePath;
    } catch {
        return "";
    }
}

export async function pickImageFile(): Promise<string> {
    return pickFile("Image files (*.png;*.jpg;*.jpeg;*.webp;*.bmp)|*.png;*.jpg;*.jpeg;*.webp;*.bmp");
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

export async function downloadFile(url: string, destPath: string): Promise<string | null> {
    const { success, error } = await getElectrobun().rpc.request.downloadFile({ url, destPath });
    return success ? null : (error ?? "Download failed");
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
