export type SdRunMode = "img_gen" | "vid_gen" | "upscale" | "convert" | "metadata";

export type SdMetadataFormat = "text" | "json";

export type SdPreviewMethod = "none" | "proj" | "tae" | "vae";

export type SdWeightType =
    | "f32"
    | "f16"
    | "q4_0"
    | "q4_1"
    | "q5_0"
    | "q5_1"
    | "q8_0"
    | "q2_K"
    | "q3_K"
    | "q4_K"
    | "q4_K_S"
    | "q4_K_M"
    | "q5_K"
    | "q5_K_S"
    | "q5_K_M"
    | "q6_K"
    | "q8_K"
    | "bf16";

export type SdRng = "std_default" | "cuda" | "cpu";

export type SdPrediction = "eps" | "v" | "edm_v" | "sd3_flow" | "flux_flow" | "flux2_flow";

export type SdLoraApplyMode = "auto" | "immediately" | "at_runtime";

export type SdSamplingMethod =
    | "euler"
    | "euler_a"
    | "heun"
    | "dpm2"
    | "dpm++2s_a"
    | "dpm++2m"
    | "dpm++2mv2"
    | "ipndm"
    | "ipndm_v"
    | "lcm"
    | "ddim_trailing"
    | "tcd"
    | "res_multistep"
    | "res_2s"
    | "er_sde";

export type SdScheduler =
    | "discrete"
    | "karras"
    | "exponential"
    | "ays"
    | "gits"
    | "smoothstep"
    | "sgm_uniform"
    | "simple"
    | "kl_optimal"
    | "lcm"
    | "bong_tangent";

export type SdCacheMode = "easycache" | "ucache" | "dbcache" | "taylorseer" | "cache-dit" | "spectrum";

export type SdScmPolicy = "dynamic" | "static";

export type SdUCacheOptions = {
    threshold?: number;
    start?: number;
    end?: number;
    decay?: number;
    relative?: number;
    reset?: number;
};

export type SdEasyCacheOptions = Pick<SdUCacheOptions, "threshold" | "start" | "end">;

export type SdDiTCacheOptions = {
    Fn?: number;
    Bn?: number;
    threshold?: number;
    warmup?: number;
};

export type SdSpectrumCacheOptions = {
    w?: number;
    m?: number;
    lam?: number;
    window?: number;
    flex?: number;
    warmup?: number;
    stop?: number;
};

export type SdCacheOptions = SdUCacheOptions | SdEasyCacheOptions | SdDiTCacheOptions | SdSpectrumCacheOptions;

export type SdTileSize = `${number}x${number}`;

export type SdCliOptions = {
    output?: string;
    image?: string;
    metadataFormat?: SdMetadataFormat;
    previewPath?: string;
    previewInterval?: number;
    outputBeginIdx?: number;
    canny?: boolean;
    convertName?: boolean;
    verbose?: boolean;
    color?: boolean;
    taesdPreviewOnly?: boolean;
    previewNoisy?: boolean;
    metadataRaw?: boolean;
    metadataBrief?: boolean;
    metadataAll?: boolean;
    mode?: SdRunMode;
    preview?: SdPreviewMethod;
    model?: string;
    clipL?: string;
    clipG?: string;
    clipVision?: string;
    t5xxl?: string;
    llm?: string;
    llmVision?: string;
    qwen2vl?: string;
    qwen2vlVision?: string;
    diffusionModel?: string;
    highNoiseDiffusionModel?: string;
    vae?: string;
    taesd?: string;
    tae?: string;
    controlNet?: string;
    embdDir?: string;
    loraModelDir?: string;
    hiresUpscalersDir?: string;
    tensorTypeRules?: string;
    photoMaker?: string;
    audioVae?: string;
    embeddingsConnectors?: string;
    upscaleModel?: string;
    threads?: number;
    chromaT5MaskPad?: number;
    maxVram?: number;
    forceSdxlVaeConvScale?: boolean;
    offloadToCpu?: boolean;
    mmap?: boolean;
    controlNetCpu?: boolean;
    clipOnCpu?: boolean;
    vaeOnCpu?: boolean;
    fa?: boolean;
    diffusionFa?: boolean;
    diffusionConvDirect?: boolean;
    vaeConvDirect?: boolean;
    circular?: boolean;
    circularx?: boolean;
    circulary?: boolean;
    chromaDisableDitMask?: boolean;
    qwenImageZeroCondT?: boolean;
    chromaEnableT5Mask?: boolean;
    type?: SdWeightType;
    rng?: SdRng;
    samplerRng?: SdRng;
    prediction?: SdPrediction;
    loraApplyMode?: SdLoraApplyMode;
    prompt?: string;
    negativePrompt?: string;
    initImg?: string;
    endImg?: string;
    mask?: string;
    controlImage?: string;
    controlVideo?: string;
    pmIdImagesDir?: string;
    pmIdEmbedPath?: string;
    hiresUpscaler?: string;
    height?: number;
    width?: number;
    steps?: number;
    highNoiseSteps?: number;
    clipSkip?: number;
    batchCount?: number;
    videoFrames?: number;
    fps?: number;
    timestepShift?: number;
    upscaleRepeats?: number;
    upscaleTileSize?: number;
    hiresWidth?: number;
    hiresHeight?: number;
    hiresSteps?: number;
    hiresUpscaleTileSize?: number;
    cfgScale?: number;
    imgCfgScale?: number;
    guidance?: number;
    slgScale?: number;
    skipLayerStart?: number;
    skipLayerEnd?: number;
    eta?: number;
    flowShift?: number;
    highNoiseCfgScale?: number;
    highNoiseImgCfgScale?: number;
    highNoiseGuidance?: number;
    highNoiseSlgScale?: number;
    highNoiseSkipLayerStart?: number;
    highNoiseSkipLayerEnd?: number;
    highNoiseEta?: number;
    strength?: number;
    pmStyleStrength?: number;
    controlStrength?: number;
    moeBoundary?: number;
    vaceStrength?: number;
    vaeTileOverlap?: number;
    hiresScale?: number;
    hiresDenoisingStrength?: number;
    increaseRefIndex?: boolean;
    disableAutoResizeRefImage?: boolean;
    disableImageMetadata?: boolean;
    vaeTiling?: boolean;
    hires?: boolean;
    seed?: number;
    samplingMethod?: SdSamplingMethod;
    highNoiseSamplingMethod?: SdSamplingMethod;
    scheduler?: SdScheduler;
    sigmas?: string | number[];
    skipLayers?: number[];
    highNoiseSkipLayers?: number[];
    refImages?: string[];
    cacheMode?: SdCacheMode;
    cacheOption?: string | SdCacheOptions;
    scmMask?: string;
    scmPolicy?: SdScmPolicy;
    vaeTileSize?: SdTileSize;
    vaeRelativeTileSize?: SdTileSize;
};
