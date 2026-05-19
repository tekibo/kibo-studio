import { Button } from "@/components/ui/button";
import { useGenerateStore } from "@/store/generateStore";

const QUALITY_OPTIONS = [
    { scale: 0.5, label: "Draft" },
    { scale: 0.75, label: "Low" },
    { scale: 1, label: "Standard" },
    { scale: 1.5, label: "High" },
    { scale: 2, label: "Ultra" },
] as const;

export function ResolutionQuality() {
    const resolutionScale = useGenerateStore((s) => s.resolutionScale);
    const setResolutionScale = useGenerateStore((s) => s.setResolutionScale);

    return (
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
    );
}
