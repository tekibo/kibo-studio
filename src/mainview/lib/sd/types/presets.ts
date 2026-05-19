import type { SdCliOptions, SdRunMode } from "./cli";

export type SdModelFamily =
    | "flux2"
    | "flux1"
    | "qwen-image"
    | "qwen-image-edit"
    | "z-image"
    | "ernie-image"
    | "sd-classic"
    | "sd3"
    | "chroma"
    | "chroma-radiance"
    | "anima"
    | "hidream"
    | "ovis"
    | "distilled-sd"
    | "wan"
    | "ltx";

export type SdPresetId =
    | "flux2-dev"
    | "flux2-klein-4b"
    | "flux2-klein-base-4b"
    | "flux2-klein-9b"
    | "flux2-klein-base-9b"
    | "flux1-dev"
    | "flux1-schnell"
    | "flux1-kontext-dev"
    | "qwen-image"
    | "qwen-image-edit"
    | "qwen-image-edit-2509"
    | "qwen-image-edit-2511"
    | "z-image-turbo"
    | "z-image-base"
    | "ernie-image-turbo"
    | "ernie-image-base"
    | "sd-v1-5"
    | "sd-v2-1"
    | "sdxl-base"
    | "sd3-2b"
    | "sd3-5-large"
    | "chroma"
    | "chroma-radiance"
    | "anima"
    | "anima2"
    | "hidream-dev"
    | "hidream"
    | "ovis-image"
    | "ssd-1b"
    | "vega"
    | "sdxs-512"
    | "wan21-t2v-14b"
    | "wan21-i2v-14b-480p"
    | "wan22-t2v-a14b"
    | "wan22-i2v-a14b"
    | "wan22-ti2v-5b"
    | "wan21-t2v-13b"
    | "ltx-23-dev";

export type SdVramProfile = "low" | "balanced" | "high";

export type SdPerfFlags = {
    offloadToCpu?: boolean;
    vaeOnCpu?: boolean;
    clipOnCpu?: boolean;
    diffusionFa?: boolean;
    vaeTiling?: boolean;
    fa?: boolean;
    controlNetCpu?: boolean;
    mmap?: boolean;
    diffusionConvDirect?: boolean;
    vaeConvDirect?: boolean;
};

export type SdModelPaths = Pick<
    SdCliOptions,
    | "model"
    | "diffusionModel"
    | "highNoiseDiffusionModel"
    | "vae"
    | "audioVae"
    | "llm"
    | "llmVision"
    | "clipL"
    | "clipG"
    | "clipVision"
    | "t5xxl"
    | "taesd"
    | "photoMaker"
    | "pmIdImagesDir"
    | "pmIdEmbedPath"
    | "embeddingsConnectors"
>;

export type SdModelPathKey = keyof SdModelPaths;

export type SdModelPathInput = {
    key: SdModelPathKey;
    label: string;
    required?: boolean;
    description?: string;
    placeholder?: string;
};

export type SdDownloadLink = {
    label: string;
    url: string;
    format: "safetensors" | "gguf" | "other";
};

export type SdModelPreset = {
    id: SdPresetId;
    family: SdModelFamily;
    label: string;
    description: string;
    defaultVramProfile: SdVramProfile;
    paths: SdModelPaths;
    pathInputs: SdModelPathInput[];
    defaults: SdCliOptions;
    downloads: SdDownloadLink[];
    supportsRefImage?: boolean;
    supportsPhotoMaker?: boolean;
    runMode: SdRunMode;
};

export type SdPresetRegistry = Record<SdPresetId, SdModelPreset>;
