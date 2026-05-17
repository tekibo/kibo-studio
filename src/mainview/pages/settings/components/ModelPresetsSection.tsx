import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#components/ui/accordion";
import { Button } from "#components/ui/button";
import { MissingBadge } from "./MissingBadge";
import { PresetPaths } from "./PresetPaths";
import { Download } from "lucide-react";
import type { SdModelPathKey, SdPresetId } from "#lib/sd/types";

type Preset = { id: SdPresetId; label: string; pathInputs: { key: SdModelPathKey; label: string; required?: boolean; placeholder?: string }[]; downloads: { url: string; label: string }[] };

type Props = {
    presets: Preset[];
    disabled: boolean;
};

export function ModelPresetsSection({ presets, disabled }: Props) {
    return (
        <section className="space-y-3 rounded-lg border border-border/50 bg-card p-4">
            <div>
                <h2 className="text-sm font-medium">Model presets</h2>
                <p className="text-xs text-muted-foreground">Configure model paths for each preset</p>
            </div>
            <Accordion >
                {presets.map((preset) => (
                    <AccordionItem key={preset.id} value={preset.id}>
                        <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <span>{preset.label}</span>
                                <MissingBadge presetId={preset.id} />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <PresetPaths preset={preset} disabled={disabled} />
                            {preset.downloads.length > 0 && (
                                <DownloadButtons preset={preset} />
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}

function DownloadButtons({ preset }: { preset: Preset }) {
    return (
        <div className="mt-3">
            <p className="text-[11px] font-medium text-muted-foreground">Download links</p>
            <div className="flex flex-wrap gap-1.5">
                {preset.downloads.map((dl) => (
                    <Button
                        key={dl.url}
                        variant="outline"
                        size="sm"
                        render={
                            <a href={dl.url} target="_blank" rel="noreferrer" />
                        }>
                        <Download className="size-3" />
                        {dl.label}
                    </Button>
                ))}
            </div>
        </div>
    )
}