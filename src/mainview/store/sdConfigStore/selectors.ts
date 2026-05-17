import { useShallow } from "zustand/react/shallow";
import { useSdConfigStore } from "./store";

export function useSdConfigHeaderState() {
    return useSdConfigStore(useShallow((state) => ({
        isLoading: state.isSettingsLoading,
        isSaving: state.isSettingsSaving,
        isDirty: state.isSettingsDirty,
        hasHydrated: state.hasHydratedSettings,
        settingsError: state.settingsError,
        saveSettings: state.saveSdSettings,
    })));
}

export function useSdConfigAutoSaveState() {
    return useSdConfigStore(useShallow((state) => ({
        hasHydrated: state.hasHydratedSettings,
        isDirty: state.isSettingsDirty,
        revision: state.settingsRevision,
        saveSettings: state.saveSdSettings,
    })));
}

export function useSdConfigGateState() {
    return useSdConfigStore(useShallow((state) => ({
        hasHydrated: state.hasHydratedSettings,
        isLoading: state.isSettingsLoading,
    })));
}

export function useSdMissingPathState() {
    return useSdConfigStore(useShallow((state) => ({
        presets: state.sdPresets,
        selectedPresetId: state.selectedPresetId,
        pathsByPreset: state.pathsByPreset,
    })));
}

export function useSdModelSelectionState() {
    return useSdConfigStore(useShallow((state) => ({
        models: state.sdModels,
        presets: state.sdPresets,
        selectedModel: state.selectedModel,
        selectedPresetId: state.selectedPresetId,
        isLoading: state.isSettingsLoading,
        hasHydrated: state.hasHydratedSettings,
        setSelectedModel: state.setSelectedModel,
        setSelectedPresetId: state.setSelectedPresetId,
    })));
}

export function useSdRuntimeSettingsState() {
    return useSdConfigStore(useShallow((state) => ({
        vramProfile: state.vramProfile,
        samplingMethod: state.samplingMethod,
        cacheMode: state.cacheMode,
        scmPolicy: state.scmPolicy,
        isLoading: state.isSettingsLoading,
        hasHydrated: state.hasHydratedSettings,
        setVramProfile: state.setVramProfile,
        setSamplingMethod: state.setSamplingMethod,
        setCacheMode: state.setCacheMode,
        setScmPolicy: state.setScmPolicy,
    })));
}

export function useSdLoraState() {
    return useSdConfigStore(useShallow((state) => ({
        loraApplyMode: state.loraApplyMode,
        loraModelDir: state.loraModelDir,
        setLoraApplyMode: state.setLoraApplyMode,
        setLoraModelDir: state.setLoraModelDir,
    })));
}

export function useSdCliPathState() {
    return useSdConfigStore(useShallow((state) => ({
        sdCliPath: state.sdCliPath,
        isDirty: state.isSettingsDirty,
        setSdCliPath: state.setSdCliPath,
    })));
}

export function useSdDevModeState() {
    return useSdConfigStore(useShallow((state) => ({
        devMode: state.devMode,
        setDevMode: state.setDevMode,
    })));
}

export function useSdPresetPathState() {
    return useSdConfigStore(useShallow((state) => ({
        presets: state.sdPresets,
        selectedPresetId: state.selectedPresetId,
        pathsByPreset: state.pathsByPreset,
        isDirty: state.isSettingsDirty,
        setPresetPath: state.setPresetPath,
    })));
}
