import { useState, useMemo } from "react";
import { Sparkles, Video, ImageIcon } from "lucide-react";
import { useSdConfigStore } from "#store/sdConfigStore";
import type { SdModelFamily } from "#lib/sd/types";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "#components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "#components/ui/tabs";
import { Separator } from "#components/ui/separator";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

type TabValue = "all" | "image" | "video";

const videoFamilies = new Set<SdModelFamily>(["wan", "ltx"]);

function getFamilyTab(family: SdModelFamily): "image" | "video" {
    return videoFamilies.has(family) ? "video" : "image";
}

const TAB_CONFIG: { value: TabValue; label: string; icon: typeof ImageIcon | null }[] = [
    { value: "all", label: "All", icon: null },
    { value: "image", label: "Image", icon: ImageIcon },
    { value: "video", label: "Video", icon: Video },
];

export function ModelSelector() {
    const models = useSdConfigStore((s) => s.sdModels);
    const presets = useSdConfigStore((s) => s.sdPresets);
    const selectedModel = useSdConfigStore((s) => s.selectedModel);
    const setSelectedModel = useSdConfigStore((s) => s.setSelectedModel);
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<TabValue>("all");

    const filteredModels = useMemo(() => {
        if (tab === "all") return models;
        return models.filter((m) => getFamilyTab(m.id) === tab);
    }, [models, tab]);

    const selectedLabel = models.find((m) => m.id === selectedModel)?.label ?? "Select model";

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 gap-1.5 px-2.5 text-xs"
                )}
            >
                <Sparkles className="size-3.5 text-primary shrink-0" />
                {selectedLabel}
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="w-72">
                <div className="space-y-3">
                    <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
                        <TabsList className="w-full">
                            {TAB_CONFIG.map((t) => (
                                <TabsTrigger key={t.value} value={t.value} className="flex-1">
                                    {t.icon && <t.icon className="size-3.5" />}
                                    {t.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    <Separator />
                    <ScrollArea className="max-h-65 overflow-y-auto">
                        {filteredModels.map((m) => {
                            const firstPreset = presets.find((p) => p.id === m.presetIds[0]);
                            const description = firstPreset?.description;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => {
                                        setSelectedModel(m.id);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left rounded-lg px-2.5 py-2 transition-colors hover:bg-accent",
                                        selectedModel === m.id && "bg-accent"
                                    )}
                                >
                                    <div className="text-sm font-medium">{m.label}</div>
                                    {description && (
                                        <div className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">
                                            {description}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                        {filteredModels.length === 0 && (
                            <div className="text-center text-xs text-muted-foreground py-6">
                                No models found
                            </div>
                        )}
                    </ScrollArea>

                </div>
            </PopoverContent>
        </Popover>
    );
}
