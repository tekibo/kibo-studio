import { Settings2, Minus, Plus } from "lucide-react";
import { ASPECT_RATIOS, useGenerateStore } from "@/store/generateStore";
import { useSdConfigStore } from "#store/sdConfigStore";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "#components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUALITY_OPTIONS = [
    { scale: 0.5, label: "Draft" },
    { scale: 0.75, label: "Low" },
    { scale: 1, label: "Standard" },
    { scale: 1.5, label: "High" },
    { scale: 2, label: "Ultra" },
] as const;

type Ratio = (typeof ASPECT_RATIOS)[number];

export default function AspectRatioSelect({
    ratios,
    selected,
    onSelect,
    disabled,
}: {
    ratios: typeof ASPECT_RATIOS;
    selected: Ratio;
    onSelect: (ratio: Ratio) => void;
    disabled: boolean;
}) {
    const resolutionScale = useGenerateStore((s) => s.resolutionScale);
    const setResolutionScale = useGenerateStore((s) => s.setResolutionScale);
    const steps = useGenerateStore((s) => s.steps);
    const setSteps = useGenerateStore((s) => s.setSteps);
    const selectedPresetId = useSdConfigStore((s) => s.selectedPresetId);
    const sdPresets = useSdConfigStore((s) => s.sdPresets);

    const presetSteps = sdPresets.find((p) => p.id === selectedPresetId)?.defaults?.steps;
    const defaultHint = presetSteps ? ` (preset: ${presetSteps})` : "";

    return (
        <Popover>
            <PopoverTrigger
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-9 gap-1.5 px-3"
                )}
            >
                <Settings2 className="size-3.5" />
                {selected.label}
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-64">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Aspect ratio</span>
                        <span className="text-xs text-muted-foreground/60">
                            {selected.width}x{selected.height}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                        {ratios.map((ratio) => (
                            <Button
                                key={ratio.label}
                                onClick={() => onSelect(ratio)}
                                disabled={disabled}
                                aria-pressed={selected.label === ratio.label}
                                variant={selected.label === ratio.label ? "default" : "outline"}
                                className="gap-2"
                            >
                                <div
                                    className="shrink-0 rounded-sm border border-current/30"
                                    style={{ width: 24, height: 24 * (ratio.height / ratio.width), maxHeight: 24 }}
                                />
                                <div className="flex flex-col items-start">
                                    <span className="font-medium leading-tight">{ratio.label}</span>
                                    <span className="text-[10px]">
                                        {ratio.width * resolutionScale}x{Math.round(ratio.height * resolutionScale)}
                                    </span>
                                </div>
                            </Button>
                        ))}
                    </div>

                    <hr className="border-border" />

                    <div className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground">Resolution quality</span>
                        <div className="flex gap-1">
                            {QUALITY_OPTIONS.map((opt) => (
                                <Button
                                    key={opt.scale}
                                    onClick={() => setResolutionScale(opt.scale)}
                                    variant={resolutionScale === opt.scale ? "default" : "outline"}
                                    size="sm"
                                    className="flex-1 text-[11px] h-7 px-1"
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                    </div>

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
                </div>
            </PopoverContent>
        </Popover>
    );
}
