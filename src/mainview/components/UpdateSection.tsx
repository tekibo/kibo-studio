import { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { getElectrobun, isWebUi } from "@/lib/electrobun";
import { cn } from "@/lib/utils";

const STATUS_MAP: Record<string, string> = {
    "no-update": "Up to date",
    "update-available": "Update available",
    "downloading": "Downloading...",
    "download-ready": "Update ready — restart to apply",
};

export function UpdateSection() {
    const [text, setText] = useState("");
    const [checking, setChecking] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (isWebUi()) return;
        const handler = (e: Event) => {
            const { status, version, error } = (e as CustomEvent).detail;
            const msg = STATUS_MAP[status];
            if (msg) setText(version ? `${msg} (v${version})` : msg);
            else if (status === "error") setText(error ?? "Check failed");
            else return;
            setChecking(false);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setText(""), 6000);
        };
        window.addEventListener("update-status", handler);
        return () => {
            window.removeEventListener("update-status", handler);
            clearTimeout(timerRef.current);
        };
    }, []);

    if (isWebUi()) return null;

    return (
        <div className="px-3 py-2 border-t border-sidebar-border/50">
            <button
                disabled={checking}
                onClick={async () => {
                    setChecking(true);
                    setText("Checking...");
                    try {
                        const res = await getElectrobun().rpc.request.checkForUpdate({});
                        const msg = STATUS_MAP[res.status];
                        if (msg) setText(res.version ? `${msg} (v${res.version})` : msg);
                        else if (res.status === "error") setText(res.error ?? "Check failed");
                    } catch {
                        setText("Check failed");
                    }
                    setChecking(false);
                    clearTimeout(timerRef.current);
                    timerRef.current = setTimeout(() => setText(""), 6000);
                }}
                className={cn(
                    "flex items-center gap-1.5 w-full text-xs rounded-lg px-2 py-1.5 transition-colors",
                    "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    checking && "opacity-60"
                )}
            >
                <RefreshCw className={cn("size-3.5 shrink-0", checking && "animate-spin")} />
                <span>Check for Updates</span>
            </button>
            {text && (
                <p className="text-[10px] text-sidebar-foreground/40 mt-0.5 px-2">
                    {text}
                </p>
            )}
        </div>
    );
}
