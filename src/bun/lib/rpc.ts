import type { BrowserWindow } from "electrobun/bun";
import { openFileDialog, openFolderDialog, pickSavePath } from "./dialogs";
import { startDownload as startBgDownload, cancelDownload, extractArchive, writeBase64File } from "./download";
import { listImages, deleteImage as deleteWorkspaceImage, importImage } from "./workspace";
import { getSdSettings, writeSdUserConfig } from "./sd/settings";
import type { SdUserConfig } from "../../mainview/lib/sd/types";
import type { ImageRequest } from "../../mainview/lib/sd/types";
import { detectSystem } from "./system";
import generateImage, { getJobStatus, cancelGeneration } from "./sd/generate";
import {
    isCustomMaximized,
    toggleMaximize,
    startResize,
    updateResize,
    stopResize,
} from "./window";
import { getWebUiUrl } from "./http-server";

import type { UpdateStatusInfo } from "#shared/rpc.types";

export function createRpcHandlers(
    getMainWindow: () => BrowserWindow,
    updateHandlers?: {
        checkForUpdate: () => Promise<UpdateStatusInfo>;
        getUpdateStatus: () => Promise<UpdateStatusInfo>;
        applyUpdate: () => Promise<{ success: boolean }>;
    }
) {
    return {
        requests: {
            getSdSettings: async () => getSdSettings(),
            saveSdSettings: async ({ config }: { config: SdUserConfig }) => writeSdUserConfig(config),
            generateImage: async ({ request }: { request: ImageRequest }) => generateImage(request),
            getJobStatus: async ({ jobId }: { jobId: string }) => getJobStatus(jobId),
            openFileDialog: async ({ extensions }: { extensions?: string[] }) => ({
                filePath: await openFileDialog(extensions),
            }),
            openFolderDialog: async () => ({ folderPath: await openFolderDialog() }),
            detectSystem: async () => detectSystem(),
            startDownload: async ({ url, destPath }: { url: string; destPath: string }) => {
                const downloadId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const mw = getMainWindow();
                startBgDownload(url, destPath, downloadId, (info) => {
                    try {
                        const rpc = (mw.webview as any)?.rpc;
                        rpc?.send?.downloadProgress?.({ downloadId, info });
                    } catch {}
                });
                return { downloadId };
            },
            cancelDownload: async ({ downloadId }: { downloadId: string }) => ({
                success: cancelDownload(downloadId),
            }),
            extractArchive: async ({ zipPath, destDir }: { zipPath: string; destDir: string }) => {
                const error = await extractArchive(zipPath, destDir);
                return error ? { success: false, error } : { success: true };
            },
            pickSavePath: async ({ defaultName }: { defaultName: string }) => ({
                filePath: await pickSavePath(defaultName),
            }),
            writeBase64File: async ({ filePath, data }: { filePath: string; data: string }) => {
                const error = await writeBase64File(filePath, data);
                return error ? { success: false, error } : { success: true };
            },
            deleteImage: async ({ id }: { id: string }) => ({
                success: deleteWorkspaceImage(id),
            }),
            readImageFile: async ({ filePath }: { filePath: string }) => {
                const file = Bun.file(filePath);
                const buffer = await file.arrayBuffer();
                const base64 = Buffer.from(buffer).toString("base64");
                const ext = filePath.split(".").pop()?.toLowerCase() ?? "png";
                const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
                return { dataUrl: `data:${mime};base64,${base64}` };
            },
            listWorkingImages: async () => ({ images: await listImages() }),
            uploadImage: async ({ sourcePath }: { sourcePath: string }) => {
                const image = await importImage(sourcePath);
                if (!image) return { image: null };
                const { readImageDataUrl } = await import("./workspace");
                const dataUrl = await readImageDataUrl(image.fileName);
                return { image: { ...image, image: dataUrl ?? "" } };
            },
            isMaximized: async () => ({
                isMaximized:
                    process.platform === "win32"
                        ? isCustomMaximized
                        : getMainWindow().isMaximized(),
            }),
            getWebUiUrl: async () => ({ url: getWebUiUrl() }),
            cancelGeneration: async ({ jobId }: { jobId: string }) => ({
                success: cancelGeneration(jobId),
            }),
            checkForUpdate: async () =>
                updateHandlers?.checkForUpdate() ?? { status: "no-update" as const },
            getUpdateStatus: async () =>
                updateHandlers?.getUpdateStatus() ?? { status: "no-update" as const },
            applyUpdate: async () =>
                updateHandlers?.applyUpdate() ?? { success: false },
        },
        messages: {
            closeWindow: () => getMainWindow().close(),
            minimizeWindow: () => getMainWindow().minimize(),
            maximizeWindow: () => {
                if (process.platform === "win32") {
                    toggleMaximize();
                } else {
                    const mw = getMainWindow();
                    if (mw.isMaximized()) {
                        mw.unmaximize();
                    } else {
                        mw.maximize();
                    }
                }
            },
            startResize: ({ edge, mouseX, mouseY }: { edge: string; mouseX: number; mouseY: number }) =>
                startResize(edge, mouseX, mouseY),
            updateResize: ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) =>
                updateResize(mouseX, mouseY),
            stopResize: () => stopResize(),
        },
    };
}
