import { BrowserView, BrowserWindow, Tray, Updater } from "electrobun/bun";
import { initWindow } from "./lib/window";
import { createRpcHandlers } from "./lib/rpc";
import { KiboStudioRPC } from "#shared/rpc.types";
import { startHttpServer } from "./lib/http-server";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

async function getMainViewUrl(): Promise<string> {
    const channel = await Updater.localInfo.channel();
    if (channel === "dev") {
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

let mainWindow: BrowserWindow;
const rpcHandlers = createRpcHandlers(() => mainWindow);

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

void tray;

// Start LAN web UI server
startHttpServer();

console.log("KiboStudio started!");
