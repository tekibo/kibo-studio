import { BrowserWindow, Screen } from "electrobun/bun";
import { dlopen, FFIType, ptr } from "bun:ffi";

let mw: BrowserWindow;
let isCustomResizing = false;

// --- Maximize state ---
export let isCustomMaximized = false;
let previousFrame = { x: 200, y: 200, width: 1200, height: 800 };

// --- Resize state ---
export const resizeState: {
    active: boolean;
    edge: string;
    initialMouse: { x: number; y: number };
    initialFrame: { x: number; y: number; width: number; height: number };
} = { active: false, edge: "", initialMouse: { x: 0, y: 0 }, initialFrame: { x: 0, y: 0, width: 0, height: 0 } };

// --- Cached FFI handles ---
let setCornerRound: ((round: boolean) => void) | null = null;
let windowRectForClient: ((cw: number, ch: number) => { x: number; y: number; w: number; h: number }) | null = null;

const GWL_STYLE = -16;
const GWL_EXSTYLE = -20;
const SWP_FRAMECHANGED = 0x0020;
const SWP_NOZORDER = 0x0004;
const SWP_NOMOVE = 0x0002;
const SWP_NOSIZE = 0x0001;

function initDwmLib(): void {
    if (setCornerRound || process.platform !== "win32") return;
    try {
        const dwmapi = dlopen("dwmapi.dll", {
            DwmSetWindowAttribute: {
                args: [FFIType.ptr, FFIType.u32, FFIType.ptr, FFIType.u32],
                returns: FFIType.i32,
            },
        });
        const setAttr = dwmapi.symbols.DwmSetWindowAttribute;
        setCornerRound = (round: boolean) => {
            const hwnd = mw?.ptr;
            if (!hwnd) return;
            const pref = new Uint32Array([round ? 2 : 1]);
            setAttr(hwnd, 33, ptr(pref), 4);
        };
    } catch {}
}

function initUser32Lib(): void {
    if (windowRectForClient || process.platform !== "win32") return;
    try {
        const user32 = dlopen("user32.dll", {
            AdjustWindowRectEx: {
                args: [FFIType.ptr, FFIType.u32, FFIType.i32, FFIType.u32],
                returns: FFIType.i32,
            },
            GetWindowLongPtrW: {
                args: [FFIType.ptr, FFIType.i32],
                returns: FFIType.ptr,
            },
            SetWindowPos: {
                args: [FFIType.ptr, FFIType.ptr, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u32],
                returns: FFIType.i32,
            },
        });
        const adjustRect = user32.symbols.AdjustWindowRectEx;
        const getStyle = user32.symbols.GetWindowLongPtrW;
        const setWinPos = user32.symbols.SetWindowPos;

        windowRectForClient = (cw: number, ch: number) => {
            const hwnd = mw?.ptr;
            if (!hwnd) return { x: 0, y: 0, w: cw, h: ch };
            const style = Number(getStyle(hwnd, GWL_STYLE));
            const exStyle = Number(getStyle(hwnd, GWL_EXSTYLE));
            const rect = new Int32Array([0, 0, cw, ch]);
            adjustRect(ptr(rect), style, 0, exStyle);
            return {
                x: rect[0],
                y: rect[1],
                w: rect[2] - rect[0],
                h: rect[3] - rect[1],
            };
        };

        // Wrap setCornerRound to also call SetWindowPos with SWP_FRAMECHANGED
        // so DWM re-evaluates the corner preference immediately
        const origSetCornerRound = setCornerRound;
        if (origSetCornerRound) {
            setCornerRound = (round: boolean) => {
                origSetCornerRound(round);
                const hwnd = mw?.ptr;
                if (hwnd) {
                    setWinPos(hwnd, null, 0, 0, 0, 0,
                        SWP_FRAMECHANGED | SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER);
                }
            };
        }
    } catch {}
}

export function initWindow(mainWindow: BrowserWindow): void {
    mw = mainWindow;
    initDwmLib();
    initUser32Lib();
    setCornerRound?.(true);
    mw.on("resize", onResize);
}

function sendMaximizedState(val: boolean): void {
    (mw.webview.rpc as any)?.send.windowMaximizedState({ isMaximized: val });
}

function applyMaximize(): void {
    previousFrame = mw.getFrame();
    const wa = Screen.getPrimaryDisplay().workArea;
    isCustomMaximized = true;
    setCornerRound?.(false);

    if (windowRectForClient) {
        // Use AdjustWindowRectEx to compute the exact window rect needed
        // for the client area to match workArea
        const wr = windowRectForClient(wa.width, wa.height);
        mw.setFrame(wa.x + wr.x, wa.y + wr.y, wr.w, wr.h);
    } else {
        mw.setFrame(wa.x, wa.y, wa.width, wa.height);
    }
}

function applyRestore(): void {
    isCustomMaximized = false;
    setCornerRound?.(true);
    mw.setFrame(previousFrame.x, previousFrame.y, previousFrame.width, previousFrame.height);
}

export function toggleMaximize(): void {
    if (isCustomMaximized) {
        applyRestore();
    } else {
        applyMaximize();
    }
    sendMaximizedState(isCustomMaximized);
}

export function startResize(edge: string, mouseX: number, mouseY: number): void {
    if (process.platform !== "win32") return;
    resizeState.active = true;
    resizeState.edge = edge;
    resizeState.initialMouse = { x: mouseX, y: mouseY };
    resizeState.initialFrame = mw.getFrame();
    if (isCustomMaximized) {
        isCustomMaximized = false;
        setCornerRound?.(true);
        sendMaximizedState(false);
    }
}

export function updateResize(mouseX: number, mouseY: number): void {
    if (!resizeState.active) return;
    const { edge, initialMouse, initialFrame } = resizeState;
    const dx = mouseX - initialMouse.x;
    const dy = mouseY - initialMouse.y;
    let { x, y, width, height } = initialFrame;
    const MIN_W = 800;
    const MIN_H = 600;

    if (edge.includes("right")) {
        width = Math.max(MIN_W, initialFrame.width + dx);
    }
    if (edge.includes("left")) {
        const newW = Math.max(MIN_W, initialFrame.width - dx);
        x = initialFrame.x + initialFrame.width - newW;
        width = newW;
    }
    if (edge.includes("bottom")) {
        height = Math.max(MIN_H, initialFrame.height + dy);
    }
    if (edge.includes("top")) {
        const newH = Math.max(MIN_H, initialFrame.height - dy);
        y = initialFrame.y + initialFrame.height - newH;
        height = newH;
    }

    mw.setFrame(x, y, width, height);
}

export function stopResize(): void {
    resizeState.active = false;
}

function onResize(): void {
    if (process.platform === "win32" && !isCustomResizing) {
        isCustomResizing = true;
        try {
            if (mw.isMaximized() && !isCustomMaximized) {
                const wa = Screen.getPrimaryDisplay().workArea;
                isCustomMaximized = true;
                setCornerRound?.(false);

                if (windowRectForClient) {
                    const wr = windowRectForClient(wa.width, wa.height);
                    mw.setFrame(wa.x + wr.x, wa.y + wr.y, wr.w, wr.h);
                } else {
                    mw.setFrame(wa.x, wa.y, wa.width, wa.height);
                }
            }
        } finally {
            isCustomResizing = false;
        }
    }
    sendMaximizedState(
        process.platform === "win32" ? isCustomMaximized : mw.isMaximized(),
    );
}
