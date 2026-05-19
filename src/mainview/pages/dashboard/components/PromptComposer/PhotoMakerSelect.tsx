import { User } from "lucide-react";
import { useGenerateStore } from "#store/generateStore";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "#components/ui/popover";
import { Label } from "#components/ui/label";
import { Slider } from "#components/ui/slider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PhotoMakerSelect({ disabled }: { disabled: boolean }) {
    const pmStyleStrength = useGenerateStore((s) => s.pmStyleStrength);
    const setPmStyleStrength = useGenerateStore((s) => s.setPmStyleStrength);

    return (
        <Popover>
            <PopoverTrigger
                disabled={disabled}
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-9 gap-1.5 px-3"
                )}
            >
                <User className="size-3.5" />
                PhotoMaker
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-64">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Style strength</Label>
                        <span className="text-xs tabular-nums text-muted-foreground">
                            {pmStyleStrength}%
                        </span>
                    </div>
                    <Slider
                        value={[pmStyleStrength]}
                        onValueChange={(v) => setPmStyleStrength(Array.isArray(v) ? v[0] : v)}
                        min={0}
                        max={100}
                        step={1}
                        disabled={disabled}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
