import { useAppStore } from "#store/appStore";
import { useGenerateStore } from "#store/generateStore";
import { useSdConfigStore } from "#store/sdConfigStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { PromptComposer } from "./components/PromptComposer";
import { ImageGrid } from "./components/ImageGrid";

export function DashboardPage() {
    const setView = useAppStore((s) => s.setView);

    const generate = useGenerateStore((s) => s.generate);
    const cancelGeneration = useGenerateStore((s) => s.cancelGeneration);
    const isGenerating = useGenerateStore((s) => s.isGenerating);
    const prompt = useGenerateStore((s) => s.prompt);
    const imageError = useGenerateStore((s) => s.imageError)

    const sdSettingsLoaded = useSdConfigStore((s) => s.hasHydratedSettings);
    const sdSettingsLoading = useSdConfigStore((s) => s.isSettingsLoading);
    const presets = useSdConfigStore((s) => s.sdPresets);
    const selectedPresetId = useSdConfigStore((s) => s.selectedPresetId);
    const pathsByPreset = useSdConfigStore((s) => s.pathsByPreset);

    useEffect(() => {
        if (imageError) toast.error(imageError, { duration: 8000 });
    }, [imageError]);

    const handleGenerate = async () => {
        if (!prompt.trim() || isGenerating || !sdSettingsLoaded || sdSettingsLoading) return;
        const preset = presets.find((p) => p.id === selectedPresetId);
        if (!preset) { toast.error("No preset selected"); return; }
        const currentPaths = pathsByPreset[selectedPresetId] ?? {};
        const missing = preset.pathInputs.filter((i) => i.required && !currentPaths[i.key]?.trim());
        if (missing.length > 0) {
            toast.error("Model paths not configured", {
                description: `Set ${missing.map((m) => m.label).join(", ")} in Settings.`,
                action: { label: "Open Settings", onClick: () => setView("settings") },
                duration: 5000,
            });
            return;
        }
        await generate();
    };

    const handleStop = () => {
        cancelGeneration();
    };

    return (
        <>
            <ImageGrid />
            <PromptComposer onGenerate={handleGenerate} onStop={handleStop} />
        </>
    );
}
