import { useAppStore } from "@/store/appStore";
import { useSdConfigStore } from "@/store/sdConfigStore";

export default function MissingModels() {

    const setView = useAppStore((s) => s.setView);
    const presets = useSdConfigStore((s) => s.sdPresets);
    const selectedPresetId = useSdConfigStore((s) => s.selectedPresetId);
    const pathsByPreset = useSdConfigStore((s) => s.pathsByPreset);
    const preset = presets.find((p) => p.id === selectedPresetId);
    const currentPaths = pathsByPreset[selectedPresetId] ?? {};
    const missing = preset ? preset.pathInputs.filter((i) => i.required && !currentPaths[i.key]?.trim()) : [];
    return (
        <>
            {missing.length > 0 && (
                <div onClick={() => setView("settings")} className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-destructive bg-destructive/10 cursor-pointer">
                    <span>⚠</span>
                    <span>{missing.length} path{missing.length > 1 ? "s" : ""} missing</span>
                </div>
            )}
        </>
    )
}