import { SelectField } from "#components/base/SelectField";
import { SwitchField } from "#components/base/SwitchField";
import { useSdRuntimeSettingsState, useSdDevModeState } from "#store/sdConfigStore";
import { useGenerationBusy } from "#store/generateStore";
import { sdCacheModeOptions, NO_CACHE_MODE } from "#lib/sd/options";
import { SAMPLING_METHOD_SELECT_OPTIONS, SCM_POLICY_SELECT_OPTIONS } from "#lib/sd/utils";
import type { SdPersistedCacheMode, SdSamplingMethod, SdScmPolicy } from "#lib/sd/types";
import { PerformanceSettings } from "./PerformanceSettings";

export function GlobalSettings() {
    const { samplingMethod, cacheMode, scmPolicy, isLoading, hasHydrated, setSamplingMethod, setCacheMode, setScmPolicy } = useSdRuntimeSettingsState();
    const { devMode, setDevMode } = useSdDevModeState();
    const isGenerating = useGenerationBusy();
    const disabled = isGenerating || isLoading || !hasHydrated;

    return (
        <div className="space-y-3">
            <PerformanceSettings />
            <div className="grid grid-cols-2 gap-3">
                <SelectField label="Sampler" value={samplingMethod} disabled={disabled} onValueChange={(v) => setSamplingMethod(v as SdSamplingMethod)} options={SAMPLING_METHOD_SELECT_OPTIONS} />
                <SelectField label="Cache" value={cacheMode} disabled={disabled} onValueChange={(v) => setCacheMode(v as SdPersistedCacheMode)} options={sdCacheModeOptions} />
                {cacheMode !== NO_CACHE_MODE && (
                    <SelectField label="SCM" value={scmPolicy} disabled={disabled} onValueChange={(v) => setScmPolicy(v as SdScmPolicy)} options={SCM_POLICY_SELECT_OPTIONS} />
                )}
                <SwitchField label="Dev Mode" checked={devMode} disabled={disabled} onCheckedChange={setDevMode} />
            </div>
        </div>
    );
}
