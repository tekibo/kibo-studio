import { useMemo } from "react";
import { useSdConfigStore } from "#store/sdConfigStore";
import type { SdPresetId } from "#lib/sd/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#components/ui/select";

export function PresetSelector() {
    const models = useSdConfigStore((s) => s.sdModels);
    const presets = useSdConfigStore((s) => s.sdPresets);
    const selectedModel = useSdConfigStore((s) => s.selectedModel);
    const selectedPresetId = useSdConfigStore((s) => s.selectedPresetId);
    const setSelectedPresetId = useSdConfigStore((s) => s.setSelectedPresetId);
    const selectedModelOption = models.find((m) => m.id === selectedModel);

    const presetOptions = useMemo(() => {
        if (!selectedModelOption) return [];
        return selectedModelOption.presetIds
            .map((id) => presets.find((p) => p.id === id))
            .filter(Boolean) as typeof presets;
    }, [presets, selectedModelOption]);

    if (!selectedModelOption || presetOptions.length <= 1) return null;

    return (
        <Select value={selectedPresetId} onValueChange={(v) => { if (v) setSelectedPresetId(v as SdPresetId); }}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" className="min-w-[160px]">
                {presetOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                        {p.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
