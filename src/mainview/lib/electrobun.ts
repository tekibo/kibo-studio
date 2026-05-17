import { Electroview } from "electrobun/view";
import type { KiboStudioRPC, DownloadProgressInfo } from "../../shared/rpc.types";
import type { SdSettingsResponse, SdUserConfig } from "./sd/types/settings";
import type { ImageResponse } from "./sd/types/generation";
import type { WorkingImageEntry } from "../../shared/rpc.types";

type BunRequests = KiboStudioRPC["bun"]["requests"];
type BunMessages = KiboStudioRPC["bun"]["messages"];

export type ProgressCallback = (info: DownloadProgressInfo & { downloadId: string }) => void;
let progressListeners: ProgressCallback[] = [];

export function onDownloadProgress(cb: ProgressCallback) {
    progressListeners.push(cb);
    return () => {
        progressListeners = progressListeners.filter((l) => l !== cb);
    };
}

function emitDownloadProgress(data: DownloadProgressInfo & { downloadId: string }) {
    for (const cb of progressListeners) {
        cb(data);
    }
}

type RequestMethods = {
    [K in keyof BunRequests]: (params: BunRequests[K]["params"]) => Promise<BunRequests[K]["response"]>;
};

type SendMethods = {
    [K in keyof BunMessages]: (params: BunMessages[K]) => void;
};

type AppRpc = { request: RequestMethods; send: SendMethods };
type AppInstance = { rpc: AppRpc };

let instance: AppInstance | null = null;

const noopSend: SendMethods = new Proxy({} as SendMethods, {
    get: () => () => {},
});

function createHttpRpc(): AppInstance {
    const json = (path: string, init?: RequestInit) =>
        fetch(path, {
            headers: { "Content-Type": "application/json" },
            ...init,
        }).then((r) => r.json());

    return {
        rpc: {
            send: noopSend,
            request: {
                getSdSettings: () => json("/api/settings") as Promise<SdSettingsResponse>,
                saveSdSettings: ({ config }) =>
                    json("/api/settings", { method: "POST", body: JSON.stringify({ config }) }) as Promise<SdUserConfig>,
                generateImage: ({ request }) =>
                    json("/api/generate", { method: "POST", body: JSON.stringify(request) }) as Promise<ImageResponse>,
                getJobStatus: ({ jobId }) =>
                    json(`/api/generate/${jobId}`) as Promise<ImageResponse>,
                cancelGeneration: ({ jobId }) =>
                    json(`/api/generate/${jobId}/cancel`, { method: "POST" }) as Promise<{ success: boolean }>,
                listWorkingImages: () =>
                    json("/api/images") as Promise<{ images: WorkingImageEntry[] }>,
                uploadImage: () => Promise.resolve({ image: null }),
                deleteImage: ({ id }) =>
                    json(`/api/images/${id}`, { method: "DELETE" }) as Promise<{ success: boolean }>,
                openFileDialog: () => Promise.resolve({ filePath: "" }),
                openFolderDialog: () => Promise.resolve({ folderPath: "" }),
                detectSystem: () =>
                    json("/api/system").catch(() => ({
                        os: "unknown",
                        arch: "unknown",
                        gpu: "unknown",
                        platform: "unknown" as const,
                        hasCuda: false,
                        cpuCores: 0,
                        totalMemGB: 0,
                    })),
                startDownload: () => Promise.resolve({ downloadId: "" }),
                cancelDownload: () => Promise.resolve({ success: false }),
                extractArchive: () => Promise.resolve({ success: false, error: "Not available" }),
                pickSavePath: () => Promise.resolve({ filePath: "" }),
                writeBase64File: () => Promise.resolve({ success: false, error: "Not available" }),
                readImageFile: () => Promise.resolve({ dataUrl: "" }),
                isMaximized: () => Promise.resolve({ isMaximized: false }),
                getWebUiUrl: () => Promise.resolve({ url: window.location.origin }),
            } as RequestMethods,
        },
    };
}

type WindowMaximizedCallback = (data: { isMaximized: boolean }) => void;
let onWindowMaximizedState: WindowMaximizedCallback | null = null;

export function setOnWindowMaximizedState(callback: WindowMaximizedCallback | null) {
    onWindowMaximizedState = callback;
}

export function initElectrobun() {
    if (instance) return instance;

    try {
        if (typeof window !== "undefined" && (window as any).__electrobunWebviewId) {
            const rpc = Electroview.defineRPC<KiboStudioRPC>({
                maxRequestTime: 120000,
                handlers: {
                    requests: {},
                    messages: {
                        windowMaximizedState: (data: { isMaximized: boolean }) => {
                            onWindowMaximizedState?.(data);
                        },
                        downloadProgress: (data: { downloadId: string; info: DownloadProgressInfo }) => {
                            emitDownloadProgress({ ...data.info, downloadId: data.downloadId });
                        },
                    },
                },
            });

            instance = new Electroview({ rpc }) as unknown as AppInstance;
            return instance;
        }
    } catch {}

    instance = createHttpRpc();
    return instance;
}

export function getElectrobun() {
    return instance ?? initElectrobun();
}

export function isWebUi(): boolean {
    return !(typeof window !== "undefined" && (window as any).__electrobunWebviewId);
}
