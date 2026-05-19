import { fetchSdSettings, saveSdSettings as persistSdSettings } from "@/lib/sd/client";
import { defaultSdUserConfig, NO_CACHE_MODE } from "@/lib/sd/options";
import type { SdCacheMode, SdPerfFlags } from "@/lib/sd/types";
import { create } from "zustand";
import type { SdConfigState } from "./types";
import { applyUserConfigToState, markSettingsDirty, toSdUserConfig } from "./utils";

export const useSdConfigStore = create<SdConfigState>((set, get) => ({
    sdPresets: [],
    sdModels: [],
    selectedModel: "",
    selectedPresetId: defaultSdUserConfig.selectedPresetId,
    vramProfile: defaultSdUserConfig.vramProfile,
    samplingMethod: defaultSdUserConfig.samplingMethod,
    cacheMode: defaultSdUserConfig.cacheMode,
    perfFlags: {},
    devMode: defaultSdUserConfig.devMode,
    scmPolicy: defaultSdUserConfig.scmPolicy,
    loraApplyMode: defaultSdUserConfig.loraApplyMode,
    loraModelDir: defaultSdUserConfig.loraModelDir,
    sdCliPath: defaultSdUserConfig.sdCliPath,
    pathsByPreset: {},
    isSettingsLoading: false,
    isSettingsSaving: false,
    isSettingsDirty: false,
    hasHydratedSettings: false,
    settingsError: "",
    settingsRevision: 0,
    loadSdSettings: async () => {
        if (get().isSettingsLoading) {
            return;
        }

        set({ isSettingsLoading: true, settingsError: "" });

        try {
            get().hydrateSdSettings(await fetchSdSettings());
        } catch (error) {
            set({
                isSettingsLoading: false,
                hasHydratedSettings: true,
                settingsError: error instanceof Error ? error.message : "Failed to load settings",
            });
        }
    },
    saveSdSettings: async () => {
        const revision = get().settingsRevision;
        const config = toSdUserConfig(get());

        set({ isSettingsSaving: true, settingsError: "" });

        try {
            const savedConfig = await persistSdSettings(config);

            set((state) => state.settingsRevision === revision
                ? {
                    ...applyUserConfigToState(savedConfig, state.sdPresets, state.sdModels),
                    isSettingsSaving: false,
                    isSettingsDirty: false,
                    settingsError: "",
                }
                : {
                    isSettingsSaving: false,
                    isSettingsDirty: true,
                    settingsError: "",
                });
        } catch (error) {
            set({
                isSettingsSaving: false,
                settingsError: error instanceof Error ? error.message : "Failed to save settings",
            });
        }
    },
    hydrateSdSettings: (settings) => {
        set((state) => ({
            ...applyUserConfigToState(settings.config, settings.presets, settings.models),
            sdPresets: settings.presets,
            sdModels: settings.models,
            isSettingsLoading: false,
            isSettingsSaving: false,
            isSettingsDirty: false,
            hasHydratedSettings: true,
            settingsError: "",
            settingsRevision: state.settingsRevision,
        }));
    },
    setSelectedModel: (selectedModel) => set((state) => {
        const nextPresetId = state.sdModels.find((model) => model.id === selectedModel)?.presetIds[0] ?? state.selectedPresetId;

        return markSettingsDirty({ selectedModel, selectedPresetId: nextPresetId }, state.settingsRevision);
    }),
    setSelectedPresetId: (selectedPresetId) => set((state) => markSettingsDirty({
        selectedPresetId,
        selectedModel: state.sdPresets.find((preset) => preset.id === selectedPresetId)?.family ?? state.selectedModel,
    }, state.settingsRevision)),
    setVramProfile: (vramProfile) => set((state) => markSettingsDirty({ vramProfile }, state.settingsRevision)),
    setSamplingMethod: (samplingMethod) => set((state) => markSettingsDirty({ samplingMethod }, state.settingsRevision)),
    setCacheMode: (cacheMode) => set((state) => markSettingsDirty({ cacheMode }, state.settingsRevision)),
    setScmPolicy: (scmPolicy) => set((state) => markSettingsDirty({ scmPolicy }, state.settingsRevision)),
    setLoraApplyMode: (loraApplyMode) => set((state) => markSettingsDirty({ loraApplyMode }, state.settingsRevision)),
    setLoraModelDir: (loraModelDir) => set((state) => markSettingsDirty({ loraModelDir }, state.settingsRevision)),
    setSdCliPath: (sdCliPath) => set((state) => markSettingsDirty({ sdCliPath }, state.settingsRevision)),
    setDevMode: (devMode) => set((state) => markSettingsDirty({ devMode }, state.settingsRevision)),
    setPerfFlag: (key, value) => set((state) => markSettingsDirty({
        perfFlags: { ...state.perfFlags, [key]: value },
    }, state.settingsRevision)),
    setPresetPath: (presetId, key, value) => set((state) => {
        const presetPaths = { ...(state.pathsByPreset[presetId] ?? {}) };

        if (value.trim()) {
            presetPaths[key] = value;
        } else {
            delete presetPaths[key];
        }

        return markSettingsDirty({
            pathsByPreset: {
                ...state.pathsByPreset,
                [presetId]: presetPaths,
            },
        }, state.settingsRevision);
    }),
    buildImageRequest: ({ prompt, width, height, mask, strength, refImages, seed, steps, videoFrames, fps, flowShift, pmStyleStrength }) => {
        const state = get();
        const cacheMode = state.cacheMode === NO_CACHE_MODE ? undefined : state.cacheMode as SdCacheMode;

        const perfFlags = Object.fromEntries(
            Object.entries(state.perfFlags).filter(([, v]) => v !== undefined)
        ) as SdPerfFlags;

        return {
            prompt,
            width,
            height,
            presetId: state.selectedPresetId,
            vramProfile: state.vramProfile,
            ...perfFlags,
            samplingMethod: state.samplingMethod,
            cacheMode,
            scmPolicy: cacheMode ? state.scmPolicy : undefined,
            loraApplyMode: state.loraApplyMode,
            loraModelDir: state.loraModelDir.trim() || undefined,
            paths: state.pathsByPreset[state.selectedPresetId] ?? {},
            mask,
            strength,
            refImages,
            seed,
            steps,
            videoFrames,
            fps,
            flowShift,
            pmStyleStrength,
        };
    },
}));
