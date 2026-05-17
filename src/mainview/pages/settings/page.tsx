import { useEffect, useRef } from "react";
import { LoraConfig } from "#components/LoraConfig";
import { GlobalSettings } from "./components/GlobalSettings";
import { SdCliSection } from "./components/SdCliSection";
import { ModelPresetsSection } from "./components/ModelPresetsSection";
import { pickFile } from "#lib/sd/client";
import { useSdConfigAutoSaveState, useSdConfigHeaderState, useSdCliPathState, useSdPresetPathState } from "#store/sdConfigStore";
import { useGenerationBusy } from "#store/generateStore";

function useAutoSave() {
    const { hasHydrated, isDirty, revision, saveSettings } = useSdConfigAutoSaveState();
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (!hasHydrated || !isDirty) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => void saveSettings(), 800);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [revision, hasHydrated]);
}

export function SettingsPage() {
    useAutoSave();

    const { isLoading, hasHydrated } = useSdConfigHeaderState();
    const isGenerating = useGenerationBusy();
    const disabled = isGenerating || isLoading || !hasHydrated;
    const { sdCliPath, setSdCliPath } = useSdCliPathState();
    const { presets } = useSdPresetPathState();

    return (
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 auto-rows-min">
            <SdCliSection
                value={sdCliPath}
                disabled={disabled}
                onChange={setSdCliPath}
                onBrowse={async () => { const p = await pickFile("Executable files (*.exe)|*.exe|All files (*.*)|*.*"); if (p) setSdCliPath(p); }}
            />

            <section className="space-y-3 rounded-lg border border-border/50 bg-card p-4">
                <div>
                    <h2 className="text-sm font-medium">Generation defaults</h2>
                    <p className="text-xs text-muted-foreground">Applied to all new generations</p>
                </div>
                <GlobalSettings />
            </section>

            <section className="rounded-lg border border-border/50 bg-card p-4 lg:col-span-2">
                <LoraConfig disabled={disabled} />
            </section>

            <div className="lg:col-span-2">
                <ModelPresetsSection presets={presets} disabled={disabled} />
            </div>
        </div>
    );
}
