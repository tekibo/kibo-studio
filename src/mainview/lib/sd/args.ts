import type { SdCacheOptions, SdCliOptions } from "./types";

type ValueOption = readonly [keyof SdCliOptions, string];
type FlagOption = readonly [keyof SdCliOptions, string];

const valueOptions = [
    ["output", "--output"],
    ["image", "--image"],
    ["metadataFormat", "--metadata-format"],
    ["previewPath", "--preview-path"],
    ["previewInterval", "--preview-interval"],
    ["outputBeginIdx", "--output-begin-idx"],
    ["mode", "--mode"],
    ["preview", "--preview"],
    ["model", "--model"],
    ["clipL", "--clip_l"],
    ["clipG", "--clip_g"],
    ["clipVision", "--clip_vision"],
    ["t5xxl", "--t5xxl"],
    ["llm", "--llm"],
    ["llmVision", "--llm_vision"],
    ["qwen2vl", "--qwen2vl"],
    ["qwen2vlVision", "--qwen2vl_vision"],
    ["diffusionModel", "--diffusion-model"],
    ["highNoiseDiffusionModel", "--high-noise-diffusion-model"],
    ["vae", "--vae"],
    ["taesd", "--taesd"],
    ["tae", "--tae"],
    ["controlNet", "--control-net"],
    ["embdDir", "--embd-dir"],
    ["loraModelDir", "--lora-model-dir"],
    ["hiresUpscalersDir", "--hires-upscalers-dir"],
    ["tensorTypeRules", "--tensor-type-rules"],
    ["photoMaker", "--photo-maker"],
    ["upscaleModel", "--upscale-model"],
    ["threads", "--threads"],
    ["chromaT5MaskPad", "--chroma-t5-mask-pad"],
    ["maxVram", "--max-vram"],
    ["type", "--type"],
    ["rng", "--rng"],
    ["samplerRng", "--sampler-rng"],
    ["prediction", "--prediction"],
    ["loraApplyMode", "--lora-apply-mode"],
    ["prompt", "--prompt"],
    ["negativePrompt", "--negative-prompt"],
    ["initImg", "--init-img"],
    ["endImg", "--end-img"],
    ["mask", "--mask"],
    ["controlImage", "--control-image"],
    ["controlVideo", "--control-video"],
    ["pmIdImagesDir", "--pm-id-images-dir"],
    ["pmIdEmbedPath", "--pm-id-embed-path"],
    ["hiresUpscaler", "--hires-upscaler"],
    ["height", "--height"],
    ["width", "--width"],
    ["steps", "--steps"],
    ["highNoiseSteps", "--high-noise-steps"],
    ["clipSkip", "--clip-skip"],
    ["batchCount", "--batch-count"],
    ["videoFrames", "--video-frames"],
    ["fps", "--fps"],
    ["timestepShift", "--timestep-shift"],
    ["upscaleRepeats", "--upscale-repeats"],
    ["upscaleTileSize", "--upscale-tile-size"],
    ["hiresWidth", "--hires-width"],
    ["hiresHeight", "--hires-height"],
    ["hiresSteps", "--hires-steps"],
    ["hiresUpscaleTileSize", "--hires-upscale-tile-size"],
    ["cfgScale", "--cfg-scale"],
    ["imgCfgScale", "--img-cfg-scale"],
    ["guidance", "--guidance"],
    ["slgScale", "--slg-scale"],
    ["skipLayerStart", "--skip-layer-start"],
    ["skipLayerEnd", "--skip-layer-end"],
    ["eta", "--eta"],
    ["flowShift", "--flow-shift"],
    ["highNoiseCfgScale", "--high-noise-cfg-scale"],
    ["highNoiseImgCfgScale", "--high-noise-img-cfg-scale"],
    ["highNoiseGuidance", "--high-noise-guidance"],
    ["highNoiseSlgScale", "--high-noise-slg-scale"],
    ["highNoiseSkipLayerStart", "--high-noise-skip-layer-start"],
    ["highNoiseSkipLayerEnd", "--high-noise-skip-layer-end"],
    ["highNoiseEta", "--high-noise-eta"],
    ["strength", "--strength"],
    ["pmStyleStrength", "--pm-style-strength"],
    ["controlStrength", "--control-strength"],
    ["moeBoundary", "--moe-boundary"],
    ["vaceStrength", "--vace-strength"],
    ["vaeTileOverlap", "--vae-tile-overlap"],
    ["hiresScale", "--hires-scale"],
    ["hiresDenoisingStrength", "--hires-denoising-strength"],
    ["seed", "--seed"],
    ["samplingMethod", "--sampling-method"],
    ["highNoiseSamplingMethod", "--high-noise-sampling-method"],
    ["scheduler", "--scheduler"],
    ["scmMask", "--scm-mask"],
    ["scmPolicy", "--scm-policy"],
    ["vaeTileSize", "--vae-tile-size"],
    ["vaeRelativeTileSize", "--vae-relative-tile-size"],
] as const satisfies readonly ValueOption[];

const flagOptions = [
    ["canny", "--canny"],
    ["convertName", "--convert-name"],
    ["verbose", "--verbose"],
    ["color", "--color"],
    ["taesdPreviewOnly", "--taesd-preview-only"],
    ["previewNoisy", "--preview-noisy"],
    ["metadataRaw", "--metadata-raw"],
    ["metadataBrief", "--metadata-brief"],
    ["metadataAll", "--metadata-all"],
    ["forceSdxlVaeConvScale", "--force-sdxl-vae-conv-scale"],
    ["offloadToCpu", "--offload-to-cpu"],
    ["mmap", "--mmap"],
    ["controlNetCpu", "--control-net-cpu"],
    ["clipOnCpu", "--clip-on-cpu"],
    ["vaeOnCpu", "--vae-on-cpu"],
    ["fa", "--fa"],
    ["diffusionFa", "--diffusion-fa"],
    ["diffusionConvDirect", "--diffusion-conv-direct"],
    ["vaeConvDirect", "--vae-conv-direct"],
    ["circular", "--circular"],
    ["circularx", "--circularx"],
    ["circulary", "--circulary"],
    ["chromaDisableDitMask", "--chroma-disable-dit-mask"],
    ["qwenImageZeroCondT", "--qwen-image-zero-cond-t"],
    ["chromaEnableT5Mask", "--chroma-enable-t5-mask"],
    ["increaseRefIndex", "--increase-ref-index"],
    ["disableAutoResizeRefImage", "--disable-auto-resize-ref-image"],
    ["disableImageMetadata", "--disable-image-metadata"],
    ["vaeTiling", "--vae-tiling"],
    ["hires", "--hires"],
] as const satisfies readonly FlagOption[];

export function formatCacheOptions(options: SdCacheOptions) {
    return Object.entries(options)
        .filter((entry): entry is [string, number] => entry[1] !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join(",");
}

export function buildSdCliArgs(cliPath: string, options: SdCliOptions) {
    const args = [cliPath];

    for (const [key, flag] of valueOptions) {
        pushValue(args, flag, options[key]);
    }

    for (const [key, flag] of flagOptions) {
        if (options[key] === true) {
            args.push(flag);
        }
    }

    for (const refImage of options.refImages ?? []) {
        pushValue(args, "--ref-image", refImage);
    }

    pushValue(args, "--sigmas", formatList(options.sigmas));
    pushValue(args, "--skip-layers", formatList(options.skipLayers));
    pushValue(args, "--high-noise-skip-layers", formatList(options.highNoiseSkipLayers));
    pushValue(args, "--cache-mode", options.cacheMode);

    const cacheOption = typeof options.cacheOption === "string"
        ? options.cacheOption
        : options.cacheOption
            ? formatCacheOptions(options.cacheOption)
            : undefined;

    pushValue(args, "--cache-option", cacheOption);

    return args;
}

function pushValue(args: string[], flag: string, value: unknown) {
    if (value === undefined || value === null || value === "") {
        return;
    }

    args.push(flag, String(value));
}

function formatList(value: string | number[] | undefined) {
    if (Array.isArray(value)) {
        return value.join(",");
    }

    return value;
}
