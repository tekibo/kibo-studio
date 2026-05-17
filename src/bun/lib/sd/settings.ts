import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { SD_USER_CONFIG_PATH } from "./config";
import { defaultSdUserConfig, NO_CACHE_MODE, sdModelFamilyLabels, sdSamplingMethodOptions } from "../../../mainview/lib/sd/options";
import { listSdPresets } from "./diffusion";
import { sdPresetRegistry, supportedSdPresetIds } from "../../../mainview/lib/sd/presets";
import type {
    ImageGenerationRequest,
    SdCacheMode,
    SdModelFamily,
    SdModelOption,
    SdModelPathKey,
    SdModelPaths,
    SdPresetId,
    SdSettingsResponse,
    SdUserConfig,
} from "../../../mainview/lib/sd/types";

const pathKeys = [
    "model",
    "diffusionModel",
    "highNoiseDiffusionModel",
    "vae",
    "llm",
    "llmVision",
    "clipL",
    "clipG",
    "clipVision",
    "t5xxl",
    "taesd",
] as const satisfies readonly SdModelPathKey[];

export async function readSdUserConfig(): Promise<SdUserConfig> {
    try {
        const content = await Bun.file(SD_USER_CONFIG_PATH).text();
        return normalizeSdUserConfig(JSON.parse(content));
    } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
            return { ...defaultSdUserConfig, pathsByPreset: {} };
        }

        throw error;
    }
}

export async function writeSdUserConfig(config: SdUserConfig): Promise<SdUserConfig> {
    const normalized = normalizeSdUserConfig(config);

    if (!existsSync(dirname(SD_USER_CONFIG_PATH))) {
        mkdirSync(dirname(SD_USER_CONFIG_PATH), { recursive: true });
    }
    await Bun.write(SD_USER_CONFIG_PATH, `${JSON.stringify(normalized, null, 2)}\n`);

    return normalized;
}

export async function getSdSettings(): Promise<SdSettingsResponse> {
    return {
        config: await readSdUserConfig(),
        models: getSdModelOptions(),
        presets: listSdPresets(),
    };
}

export async function applySdUserConfig(request: ImageGenerationRequest): Promise<ImageGenerationRequest> {
    const config = await readSdUserConfig();
    const presetId = request.presetId ?? config.selectedPresetId;
    const savedPaths = config.pathsByPreset[presetId] ?? {};
    const cacheMode = request.cacheMode ?? (config.cacheMode === NO_CACHE_MODE ? undefined : config.cacheMode as SdCacheMode);
    const loraModelDir = request.loraModelDir ?? config.loraModelDir;
    const scmPolicy = cacheMode ? request.scmPolicy ?? config.scmPolicy : undefined;

    return {
        ...request,
        presetId,
        vramProfile: request.vramProfile ?? config.vramProfile,
        samplingMethod: request.samplingMethod ?? config.samplingMethod,
        cacheMode,
        scmPolicy,
        loraApplyMode: request.loraApplyMode ?? config.loraApplyMode,
        loraModelDir: loraModelDir || undefined,
        paths: {
            ...savedPaths,
            ...request.paths,
        },
    };
}

function getSdModelOptions(): SdModelOption[] {
    const models = new Map<SdModelFamily, SdPresetId[]>();

    for (const preset of listSdPresets()) {
        models.set(preset.family, [...(models.get(preset.family) ?? []), preset.id]);
    }

    return [...models].map(([id, presetIds]) => ({
        id,
        label: sdModelFamilyLabels[id],
        presetIds,
    }));
}

function normalizeSdUserConfig(value: unknown): SdUserConfig {
    const input = isRecord(value) ? value : {};
    const selectedPresetId = isPresetId(input.selectedPresetId) ? input.selectedPresetId : defaultSdUserConfig.selectedPresetId;

    return {
        selectedPresetId,
        vramProfile: input.vramProfile === "balanced" || input.vramProfile === "high" ? input.vramProfile : "low",
        samplingMethod: sdSamplingMethodOptions.includes(input.samplingMethod as SdUserConfig["samplingMethod"])
            ? input.samplingMethod as SdUserConfig["samplingMethod"]
            : defaultSdUserConfig.samplingMethod,
        cacheMode: isCacheMode(input.cacheMode) ? input.cacheMode : defaultSdUserConfig.cacheMode,
        scmPolicy: input.scmPolicy === "static" ? "static" : "dynamic",
        loraApplyMode: input.loraApplyMode === "immediately" || input.loraApplyMode === "at_runtime" ? input.loraApplyMode : "auto",
        loraModelDir: typeof input.loraModelDir === "string" ? input.loraModelDir : "",
        sdCliPath: typeof input.sdCliPath === "string" ? input.sdCliPath : "",
        pathsByPreset: normalizePathsByPreset(input.pathsByPreset),
        devMode: typeof input.devMode === "boolean" ? input.devMode : defaultSdUserConfig.devMode,
    };
}

function normalizePathsByPreset(value: unknown): SdUserConfig["pathsByPreset"] {
    if (!isRecord(value)) {
        return {};
    }

    return Object.fromEntries(
        Object.entries(value)
            .filter((entry): entry is [SdPresetId, unknown] => isPresetId(entry[0]))
            .map(([presetId, paths]) => [presetId, normalizeModelPaths(paths)]),
    );
}

function normalizeModelPaths(value: unknown): Partial<SdModelPaths> {
    if (!isRecord(value)) {
        return {};
    }

    return Object.fromEntries(
        pathKeys
            .map((key) => [key, value[key]] as const)
            .filter((entry): entry is [SdModelPathKey, string] => typeof entry[1] === "string" && entry[1].trim().length > 0),
    );
}

function isPresetId(value: unknown): value is SdPresetId {
    return typeof value === "string" && supportedSdPresetIds.includes(value as SdPresetId) && Boolean(sdPresetRegistry[value as SdPresetId]);
}

function isCacheMode(value: unknown): value is SdUserConfig["cacheMode"] {
    return value === NO_CACHE_MODE || value === "easycache" || value === "ucache" || value === "dbcache" || value === "taylorseer" || value === "cache-dit" || value === "spectrum";
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
