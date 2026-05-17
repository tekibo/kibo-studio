import type { SdCacheMode, SdLoraApplyMode, SdSamplingMethod, SdScmPolicy } from "./cli";
import type { SdModelFamily, SdModelPaths, SdModelPreset, SdPresetId, SdVramProfile } from "./presets";

export type SdPersistedCacheMode = SdCacheMode | "none";

export type SdUserConfig = {
    selectedPresetId: SdPresetId;
    vramProfile: SdVramProfile;
    samplingMethod: SdSamplingMethod;
    cacheMode: SdPersistedCacheMode;
    scmPolicy: SdScmPolicy;
    loraApplyMode: SdLoraApplyMode;
    loraModelDir: string;
    sdCliPath: string;
    pathsByPreset: Partial<Record<SdPresetId, Partial<SdModelPaths>>>;
    devMode: boolean;
};

export type SdModelOption = {
    id: SdModelFamily;
    label: string;
    presetIds: SdPresetId[];
};

export type SdSettingsResponse = {
    config: SdUserConfig;
    models: SdModelOption[];
    presets: SdModelPreset[];
};

export type SdSaveSettingsResponse = {
    success: boolean;
    config?: SdUserConfig;
    error?: string;
};
