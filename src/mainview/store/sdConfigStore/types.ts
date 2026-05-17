import type {
    ImageRequest,
    SdLoraApplyMode,
    SdModelFamily,
    SdModelOption,
    SdModelPathKey,
    SdModelPaths,
    SdModelPreset,
    SdPersistedCacheMode,
    SdPresetId,
    SdSamplingMethod,
    SdScmPolicy,
    SdSettingsResponse,
    SdVramProfile,
} from "@/lib/sd/types";

export type SdConfigState = {
    sdPresets: SdModelPreset[];
    sdModels: SdModelOption[];
    selectedModel: SdModelFamily | "";
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
    isSettingsLoading: boolean;
    isSettingsSaving: boolean;
    isSettingsDirty: boolean;
    hasHydratedSettings: boolean;
    settingsError: string;
    settingsRevision: number;
    loadSdSettings: () => Promise<void>;
    saveSdSettings: () => Promise<void>;
    hydrateSdSettings: (settings: SdSettingsResponse) => void;
    setSelectedModel: (model: SdModelFamily) => void;
    setSelectedPresetId: (presetId: SdPresetId) => void;
    setVramProfile: (profile: SdVramProfile) => void;
    setSamplingMethod: (method: SdSamplingMethod) => void;
    setCacheMode: (mode: SdPersistedCacheMode) => void;
    setScmPolicy: (policy: SdScmPolicy) => void;
    setLoraApplyMode: (mode: SdLoraApplyMode) => void;
    setLoraModelDir: (path: string) => void;
    setSdCliPath: (path: string) => void;
    setPresetPath: (presetId: SdPresetId, key: SdModelPathKey, value: string) => void;
    setDevMode: (devMode: boolean) => void;
    buildImageRequest: (input: {
        prompt: string;
        width: number;
        height: number;
        mask?: string;
        strength?: number;
        refImages?: string[];
        seed?: number;
        steps?: number;
    }) => ImageRequest;
};

export type SdConfigSnapshot = Pick<
    SdConfigState,
    | "selectedPresetId"
    | "vramProfile"
    | "samplingMethod"
    | "cacheMode"
    | "scmPolicy"
    | "loraApplyMode"
    | "loraModelDir"
    | "sdCliPath"
    | "pathsByPreset"
    | "devMode"
>;

export type { SdModelPathKey, SdModelPaths, SdPresetId };
