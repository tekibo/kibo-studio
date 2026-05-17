import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import { pickFile } from "#lib/sd/client";
import { useSdPresetPathState } from "#store/sdConfigStore";
import { EMPTY_PATHS } from "#lib/sd/utils";
import { FileIcon } from "lucide-react";
import type { SdModelPathKey, SdPresetId } from "#lib/sd/types";

type Preset = { id: SdPresetId; pathInputs: { key: SdModelPathKey; label: string; required?: boolean; placeholder?: string }[] };

export function PresetPaths({ preset, disabled }: { preset: Preset; disabled: boolean }) {
    const { pathsByPreset, setPresetPath } = useSdPresetPathState();
    const currentPaths = pathsByPreset[preset.id] ?? EMPTY_PATHS;

    return (
        <div className="space-y-2">
            {preset.pathInputs.map((input) => (
                <div key={input.key} className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">{input.label}{input.required ? " *" : ""}</Label>
                    <div className="flex gap-1.5">
                        <Input value={currentPaths[input.key] ?? ""} onChange={(e) => setPresetPath(preset.id, input.key, e.target.value)} disabled={disabled} placeholder={input.placeholder} className="h-8 flex-1 rounded-md text-xs" />
                        <Button variant="outline" size="icon-sm" disabled={disabled} onClick={async () => { const p = await pickFile("Model files (*.gguf;*.safetensors)|*.gguf;*.safetensors|All files (*.*)|*.*"); if (p) setPresetPath(preset.id, input.key, p); }} className="h-8 w-8 shrink-0 rounded-md">
                            <FileIcon className="size-3.5" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
