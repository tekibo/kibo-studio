import { BrowserView, BrowserWindow, Tray, Updater } from "electrobun/bun";
import { initWindow } from "./lib/window";
import { createRpcHandlers } from "./lib/rpc";
import { KiboStudioRPC, UpdateStatusInfo } from "#shared/rpc.types";
import { startHttpServer } from "./lib/http-server";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

let updateInProgress = false;

async function getMainViewUrl(): Promise<string> {
    const localInfo = await Updater.getLocalInfo();
    if (localInfo.channel === "dev") {
        try {
            await fetch(DEV_SERVER_URL, { method: "HEAD" });
            console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);
            return DEV_SERVER_URL;
        } catch {
            console.log("Vite dev server not running. Run 'bun run dev:hmr' for HMR support.");
        }
    }
    return "views://mainview/index.html";
}

function sendUpdateStatus(status: UpdateStatusInfo) {
    if (mainWindow) {
        try {
            (mainWindow.webview.rpc as any).send.updateStatus(status);
        } catch {}
    }
}

async function checkAndDownloadUpdate() {
    if (updateInProgress) return;
    updateInProgress = true;

    try {
        sendUpdateStatus({ status: "checking" });

        const result = await Updater.checkForUpdate();
        if (result.updateAvailable) {
            sendUpdateStatus({
                status: "update-available",
                version: result.version,
            });

            await Updater.downloadUpdate();

            sendUpdateStatus({
                status: "download-ready",
                version: result.version,
            });
        } else if (result.error) {
            sendUpdateStatus({ status: "error", error: result.error });
        } else {
            sendUpdateStatus({ status: "no-update" });
        }
    } catch (err) {
        sendUpdateStatus({
            status: "error",
            error: err instanceof Error ? err.message : "Update check failed",
        });
    } finally {
        updateInProgress = false;
    }
}

let mainWindow: BrowserWindow;
const rpcHandlers = createRpcHandlers(() => mainWindow, {
    checkForUpdate: async () => {
        checkAndDownloadUpdate().catch(() => {});
        const info = Updater.updateInfo();
        if (info.updateReady) {
            return { status: "download-ready", version: info.version };
        }
        if (info.updateAvailable) {
            return { status: "update-available", version: info.version };
        }
        if (info.error) {
            return { status: "error", error: info.error };
        }
        return { status: "no-update" };
    },
    getUpdateStatus: async () => {
        const info = Updater.updateInfo();
        if (info.updateReady) {
            return { status: "download-ready", version: info.version };
        }
        if (info.updateAvailable) {
            return { status: "update-available", version: info.version };
        }
        if (info.error) {
            return { status: "error", error: info.error };
        }
        return { status: "no-update" };
    },
    applyUpdate: async () => {
        try {
            await Updater.applyUpdate();
            return { success: true };
        } catch {
            return { success: false };
        }
    },
});

const sdRpc = BrowserView.defineRPC<KiboStudioRPC>({
    maxRequestTime: 120000,
    handlers: rpcHandlers,
});

mainWindow = new BrowserWindow({
    title: "KiboStudio",
    url: await getMainViewUrl(),
    rpc: sdRpc,
    titleBarStyle: process.platform === "win32" ? "hidden" : "hiddenInset",
    frame: {
        width: 1200,
        height: 800,
        x: 200,
        y: 200,
    },
});

initWindow(mainWindow);

const tray = new Tray({
    title: "KiboStudio",
    image: "views://mainview/icon.png",
    template: true,
    width: 32,
    height: 32,
});

tray.setMenu([
    {
        type: "normal",
        label: "Check for Updates",
        action: "check-updates",
    },
    { type: "separator" },
    {
        type: "normal",
        label: "Quit",
        action: "quit",
    },
]);

tray.on("tray-clicked", (e) => {
    const { action } = (e as any).data as { id: number; action: string };
    if (action === "check-updates") {
        checkAndDownloadUpdate().catch(() => {});
    } else if (action === "quit") {
        process.exit(0);
    }
});

startHttpServer();

setTimeout(() => {
    checkAndDownloadUpdate().catch(() => {});
}, 5000);

console.log("KiboStudio started!");
