import { Slider } from "@/components/ui/slider";
import { useGenerateStore } from "@/store/generateStore";

export default function ReferenceStrength() {
    const strength = useGenerateStore((s) => s.strength);
    const setStrength = useGenerateStore((s) => s.setStrength);
    return (
        <div className="space-y-2">
            <header className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-muted-foreground">
                    Strength
                </label>

                <span className="text-xs tabular-nums text-muted-foreground/70">
                    {strength.toFixed(2)}
                </span>
            </header>

            <Slider
                value={[strength]}
                onValueChange={(value) => setStrength(Array.isArray(value) ? value[0] : value)}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
            />
        </div>
    )
}