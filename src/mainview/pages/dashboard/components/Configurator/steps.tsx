import { Minus, Plus } from "lucide-react";
import { useGenerateStore } from "@/store/generateStore";
import { useSdConfigStore } from "#store/sdConfigStore";

export function StepsControl({ disabled }: { disabled: boolean }) {
    const steps = useGenerateStore((s) => s.steps);
    const setSteps = useGenerateStore((s) => s.setSteps);
    const selectedPresetId = useSdConfigStore((s) => s.selectedPresetId);
    const sdPresets = useSdConfigStore((s) => s.sdPresets);

    const presetSteps = sdPresets.find((p) => p.id === selectedPresetId)?.defaults?.steps;
    const defaultHint = presetSteps ? ` (preset: ${presetSteps})` : "";

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Steps</span>
                <span className="text-[10px] text-muted-foreground/50">{defaultHint}</span>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setSteps(Math.max(1, steps - 1))}
                    disabled={disabled || steps <= 1}
                    className="flex size-7 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30"
                >
                    <Minus className="size-3" />
                </button>
                <div className="flex-1 text-center text-sm font-semibold tabular-nums text-foreground">
                    {steps}
                </div>
                <button
                    onClick={() => setSteps(Math.min(100, steps + 1))}
                    disabled={disabled || steps >= 100}
                    className="flex size-7 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30"
                >
                    <Plus className="size-3" />
                </button>
            </div>
        </div>
    );
}
