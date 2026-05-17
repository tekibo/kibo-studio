import type { SdCacheOptions, SdCliOptions, SdLoraApplyMode, SdSamplingMethod, SdScmPolicy } from "./cli";
import type { SdLoraReference } from "./lora";
import type { SdModelPaths, SdPresetId, SdVramProfile } from "./presets";

export type ImageGenerationRequest = Omit<
    SdCliOptions,
    "output" | "prompt" | "negativePrompt" | "cacheOption" | "refImages" | "loraApplyMode"
> & {
    prompt: string;
    negativePrompt?: string;
    presetId?: SdPresetId;
    vramProfile?: SdVramProfile;
    paths?: Partial<SdModelPaths>;
    refImages?: string[];
    referenceImage?: string;
    loras?: SdLoraReference[];
    loraModelDir?: string;
    loraApplyMode?: SdLoraApplyMode;
    cacheOptions?: SdCacheOptions;
    cacheOption?: string | SdCacheOptions;
    cgfScale?: number;
    cfgScale?: number;
    samplingMethod?: SdSamplingMethod;
    scmPolicy?: SdScmPolicy;
};

export type ImageRequest = ImageGenerationRequest;

export type ImageGenerationStatus = "pending" | "completed" | "failed";

export type ImageResponse = {
    success: boolean;
    image?: string;
    jobId?: string;
    status?: ImageGenerationStatus;
    error?: string;
    output?: string;
    command?: string;
};

export type ImageGenerationJob = {
    status: ImageGenerationStatus;
    image?: string;
    error?: string;
    output?: string;
    command?: string;
    proc?: any;
};
