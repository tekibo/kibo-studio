import { SelectField } from "#components/base/SelectField";
import { SwitchField } from "#components/base/SwitchField";
import { useSdRuntimeSettingsState, useSdDevModeState } from "#store/sdConfigStore";
import { useGenerationBusy } from "#store/generateStore";
import { sdCacheModeOptions, sdVramProfileOptions, NO_CACHE_MODE } from "#lib/sd/options";
import { SAMPLING_METHOD_SELECT_OPTIONS, SCM_POLICY_SELECT_OPTIONS } from "#lib/sd/utils";
import type { SdPersistedCacheMode, SdSamplingMethod, SdScmPolicy, SdVramProfile } from "#lib/sd/types";

export function GlobalSettings() {
    const { vramProfile, samplingMethod, cacheMode, scmPolicy, isLoading, hasHydrated, setVramProfile, setSamplingMethod, setCacheMode, setScmPolicy } = useSdRuntimeSettingsState();
    const { devMode, setDevMode } = useSdDevModeState();
    const isGenerating = useGenerationBusy();
    const disabled = isGenerating || isLoading || !hasHydrated;

    return (
        <div className="grid grid-cols-2 gap-3">
            <SelectField label="VRAM" value={vramProfile} disabled={disabled} onValueChange={(v) => setVramProfile(v as SdVramProfile)} options={sdVramProfileOptions} />
            <SelectField label="Sampler" value={samplingMethod} disabled={disabled} onValueChange={(v) => setSamplingMethod(v as SdSamplingMethod)} options={SAMPLING_METHOD_SELECT_OPTIONS} />
            <SelectField label="Cache" value={cacheMode} disabled={disabled} onValueChange={(v) => setCacheMode(v as SdPersistedCacheMode)} options={sdCacheModeOptions} />
            {cacheMode !== NO_CACHE_MODE && (
                <SelectField label="SCM" value={scmPolicy} disabled={disabled} onValueChange={(v) => setScmPolicy(v as SdScmPolicy)} options={SCM_POLICY_SELECT_OPTIONS} />
            )}
            <SwitchField label="Dev Mode" checked={devMode} disabled={disabled} onCheckedChange={setDevMode} />
        </div>
    );
}
