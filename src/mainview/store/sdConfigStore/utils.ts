import type { SdModelFamily, SdModelOption, SdModelPreset, SdUserConfig } from "@/lib/sd/types";
import type { SdConfigSnapshot } from "./types";

export function toSdUserConfig(state: SdConfigSnapshot): SdUserConfig {
    return {
        selectedPresetId: state.selectedPresetId,
        vramProfile: state.vramProfile,
        samplingMethod: state.samplingMethod,
        cacheMode: state.cacheMode,
        scmPolicy: state.scmPolicy,
        loraApplyMode: state.loraApplyMode,
        loraModelDir: state.loraModelDir,
        sdCliPath: state.sdCliPath,
        pathsByPreset: state.pathsByPreset,
        perfFlags: state.perfFlags,
        devMode: state.devMode,
    };
}

export function applyUserConfigToState(config: SdUserConfig, presets: SdModelPreset[], models: SdModelOption[]) {
    const preset = presets.find((item) => item.id === config.selectedPresetId) ?? presets[0];

    return {
        selectedPresetId: preset?.id ?? config.selectedPresetId,
        selectedModel: (preset?.family ?? models[0]?.id ?? "") as SdModelFamily | "",
        vramProfile: config.vramProfile,
        samplingMethod: config.samplingMethod,
        cacheMode: config.cacheMode,
        scmPolicy: config.scmPolicy,
        loraApplyMode: config.loraApplyMode,
        loraModelDir: config.loraModelDir,
        sdCliPath: config.sdCliPath,
        pathsByPreset: config.pathsByPreset,
        perfFlags: config.perfFlags,
        devMode: config.devMode,
    };
}

export function markSettingsDirty<T extends object>(changes: T, revision: number) {
    return {
        ...changes,
        isSettingsDirty: true,
        settingsRevision: revision + 1,
    };
}
