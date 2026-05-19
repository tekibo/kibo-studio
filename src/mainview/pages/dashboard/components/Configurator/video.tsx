import { Minus, Plus } from "lucide-react";
import { useGenerateStore } from "@/store/generateStore";

export function FramesControl({ disabled }: { disabled: boolean }) {
    const videoFrames = useGenerateStore((s) => s.videoFrames);
    const setVideoFrames = useGenerateStore((s) => s.setVideoFrames);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Frames</span>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setVideoFrames(Math.max(1, videoFrames - 1))}
                    disabled={disabled || videoFrames <= 1}
                    className="flex size-7 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30"
                >
                    <Minus className="size-3" />
                </button>
                <div className="flex-1 text-center text-sm font-semibold tabular-nums text-foreground">
                    {videoFrames}
                </div>
                <button
                    onClick={() => setVideoFrames(Math.min(200, videoFrames + 1))}
                    disabled={disabled || videoFrames >= 200}
                    className="flex size-7 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30"
                >
                    <Plus className="size-3" />
                </button>
            </div>
        </div>
    );
}

export function FpsControl({ disabled }: { disabled: boolean }) {
    const fps = useGenerateStore((s) => s.fps);
    const setFps = useGenerateStore((s) => s.setFps);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">FPS</span>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setFps(Math.max(1, fps - 1))}
                    disabled={disabled || fps <= 1}
                    className="flex size-7 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30"
                >
                    <Minus className="size-3" />
                </button>
                <div className="flex-1 text-center text-sm font-semibold tabular-nums text-foreground">
                    {fps}
                </div>
                <button
                    onClick={() => setFps(Math.min(60, fps + 1))}
                    disabled={disabled || fps >= 60}
                    className="flex size-7 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30"
                >
                    <Plus className="size-3" />
                </button>
            </div>
        </div>
    );
}

export function VideoControls({ disabled }: { disabled: boolean }) {
    return (
        <div className="contents">
            <FramesControl disabled={disabled} />
            <FpsControl disabled={disabled} />
        </div>
    );
}
