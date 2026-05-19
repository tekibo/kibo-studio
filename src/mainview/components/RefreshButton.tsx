import { FolderOpen, RefreshCw } from "lucide-react";
import { useState, useCallback } from "react";
import { getElectrobun } from "@/lib/electrobun";
import { useGenerateStore } from "#store/generateStore";
import { Spinner } from "#components/ui/spinner";

export default function RefreshButton() {
    const [spinning, setSpinning] = useState(false);

    const handleRefresh = useCallback(async () => {
        if (spinning) return;
        setSpinning(true);
        await useGenerateStore.getState().loadWorkingImages();
        window.dispatchEvent(new CustomEvent("app-refresh"));
        setSpinning(false);
    }, [spinning]);

    const handleOpenFolder = useCallback(() => {
        getElectrobun().rpc.request.openWorkspaceFolder({});
    }, []);

    const btn = "flex size-8 items-center justify-center rounded-md hover:bg-accent hover:text-foreground text-muted-foreground cursor-pointer border-none";

    return (
        <>
            <button onClick={handleRefresh} className={btn} aria-label="Refresh workspace images">
                {spinning ? <Spinner className="size-3.5" /> : <RefreshCw className="size-3.5" />}
            </button>
            <button onClick={handleOpenFolder} className={btn} aria-label="Open workspace folder"
                title="Open workspace folder in Explorer"
            >
                <FolderOpen className="size-3.5" />
            </button>
        </>
    );
}
