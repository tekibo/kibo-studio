import { Settings2 } from "lucide-react";
import { useSdRuntimeSettingsState } from "#store/sdConfigStore";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "#components/ui/popover";
import { Checkbox } from "#components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SdPerfFlags, SdVramProfile } from "#lib/sd/types";

type PerfFlagDef = {
    key: keyof SdPerfFlags;
    label: string;
    description: string;
};

const PERF_FLAGS: PerfFlagDef[] = [
    { key: "offloadToCpu", label: "CPU Offload", description: "Place weights in RAM, load to VRAM when needed" },
    { key: "vaeOnCpu", label: "VAE on CPU", description: "Keep VAE on CPU to save VRAM" },
    { key: "clipOnCpu", label: "CLIP on CPU", description: "Keep CLIP on CPU to save VRAM" },
    { key: "diffusionFa", label: "Diffusion Flash Attention", description: "Flash attention in diffusion model only" },
    { key: "vaeTiling", label: "VAE Tiling", description: "Process VAE in tiles to reduce memory" },
    { key: "fa", label: "Flash Attention", description: "Flash attention (general)" },
    { key: "controlNetCpu", label: "ControlNet on CPU", description: "Keep ControlNet on CPU" },
    { key: "mmap", label: "Memory Map", description: "Memory-map model file" },
];

const VRAM_PRESETS: { value: SdVramProfile; label: string; flags: Partial<Record<keyof SdPerfFlags, boolean>> }[] = [
    { value: "low", label: "Low", flags: { offloadToCpu: true, vaeOnCpu: true, clipOnCpu: true, diffusionFa: true, vaeTiling: true } },
    { value: "balanced", label: "Balanced", flags: { offloadToCpu: true, diffusionFa: true } },
    { value: "high", label: "High", flags: { diffusionFa: true } },
];

function getEffectiveFlags(vramProfile: SdVramProfile, perfFlags: SdPerfFlags): SdPerfFlags {
    const preset = VRAM_PRESETS.find((p) => p.value === vramProfile);
    const base = { ...preset?.flags } as SdPerfFlags;

    for (const [key, value] of Object.entries(perfFlags)) {
        if (value !== undefined) {
            (base as any)[key] = value;
        }
    }

    return base;
}

function getActivePreset(perfFlags: SdPerfFlags): SdVramProfile | "custom" {
    for (const preset of VRAM_PRESETS) {
        const matches = Object.entries(preset.flags).every(
            ([key, value]) => perfFlags[key as keyof SdPerfFlags] === value
        );
        const noExtra = Object.entries(perfFlags).every(
            ([key, value]) => value === undefined || key in preset.flags
        );

        if (matches && noExtra) {
            return preset.value;
        }
    }

    return "custom";
}

function getPresetLabel(vramProfile: SdVramProfile, perfFlags: SdPerfFlags): string {
    const active = getActivePreset({ ...VRAM_PRESETS.find((p) => p.value === vramProfile)?.flags, ...perfFlags });
    return active === "custom" ? "Custom" : VRAM_PRESETS.find((p) => p.value === active)?.label ?? "Custom";
}

export function PerformanceSettings() {
    const { vramProfile, perfFlags, isLoading, hasHydrated, setVramProfile, setPerfFlag } = useSdRuntimeSettingsState();
    const disabled = isLoading || !hasHydrated;
    const effective = getEffectiveFlags(vramProfile, perfFlags);
    const active = getActivePreset(effective);

    const applyPreset = (profile: SdVramProfile) => {
        setVramProfile(profile);
        const preset = VRAM_PRESETS.find((p) => p.value === profile);

        if (preset) {
            for (const key of Object.keys(preset.flags)) {
                setPerfFlag(key as keyof SdPerfFlags, undefined);
            }
        }
    };

    const toggleFlag = (key: keyof SdPerfFlags, checked: boolean) => {
        setPerfFlag(key, checked);
    };

    return (
        <Popover>
            <PopoverTrigger
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-9 gap-1.5 px-3 w-full"
                )}
                disabled={disabled}
            >
                <Settings2 className="size-3.5" />
                {getPresetLabel(vramProfile, perfFlags)}
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="w-72">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">VRAM Profile</span>
                    </div>
                    <div className="flex gap-1">
                        {VRAM_PRESETS.map((preset) => (
                            <Button
                                key={preset.value}
                                onClick={() => applyPreset(preset.value)}
                                disabled={disabled}
                                variant={active === preset.value ? "default" : "outline"}
                                size="sm"
                                className="flex-1 text-[11px] h-7 px-1"
                            >
                                {preset.label}
                            </Button>
                        ))}
                    </div>

                    <hr className="border-border" />

                    <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground">Fine-tune</span>
                        <div className="space-y-1">
                            {PERF_FLAGS.map((flag) => (
                                <label
                                    key={flag.key}
                                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <Checkbox
                                        checked={effective[flag.key] ?? false}
                                        onCheckedChange={(checked) => toggleFlag(flag.key, checked)}
                                        disabled={disabled}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium leading-tight">{flag.label}</span>
                                        <span className="text-[10px] text-muted-foreground/70">{flag.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
