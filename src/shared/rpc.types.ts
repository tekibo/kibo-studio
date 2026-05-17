import { ImageGenerationRequest, ImageResponse, SdSettingsResponse, SdUserConfig } from "@/lib/sd";
import type { RPCSchema } from "electrobun";

export type SystemInfo = {
    platform: "win" | "mac" | "linux";
    arch: string;
    hasCuda: boolean;
    cpuCores: number;
    totalMemGB: number;
};

export type WorkingImageEntry = {
    id: string;
    fileName: string;
    prompt?: string;
    width: number;
    height: number;
    createdAt: number;
    image: string;
    source: "generated" | "imported";
};

export type KiboStudioRPC = {
    bun: RPCSchema<{
        requests: {
            getSdSettings: { params: {}; response: SdSettingsResponse };
            saveSdSettings: { params: { config: SdUserConfig }; response: SdUserConfig };
            generateImage: { params: { request: ImageGenerationRequest }; response: ImageResponse };
            getJobStatus: { params: { jobId: string }; response: ImageResponse };
            openFileDialog: { params: { filters?: string }; response: { filePath: string } };
            openFolderDialog: { params: {}; response: { folderPath: string } };
            detectSystem: { params: {}; response: SystemInfo };
            downloadFile: { params: { url: string; destPath: string }; response: { success: boolean; error?: string } };
            extractArchive: { params: { zipPath: string; destDir: string }; response: { success: boolean; error?: string } };
            pickSavePath: { params: { defaultName: string }; response: { filePath: string } };
            writeBase64File: { params: { filePath: string; data: string }; response: { success: boolean; error?: string } };
            deleteImage: { params: { id: string }; response: { success: boolean } };
            readImageFile: { params: { filePath: string }; response: { dataUrl: string } };
            listWorkingImages: { params: {}; response: { images: WorkingImageEntry[] } };
            uploadImage: { params: { sourcePath: string }; response: { image: WorkingImageEntry | null } };
            isMaximized: { params: {}; response: { isMaximized: boolean } };
            getWebUiUrl: { params: {}; response: { url: string } };
            cancelGeneration: { params: { jobId: string }; response: { success: boolean } };
        };
        messages: {
            downloadProgress: { percent: number };
            closeWindow: {};
            minimizeWindow: {};
            maximizeWindow: {};
            startResize: { edge: string; mouseX: number; mouseY: number };
            updateResize: { mouseX: number; mouseY: number };
            stopResize: {};
        };
    }>;
    webview: RPCSchema<{
        requests: {};
        messages: {
            windowMaximizedState: { isMaximized: boolean };
        };
    }>;
};
