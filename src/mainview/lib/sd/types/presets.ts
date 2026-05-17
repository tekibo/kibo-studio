import type { SdCliOptions } from "./cli";

export type SdModelFamily = "flux2" | "qwen-image" | "qwen-image-edit" | "z-image" | "ernie-image";

export type SdPresetId =
    | "flux2-dev"
    | "flux2-klein-4b"
    | "flux2-klein-base-4b"
    | "flux2-klein-9b"
    | "flux2-klein-base-9b"
    | "qwen-image"
    | "qwen-image-edit"
    | "qwen-image-edit-2509"
    | "qwen-image-edit-2511"
    | "z-image-turbo"
    | "z-image-base"
    | "ernie-image-turbo"
    | "ernie-image-base";

export type SdVramProfile = "low" | "balanced" | "high";

export type SdModelPaths = Pick<
    SdCliOptions,
    | "model"
    | "diffusionModel"
    | "highNoiseDiffusionModel"
    | "vae"
    | "llm"
    | "llmVision"
    | "clipL"
    | "clipG"
    | "clipVision"
    | "t5xxl"
    | "taesd"
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
};

export type SdPresetRegistry = Record<SdPresetId, SdModelPreset>;
