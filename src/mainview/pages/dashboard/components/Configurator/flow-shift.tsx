import { Minus, Plus } from "lucide-react";
import { useGenerateStore } from "@/store/generateStore";
import { useSdConfigStore } from "#store/sdConfigStore";

export function FlowShiftControl({ disabled }: { disabled: boolean }) {
    const flowShift = useGenerateStore((s) => s.flowShift);
    const setFlowShift = useGenerateStore((s) => s.setFlowShift);
    const selectedPresetId = useSdConfigStore((s) => s.selectedPresetId);
    const sdPresets = useSdConfigStore((s) => s.sdPresets);

    const presetFlowShift = sdPresets.find((p) => p.id === selectedPresetId)?.defaults?.flowShift;
    const hasDefault = presetFlowShift !== undefined;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Flow shift</span>
                {hasDefault && (
                    <span className="text-[10px] text-muted-foreground/50">preset: {presetFlowShift}</span>
                )}
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setFlowShift(Math.max(0, parseFloat((flowShift - 0.5).toFixed(1))))}
                    disabled={disabled || flowShift <= 0}
                    className="flex size-7 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30"
                >
                    <Minus className="size-3" />
                </button>
                <div className="flex-1 text-center text-sm font-semibold tabular-nums text-foreground">
                    {flowShift}
                </div>
                <button
                    onClick={() => setFlowShift(Math.min(10, parseFloat((flowShift + 0.5).toFixed(1))))}
                    disabled={disabled || flowShift >= 10}
                    className="flex size-7 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30"
                >
                    <Plus className="size-3" />
                </button>
            </div>
        </div>
    );
}
