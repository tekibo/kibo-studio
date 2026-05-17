import { buildSdCliArgs } from "../../../mainview/lib/sd/args";
import { DEFAULT_SD_CLI_PATH, DEFAULT_SD_PRESET_ID } from "./config";
import { readSdUserConfig } from "./settings";
import { appendLorasToPrompt, getLoraCliOptions } from "../../../mainview/lib/sd/lora";
import { getMissingPresetPathInputs } from "../../../mainview/lib/sd/path-fields";
import { sdPresetRegistry } from "../../../mainview/lib/sd/presets";
import type { ImageGenerationRequest, SdCliOptions, SdModelPreset, SdPresetId, SdVramProfile } from "../../../mainview/lib/sd/types";

export const sdVramPrefixes = {
    low: {
        offloadToCpu: true,
        vaeOnCpu: true,
        clipOnCpu: true,
        diffusionFa: true,
        vaeTiling: true,
    },
    balanced: {
        offloadToCpu: true,
        diffusionFa: true,
    },
    high: {
        diffusionFa: true,
    },
} as const satisfies Record<SdVramProfile, SdCliOptions>;

export function getSdPreset(presetId: SdPresetId = DEFAULT_SD_PRESET_ID) {
    const preset = sdPresetRegistry[presetId];

    if (!preset) {
        throw new Error(`Unsupported stable-diffusion.cpp preset: ${presetId}`);
    }

    return preset;
}

export function buildImageGenerationOptions(request: ImageGenerationRequest, output: string): SdCliOptions {
    const {
        prompt: rawPrompt,
        presetId,
        vramProfile: requestedVramProfile,
        paths,
        refImages: requestedRefImages,
        referenceImage,
        loras,
        loraModelDir,
        loraApplyMode,
        cacheOptions,
        cacheOption,
        cgfScale,
        cfgScale,
        ...cliOverrides
    } = request;
    const preset = getSdPreset(presetId);
    const vramProfile = requestedVramProfile ?? preset.defaultVramProfile;
    const loraOptions = getLoraCliOptions({
        applyMode: loraApplyMode,
        modelDir: loraModelDir,
        loras,
    });
    const prompt = appendLorasToPrompt(rawPrompt, loras);
    const refImages = [
        ...(requestedRefImages ?? []),
        ...(referenceImage ? [referenceImage] : []),
    ];

    const options = pruneUndefined<SdCliOptions>({
        mode: "img_gen",
        negativePrompt: "",
        verbose: true,
        color: true,
        ...preset.paths,
        ...preset.defaults,
        ...sdVramPrefixes[vramProfile],
        ...cliOverrides,
        ...paths,
        ...loraOptions,
        output,
        prompt,
        refImages,
        cfgScale: cfgScale ?? cgfScale ?? preset.defaults.cfgScale,
        cacheOption: cacheOption ?? cacheOptions,
    });

    assertRequiredModelPaths(preset, options);

    return options;
}

export async function buildImageGenerationCommand(request: ImageGenerationRequest, output: string) {
    const config = await readSdUserConfig();
    const cliPath = config.sdCliPath.trim() || DEFAULT_SD_CLI_PATH;
    return buildSdCliArgs(cliPath, buildImageGenerationOptions(request, output));
}

export function listSdPresets() {
    return Object.values(sdPresetRegistry) as SdModelPreset[];
}

function pruneUndefined<T extends object>(value: T) {
    return Object.fromEntries(Object.entries(value).filter((entry) => entry[1] !== undefined)) as T;
}

function assertRequiredModelPaths(preset: SdModelPreset, options: SdCliOptions) {
    const missing = getMissingPresetPathInputs(preset, options);

    if (missing.length > 0) {
        throw new Error(`Missing model path${missing.length === 1 ? "" : "s"}: ${missing.map((input) => input.label).join(", ")}`);
    }
}
