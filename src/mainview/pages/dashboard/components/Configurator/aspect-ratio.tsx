import { Button } from "@/components/ui/button";
import { useGenerateStore } from "@/store/generateStore";
import { ASPECT_RATIOS } from "@/store/generateStore";

type Ratio = (typeof ASPECT_RATIOS)[number];

export function AspectRatioGrid({
    selected,
    onSelect,
    disabled,
}: {
    selected: Ratio;
    onSelect: (ratio: Ratio) => void;
    disabled: boolean;
}) {
    const resolutionScale = useGenerateStore((s) => s.resolutionScale);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Aspect ratio</span>
                <span className="text-xs text-muted-foreground/60">
                    {selected.width}x{selected.height}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
                {ASPECT_RATIOS.map((ratio) => (
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
        </div>
    );
}
