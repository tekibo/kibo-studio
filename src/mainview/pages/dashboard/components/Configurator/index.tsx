import { Settings2 } from "lucide-react";
import { useGenerateStore } from "@/store/generateStore";
import { useSdConfigStore } from "#store/sdConfigStore";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "#components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "#components/ui/separator";
import { cn } from "@/lib/utils";
import { AspectRatioGrid } from "./aspect-ratio";
import { ResolutionQuality } from "./resolution";
import { StepsControl } from "./steps";
import { FlowShiftControl } from "./flow-shift";
import { VideoControls } from "./video";

export default function Configurator() {
    const selectedRatio = useGenerateStore((s) => s.selectedRatio);
    const setSelectedRatio = useGenerateStore((s) => s.setSelectedRatio);
    const isGenerating = useGenerateStore((s) => s.isGenerating);
    const selectedPresetId = useSdConfigStore((s) => s.selectedPresetId);
    const sdPresets = useSdConfigStore((s) => s.sdPresets);

    const selectedPreset = sdPresets.find((p) => p.id === selectedPresetId);
    const isVideoModel = selectedPreset?.runMode === "vid_gen";

    return (
        <Popover>
            <PopoverTrigger
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-9 gap-1.5 px-3"
                )}
            >
                <Settings2 className="size-3.5" />
                {selectedRatio.label}
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-72">
                <div className="space-y-4">
                    <AspectRatioGrid
                        selected={selectedRatio}
                        onSelect={setSelectedRatio}
                        disabled={isGenerating}
                    />

                    <Separator />

                    <ResolutionQuality />

                    <Separator />

                    <div className="grid grid-cols-2 gap-3">
                        <StepsControl disabled={isGenerating} />
                        <FlowShiftControl disabled={isGenerating} />
                        {isVideoModel && <VideoControls disabled={isGenerating} />}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
